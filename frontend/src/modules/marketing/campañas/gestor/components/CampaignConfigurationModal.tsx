import React, { useState, useEffect } from 'react';
import { telemarketingApi } from '../../telefonicas/services/telemarketingApi';
import { useToast } from '../../../../../shared/components/ui/Toast';

interface CampaignConfigurationModalProps {
    isOpen: boolean;
    onClose: () => void;
    campaignId: number;
    onSuccess?: () => void;
}

interface CampaignConfig {
    horaInicioPermitida: string;
    horaFinPermitida: string;
    diasSemanaPermitidos: string;
    maxIntentos: number;
    intervaloReintentosMin: number;
    tipoDiscado: string;
    modoContacto: string;
    permiteSmsRespaldo: boolean;
}

const diasSemana = [
    { value: 'LUN', label: 'Lunes' },
    { value: 'MAR', label: 'Martes' },
    { value: 'MIE', label: 'Miércoles' },
    { value: 'JUE', label: 'Jueves' },
    { value: 'VIE', label: 'Viernes' },
    { value: 'SAB', label: 'Sábado' },
    { value: 'DOM', label: 'Domingo' }
];

export const CampaignConfigurationModal: React.FC<CampaignConfigurationModalProps> = ({
    isOpen,
    onClose,
    campaignId,
    onSuccess
}) => {
    const { showToast } = useToast();
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [config, setConfig] = useState<CampaignConfig | null>(null);
    const [selectedDays, setSelectedDays] = useState<string[]>([]);

    useEffect(() => {
        if (isOpen && campaignId) {
            loadConfig();
        }
    }, [isOpen, campaignId]);

    const loadConfig = async () => {
        setLoading(true);
        try {
            const data = await telemarketingApi.getCampaignConfig(campaignId);
            setConfig(data);

            // Parse days
            if (data.diasSemanaPermitidos) {
                setSelectedDays(data.diasSemanaPermitidos.split('-'));
            }
        } catch (error) {
            console.error('Error loading config:', error);
            showToast('Error al cargar la configuración', 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        if (!config) return;

        setSaving(true);
        try {
            // Update dias from selected days
            const updatedConfig = {
                ...config,
                diasSemanaPermitidos: selectedDays.join('-')
            };

            await telemarketingApi.updateCampaignConfig(campaignId, updatedConfig);
            showToast('Configuración actualizada exitosamente', 'success');
            if (onSuccess) onSuccess();
            onClose();
        } catch (error: any) {
            console.error('Error saving config:', error);
            showToast(error.response?.data?.message || 'Error al guardar la configuración', 'error');
        } finally {
            setSaving(false);
        }
    };

    const toggleDay = (day: string) => {
        setSelectedDays(prev =>
            prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day]
        );
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[70] p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full">
                {/* Header */}
                <div className="flex justify-between items-center p-6 border-b border-gray-200">
                    <h2 className="text-2xl font-bold text-dark">Configuración de Telemarketing</h2>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                        title="Cerrar"
                    >
                        <span className="material-symbols-outlined text-2xl">close</span>
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 max-h-[calc(90vh-200px)] overflow-y-auto">
                    {loading ? (
                        <div className="flex items-center justify-center p-12">
                            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent"></div>
                        </div>
                    ) : config ? (
                        <div className="space-y-6">
                            {/* Horario de llamadas */}
                            <div className="card p-4">
                                <h3 className="text-lg font-semibold text-dark mb-4">Horario de Llamadas</h3>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-sm font-medium text-gray-700 block mb-2">
                                            Hora de Inicio
                                        </label>
                                        <input
                                            type="time"
                                            value={config.horaInicioPermitida}
                                            onChange={(e) => setConfig({ ...config, horaInicioPermitida: e.target.value })}
                                            className="form-input w-full rounded-lg border border-gray-300"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-gray-700 block mb-2">
                                            Hora de Fin
                                        </label>
                                        <input
                                            type="time"
                                            value={config.horaFinPermitida}
                                            onChange={(e) => setConfig({ ...config, horaFinPermitida: e.target.value })}
                                            className="form-input w-full rounded-lg border border-gray-300"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Días permitidos */}
                            <div className="card p-4">
                                <h3 className="text-lg font-semibold text-dark mb-4">Días Permitidos</h3>
                                <div className="flex flex-wrap gap-2 justify-center">
                                    {diasSemana.map(dia => (
                                        <button
                                            key={dia.value}
                                            onClick={() => toggleDay(dia.value)}
                                            className={`px-4 py-2 rounded-full font-medium transition-colors ${selectedDays.includes(dia.value)
                                                ? 'bg-primary text-white'
                                                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                                }`}
                                        >
                                            {dia.label}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Reintentos */}
                            <div className="card p-4">
                                <h3 className="text-lg font-semibold text-dark mb-4">Configuración de Reintentos</h3>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-sm font-medium text-gray-700 block mb-3">
                                            Máximo de Intentos
                                        </label>
                                        <div className="flex items-center gap-3">
                                            <button
                                                onClick={() => setConfig({ ...config, maxIntentos: Math.max(1, config.maxIntentos - 1) })}
                                                className="w-10 h-10 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center transition-colors"
                                                disabled={config.maxIntentos <= 1}
                                            >
                                                <span className="material-symbols-outlined text-xl">remove</span>
                                            </button>
                                            <div className="flex-1 text-center">
                                                <span className="text-2xl font-bold text-primary">{config.maxIntentos}</span>
                                                <span className="text-sm text-gray-500 block">intentos</span>
                                            </div>
                                            <button
                                                onClick={() => setConfig({ ...config, maxIntentos: Math.min(10, config.maxIntentos + 1) })}
                                                className="w-10 h-10 rounded-full bg-primary hover:bg-blue-700 text-white flex items-center justify-center transition-colors"
                                                disabled={config.maxIntentos >= 10}
                                            >
                                                <span className="material-symbols-outlined text-xl">add</span>
                                            </button>
                                        </div>
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-gray-700 block mb-3">
                                            Intervalo entre Reintentos
                                        </label>
                                        <div className="flex items-center gap-3">
                                            <button
                                                onClick={() => setConfig({ ...config, intervaloReintentosMin: Math.max(1, config.intervaloReintentosMin - 5) })}
                                                className="w-10 h-10 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center transition-colors"
                                                disabled={config.intervaloReintentosMin <= 1}
                                            >
                                                <span className="material-symbols-outlined text-xl">remove</span>
                                            </button>
                                            <div className="flex-1 text-center">
                                                <span className="text-2xl font-bold text-primary">{config.intervaloReintentosMin}</span>
                                                <span className="text-sm text-gray-500 block">minutos</span>
                                            </div>
                                            <button
                                                onClick={() => setConfig({ ...config, intervaloReintentosMin: config.intervaloReintentosMin + 5 })}
                                                className="w-10 h-10 rounded-full bg-primary hover:bg-blue-700 text-white flex items-center justify-center transition-colors"
                                            >
                                                <span className="material-symbols-outlined text-xl">add</span>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="text-center text-gray-500 py-8">
                            No se pudo cargar la configuración
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="flex justify-end gap-3 p-6 border-t border-gray-200">
                    <button
                        onClick={handleSave}
                        disabled={saving || !config}
                        className="px-4 py-2 bg-primary text-white rounded-full hover:bg-blue-700 flex items-center gap-2 disabled:opacity-50"
                    >
                        {saving && <span className="material-symbols-outlined animate-spin">refresh</span>}
                        {saving ? 'Guardando...' : 'Guardar Cambios'}
                    </button>
                    <button
                        onClick={onClose}
                        disabled={saving}
                        className="px-4 py-2 bg-gray-500 text-white rounded-full hover:bg-gray-600 disabled:opacity-50"
                    >
                        Cancelar
                    </button>
                </div>
            </div>
        </div>
    );
};
