import React, { createContext, useContext, useState, ReactNode } from "react";

type RefreshContextType = {
    refreshKeys: Record<string, number>;
    triggerRefresh: (screen: string) => void;
    removeRefreshKey: (screen: string) => void;
};

const RefreshContext = createContext<RefreshContextType | undefined>(undefined);

export const RefreshProvider = ({ children }: { children: ReactNode }) => {
    const [refreshKeys, setRefreshKeys] = useState<Record<string, number>>({});

    const triggerRefresh = (screen: string) => {
        setRefreshKeys((prev) => ({
            ...prev,
            [screen]: Date.now(),
        }));
    };

    const removeRefreshKey = (screen: string) => {
        setRefreshKeys((prev) => {
            const updated = { ...prev };
            delete updated[screen];
            return updated;
        });
    };

    return (
        <RefreshContext.Provider
            value={{ refreshKeys, triggerRefresh, removeRefreshKey }}
        >
            {children}
        </RefreshContext.Provider>
    );
};

export const useRefresh = () => {
    const context = useContext(RefreshContext);
    if (!context) throw new Error("useRefresh must be used inside RefreshProvider");
    return context;
};
