import React, { useState } from 'react';
import { Modal } from '../../../../../shared/components/ui/Modal';
import { Input } from '../../../../../shared/components/ui/Input';
import { telemarketingReportsApi, TelemarketingReportFilter } from '../services/telemarketing-reports.api';
import { useAuth } from '../../../../../shared/context/AuthContext';

interface CampaignReportModalProps {
    isOpen: boolean;
    onClose: () => void;
    campaignId: number;
    campaignName: string;
}

export const CampaignReportModal: React.FC<CampaignReportModalProps> = ({
    isOpen,
    onClose,
    campaignId,
    campaignName
}) => {
    const { user } = useAuth();
    const isAdmin = user?.rol === 'ADMIN';

    const [loading, setLoading] = useState(false);
    const [filters, setFilters] = useState<TelemarketingReportFilter>({
        fechaInicio: '',
        fechaFin: '',
        idAgente: undefined
    });

    const handleGenerate = async () => {
        setLoading(true);
        try {
            // Limpiar filtros vacíos
            const activeFilters: TelemarketingReportFilter = {};
            if (filters.fechaInicio) activeFilters.fechaInicio = filters.fechaInicio;
            if (filters.fechaFin) activeFilters.fechaFin = filters.fechaFin;
            if (filters.idAgente) activeFilters.idAgente = filters.idAgente;

            await telemarketingReportsApi.getCampaignReport(campaignId, activeFilters);
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
            title="Generar Reporte de Campaña"
            onConfirm={handleGenerate}
            confirmText={loading ? 'Generando...' : 'Descargar PDF'}
            isLoading={loading}
        >
            <div className="space-y-4">
                {/* Información de la campaña */}
                <div className="bg-blue-50 border-l-4 border-blue-500 p-3 rounded">
                    <p className="text-sm font-medium text-blue-900">
                        Campaña: {campaignName}
                    </p>
                    <p className="text-xs text-blue-700 mt-1">
                        El reporte incluirá métricas y historial de llamadas
                    </p>
                </div>

                {/* Filtros de fecha */}
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

                {/* Filtro de agente (solo para admins) */}
                {isAdmin && (
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Filtrar por Agente (Opcional)
                        </label>
                        <Input
                            type="number"
                            placeholder="ID del agente (dejar vacío para todos)"
                            value={filters.idAgente || ''}
                            onChange={(e) => setFilters({
                                ...filters,
                                idAgente: e.target.value ? parseInt(e.target.value) : undefined
                            })}
                        />
                        <p className="text-xs text-gray-500 mt-1">
                            Deja este campo vacío para incluir todos los agentes
                        </p>
                    </div>
                )}

                {/* Información para agentes */}
                {!isAdmin && (
                    <div className="bg-gray-50 border border-gray-200 p-3 rounded">
                        <p className="text-xs text-gray-600">
                            <span className="material-symbols-outlined text-sm align-middle mr-1">info</span>
                            El reporte mostrará únicamente tus llamadas
                        </p>
                    </div>
                )}
            </div>
        </Modal>
    );
};

