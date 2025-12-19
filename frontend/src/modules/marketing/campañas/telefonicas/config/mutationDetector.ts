import type { MutationEvent } from './cacheInvalidationMap';

interface EndpointPattern {
    method: 'POST' | 'PUT' | 'DELETE';
    pattern: RegExp;
    event: MutationEvent;
    extractCampaignId?: (url: string) => number | null;
}

/**
 * Patrones de endpoints que modifican datos
 */
export const MUTATION_PATTERNS: EndpointPattern[] = [
    // === Tomar contacto ===
    {
        method: 'POST',
        pattern: /\/campanias-telefonicas\/(\d+)\/cola\/siguiente$/,
        event: 'CONTACT_TAKEN',
        extractCampaignId: (url) => {
            const match = url.match(/\/campanias-telefonicas\/(\d+)\//);
            return match ? parseInt(match[1]) : null;
        }
    },
    {
        method: 'POST',
        pattern: /\/campanias-telefonicas\/(\d+)\/contactos\/\d+\/tomar$/,
        event: 'CONTACT_TAKEN',
        extractCampaignId: (url) => {
            const match = url.match(/\/campanias-telefonicas\/(\d+)\//);
            return match ? parseInt(match[1]) : null;
        }
    },

    // === Registrar resultado ===
    {
        method: 'POST',
        pattern: /\/campanias-telefonicas\/(\d+)\/llamadas\/resultado$/,
        event: 'CALL_RESULT_REGISTERED',
        extractCampaignId: (url) => {
            const match = url.match(/\/campanias-telefonicas\/(\d+)\//);
            return match ? parseInt(match[1]) : null;
        }
    },

    // === Pausar/Reanudar cola ===
    {
        method: 'POST',
        pattern: /\/campanias-telefonicas\/\d+\/pausar-cola$/,
        event: 'QUEUE_TOGGLED',
        extractCampaignId: (url) => {
            const match = url.match(/\/campanias-telefonicas\/(\d+)\//);
            return match ? parseInt(match[1]) : null;
        }
    },
    {
        method: 'POST',
        pattern: /\/campanias-telefonicas\/\d+\/reanudar-cola$/,
        event: 'QUEUE_TOGGLED',
        extractCampaignId: (url) => {
            const match = url.match(/\/campanias-telefonicas\/(\d+)\//);
            return match ? parseInt(match[1]) : null;
        }
    },

    // === Grabaciones ===
    {
        method: 'POST',
        pattern: /\/campanias-telefonicas\/\d+\/grabaciones$/,
        event: 'RECORDING_UPLOADED',
        extractCampaignId: (url) => {
            const match = url.match(/\/campanias-telefonicas\/(\d+)\//);
            return match ? parseInt(match[1]) : null;
        }
    },
    {
        method: 'DELETE',
        pattern: /\/grabaciones\/\d+$/,
        event: 'RECORDING_DELETED',
        extractCampaignId: () => null  // No necesita campaignId
    },

    // === Admin - Crear campaña ===
    {
        method: 'POST',
        pattern: /\/campanias-telefonicas$/,
        event: 'CAMPAIGN_CREATED',
        extractCampaignId: () => null
    },

    // === Admin - Actualizar configuración ===
    {
        method: 'PUT',
        pattern: /\/campanias-telefonicas\/(\d+)\/config$/,
        event: 'CAMPAIGN_CONFIG_UPDATED',
        extractCampaignId: (url) => {
            const match = url.match(/\/campanias-telefonicas\/(\d+)\//);
            return match ? parseInt(match[1]) : null;
        }
    },

    // === Admin - Vincular guion ===
    {
        method: 'POST',
        pattern: /\/campanias-telefonicas\/(\d+)\/vincular-guion$/,
        event: 'SCRIPT_LINKED',
        extractCampaignId: (url) => {
            const match = url.match(/\/campanias-telefonicas\/(\d+)\//);
            return match ? parseInt(match[1]) : null;
        }
    },
    {
        method: 'POST',
        pattern: /\/campanias-telefonicas\/\d+\/guiones\/general$/,
        event: 'SCRIPT_LINKED',
        extractCampaignId: (url) => {
            const match = url.match(/\/campanias-telefonicas\/(\d+)\//);
            return match ? parseInt(match[1]) : null;
        }
    },

    // === Admin - Actualizar guion ===
    {
        method: 'PUT',
        pattern: /\/guiones\/\d+$/,
        event: 'SCRIPT_UPDATED',
        extractCampaignId: () => null  // Afecta TODAS las campañas que usan el guion
    },

    // === Contacto urgente ===
    {
        method: 'POST',
        pattern: /\/public\/v1\/campanias-telefonicas\/cola\/urgente$/,
        event: 'URGENT_CONTACT_ADDED',
        extractCampaignId: () => null  // Se determina del response body
    }
];

/**
 * Detecta si una petición HTTP es una mutación y extrae el evento
 */
export function detectMutation(method: string, url: string): {
    event: MutationEvent;
    campaignId: number | null;
} | null {
    for (const pattern of MUTATION_PATTERNS) {
        if (pattern.method === method && pattern.pattern.test(url)) {
            const campaignId = pattern.extractCampaignId ? pattern.extractCampaignId(url) : null;
            return { event: pattern.event, campaignId };
        }
    }
    return null;
}
