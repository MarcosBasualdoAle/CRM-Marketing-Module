import { useState, useCallback } from 'react';
import { grabacionesApi } from '../services/grabaciones.api';
import type { Grabacion, GrabacionesFilters, GrabacionesPage } from '../types/grabaciones.types';

export const useRecordings = () => {
    const [grabaciones, setGrabaciones] = useState<GrabacionesPage | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const listarGrabaciones = useCallback(async (filters: GrabacionesFilters = {}) => {
        console.log('🔍 useRecordings: Iniciando listarGrabaciones', filters);
        setLoading(true);
        setError(null);
        try {
            const data = await grabacionesApi.listarMisGrabaciones(filters);
            console.log('✅ useRecordings: Datos recibidos', data);
            setGrabaciones(data);
            return data;
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Error al cargar grabaciones';
            console.error('❌ useRecordings: Error', err);
            setError(message);
            throw err;
        } finally {
            setLoading(false);
            console.log('🏁 useRecordings: Finalizado');
        }
    }, []);

    const obtenerGrabacion = useCallback(async (id: number): Promise<Grabacion> => {
        setLoading(true);
        setError(null);
        try {
            const data = await grabacionesApi.obtenerGrabacion(id);
            return data;
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Error al cargar grabación';
            setError(message);
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    const obtenerAudioUrl = useCallback(async (id: number): Promise<string> => {
        setLoading(true);
        setError(null);
        try {
            const url = await grabacionesApi.obtenerAudioUrl(id);
            return url;
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Error al obtener URL de audio';
            setError(message);
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    const obtenerTranscripcion = useCallback(async (id: number): Promise<string> => {
        setLoading(true);
        setError(null);
        try {
            const transcripcion = await grabacionesApi.obtenerTranscripcion(id);
            return transcripcion;
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Error al cargar transcripción';
            setError(message);
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    const eliminarGrabacion = useCallback(async (id: number): Promise<void> => {
        setLoading(true);
        setError(null);
        try {
            await grabacionesApi.eliminarGrabacion(id);
            // Refrescar la lista si existe
            if (grabaciones) {
                setGrabaciones({
                    ...grabaciones,
                    content: grabaciones.content.filter(g => g.id !== id),
                });
            }
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Error al eliminar grabación';
            setError(message);
            throw err;
        } finally {
            setLoading(false);
        }
    }, [grabaciones]);

    return {
        grabaciones,
        loading,
        error,
        listarGrabaciones,
        obtenerGrabacion,
        obtenerAudioUrl,
        obtenerTranscripcion,
        eliminarGrabacion,
    };
};
