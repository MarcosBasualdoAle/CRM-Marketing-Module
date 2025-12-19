import React from 'react';
import { useNavigate } from 'react-router-dom';
import { modules, ModuleConfig } from './moduleConfig';

export const HubPage: React.FC = () => {
    const navigate = useNavigate();

    const handleModuleClick = (module: ModuleConfig) => {
        if (module.isExternal) {
            // Redirect to external URL
            window.location.href = module.url;
        } else {
            // Navigate to internal route
            navigate(module.url);
        }
    };

    return (
        <div className="flex min-h-screen w-full flex-col bg-background font-display">
            <header className="w-full border-b border-border-color bg-card-white">
                <div className="mx-auto flex max-w-[1200px] items-center px-8 py-4">
                    <div className="flex items-center gap-4">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-[#1D4ED8] to-[#1E40AF]">
                            <span className="material-symbols-outlined text-white" style={{ fontSize: 24 }}>
                                widgets
                            </span>
                        </div>
                        <div>
                            <h1 className="text-lg font-semibold text-main-text">Sistema Integrado</h1>
                            <p className="text-xs text-secondary-text">Portal de módulos</p>
                        </div>
                    </div>
                </div>
            </header>

            <main className="w-full flex-1">
                <div className="mx-auto max-w-[1200px] px-8 py-8">
                    <div className="flex h-24 items-center rounded-band bg-gradient-to-r from-[#1D4ED8] to-[#1E40AF] p-6 shadow-band">
                        <div>
                            <h2 className="text-xl font-semibold text-white">
                                Selecciona un módulo para continuar
                            </h2>
                            <p className="mt-1 text-sm text-slate-100/90">
                                Acceso rápido a las áreas operativas del sistema.
                            </p>
                        </div>
                    </div>

                    <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8">
                        {modules.map((module) => (
                            <div
                                key={module.id}
                                onClick={() => handleModuleClick(module)}
                                className="group flex cursor-pointer flex-col rounded-card border border-border-color bg-card-white p-6 shadow-card transition-all duration-200 hover:-translate-y-0.5 hover:shadow-card-hover"
                            >
                                <div className="flex items-center gap-4">
                                    <div
                                        className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-icon"
                                        style={{ backgroundColor: module.iconBgColor }}
                                    >
                                        <span
                                            className="material-symbols-outlined"
                                            style={{ color: module.iconColor }}
                                        >
                                            {module.icon}
                                        </span>
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="text-base font-semibold text-main-text">{module.title}</h3>
                                    </div>
                                    <span className="flex-shrink-0 rounded-full bg-chip-bg px-3 py-1 text-xs font-medium text-secondary-text">
                                        {module.category}
                                    </span>
                                </div>

                                <p className="mt-4 flex-grow text-sm text-secondary-text">
                                    {module.description}
                                </p>

                                <button className="mt-6 inline-flex w-fit items-center justify-center gap-2 self-start rounded-button bg-primary px-5 py-2 text-sm font-medium text-white transition-all duration-200 hover:bg-primary-dark hover:shadow-md">
                                    Ingresar
                                    <span className="material-symbols-outlined text-base transition-transform duration-200 group-hover:translate-x-0.5">
                                        arrow_forward
                                    </span>
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            </main>
        </div>
    );
};
