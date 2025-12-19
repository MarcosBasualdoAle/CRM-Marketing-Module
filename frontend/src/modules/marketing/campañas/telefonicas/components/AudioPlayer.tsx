import React, { useState, useRef, useEffect } from 'react';

interface AudioPlayerProps {
    audioUrl: string;
    duration?: number;
    onError?: (error: Error) => void;
}

export const AudioPlayer: React.FC<AudioPlayerProps> = ({ audioUrl, duration: initialDuration, onError }) => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(initialDuration || 0);
    const [playbackRate, setPlaybackRate] = useState(1);
    const [loading, setLoading] = useState(false);
    const audioRef = useRef<HTMLAudioElement>(null);

    useEffect(() => {
        if (initialDuration) {
            setDuration(initialDuration);
        }
    }, [initialDuration]);

    useEffect(() => {
        const audio = audioRef.current;
        if (!audio) return;

        const handleLoadedMetadata = () => {
            if (Number.isFinite(audio.duration)) {
                setDuration(audio.duration);
            }
            setLoading(false);
        };

        const handleTimeUpdate = () => {
            setCurrentTime(audio.currentTime);
        };

        const handleEnded = () => {
            setIsPlaying(false);
            setCurrentTime(0);
        };

        const handleError = () => {
            setLoading(false);
            onError?.(new Error('Error al cargar el audio'));
        };

        audio.addEventListener('loadedmetadata', handleLoadedMetadata);
        audio.addEventListener('timeupdate', handleTimeUpdate);
        audio.addEventListener('ended', handleEnded);
        audio.addEventListener('error', handleError);

        return () => {
            audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
            audio.removeEventListener('timeupdate', handleTimeUpdate);
            audio.removeEventListener('ended', handleEnded);
            audio.removeEventListener('error', handleError);
        };
    }, [onError]);

    const togglePlayPause = () => {
        const audio = audioRef.current;
        if (!audio) return;

        if (isPlaying) {
            audio.pause();
        } else {
            audio.play();
        }
        setIsPlaying(!isPlaying);
    };

    const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
        const audio = audioRef.current;
        if (!audio) return;

        const newTime = parseFloat(e.target.value);
        audio.currentTime = newTime;
        setCurrentTime(newTime);
    };

    const changePlaybackRate = (rate: number) => {
        const audio = audioRef.current;
        if (!audio) return;

        audio.playbackRate = rate;
        setPlaybackRate(rate);
    };

    const formatTime = (seconds: number): string => {
        if (!Number.isFinite(seconds) || isNaN(seconds)) return '00:00';
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center p-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-lg p-4 space-y-4">
            <audio ref={audioRef} src={audioUrl} preload="metadata" />

            {/* Progress Bar */}
            <div className="space-y-2">
                <input
                    type="range"
                    min="0"
                    max={Number.isFinite(duration) ? duration : 0}
                    value={currentTime}
                    onChange={handleSeek}
                    className="w-full h-2 bg-neutral-200 rounded-lg appearance-none cursor-pointer accent-primary"
                />
                <div className="flex justify-between text-sm text-neutral-600">
                    <span>{formatTime(currentTime)}</span>
                    <span>{formatTime(duration)}</span>
                </div>
            </div>

            {/* Controls */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    {/* Play/Pause Button */}
                    <button
                        onClick={togglePlayPause}
                        className="flex items-center justify-center w-12 h-12 bg-primary text-white rounded-full hover:bg-primary/90 transition-colors"
                    >
                        <span className="material-symbols-outlined text-2xl">
                            {isPlaying ? 'pause' : 'play_arrow'}
                        </span>
                    </button>

                    {/* Playback Speed */}
                    <div className="flex items-center gap-1">
                        {[0.5, 1, 1.5, 2].map((rate) => (
                            <button
                                key={rate}
                                onClick={() => changePlaybackRate(rate)}
                                className={`px-3 py-1 text-sm rounded-full transition-colors ${playbackRate === rate
                                    ? 'bg-primary text-white'
                                    : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
                                    }`}
                            >
                                {rate}x
                            </button>
                        ))}
                    </div>
                </div>

                {/* Download Button */}
                <a
                    href={audioUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-2 bg-neutral-100 text-neutral-700 rounded-full hover:bg-neutral-200 transition-colors"
                    title="Abrir/Descargar en nueva pestaña"
                >
                    <span className="material-symbols-outlined text-lg">download</span>
                    <span className="text-sm font-medium">Descargar</span>
                </a>
            </div>
        </div>
    );
};
