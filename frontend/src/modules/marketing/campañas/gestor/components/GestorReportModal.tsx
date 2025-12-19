import React, { useState } from 'react';
import { Modal } from '../../../../../shared/components/ui/Modal';
import { Input } from '../../../../../shared/components/ui/Input';
import { Select } from '../../../../../shared/components/ui/Select';
import { gestorReportsApi, GestorReportFilterDTO } from '../services/gestor-reports.api';

interface GestorReportModalProps {
    isOpen: boolean;
    onClose: () => void;
}

type ReportType = 'GENERAL' | 'EFICIENCIA' | 'USO';

export const GestorReportModal: React.FC<GestorReportModalProps> = ({ isOpen, onClose }) => {
    const [reportType, setReportType] = useState<ReportType>('GENERAL');
    const [loading, setLoading] = useState(false);
    const [filters, setFilters] = useState<GestorReportFilterDTO>({
        fechaInicio: '',
        fechaFin: '',
        estado: undefined,
        canal: undefined
    });

    const handleGenerate = async () => {
        setLoading(true);
        try {
            // Limpiar filtros vacíos
            const activeFilters: GestorReportFilterDTO = {};
            if (filters.fechaInicio) activeFilters.fechaInicio = filters.fechaInicio;
            if (filters.fechaFin) activeFilters.fechaFin = filters.fechaFin;
            if (filters.estado) activeFilters.estado = filters.estado;
            if (filters.canal) activeFilters.canal = filters.canal;

            switch (reportType) {
                case 'GENERAL':
                    await gestorReportsApi.getGeneralReport(activeFilters);
                    break;
                case 'EFICIENCIA':
                    await gestorReportsApi.getEfficiencyReport(activeFilters);
                    break;
                case 'USO':
                    await gestorReportsApi.getResourceUsageReport(activeFilters);
                    break;
            }
            onClose();
        } catch (error) {
            console.error("Error generando reporte", error);
            alert("Error al generar el reporte. Por favor intente nuevamente.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title="Generar Reporte de Campañas"
            onConfirm={handleGenerate}
            confirmText={loading ? 'Generando...' : 'Descargar PDF'}
            isLoading={loading}
        >
            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Tipo de Reporte</label>
                    <Select
                        value={reportType}
                        onChange={(e) => setReportType(e.target.value as ReportType)}
                        options={[
                            { value: 'GENERAL', label: 'Reporte General' },
                            { value: 'EFICIENCIA', label: 'Eficiencia de Campañas' },
                            { value: 'USO', label: 'Uso de Recursos' }
                        ]}
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <Input
                        type="date"
                        label="Fecha Inicio"
                        value={filters.fechaInicio || ''}
                        onChange={(e) => setFilters({ ...filters, fechaInicio: e.target.value })}
                    />
                    <Input
                        type="date"
                        label="Fecha Fin"
                        value={filters.fechaFin || ''}
                        onChange={(e) => setFilters({ ...filters, fechaFin: e.target.value })}
                    />
                </div>

                {reportType === 'GENERAL' && (
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Estado</label>
                            <Select
                                value={filters.estado || ''}
                                onChange={(e) => setFilters({ ...filters, estado: e.target.value || undefined })}
                                options={[
                                    { value: '', label: 'Todos' },
                                    { value: 'Borrador', label: 'Borrador' },
                                    { value: 'Programada', label: 'Programada' },
                                    { value: 'Vigente', label: 'Vigente' },
                                    { value: 'Pausada', label: 'Pausada' },
                                    { value: 'Finalizada', label: 'Finalizada' },
                                    { value: 'Cancelada', label: 'Cancelada' }
                                ]}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Canal</label>
                            <Select
                                value={filters.canal || ''}
                                onChange={(e) => setFilters({ ...filters, canal: e.target.value || undefined })}
                                options={[
                                    { value: '', label: 'Todos' },
                                    { value: 'Mailing', label: 'Mailing' },
                                    { value: 'Llamadas', label: 'Llamadas' }
                                ]}
                            />
                        </div>
                    </div>
                )}
            </div>
        </Modal>
    );
};

