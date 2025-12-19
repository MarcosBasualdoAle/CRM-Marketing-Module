import React, { useState, useEffect } from 'react';
import { useRecordings } from '../hooks/useRecordings';
import { AudioPlayer } from '../components/AudioPlayer';
import { TranscriptionViewer } from '../components/TranscriptionViewer';
import type { Grabacion, GrabacionesFilters } from '../types/grabaciones.types';
import { RESULTADO_COLORS, RESULTADO_LABELS } from '../types/grabaciones.types';
import { telemarketingApi } from '../services/telemarketingApi';
import type { CampaniaTelefonica } from '../types';

export const RecordingsPage: React.FC = () => {
    const {
        grabaciones,
        loading,
        error,
        listarGrabaciones,
        obtenerAudioUrl,
        obtenerTranscripcion,
        eliminarGrabacion,
    } = useRecordings();

    const [campanias, setCampanias] = useState<CampaniaTelefonica[]>([]);
    const [filters, setFilters] = useState<GrabacionesFilters>({
        page: 0,
        size: 20,
    });
    const [selectedGrabacion, setSelectedGrabacion] = useState<Grabacion | null>(null);
    const [showModal, setShowModal] = useState(false);
    const [audioUrl, setAudioUrl] = useState<string | null>(null);
    const [transcripcion, setTranscripcion] = useState<string | null>(null);
    const [loadingModal, setLoadingModal] = useState(false);
    const [activeTab, setActiveTab] = useState<'audio' | 'transcripcion'>('audio');

    // Cargar campañas al montar
    useEffect(() => {
        console.log('🎬 RecordingsPage: Componente montado');
        loadCampanias();
        loadGrabaciones();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []); // Solo al montar

    // Recargar cuando cambien los filtros
    useEffect(() => {
        console.log('🔄 RecordingsPage: Filtros cambiados', filters);
        loadGrabaciones();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [filters]); // Solo cuando cambian filtros

    const loadCampanias = async () => {
        try {
            console.log('📞 Cargando campañas...');
            const data = await telemarketingApi.getCampaniasAsignadas();
            console.log('✅ Campañas cargadas:', data);
            setCampanias(data);
        } catch (error) {
            console.error('❌ Error al cargar campañas:', error);
        }
    };

    const loadGrabaciones = async () => {
        try {
            console.log('🎙️ Cargando grabaciones con filtros:', filters);
            const result = await listarGrabaciones(filters);
            console.log('✅ Grabaciones cargadas:', result);
            console.log('   - Total elementos:', result?.totalElements);
            console.log('   - Contenido:', result?.content?.length, 'grabaciones');
        } catch (error) {
            console.error('❌ Error al cargar grabaciones:', error);
        }
    };

    const handleFilterChange = (key: keyof GrabacionesFilters, value: any) => {
        console.log('🔧 Cambiando filtro:', key, '=', value);
        setFilters(prev => ({
            ...prev,
            [key]: value,
            page: 0, // Reset a primera página
        }));
    };

    const handleVerDetalles = async (grabacion: Grabacion) => {
        console.log('👁️ Ver detalles de grabación:', grabacion.id);
        setSelectedGrabacion(grabacion);
        setShowModal(true);
        setLoadingModal(true);
        setActiveTab('audio');

        try {
            console.log('🔊 Obteniendo URL de audio...');
            // Cargar audio URL
            const url = await obtenerAudioUrl(grabacion.id);
            console.log('✅ URL de audio obtenida:', url);
            setAudioUrl(url);

            // Cargar transcripción si está disponible
            if (grabacion.estadoProcesamiento === 'COMPLETADO' && grabacion.rutaTranscripcionSupabase) {
                console.log('📝 Obteniendo transcripción...');
                const trans = await obtenerTranscripcion(grabacion.id);
                console.log('✅ Transcripción obtenida, longitud:', trans?.length);
                setTranscripcion(trans);
            }
        } catch (error) {
            console.error('❌ Error al cargar detalles:', error);
        } finally {
            setLoadingModal(false);
        }
    };

    const handleCloseModal = () => {
        console.log('❌ Cerrando modal');
        setShowModal(false);
        setSelectedGrabacion(null);
        setAudioUrl(null);
        setTranscripcion(null);
    };

    const handleEliminar = async (id: number) => {
        if (!confirm('¿Estás seguro de eliminar esta grabación? Esta acción no se puede deshacer.')) {
            return;
        }

        try {
            await eliminarGrabacion(id);
            if (showModal && selectedGrabacion?.id === id) {
                handleCloseModal();
            }
        } catch (error) {
            console.error('Error al eliminar:', error);
            alert('Error al eliminar la grabación');
        }
    };

    const formatDuration = (seconds: number): string => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    const formatDate = (dateString: string): string => {
        const date = new Date(dateString);
        return new Intl.DateTimeFormat('es-ES', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
        }).format(date);
    };

    return (
        <div className="min-h-screen bg-background-light p-8">
            <div className="w-full max-w-7xl mx-auto">
                {/* Header */}
                <header className="flex flex-wrap justify-between items-center gap-4 mb-6">
                    <div className="flex flex-col gap-1">
                        <h1 className="text-neutral-900 text-3xl font-bold tracking-tight">
                            Grabaciones de llamadas
                        </h1>
                        <p className="text-neutral-500 text-base font-normal">
                            Gestiona y revisa todas las grabaciones de tus campañas
                        </p>
                    </div>
                </header>

                {/* Filtros */}
                <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                        {/* Searchbar */}
                        <div className="col-span-1 md:col-span-2">
                            <div className="flex w-full items-stretch rounded-full h-12">
                                <div className="text-neutral-500 flex bg-neutral-100 items-center justify-center pl-4 rounded-l-full">
                                    <span className="material-symbols-outlined">search</span>
                                </div>
                                <input
                                    className="flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-r-full text-neutral-900 focus:outline-0 focus:ring-2 focus:ring-primary/50 border-none bg-neutral-100 h-full placeholder:text-neutral-500 px-4 text-base font-normal"
                                    placeholder="Buscar por nombre, teléfono o ID de lead…"
                                    value={filters.busqueda || ''}
                                    onChange={(e) => handleFilterChange('busqueda', e.target.value)}
                                />
                            </div>
                        </div>

                        {/* Filtros adicionales */}
                        <div className="flex gap-2 items-center justify-end">
                            <select
                                className="px-3 py-1.5 text-sm font-medium bg-white text-neutral-600 border border-neutral-300 rounded-full hover:bg-neutral-50"
                                value={filters.idCampania || ''}
                                onChange={(e) => handleFilterChange('idCampania', e.target.value ? parseInt(e.target.value) : undefined)}
                            >
                                <option value="">Todas las campañas</option>
                                {campanias.map((c) => (
                                    <option key={c.id} value={c.id}>
                                        {c.nombre}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Chips de filtro por resultado */}
                    <div className="flex gap-2 p-3 flex-wrap -ml-3 mt-2">
                        <button
                            onClick={() => handleFilterChange('resultado', undefined)}
                            className={`flex h-8 shrink-0 items-center justify-center gap-x-2 rounded-full pl-4 pr-4 ${!filters.resultado
                                ? 'bg-primary/20 text-primary ring-2 ring-primary'
                                : 'bg-neutral-100 hover:bg-neutral-200'
                                }`}
                        >
                            <p className="text-sm font-medium leading-normal">Todos</p>
                        </button>
                        {Object.entries(RESULTADO_LABELS).map(([key, label]) => (
                            <button
                                key={key}
                                onClick={() => handleFilterChange('resultado', key)}
                                className={`flex h-8 shrink-0 items-center justify-center gap-x-2 rounded-full pl-4 pr-4 ${filters.resultado === key
                                    ? 'bg-primary/20 text-primary ring-2 ring-primary'
                                    : 'bg-neutral-100 hover:bg-neutral-200'
                                    }`}
                            >
                                <p className="text-neutral-700 text-sm font-medium leading-normal">
                                    {label}
                                </p>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Tabla de grabaciones */}
                <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                    {loading && !grabaciones ? (
                        <div className="flex items-center justify-center p-12">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                        </div>
                    ) : error ? (
                        <div className="flex flex-col items-center justify-center p-12 text-center">
                            <span className="material-symbols-outlined text-6xl text-red-400 mb-4">error</span>
                            <p className="text-neutral-600">{error}</p>
                        </div>
                    ) : !grabaciones || grabaciones.content.length === 0 ? (
                        <div className="flex flex-col items-center justify-center p-12 text-center">
                            <span className="material-symbols-outlined text-6xl text-neutral-300 mb-4">
                                voicemail
                            </span>
                            <p className="text-neutral-500">No hay grabaciones disponibles</p>
                        </div>
                    ) : (
                        <>
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm text-left text-neutral-500">
                                    <thead className="bg-table-header">
                                        <tr>
                                            <th className="p-4 text-sm font-semibold text-dark tracking-wide">Fecha / Hora</th>
                                            <th className="p-4 text-sm font-semibold text-dark tracking-wide">Lead</th>
                                            <th className="p-4 text-sm font-semibold text-dark tracking-wide">Teléfono</th>
                                            <th className="p-4 text-sm font-semibold text-dark tracking-wide">Resultado</th>
                                            <th className="p-4 text-sm font-semibold text-dark tracking-wide">Duración</th>
                                            <th className="p-4 text-sm font-semibold text-dark tracking-wide">Estado</th>
                                            <th className="p-4 text-sm font-semibold text-dark tracking-wide text-right">Acciones</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-separator">
                                        {grabaciones.content.map((grabacion) => (
                                            <tr
                                                key={grabacion.id}
                                                className="bg-white hover:bg-gray-50 transition-colors"
                                            >
                                                <td className="p-4 font-medium text-neutral-900 whitespace-nowrap">
                                                    {formatDate(grabacion.fechaHora)}
                                                </td>
                                                <td className="p-4">{grabacion.nombreLead || 'N/A'}</td>
                                                <td className="p-4">{grabacion.telefonoLead || '-'}</td>
                                                <td className="p-4">
                                                    {grabacion.resultado && (
                                                        <span
                                                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${RESULTADO_COLORS[grabacion.resultado] || 'bg-gray-100 text-gray-800'
                                                                }`}
                                                        >
                                                            {RESULTADO_LABELS[grabacion.resultado] || grabacion.resultado}
                                                        </span>
                                                    )}
                                                </td>
                                                <td className="p-4">{formatDuration(grabacion.duracionSegundos)}</td>
                                                <td className="p-4">
                                                    <span
                                                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${grabacion.estadoProcesamiento === 'COMPLETADO'
                                                            ? 'bg-green-100 text-green-800'
                                                            : grabacion.estadoProcesamiento === 'PROCESANDO'
                                                                ? 'bg-blue-100 text-blue-800'
                                                                : grabacion.estadoProcesamiento === 'ERROR'
                                                                    ? 'bg-red-100 text-red-800'
                                                                    : 'bg-yellow-100 text-yellow-800'
                                                            }`}
                                                    >
                                                        {grabacion.estadoProcesamiento}
                                                    </span>
                                                </td>
                                                <td className="p-4 text-right">
                                                    <button
                                                        onClick={() => handleVerDetalles(grabacion)}
                                                        className="p-2 text-neutral-500 rounded-full hover:bg-neutral-100"
                                                        title="Ver detalles"
                                                    >
                                                        <span className="material-symbols-outlined text-xl">play_circle</span>
                                                    </button>
                                                    <button
                                                        onClick={() => handleEliminar(grabacion.id)}
                                                        className="p-2 text-neutral-500 rounded-full hover:bg-neutral-100"
                                                        title="Eliminar"
                                                    >
                                                        <span className="material-symbols-outlined text-xl">delete</span>
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {/* Paginación */}
                            <nav className="flex items-center justify-between p-4">
                                <span className="text-sm font-normal text-neutral-500">
                                    Mostrando{' '}
                                    <span className="font-semibold text-neutral-900">
                                        {grabaciones.number * grabaciones.size + 1}-
                                        {Math.min((grabaciones.number + 1) * grabaciones.size, grabaciones.totalElements)}
                                    </span>{' '}
                                    de{' '}
                                    <span className="font-semibold text-neutral-900">
                                        {grabaciones.totalElements}
                                    </span>
                                </span>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => setFilters((prev) => ({ ...prev, page: Math.max(0, (prev.page || 0) - 1) }))}
                                        disabled={grabaciones.first}
                                        className="flex items-center justify-center px-3 h-8 text-neutral-500 bg-white border border-neutral-300 rounded-lg hover:bg-neutral-100 hover:text-neutral-700 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        Anterior
                                    </button>
                                    <button
                                        onClick={() => setFilters((prev) => ({ ...prev, page: (prev.page || 0) + 1 }))}
                                        disabled={grabaciones.last}
                                        className="flex items-center justify-center px-3 h-8 text-neutral-500 bg-white border border-neutral-300 rounded-lg hover:bg-neutral-100 hover:text-neutral-700 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        Siguiente
                                    </button>
                                </div>
                            </nav>
                        </>
                    )}
                </div>
            </div>

            {/* Modal de detalles */}
            {showModal && selectedGrabacion && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="sticky top-0 bg-white border-b border-neutral-200 p-4 flex justify-between items-center">
                            <h2 className="text-xl font-bold text-neutral-900">
                                Grabación - {selectedGrabacion.nombreLead}
                            </h2>
                            <button
                                onClick={handleCloseModal}
                                className="p-2 rounded-full hover:bg-neutral-100"
                            >
                                <span className="material-symbols-outlined">close</span>
                            </button>
                        </div>

                        <div className="p-6">
                            {/* Info del lead */}
                            <div className="grid grid-cols-2 gap-4 mb-6 p-4 bg-neutral-50 rounded-lg">
                                <div>
                                    <p className="text-sm text-neutral-500">Campaña</p>
                                    <p className="font-medium text-neutral-900">
                                        {selectedGrabacion.nombreCampania || 'N/A'}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-sm text-neutral-500">Agente</p>
                                    <p className="font-medium text-neutral-900">
                                        {selectedGrabacion.nombreAgente || 'N/A'}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-sm text-neutral-500">Fecha</p>
                                    <p className="font-medium text-neutral-900">
                                        {formatDate(selectedGrabacion.fechaHora)}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-sm text-neutral-500">Duración</p>
                                    <p className="font-medium text-neutral-900">
                                        {formatDuration(selectedGrabacion.duracionSegundos)}
                                    </p>
                                </div>
                            </div>

                            {/* Tabs */}
                            <div className="flex gap-2 mb-4 border-b border-neutral-200">
                                <button
                                    onClick={() => setActiveTab('audio')}
                                    className={`px-4 py-2 font-medium transition-colors ${activeTab === 'audio'
                                        ? 'text-primary border-b-2 border-primary'
                                        : 'text-neutral-500'
                                        }`}
                                >
                                    Audio
                                </button>
                                <button
                                    onClick={() => setActiveTab('transcripcion')}
                                    className={`px-4 py-2 font-medium transition-colors ${activeTab === 'transcripcion'
                                        ? 'text-primary border-b-2 border-primary'
                                        : 'text-neutral-500'
                                        }`}
                                    disabled={selectedGrabacion.estadoProcesamiento !== 'COMPLETADO'}
                                >
                                    Transcripción
                                    {selectedGrabacion.estadoProcesamiento === 'PROCESANDO' && (
                                        <span className="ml-2 text-xs">(Procesando...)</span>
                                    )}
                                </button>
                            </div>

                            {/* Contenido */}
                            <div className="mt-4">
                                {loadingModal ? (
                                    <div className="flex items-center justify-center p-12">
                                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                                    </div>
                                ) : (
                                    <>
                                        {console.log('🎵 activeTab:', activeTab)}
                                        {console.log('🎵 audioUrl:', audioUrl)}
                                        {console.log('🎵 loadingModal:', loadingModal)}
                                        {activeTab === 'audio' && audioUrl && (
                                            <AudioPlayer
                                                audioUrl={audioUrl}
                                                duration={selectedGrabacion?.duracionSegundos}
                                            />
                                        )}
                                        {activeTab === 'transcripcion' && (
                                            <TranscriptionViewer
                                                transcription={transcripcion || ''}
                                                loading={!transcripcion && selectedGrabacion.estadoProcesamiento === 'COMPLETADO'}
                                            />
                                        )}
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
