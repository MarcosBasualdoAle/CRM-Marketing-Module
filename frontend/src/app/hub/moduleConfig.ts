export interface ModuleConfig {
    id: string;
    title: string;
    description: string;
    category: string;
    icon: string;
    iconColor: string;
    iconBgColor: string;
    url: string;
    isExternal: boolean;
}

export const modules: ModuleConfig[] = [
    {
        id: 'atencion-cliente',
        title: 'Atención al Cliente',
        description: 'Gestiona y resuelve las incidencias y solicitudes de los clientes de manera eficiente.',
        category: 'SQRC',
        icon: 'support_agent',
        iconColor: '#DC2626',
        iconBgColor: '#FECACA',
        url: 'http://modulo-sqrc.up.railway.app',
        isExternal: true,
    },
    {
        id: 'marketing',
        title: 'Marketing',
        description: 'Planifica, ejecuta y analiza las campañas de marketing para captar nuevos clientes.',
        category: 'Campañas',
        icon: 'campaign',
        iconColor: '#7C3AED',
        iconBgColor: '#E9D5FF',
        url: '/login',
        isExternal: false,
    },
    {
        id: 'ventas',
        title: 'Ventas',
        description: 'Registra nuevas ventas, gestiona clientes potenciales y realiza seguimiento de cuotas.',
        category: 'Comercial',
        icon: 'receipt_long',
        iconColor: '#0284C7',
        iconBgColor: '#BAE6FD',
        url: 'https://mod-ventas.vercel.app/',
        isExternal: true,
    },
    {
        id: 'inventario',
        title: 'Inventario',
        description: 'Controla el stock de productos, gestiona entradas y salidas de mercancía.',
        category: 'Logística',
        icon: 'inventory_2',
        iconColor: '#16A34A',
        iconBgColor: '#BBF7D0',
        url: '#', // TODO: Configurar URL del módulo de Inventario
        isExternal: true,
    },
    {
        id: 'recursos-humanos',
        title: 'Recursos Humanos',
        description: 'Administra la información del personal, nóminas, contratos y evaluaciones.',
        category: 'Gestión',
        icon: 'groups',
        iconColor: '#4F46E5',
        iconBgColor: '#C7D2FE',
        url: '#', // TODO: Configurar URL del módulo de Recursos Humanos
        isExternal: true,
    },
    {
        id: 'compras',
        title: 'Compras',
        description: 'Gestiona órdenes de compra, seguimiento de proveedores y control de gastos.',
        category: 'Proveedores',
        icon: 'shopping_cart',
        iconColor: '#DB2777',
        iconBgColor: '#FBCFE8',
        url: '#', // TODO: Configurar URL del módulo de Compras
        isExternal: true,
    },
];
