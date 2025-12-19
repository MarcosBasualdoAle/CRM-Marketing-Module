import { http } from "../../../../../shared/services/api.client";

const ENDPOINT = '/marketing/campanas/gestor/reportes';

export interface GestorReportFilterDTO {
    fechaInicio?: string;
    fechaFin?: string;
    estado?: string;
    canal?: string;
}

export const gestorReportsApi = {
    // 1. Reporte General
    getGeneralReport: (filters: GestorReportFilterDTO) => {
        return downloadPdf(`${ENDPOINT}/general`, filters, 'reporte-campanas-general.pdf');
    },

    // 2. Reporte de Eficiencia
    getEfficiencyReport: (filters: GestorReportFilterDTO) => {
        return downloadPdf(`${ENDPOINT}/eficiencia`, filters, 'reporte-campanas-eficiencia.pdf');
    },

    // 3. Reporte de Uso de Recursos
    getResourceUsageReport: (filters: GestorReportFilterDTO) => {
        return downloadPdf(`${ENDPOINT}/uso`, filters, 'reporte-campanas-uso-recursos.pdf');
    }
};

// Helper para descargar PDF
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
