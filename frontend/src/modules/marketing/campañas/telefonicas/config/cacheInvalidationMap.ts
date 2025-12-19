export type CacheDataType = 'campaign' | 'queue' | 'leads' | 'history' |
    'dailyMetrics' | 'campaignMetrics' | 'scripts' | 'guion' | 'scheduledCalls';

export type MutationEvent =
    | 'CONTACT_TAKEN'
    | 'CALL_RESULT_REGISTERED'
    | 'QUEUE_TOGGLED'
    | 'RECORDING_UPLOADED'
    | 'RECORDING_DELETED'
    | 'CAMPAIGN_CREATED'
    | 'CAMPAIGN_CONFIG_UPDATED'
    | 'SCRIPT_LINKED'
    | 'SCRIPT_UPDATED'
    | 'URGENT_CONTACT_ADDED';

interface InvalidationRule {
    event: MutationEvent;
    caches: CacheDataType[];
    affectsGlobalCampaignList?: boolean; // Si true, invalida CampaignsContext
}

/**
 * Mapa de eventos a cachés afectados
 * Basado en el análisis detallado en analisis_comportamiento_campanas.md
 */
export const CACHE_INVALIDATION_MAP: InvalidationRule[] = [
    // === Eventos del Agente ===
    {
        event: 'CONTACT_TAKEN',
        caches: ['queue', 'leads', 'dailyMetrics']
    },
    {
        event: 'CALL_RESULT_REGISTERED',
        caches: ['queue', 'leads', 'history', 'dailyMetrics', 'campaignMetrics', 'scheduledCalls']
    },
    {
        event: 'QUEUE_TOGGLED',
        caches: ['queue']
    },
    {
        event: 'RECORDING_UPLOADED',
        caches: []  // No invalida caché de campañas, solo estado local de grabaciones
    },
    {
        event: 'RECORDING_DELETED',
        caches: []  // Solo actualiza estado local en RecordingsPage
    },

    // === Eventos del Admin ===
    {
        event: 'CAMPAIGN_CREATED',
        caches: [],
        affectsGlobalCampaignList: true
    },
    {
        event: 'CAMPAIGN_CONFIG_UPDATED',
        caches: ['campaign']
    },
    {
        event: 'SCRIPT_LINKED',
        caches: ['campaign', 'scripts', 'guion']
    },
    {
        event: 'SCRIPT_UPDATED',
        caches: ['guion']
    },
    {
        event: 'URGENT_CONTACT_ADDED',
        caches: ['queue', 'leads']
    }
];
