import React, { createContext, useContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export type Theme = {
    primaryColor: string;
    secondaryColor: string;
};

type ThemeContextType = {
    theme: Theme;
    setTheme: (theme: Theme) => void;
    resetTheme: () => void;
};

export const defaultTheme: Theme = {
    primaryColor: "#fad427",
    secondaryColor: "#4f430f",
};

const ThemeContext = createContext<ThemeContextType>({
    theme: defaultTheme,
    setTheme: () => { },
    resetTheme: () => { },
});

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({
    children,
}) => {
    const [theme, setThemeState] = useState<Theme>(defaultTheme);

    useEffect(() => {
        (async () => {
            const stored = await AsyncStorage.getItem("theme");
            if (stored) {
                setThemeState(JSON.parse(stored));
            }
        })();
    }, []);

    const setTheme = async (newTheme: Theme) => {
        setThemeState(newTheme);
        await AsyncStorage.setItem("theme", JSON.stringify(newTheme));
    };

    const resetTheme = async () => {
        setThemeState(defaultTheme);
        await AsyncStorage.removeItem("theme");
    };

    return (
        <ThemeContext.Provider value={{ theme, setTheme, resetTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => useContext(ThemeContext);