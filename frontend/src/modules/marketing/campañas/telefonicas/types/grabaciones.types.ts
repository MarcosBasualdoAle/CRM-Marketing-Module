// Types for call recordings system

export interface Grabacion {
    id: number;
    idCampania: number;
    idAgente: number;
    idLead: number;
    idLlamada?: number;
    fechaHora: string;
    duracionSegundos: number;
    rutaAudioFirebase: string;
    rutaTranscripcionSupabase?: string;
    estadoProcesamiento: 'PENDIENTE' | 'PROCESANDO' | 'COMPLETADO' | 'ERROR';
    resultado?: string;
    mensajeError?: string;
    intentosProcesamiento: number;
    createdAt: string;
    updatedAt: string;

    // Información adicional
    nombreAgente?: string;
    nombreLead?: string;
    nombreCampania?: string;
    telefonoLead?: string;
    urlAudioPublica?: string;
    transcripcionCompleta?: string;
}

export interface SubirGrabacionRequest {
    idCampania: number;
    idLead: number;
    idLlamada?: number;
    duracionSegundos: number;
    resultado?: string;
    archivo: File;
}

export interface GrabacionesFilters {
    idCampania?: number;
    resultado?: string;
    fechaDesde?: string;
    fechaHasta?: string;
    busqueda?: string;
    page?: number;
    size?: number;
}

export interface GrabacionesPage {
    content: Grabacion[];
    totalElements: number;
    totalPages: number;
    number: number;
    size: number;
    first: boolean;
    last: boolean;
}

export const RESULTADO_COLORS: Record<string, string> = {
    'VENTA': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
    'CONTACTADO': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
    'INTERESADO': 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300',
    'NO_INTERESADO': 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
    'NO_CONTESTA': 'bg-gray-100 text-gray-800 dark:bg-neutral-700 dark:text-neutral-300',
    'BUZON': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
};

export const RESULTADO_LABELS: Record<string, string> = {
    'VENTA': 'Venta',
    'CONTACTADO': 'Contactado',
    'INTERESADO': 'Interesado',
    'NO_INTERESADO': 'No interesado',
    'NO_CONTESTA': 'No contesta',
    'BUZON': 'Buzón',
};
