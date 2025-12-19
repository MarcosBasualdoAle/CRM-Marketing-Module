import React, { useState, useEffect, useRef, forwardRef, useImperativeHandle } from 'react';

interface AudioRecorderProps {
    isRecording: boolean;
    onRecordingComplete?: (audioBlob: Blob, durationSeconds: number) => void;
}

export interface AudioRecorderHandle {
    getRecording: () => { audioBlob: Blob | null; duracion: number };
}

export const AudioRecorder = forwardRef<AudioRecorderHandle, AudioRecorderProps>(
    ({ isRecording, onRecordingComplete }, ref) => {
        const [recordingTime, setRecordingTime] = useState(0);
        const [hasPermission, setHasPermission] = useState(false);
        const mediaRecorderRef = useRef<MediaRecorder | null>(null);
        const audioChunksRef = useRef<Blob[]>([]);
        const streamRef = useRef<MediaStream | null>(null);
        const startTimeRef = useRef<number>(0);
        const timerRef = useRef<NodeJS.Timeout | null>(null);

        // Exponer método para obtener la grabación
        useImperativeHandle(ref, () => ({
            getRecording: () => {
                if (audioChunksRef.current.length > 0) {
                    const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/mpeg' });
                    return { audioBlob, duracion: recordingTime };
                }
                return { audioBlob: null, duracion: 0 };
            },
        }));

        // Solicitar permisos al montar
        useEffect(() => {
            const requestPermission = async () => {
                try {
                    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
                    streamRef.current = stream;
                    setHasPermission(true);
                } catch (error) {
                    console.error('Error al solicitar permiso de micrófono:', error);
                    setHasPermission(false);
                }
            };

            requestPermission();

            return () => {
                // Limpiar stream al desmontar
                if (streamRef.current) {
                    streamRef.current.getTracks().forEach(track => track.stop());
                }
                if (timerRef.current) {
                    clearInterval(timerRef.current);
                }
            };
        }, []);

        // Manejar inicio/fin de grabación
        useEffect(() => {
            if (!hasPermission || !streamRef.current) return;

            if (isRecording) {
                startRecording();
            } else {
                stopRecording();
            }
        }, [isRecording, hasPermission]);

        const startRecording = () => {
            try {
                audioChunksRef.current = [];
                const mediaRecorder = new MediaRecorder(streamRef.current!, {
                    mimeType: 'audio/webm',
                });

                mediaRecorder.ondataavailable = (event) => {
                    if (event.data.size > 0) {
                        audioChunksRef.current.push(event.data);
                    }
                };

                mediaRecorder.onstop = () => {
                    const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/mpeg' });
                    onRecordingComplete?.(audioBlob, recordingTime);
                };

                mediaRecorder.start(1000); // Capturar cada segundo
                mediaRecorderRef.current = mediaRecorder;

                // Iniciar temporizador
                startTimeRef.current = Date.now();
                setRecordingTime(0);

                timerRef.current = setInterval(() => {
                    const elapsed = Math.floor((Date.now() - startTimeRef.current) / 1000);
                    setRecordingTime(elapsed);
                }, 1000);

            } catch (error) {
                console.error('Error al iniciar grabación:', error);
            }
        };

        const stopRecording = () => {
            if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
                mediaRecorderRef.current.stop();
            }

            if (timerRef.current) {
                clearInterval(timerRef.current);
                timerRef.current = null;
            }
        };

        const formatTime = (seconds: number): string => {
            const mins = Math.floor(seconds / 60);
            const secs = seconds % 60;
            return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
        };

        if (!hasPermission) {
            return (
                <div className="flex items-center gap-2 text-red-600 dark:text-red-400">
                    <span className="material-symbols-outlined text-xl">mic_off</span>
                    <span className="text-sm">Sin permiso de micrófono</span>
                </div>
            );
        }

        if (!isRecording) {
            return null; // No mostrar nada cuando no está grabando
        }

        return (
            <div className="flex items-center gap-3 bg-red-50 dark:bg-red-900/20 px-4 py-2 rounded-lg border border-red-200 dark:border-red-800">
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-red-600 rounded-full animate-pulse" />
                    <span className="material-symbols-outlined text-red-600 dark:text-red-400">
                        mic
                    </span>
                </div>
                <span className="text-sm font-medium text-red-900 dark:text-red-100">
                    Grabando
                </span>
                <span className="text-sm font-mono text-red-700 dark:text-red-300 ml-auto">
                    {formatTime(recordingTime)}
                </span>
            </div>
        );
    }
);

AudioRecorder.displayName = 'AudioRecorder';
