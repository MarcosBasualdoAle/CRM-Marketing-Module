import { apiClient } from "../../../../../shared/services/api.client";
import type {
    Grabacion,
    GrabacionesFilters,
    GrabacionesPage,
    SubirGrabacionRequest,
} from '../types/grabaciones.types';

const BASE_URL = '';

export const grabacionesApi = {
    /**
     * Sube una nueva grabación de llamada
     */
    async subirGrabacion(
        idCampania: number,
        request: Omit<SubirGrabacionRequest, 'idCampania'>
    ): Promise<Grabacion> {
        const formData = new FormData();
        formData.append('archivo', request.archivo);
        formData.append('idLead', request.idLead.toString());
        formData.append('duracionSegundos', request.duracionSegundos.toString());

        if (request.idLlamada) {
            formData.append('idLlamada', request.idLlamada.toString());
        }
        if (request.resultado) {
            formData.append('resultado', request.resultado);
        }

        const response = await apiClient.post(
            `${BASE_URL}/campanias-telefonicas/${idCampania}/grabaciones`,
            formData,
            {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            }
        );
        return response.data.data;
    },

    /**
     * Lista las grabaciones del agente actual con filtros
     */
    async listarMisGrabaciones(filters: GrabacionesFilters = {}): Promise<GrabacionesPage> {
        const params = new URLSearchParams();

        if (filters.idCampania) params.append('idCampania', filters.idCampania.toString());
        if (filters.resultado) params.append('resultado', filters.resultado);
        if (filters.fechaDesde) params.append('fechaDesde', filters.fechaDesde);
        if (filters.fechaHasta) params.append('fechaHasta', filters.fechaHasta);
        if (filters.busqueda) params.append('busqueda', filters.busqueda);
        if (filters.page !== undefined) params.append('page', filters.page.toString());
        if (filters.size !== undefined) params.append('size', filters.size.toString());

        const response = await apiClient.get(
            `${BASE_URL}/agentes/me/grabaciones?${params.toString()}`
        );
        return response.data.data;
    },

    /**
     * Obtiene los detalles de una grabación específica
     */
    async obtenerGrabacion(idGrabacion: number): Promise<Grabacion> {
        const response = await apiClient.get(`${BASE_URL}/grabaciones/${idGrabacion}`);
        return response.data.data;
    },

    /**
     * Obtiene la URL firmada temporal para reproducir el audio
     */
    async obtenerAudioUrl(idGrabacion: number): Promise<string> {
        const response = await apiClient.get(`${BASE_URL}/grabaciones/${idGrabacion}/audio`);
        return response.data.data.url;
    },

    /**
     * Obtiene la transcripción en formato markdown
     */
    async obtenerTranscripcion(idGrabacion: number): Promise<string> {
        const response = await apiClient.get(
            `${BASE_URL}/grabaciones/${idGrabacion}/transcripcion`
        );

        console.log('📄 Transcripción raw response:', response);
        console.log('📄 Transcripción tipo:', typeof response.data);
        console.log('📄 Transcripción preview:', response.data?.substring(0, 200));

        // El backend devuelve texto plano, axios lo maneja automáticamente  
        return response.data;
    },

    /**
     * Elimina una grabación (audio y transcripción)
     */
    async eliminarGrabacion(idGrabacion: number): Promise<void> {
        await apiClient.delete(`${BASE_URL}/grabaciones/${idGrabacion}`);
    },
};
