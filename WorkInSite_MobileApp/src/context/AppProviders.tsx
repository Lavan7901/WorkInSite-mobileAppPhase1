import React from 'react';
import { RefreshProvider } from '../context/RefreshContext';
import { LanguageProvider } from '../context/LanguageContext';
import { ThemeProvider } from '../context/ThemeContext';
import { UserProvider } from '../context/UserContext';

interface Props {
    children: React.ReactNode;
}

export const AppProviders = ({ children }: Props) => {
    return (
        <RefreshProvider>
            <LanguageProvider>
                <ThemeProvider>
                    <UserProvider>
                        {children}
                    </UserProvider>
                </ThemeProvider>
            </LanguageProvider>
        </RefreshProvider>
    );
};
