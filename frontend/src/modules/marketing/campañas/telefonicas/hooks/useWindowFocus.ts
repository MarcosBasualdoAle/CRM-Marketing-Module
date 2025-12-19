import { useEffect, useCallback, useRef } from 'react';

/**
 * Hook para detectar cuando la ventana del navegador recibe foco
 * Útil para revalidar datos cuando el usuario regresa a la pestaña
 */
export function useWindowFocus(onFocus?: () => void) {
    const isVisibleRef = useRef(!document.hidden);
    const lastFocusTimeRef = useRef(Date.now());

    const handleVisibilityChange = useCallback(() => {
        const isNowVisible = !document.hidden;
        const wasHidden = !isVisibleRef.current;

        // Solo ejecutar callback si la ventana estaba oculta y ahora es visible
        if (isNowVisible && wasHidden) {
            const timeSinceLastFocus = Date.now() - lastFocusTimeRef.current;

            // Solo revalidar si han pasado más de 5 segundos desde el último foco
            // Esto evita revalidaciones excesivas al cambiar rápidamente de pestañas
            if (timeSinceLastFocus > 5000 && onFocus) {
                lastFocusTimeRef.current = Date.now();
                onFocus();
            }
        }

        isVisibleRef.current = isNowVisible;
    }, [onFocus]);

    useEffect(() => {
        // Listener para cambios de visibilidad
        document.addEventListener('visibilitychange', handleVisibilityChange);

        // Listener para cuando la ventana recibe foco
        window.addEventListener('focus', handleVisibilityChange);

        return () => {
            document.removeEventListener('visibilitychange', handleVisibilityChange);
            window.removeEventListener('focus', handleVisibilityChange);
        };
    }, [handleVisibilityChange]);

    return {
        isVisible: !document.hidden,
        lastFocusTime: lastFocusTimeRef.current
    };
}
