import { http } from "../../../../../shared/services/api.client";

export interface TelemarketingReportFilter {
    fechaInicio?: string;
    fechaFin?: string;
    idAgente?: number;
}

const ENDPOINT = '/campanias-telefonicas';

export const telemarketingReportsApi = {
    /**
     * Genera y descarga un reporte PDF de una campaña telefónica.
     * @param campaignId ID de la campaña
     * @param filters Filtros opcionales (fechas, agente)
     */
    getCampaignReport: async (campaignId: number, filters: TelemarketingReportFilter = {}) => {
        return downloadPdf(
            `${ENDPOINT}/${campaignId}/reporte/pdf`,
            filters,
            `reporte-campana-${campaignId}.pdf`
        );
    }
};

/**
 * Helper para descargar archivos PDF.
 */
const downloadPdf = async (url: string, params: any, filename: string) => {
    try {
        const data = await http.get<Blob>(url, {
            params,
            responseType: 'blob' // Importante para archivos binarios
        });

        // Crear URL del blob y forzar descarga
        const blob = new Blob([data], { type: 'application/pdf' });
        const downloadUrl = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = downloadUrl;
        link.setAttribute('download', filename);
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.URL.revokeObjectURL(downloadUrl);

        return true;
    } catch (error) {
        console.error("Error descargando reporte:", error);
        throw error;
    }
};
