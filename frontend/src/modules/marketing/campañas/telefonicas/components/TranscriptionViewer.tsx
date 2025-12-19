import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';

interface TranscriptionViewerProps {
    transcription: string;
    loading?: boolean;
}

export const TranscriptionViewer: React.FC<TranscriptionViewerProps> = ({
    transcription,
    loading = false,
}) => {
    const [copied, setCopied] = useState(false);

    const copyToClipboard = async () => {
        try {
            await navigator.clipboard.writeText(transcription);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (error) {
            console.error('Error al copiar:', error);
        }
    };

    const downloadAsFile = (format: 'md' | 'txt') => {
        const blob = new Blob([transcription], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `transcripcion_${Date.now()}.${format}`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    };

    if (loading) {
        return (
            <div className="space-y-3 animate-pulse">
                <div className="h-4 bg-neutral-200 rounded w-3/4"></div>
                <div className="h-4 bg-neutral-200 rounded"></div>
                <div className="h-4 bg-neutral-200 rounded w-5/6"></div>
                <div className="h-4 bg-neutral-200 rounded w-2/3"></div>
            </div>
        );
    }

    if (!transcription) {
        return (
            <div className="flex flex-col items-center justify-center p-12 text-center">
                <span className="material-symbols-outlined text-6xl text-neutral-300 mb-4">
                    description
                </span>
                <p className="text-neutral-500">
                    Transcripción no disponible
                </p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {/* Toolbar */}
            <div className="flex items-center justify-end gap-2 pb-2 border-b border-neutral-200">
                <button
                    onClick={copyToClipboard}
                    className="flex items-center gap-2 px-3 py-1.5 text-sm bg-neutral-100 text-neutral-700 rounded-full hover:bg-neutral-200 transition-colors"
                >
                    <span className="material-symbols-outlined text-lg">
                        {copied ? 'check' : 'content_copy'}
                    </span>
                    <span>{copied ? 'Copiado' : 'Copiar'}</span>
                </button>

                <div className="flex items-center gap-1">
                    <button
                        onClick={() => downloadAsFile('md')}
                        className="flex items-center gap-2 px-3 py-1.5 text-sm bg-neutral-100 text-neutral-700 rounded-full hover:bg-neutral-200 transition-colors"
                    >
                        <span className="material-symbols-outlined text-lg">download</span>
                        <span>.md</span>
                    </button>

                    <button
                        onClick={() => downloadAsFile('txt')}
                        className="flex items-center gap-2 px-3 py-1.5 text-sm bg-neutral-100 text-neutral-700 rounded-full hover:bg-neutral-200 transition-colors"
                    >
                        <span className="material-symbols-outlined text-lg">download</span>
                        <span>.txt</span>
                    </button>
                </div>
            </div>

            {/* Markdown Content */}
            <div className="prose prose-neutral max-w-none">
                <div className="bg-white rounded-lg p-6 max-h-[600px] overflow-y-auto">
                    <ReactMarkdown
                        components={{
                            h1: ({ node, ...props }) => (
                                <h1 className="text-2xl font-bold mb-4 text-neutral-900" {...props} />
                            ),
                            h2: ({ node, ...props }) => (
                                <h2 className="text-xl font-semibold mt-6 mb-3 text-neutral-800" {...props} />
                            ),
                            h3: ({ node, ...props }) => (
                                <h3 className="text-lg font-medium mt-4 mb-2 text-neutral-700" {...props} />
                            ),
                            p: ({ node, ...props }) => (
                                <p className="mb-3 text-neutral-700 leading-relaxed" {...props} />
                            ),
                            ul: ({ node, ...props }) => (
                                <ul className="list-disc list-inside mb-3 space-y-1 text-neutral-700" {...props} />
                            ),
                            strong: ({ node, ...props }) => (
                                <strong className="font-semibold text-neutral-900" {...props} />
                            ),
                            code: ({ node, inline, ...props }) =>
                                inline ? (
                                    <code className="bg-neutral-100 px-1 py-0.5 rounded text-sm font-mono" {...props} />
                                ) : (
                                    <code className="block bg-neutral-100 p-3 rounded text-sm font-mono overflow-x-auto" {...props} />
                                ),
                        }}
                    >
                        {transcription}
                    </ReactMarkdown>
                </div>
            </div>
        </div>
    );
};
