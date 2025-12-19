import React from 'react';
import type { RendimientoAgente } from '../../types';
import { formatNumber, formatDuration } from '../../utils/metricsUtils';
import { useAnimateOnMount } from '../../../../../../shared/hooks/useAnimateOnMount';

interface AgentPerformanceTableProps {
    agentes: RendimientoAgente[];
}

export const AgentPerformanceTable: React.FC<AgentPerformanceTableProps> = ({ agentes }) => {
    const isVisible = useAnimateOnMount(300);

    if (agentes.length === 0) {
        return (
            <div className="p-4">
                <div className="rounded-lg bg-white border border-gray-200/50 shadow-sm p-8 text-center">
                    <p className="text-gray-500">
                        No hay datos de rendimiento de agentes disponibles
                    </p>
                </div>
            </div>
        );
    }

    return (
        <>
            <h2 className="text-2xl font-bold tracking-tight px-4 pb-3 pt-5 text-gray-900 mt-6">
                Rendimiento por agente
            </h2>
            <div className="p-4">
                <div className="rounded-lg bg-white border border-gray-200/50 shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead className="bg-table-header">
                                <tr>
                                    <th className="p-4 text-sm font-semibold text-dark tracking-wide">
                                        Agente
                                    </th>
                                    <th className="p-4 text-sm font-semibold text-dark tracking-wide">
                                        Llamadas realizadas
                                    </th>
                                    <th className="p-4 text-sm font-semibold text-dark tracking-wide">
                                        Contactos efectivos
                                    </th>
                                    <th className="p-4 text-sm font-semibold text-dark tracking-wide">
                                        Tasa de éxito
                                    </th>
                                    <th className="p-4 text-sm font-semibold text-dark tracking-wide">
                                        Duración promedio
                                    </th>
                                    <th className="p-4 text-sm font-semibold text-dark tracking-wide">
                                        Llamadas hoy
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {agentes.map((agente, index) => (
                                    <tr
                                        key={agente.idAgente}
                                        className={`hover:bg-gray-50 transition-all duration-500 ${isVisible ? 'opacity-100' : 'opacity-0'
                                            }`}
                                        style={{ transitionDelay: `${index * 50}ms` }}
                                    >
                                        <td className="p-4 font-medium text-gray-900">
                                            {agente.nombreAgente || `Agente ${agente.idAgente}`}
                                        </td>
                                        <td className="p-4 font-semibold text-base text-gray-900">
                                            {formatNumber(agente.llamadasRealizadas)}
                                        </td>
                                        <td className="p-4 font-semibold text-base text-gray-900">
                                            {formatNumber(agente.contactosEfectivos)}
                                        </td>
                                        <td className="p-4 font-semibold text-base text-gray-900">
                                            {agente.tasaExito.toFixed(1)}%
                                        </td>
                                        <td className="p-4 font-semibold text-base text-gray-900">
                                            {formatDuration(agente.duracionPromedio)}
                                        </td>
                                        <td className="p-4 font-semibold text-base text-gray-900">
                                            {formatNumber(agente.llamadasHoy)}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </>
    );
};
