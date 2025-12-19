import React from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from '../../shared/components/layout/Sidebar';
import { SidebarProvider, useSidebar } from '../../shared/context/SidebarContext';
import { ScheduledCallsNotification } from '../../modules/marketing/campañas/telefonicas/components/ScheduledCallsNotification';

const MainLayoutContent: React.FC = () => {
    const { isExpanded } = useSidebar();

    return (
        <div className="flex min-h-screen bg-gray-50">
            {/* Sidebar Navigation */}
            <Sidebar />

            {/* Main Content Area - ajusta el margen según el estado del sidebar */}
            <main className={`flex-1 p-8 transition-all duration-300 ease-in-out ${isExpanded ? 'ml-64' : 'ml-20'
                }`}>
                <Outlet />
            </main>

            {/* Scheduled Calls Notification */}
            <ScheduledCallsNotification />
        </div>
    );
};

export const MainLayout: React.FC = () => {
    return (
        <SidebarProvider>
            <MainLayoutContent />
        </SidebarProvider>
    );
};
