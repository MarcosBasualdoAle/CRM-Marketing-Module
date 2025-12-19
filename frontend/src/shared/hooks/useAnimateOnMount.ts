import { useState, useEffect } from 'react';

/**
 * Hook para animar componentes al montarse
 * @param delay - Retraso antes de iniciar la animación (ms)
 * @returns isVisible - Estado que indica si el componente debe estar visible
 */
export const useAnimateOnMount = (delay = 100): boolean => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => setIsVisible(true), delay);
        return () => clearTimeout(timer);
    }, [delay]);

    return isVisible;
};
