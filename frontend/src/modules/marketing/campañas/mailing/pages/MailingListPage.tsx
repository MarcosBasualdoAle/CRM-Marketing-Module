import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Tabs } from '../../../../../shared/components/ui/Tabs';
import { Input } from '../../../../../shared/components/ui/Input';
import { LoadingSpinner } from '../../../../../shared/components/ui/LoadingSpinner';
import { useToast } from '../../../../../shared/components/ui/Toast';
import { CampanaMailing, PRIORIDAD_COLORS, MetricasMailing } from '../types/mailing.types';
import { useAuth } from '../../../../../shared/context/AuthContext';
import { useMailing } from '../context/MailingContext';
import { MailingFilters, type FilterValues } from '../components/MailingFilters';

interface CampanaConMetricas extends CampanaMailing {
    metricas?: MetricasMailing;
}

export const MailingListPage: React.FC = () => {
    const navigate = useNavigate();
    const { showToast } = useToast();
    const { user, hasRole } = useAuth();

    const { campanasCache, metricsCache, initialLoadingComplete } = useMailing();

    const [activeTab, setActiveTab] = useState('pendiente');
    const [campanas, setCampanas] = useState<CampanaConMetricas[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
    const [filters, setFilters] = useState<FilterValues>({
        nombre: '',
        fechaInicio: '',
        prioridad: 'todas'
    });
    const [isRefreshing, setIsRefreshing] = useState(false);

    // Control para evitar cargas duplicadas
    const isLoadingRef = useRef(false);
    // Control para saber si ya se cargó inicialmente
    const initialLoadDone = useRef(false);

    const isAdmin = hasRole('ADMIN');
    const canEditCampaigns = isAdmin;

    // ✅ CARGAR DESDE CACHÉ - Sin hacer petición HTTP
    const cargarDesdeCache = () => {
        const datosCache = campanasCache[activeTab] || [];

        if (!isAdmin && user?.campaniasMailing?.length) {
            const filtradas = datosCache.filter(c => user.campaniasMailing?.includes(c.id));
            setCampanas(filtradas);
        } else {
            setCampanas(datosCache);
        }

        // Añadir métricas del caché si aplica
        if (['enviado', 'finalizado'].includes(activeTab)) {
            setCampanas(prev => prev.map(c => ({
                ...c,
                metricas: metricsCache.get(c.id)
            })));
        }
    };

    // ✅ ACTUALIZAR - SOLO la pestaña activa (no borra caché de otras pestañas)
    const handleRefresh = async () => {
        if (isLoadingRef.current) return;

        isLoadingRef.current = true;
        setIsRefreshing(true);
        setError(null);

        try {
            // Hacer petición directa al servidor (sin invalidar todo el caché)
            const { mailingApi } = await import('../services/mailing.api');
            const data = await mailingApi.listarCampanas(activeTab);

            // Filtrar por permisos si no es admin
            const visibleCampanas = !isAdmin && user?.campaniasMailing?.length
                ? (data || []).filter(c => user.campaniasMailing?.includes(c.id))
                : (data || []);

            // Cargar métricas para enviados/finalizados
            if (['enviado', 'finalizado'].includes(activeTab)) {
                const campanasConMetricas = [...visibleCampanas] as CampanaConMetricas[];
                for (let i = 0; i < campanasConMetricas.length; i++) {
                    try {
                        const metricas = await mailingApi.obtenerMetricas(campanasConMetricas[i].id);
                        campanasConMetricas[i] = { ...campanasConMetricas[i], metricas };
                    } catch (err) {
                        console.error(`Error métricas ${campanasConMetricas[i].id}:`, err);
                    }
                }
                setCampanas(campanasConMetricas);
            } else {
                setCampanas(visibleCampanas);
            }

            showToast('✓ Datos actualizados', 'success');

        } catch (err: any) {
            const errorMsg = err.message || 'Error al actualizar';
            setError(errorMsg);
            showToast(errorMsg, 'error');
        } finally {
            setIsRefreshing(false);
            isLoadingRef.current = false;
        }
    };

    // ✅ EFFECT: Cargar desde caché al cambiar de pestaña (NO hace petición HTTP)
    useEffect(() => {
        cargarDesdeCache();
    }, [activeTab, campanasCache, metricsCache]);

    // ✅ EFFECT: Carga inicial única (usa el caché del contexto)
    useEffect(() => {
        if (!initialLoadDone.current) {
            initialLoadDone.current = true;
            cargarDesdeCache();
        }
    }, []);

    // Filtrado local
    const filteredCampanas = campanas.filter(c => {
        const matchesSearch = c.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
            c.descripcion?.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesNombre = !filters.nombre ||
            c.nombre.toLowerCase().includes(filters.nombre.toLowerCase());

        const matchesFecha = !filters.fechaInicio ||
            new Date(c.fechaInicio).toISOString().split('T')[0] === filters.fechaInicio;

        const matchesPrioridad = filters.prioridad === 'todas' || c.prioridad === filters.prioridad;

        return matchesSearch && matchesNombre && matchesFecha && matchesPrioridad;
    });

    const handleApplyFilters = (newFilters: FilterValues) => {
        setFilters(newFilters);
    };

    const handleEdit = (id: number) => {
        navigate(`/marketing/emailing/${id}/edit`);
    };

    const handleViewMetrics = (id: number) => {
        navigate(`/marketing/emailing/${id}/metricas`);
    };

    const mostrarMetricas = ['enviado', 'finalizado'].includes(activeTab);

    return (
        <div className="space-y-6">
            {/* Header */}
            <header className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-dark">Campañas de Mailing</h1>
                </div>
            </header>

            {/* Tabs */}
            <Tabs
                items={[
                    { label: 'Pendientes', value: 'pendiente' },
                    { label: 'Listos', value: 'listo' },
                    { label: 'Enviados', value: 'enviado' },
                    { label: 'Finalizados', value: 'finalizado' }
                ]}
                activeValue={activeTab}
                onChange={setActiveTab}
            />

            {/* Search Bar + Filtros + Botón Actualizar */}
            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 flex items-center justify-between gap-4">
                <div className="flex-1 relative">
                    <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                        search
                    </span>
                    <Input
                        placeholder="Buscar por nombre de campaña..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10"
                    />
                </div>

                {/* Botón Filtros */}
                <button
                    onClick={() => setIsFilterModalOpen(true)}
                    className="flex items-center gap-2 px-4 py-2 border border-separator rounded-lg hover:bg-gray-50 transition-colors bg-white"
                >
                    <span className="material-symbols-outlined text-gray-600">tune</span>
                    <span className="text-sm font-medium text-gray-600">Filtros</span>
                </button>

                {/* ✅ Botón Actualizar - Discreto junto a filtros */}
                <button
                    onClick={handleRefresh}
                    disabled={isRefreshing}
                    className="flex items-center gap-2 px-4 py-2 border border-separator rounded-lg hover:bg-gray-50 transition-colors bg-white disabled:opacity-50 disabled:cursor-not-allowed"
                    title="Actualizar datos desde el servidor"
                >
                    <span
                        className={`material-symbols-outlined text-gray-600 ${isRefreshing ? 'animate-spin' : ''}`}
                    >
                        refresh
                    </span>
                    <span className="text-sm font-medium text-gray-600">
                        {isRefreshing ? 'Actualizando...' : 'Actualizar'}
                    </span>
                </button>
            </div>

            {/* Modal de Filtros */}
            <MailingFilters
                isOpen={isFilterModalOpen}
                onClose={() => setIsFilterModalOpen(false)}
                onApply={handleApplyFilters}
            />

            {/* Tabla */}
            <div className="bg-white rounded-lg shadow-sm border border-separator overflow-hidden">
                {error ? (
                    <div className="p-8">
                        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                            <div className="flex items-start gap-3">
                                <span className="material-symbols-outlined text-red-600 text-2xl">error</span>
                                <div className="flex-1">
                                    <p className="text-red-700 font-bold text-lg">Error al cargar campañas</p>
                                    <p className="text-red-600 mt-2">{error}</p>
                                    <button
                                        onClick={handleRefresh}
                                        className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
                                    >
                                        Reintentar
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead className="bg-table-header sticky top-0">
                                <tr>
                                    <th className="p-4 text-sm font-semibold text-dark tracking-wide w-24">PRIORIDAD</th>
                                    <th className="p-4 text-sm font-semibold text-dark tracking-wide">NOMBRE CAMPAÑA</th>
                                    <th className="p-4 text-sm font-semibold text-dark tracking-wide">DESCRIPCIÓN</th>
                                    <th className="p-4 text-sm font-semibold text-dark tracking-wide w-32">FECHA DE INICIO</th>

                                    {mostrarMetricas && (
                                        <>
                                            <th className="p-4 text-sm font-semibold text-dark tracking-wide w-28 text-center">TASA APERTURA</th>
                                            <th className="p-4 text-sm font-semibold text-dark tracking-wide w-28 text-center">TASA CLICS</th>
                                            {activeTab === 'finalizado' && (
                                                <th className="p-4 text-sm font-semibold text-dark tracking-wide w-20 text-center">BAJAS</th>
                                            )}
                                        </>
                                    )}

                                    <th className="p-4 text-sm font-semibold text-dark tracking-wide w-16">ACCIONES</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-separator">
                                {loading || isRefreshing || !initialLoadingComplete ? (
                                    <tr>
                                        <td colSpan={mostrarMetricas ? 8 : 5} className="p-12 text-center">
                                            <div className="flex flex-col items-center justify-center">
                                                <LoadingSpinner size="lg" />
                                                <p className="text-gray-500 mt-4">Cargando campañas...</p>
                                            </div>
                                        </td>
                                    </tr>
                                ) : filteredCampanas.length === 0 ? (
                                    <tr>
                                        <td colSpan={mostrarMetricas ? 8 : 5} className="p-12 text-center">
                                            <div className="flex flex-col items-center justify-center">
                                                <span className="material-symbols-outlined text-6xl text-gray-300 mb-4">inbox</span>
                                                <p className="text-gray-500 text-lg font-medium">No se encontraron campañas</p>
                                                <p className="text-gray-400 text-sm mt-2">
                                                    Intenta con otros filtros o búsqueda
                                                </p>
                                            </div>
                                        </td>
                                    </tr>
                                ) : (
                                    filteredCampanas.map((campana) => (
                                        <tr key={`${activeTab}-${campana.id}`} className="hover:bg-gray-50 transition-colors">
                                            {/* Prioridad */}
                                            <td className="p-4">
                                                <span className={`px-2 py-1 rounded text-xs font-bold whitespace-nowrap ${PRIORIDAD_COLORS[campana.prioridad]}`}>
                                                    {campana.prioridad}
                                                </span>
                                            </td>

                                            {/* Nombre */}
                                            <td className="p-4">
                                                <span className="text-sm font-medium text-gray-900 truncate">
                                                    {campana.nombre}
                                                </span>
                                            </td>

                                            {/* Descripción */}
                                            <td className="p-4 text-sm text-gray-600 max-w-md">
                                                <p className="line-clamp-2">{campana.descripcion}</p>
                                            </td>

                                            {/* Fecha */}
                                            <td className="p-4 text-sm text-gray-600 whitespace-nowrap">
                                                {new Date(campana.fechaInicio).toLocaleDateString('es-ES', {
                                                    year: 'numeric',
                                                    month: '2-digit',
                                                    day: '2-digit'
                                                })}
                                            </td>

                                            {/* Columnas de Métricas */}
                                            {mostrarMetricas && (
                                                <>
                                                    <td className="p-4 text-sm text-gray-900 font-medium text-center">
                                                        {campana.metricas ? `${campana.metricas.tasaApertura.toFixed(1)}%` : '-'}
                                                    </td>
                                                    <td className="p-4 text-sm text-gray-900 font-medium text-center">
                                                        {campana.metricas ? `${campana.metricas.tasaClics.toFixed(1)}%` : '-'}
                                                    </td>
                                                    {activeTab === 'finalizado' && (
                                                        <td className="p-4 text-sm text-gray-900 font-medium text-center">
                                                            {campana.metricas ? campana.metricas.bajas : '-'}
                                                        </td>
                                                    )}
                                                </>
                                            )}

                                            {/* Acciones */}
                                            <td className="p-4 text-center">
                                                <div className="flex gap-2 justify-center">
                                                    {canEditCampaigns && ['pendiente', 'listo'].includes(activeTab) && (
                                                        <button
                                                            onClick={() => handleEdit(campana.id)}
                                                            className="p-2 text-primary hover:bg-blue-50 rounded-lg transition-colors inline-block"
                                                            title="Editar campaña"
                                                        >
                                                            <span className="material-symbols-outlined text-xl">edit</span>
                                                        </button>
                                                    )}

                                                    {mostrarMetricas && (
                                                        <button
                                                            onClick={() => handleViewMetrics(campana.id)}
                                                            className="p-2 text-primary hover:bg-blue-50 rounded-lg transition-colors inline-block"
                                                            title="Ver métricas detalladas"
                                                        >
                                                            <span className="material-symbols-outlined text-xl">bar_chart</span>
                                                        </button>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};















