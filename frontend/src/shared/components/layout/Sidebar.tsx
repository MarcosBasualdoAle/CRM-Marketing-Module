import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useSidebar } from '../../context/SidebarContext';

type ModuleFlag = 'MAILING' | 'TELEFONIA';

interface NavItem {
    icon: string;
    label: string;
    expandedLabel: string;
    path: string;
    excludePath?: string;
    requiredRole?: string;
    requiredModule?: ModuleFlag;
}

const NAV_ITEMS: NavItem[] = [
    { icon: 'person_search', label: 'Leads', expandedLabel: 'Gestión de Leads', path: '/marketing/leads' },
    { icon: 'filter_alt', label: 'Segmentación', expandedLabel: 'Segmentación', path: '/marketing/segmentacion' },
    { icon: 'campaign', label: 'Campañas', expandedLabel: 'Gestión de Campañas', path: '/marketing/campanas', excludePath: '/marketing/campanas/mailing', requiredRole: 'ADMIN' },
    { icon: 'mail', label: 'Emailing', expandedLabel: 'Campañas de Mailing', path: '/marketing/emailing', requiredModule: 'MAILING' },
    { icon: 'phone_in_talk', label: 'Teléfono', expandedLabel: 'Campañas Telefónicas', path: '/marketing/campanas/telefonicas', requiredModule: 'TELEFONIA' },
    { icon: 'ballot', label: 'Encuestas', expandedLabel: 'Encuestas', path: '/marketing/encuestas' },
];


export const Sidebar: React.FC = () => {
    const location = useLocation();
    const { logout, hasRole, canAccessMailing, canAccessTelefonia } = useAuth();
    const { isExpanded, setIsExpanded } = useSidebar();

    const filteredItems = React.useMemo(() => {
        return NAV_ITEMS.filter(item => {
            if (item.requiredRole && !hasRole(item.requiredRole)) {
                return false;
            }
            if (item.requiredModule === 'MAILING' && !canAccessMailing()) {
                return false;
            }
            if (item.requiredModule === 'TELEFONIA' && !canAccessTelefonia()) {
                return false;
            }
            return true;
        });
    }, [hasRole, canAccessMailing, canAccessTelefonia]);

    const activeItem = React.useMemo(() => {
        const sortedItems = [...filteredItems].sort((a, b) => b.path.length - a.path.length);
        return sortedItems.find(item => {
            const isExcluded = item.excludePath && (location.pathname.startsWith(item.excludePath) || location.pathname === item.excludePath);
            if (isExcluded) return false;
            return location.pathname === item.path || location.pathname.startsWith(`${item.path}/`);
        });
    }, [location.pathname, filteredItems]);

    return (
        <>
            {/* Overlay con sombra - transición gradual sincronizada con el sidebar */}
            <div
                className={`fixed inset-0 z-40 transition-all duration-300 ease-in-out ${isExpanded
                    ? 'bg-black/20 pointer-events-auto'
                    : 'bg-transparent pointer-events-none'
                    }`}
                onClick={() => setIsExpanded(false)}
            />

            <nav
                className={`fixed left-0 top-0 h-full bg-primary flex flex-col py-6 z-50 transition-all duration-300 ease-in-out ${isExpanded
                    ? 'w-64 shadow-2xl shadow-black/50'
                    : 'w-20 shadow-xl'
                    }`}
                onMouseEnter={() => setIsExpanded(true)}
                onMouseLeave={() => setIsExpanded(false)}
            >
                {/* Logo/Dashboard */}
                <Link
                    to="/"
                    className={`text-white/80 hover:text-white hover:bg-white/10 p-3 rounded-lg transition-colors flex items-center gap-3 ${isExpanded ? 'mx-4' : 'mx-auto'
                        }`}
                    title="Dashboard"
                >
                    <span className="material-symbols-outlined text-3xl">apps</span>
                    {isExpanded && (
                        <span className="text-white font-medium whitespace-nowrap overflow-hidden">
                            Dashboard
                        </span>
                    )}
                </Link>

                <div className={`h-px bg-white/20 my-4 ${isExpanded ? 'mx-4' : 'w-12 mx-auto'}`} />

                {/* Navegación Principal */}
                <div className="flex flex-col space-y-2 w-full">
                    {filteredItems.map((item) => {
                        const isActive = activeItem?.path === item.path;
                        return (
                            <Link
                                key={item.path}
                                to={item.path}
                                title={!isExpanded ? item.expandedLabel : undefined}
                                aria-label={item.expandedLabel}
                                aria-current={isActive ? 'page' : undefined}
                                className={`
                                    flex items-center gap-3 h-12 rounded-lg transition-all duration-200
                                    ${isExpanded ? 'mx-4 px-3' : 'w-12 mx-auto justify-center'}
                                    ${isActive
                                        ? 'bg-white text-primary shadow-lg'
                                        : 'text-white/80 hover:text-white hover:bg-white/10'}
                                `}
                            >
                                <span className="material-symbols-outlined text-2xl flex-shrink-0">{item.icon}</span>
                                {isExpanded && (
                                    <span className="font-medium whitespace-nowrap overflow-hidden text-sm">
                                        {item.expandedLabel}
                                    </span>
                                )}
                            </Link>
                        );
                    })}
                </div>

                {/* Separador inferior */}
                <div className="mt-auto" />
                <div className={`h-px bg-white/20 my-4 ${isExpanded ? 'mx-4' : 'w-12 mx-auto'}`} />

                {/* Acciones secundarias */}
                <button
                    className={`text-white/80 hover:text-white p-3 rounded-lg hover:bg-white/10 transition-colors flex items-center gap-3 ${isExpanded ? 'mx-4' : 'mx-auto'
                        }`}
                    title={!isExpanded ? "Ayuda" : undefined}
                    aria-label="Ayuda"
                >
                    <span className="material-symbols-outlined text-2xl">help_outline</span>
                    {isExpanded && (
                        <span className="font-medium whitespace-nowrap text-sm">Ayuda</span>
                    )}
                </button>
                <button
                    onClick={logout}
                    className={`text-white/80 hover:text-white p-3 rounded-lg hover:bg-white/10 transition-colors flex items-center gap-3 ${isExpanded ? 'mx-4' : 'mx-auto'
                        }`}
                    title={!isExpanded ? "Cerrar sesión" : undefined}
                    aria-label="Cerrar sesión"
                >
                    <span className="material-symbols-outlined text-2xl">logout</span>
                    {isExpanded && (
                        <span className="font-medium whitespace-nowrap text-sm">Cerrar sesión</span>
                    )}
                </button>
            </nav>
        </>
    );
};
