import React, { createContext, useContext, useState, ReactNode } from 'react';

interface SidebarContextType {
    isExpanded: boolean;
    setIsExpanded: (expanded: boolean) => void;
}

const SidebarContext = createContext<SidebarContextType | undefined>(undefined);

export const SidebarProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [isExpanded, setIsExpanded] = useState(false);

    return (
        <SidebarContext.Provider value={{ isExpanded, setIsExpanded }}>
            {children}
        </SidebarContext.Provider>
    );
};

export const useSidebar = (): SidebarContextType => {
    const context = useContext(SidebarContext);
    if (!context) {
        throw new Error('useSidebar must be used within a SidebarProvider');
    }
    return context;
};
