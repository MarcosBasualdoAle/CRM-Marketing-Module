import axios, { AxiosResponse } from 'axios';
import { detectMutation } from '../config/mutationDetector';
import { CACHE_INVALIDATION_MAP } from '../config/cacheInvalidationMap';
import { createCacheLogger } from '../../../../../shared/utils/cacheLogger';

// Logging condicional basado en environment
const isDevelopment = import.meta.env.MODE === 'development';
const logger = createCacheLogger('CacheInvalidation', isDevelopment);

// Store del interceptor para acceder a los contexts desde fuera de React
let cacheInvalidator: ((campaignId: number | null, caches: string[], affectsList?: boolean) => void) | null = null;

// Debouncing para invalidaciones
const pendingInvalidations = new Map<string, Set<string>>();
const pendingGlobalInvalidations = new Set<string>();
let invalidationTimer: NodeJS.Timeout | null = null;
const DEBOUNCE_DELAY = 300; // 300ms para agrupar invalidaciones

/**
 * Registra la función de invalidación de caché
 * Debe llamarse desde el provider principal
 */
export function registerCacheInvalidator(
    invalidator: (campaignId: number | null, caches: string[], affectsList?: boolean) => void
) {
    cacheInvalidator = invalidator;
    if (isDevelopment) {
        console.log('%c[CacheInvalidation] %cINITIALIZED%c Cache invalidator registered',
            'color: #6b7280; font-weight: bold',
            'color: #10b981; font-weight: bold',
            'color: inherit'
        );
    }
}

/**
 * Programa una invalidación con debouncing
 * Agrupa múltiples invalidaciones en una ventana de tiempo
 */
function scheduleInvalidation(
    campaignId: number | null,
    caches: string[],
    affectsGlobalList?: boolean
) {
    // Agrupar por campaña
    if (campaignId !== null) {
        const key = `campaign-${campaignId}`;
        if (!pendingInvalidations.has(key)) {
            pendingInvalidations.set(key, new Set());
        }
        caches.forEach(c => pendingInvalidations.get(key)!.add(c));
    }

    // Agrupar invalidaciones globales
    if (affectsGlobalList) {
        pendingGlobalInvalidations.add('global-list');
    }

    // Cancelar timer anterior y crear uno nuevo
    if (invalidationTimer) {
        clearTimeout(invalidationTimer);
    }

    invalidationTimer = setTimeout(() => {
        executeInvalidations();
    }, DEBOUNCE_DELAY);
}

/**
 * Ejecuta todas las invalidaciones pendientes
 */
function executeInvalidations() {
    if (!cacheInvalidator) {
        if (isDevelopment) {
            console.error('[CacheInvalidation] Cannot execute invalidations: invalidator not registered');
        }
        return;
    }

    // Ejecutar invalidaciones por campaña
    pendingInvalidations.forEach((caches, key) => {
        const campaignId = parseInt(key.split('-')[1]);
        const cachesArray = Array.from(caches);

        cacheInvalidator!(campaignId, cachesArray, false);

        if (isDevelopment) {
            console.log('%c[CacheInvalidation] %cINVALIDATED%c Campaign ' + campaignId + ': ' + cachesArray.join(', '),
                'color: #6b7280; font-weight: bold',
                'color: #ef4444; font-weight: bold',
                'color: inherit'
            );
        }
    });

    // Ejecutar invalidaciones globales
    if (pendingGlobalInvalidations.size > 0) {
        cacheInvalidator!(null, [], true);
        if (isDevelopment) {
            console.log('%c[CacheInvalidation] %cINVALIDATED%c Global campaign list',
                'color: #6b7280; font-weight: bold',
                'color: #ef4444; font-weight: bold',
                'color: inherit'
            );
        }
    }

    // Limpiar pendientes
    pendingInvalidations.clear();
    pendingGlobalInvalidations.clear();
    invalidationTimer = null;
}

/**
 * Interceptor de respuesta que detecta mutaciones y invalida caché automáticamente
 */
export function setupCacheInvalidationInterceptor() {
    axios.interceptors.response.use(
        (response: AxiosResponse) => {
            const { method, url } = response.config;

            if (!method || !url) return response;

            // Solo procesar respuestas exitosas (2xx)
            if (response.status < 200 || response.status >= 300) {
                return response;
            }

            // Detectar mutación
            const mutation = detectMutation(method.toUpperCase(), url);

            if (!mutation) {
                // No es una mutación conocida
                return response;
            }

            if (isDevelopment) {
                console.log('%c[CacheInvalidation] %cEVENT%c Detected mutation: ' + mutation.event + ' for campaign ' + mutation.campaignId,
                    'color: #6b7280; font-weight: bold',
                    'color: #3b82f6; font-weight: bold',
                    'color: inherit'
                );
            }

            // Buscar regla de invalidación
            const rule = CACHE_INVALIDATION_MAP.find(r => r.event === mutation.event);

            if (!rule) {
                if (isDevelopment) {
                    console.warn('[CacheInvalidation] No invalidation rule found for event:', mutation.event);
                }
                return response;
            }

            // Invalidar caché con debouncing
            if (cacheInvalidator) {
                // Extraer campaignId del response si no está en la URL
                let campaignId = mutation.campaignId;

                if (!campaignId && response.data?.data) {
                    // Intentar extraer de response (ej: URGENT_CONTACT_ADDED retorna ContactoDTO con idCampania)
                    if (response.data.data.idCampania) {
                        campaignId = response.data.data.idCampania;
                    }
                }

                // Agendar invalidación con debouncing
                scheduleInvalidation(campaignId, rule.caches, rule.affectsGlobalCampaignList);
            } else {
                if (isDevelopment) {
                    console.error('[CacheInvalidation] Cache invalidator not registered!');
                }
            }

            return response;
        },
        (error) => {
            // No invalidar caché en errores
            return Promise.reject(error);
        }
    );

    if (isDevelopment) {
        console.log('%c[CacheInvalidation] %cINITIALIZED%c Cache invalidation interceptor setup complete',
            'color: #6b7280; font-weight: bold',
            'color: #10b981; font-weight: bold',
            'color: inherit'
        );
    }
}
