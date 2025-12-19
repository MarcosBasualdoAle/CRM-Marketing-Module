/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: {
                    DEFAULT: '#3C83F6', // Azul corporativo
                    hover: '#2563EB',
                    dark: '#1E3A8A',
                },
                background: '#F3F4F6',
                dark: '#1F2937',       // Texto principal
                separator: '#D9D9D9',  // Bordes

                // Hub colors
                'primary-dark': '#1E3A8A',
                'card-white': '#FFFFFF',
                'border-color': '#CBD5F5',
                'main-text': '#0B1120',
                'secondary-text': '#475569',
                'chip-bg': '#F1F5F9',

                // Estados (Chips)
                status: {
                    success: { bg: '#EBFBDC', text: '#6EA113' }, // CALIFICADO
                    warning: { bg: '#FFFBEB', text: '#D97706' }, // RECHAZADO
                    default: { bg: '#EAEAEA', text: '#555555' }, // NUEVO
                }
            },
            fontFamily: {
                display: ['Inter', 'sans-serif'],
            },
            borderRadius: {
                card: '1.25rem', // 20px
                button: '9999px',
                icon: '9999px',
                band: '1rem', // 16px
            },
            boxShadow: {
                'soft': '0 1px 3px 0 rgba(0, 0, 0, 0.05), 0 1px 2px 0 rgba(0, 0, 0, 0.03)',
                'glow': '0 4px 14px 0 rgba(60, 131, 246, 0.3)',
                'card': '0 10px 30px rgba(15, 23, 42, 0.04)',
                'card-hover': '0 12px 40px rgba(15, 23, 42, 0.07)',
                'band': '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
            }
        },
    },
    plugins: [
        require('@tailwindcss/typography'),
    ],
}
