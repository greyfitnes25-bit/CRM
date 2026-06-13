"use client";

import * as React from "react";

export type Theme = "light" | "dark" | "sunset" | "system";

interface ThemeProviderProps {
  children: React.ReactNode;
  defaultTheme?: Theme;
  storageKey?: string;
}

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  resolvedTheme: "light" | "dark" | "sunset";
}

const ThemeContext = React.createContext<ThemeContextType>({
  theme: "dark",
  setTheme: () => null,
  resolvedTheme: "dark",
});

/** CSS variables injected when sunset theme is active */
const SUNSET_VARS: Record<string, string> = {
  "--background": "24 30% 8%",
  "--foreground": "30 80% 95%",
  "--card": "22 28% 11%",
  "--card-foreground": "30 80% 95%",
  "--popover": "22 28% 11%",
  "--popover-foreground": "30 80% 95%",
  "--primary": "25 90% 60%",
  "--primary-foreground": "22 25% 8%",
  "--secondary": "24 25% 16%",
  "--secondary-foreground": "30 70% 90%",
  "--muted": "24 25% 16%",
  "--muted-foreground": "28 35% 62%",
  "--accent": "30 55% 22%",
  "--accent-foreground": "30 80% 95%",
  "--destructive": "0 65% 42%",
  "--destructive-foreground": "30 80% 95%",
  "--border": "24 22% 19%",
  "--input": "24 22% 19%",
  "--ring": "25 90% 60%",
  "--sidebar-background": "22 38% 7%",
  "--sidebar-foreground": "30 55% 86%",
  "--sidebar-primary": "25 90% 60%",
  "--sidebar-primary-foreground": "22 38% 7%",
  "--sidebar-accent": "24 32% 12%",
  "--sidebar-accent-foreground": "30 55% 86%",
  "--sidebar-border": "24 32% 12%",
  "--sidebar-ring": "25 90% 60%",
};

function applySunsetVars(root: HTMLElement) {
  Object.entries(SUNSET_VARS).forEach(([k, v]) => root.style.setProperty(k, v));
}

function clearSunsetVars(root: HTMLElement) {
  Object.keys(SUNSET_VARS).forEach((k) => root.style.removeProperty(k));
}

export function ThemeProvider({
  children,
  defaultTheme = "dark",
  storageKey = "greycrm-theme",
}: ThemeProviderProps) {
  const [theme, setThemeState] = React.useState<Theme>(defaultTheme);
  const [resolvedTheme, setResolvedTheme] = React.useState<"light" | "dark" | "sunset">(
    defaultTheme === "light" ? "light" : defaultTheme === "sunset" ? "sunset" : "dark"
  );

  React.useEffect(() => {
    const stored = localStorage.getItem(storageKey) as Theme | null;
    if (stored) {
      setThemeState(stored);
    }
  }, [storageKey]);

  React.useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove("light", "dark", "sunset");

    if (theme === "sunset") {
      root.classList.add("dark", "sunset");
      setTimeout(() => applySunsetVars(root), 0);
      setResolvedTheme("sunset");
      return;
    }

    clearSunsetVars(root);

    let resolved: "light" | "dark";
    if (theme === "system") {
      resolved = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    } else {
      resolved = theme as "light" | "dark";
    }

    root.classList.add(resolved);
    setResolvedTheme(resolved);
  }, [theme]);

  const setTheme = React.useCallback(
    (newTheme: Theme) => {
      localStorage.setItem(storageKey, newTheme);
      setThemeState(newTheme);
    },
    [storageKey]
  );

  return (
    <ThemeContext.Provider value={{ theme, setTheme, resolvedTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return React.useContext(ThemeContext);
}
