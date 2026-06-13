"use client";

import { useEffect } from "react";

export type AppearanceThemeId = "grey" | "executive" | "fresh" | "midnight" | "classic";

export const APPEARANCE_THEMES: Array<{
  id: AppearanceThemeId;
  name: string;
  description: string;
  swatches: string[];
  vars: Record<string, string>;
}> = [
  {
    id: "grey",
    name: "GreyCRM Original",
    description: "Limpio, azul y operativo.",
    swatches: ["#2563eb", "#0f172a", "#f8fafc"],
    vars: {
      "--primary": "221.2 83.2% 53.3%",
      "--ring": "221.2 83.2% 53.3%",
      "--sidebar-background": "222 47% 11%",
      "--sidebar-primary": "221.2 83.2% 53.3%",
      "--sidebar-ring": "221.2 83.2% 53.3%",
      "--sidebar-accent": "216 34% 17%",
    },
  },
  {
    id: "executive",
    name: "Ejecutivo",
    description: "Azul profundo, sobrio y corporativo.",
    swatches: ["#0f3b66", "#0ea5e9", "#eef6ff"],
    vars: {
      "--primary": "205 74% 30%",
      "--ring": "199 89% 48%",
      "--sidebar-background": "202 55% 12%",
      "--sidebar-primary": "199 89% 48%",
      "--sidebar-ring": "199 89% 48%",
      "--sidebar-accent": "202 45% 18%",
    },
  },
  {
    id: "fresh",
    name: "Fresh Sales",
    description: "Verde moderno para equipos comerciales.",
    swatches: ["#059669", "#14b8a6", "#ecfdf5"],
    vars: {
      "--primary": "160 84% 39%",
      "--ring": "173 80% 40%",
      "--sidebar-background": "166 64% 10%",
      "--sidebar-primary": "160 84% 39%",
      "--sidebar-ring": "173 80% 40%",
      "--sidebar-accent": "165 48% 16%",
    },
  },
  {
    id: "midnight",
    name: "Midnight",
    description: "Oscuro, técnico y con alto contraste.",
    swatches: ["#111827", "#7c3aed", "#06b6d4"],
    vars: {
      "--primary": "262 83% 58%",
      "--ring": "188 95% 43%",
      "--sidebar-background": "220 39% 8%",
      "--sidebar-primary": "262 83% 58%",
      "--sidebar-ring": "188 95% 43%",
      "--sidebar-accent": "220 35% 14%",
    },
  },
  {
    id: "classic",
    name: "Clásico Claro",
    description: "Blanco, compacto y muy administrativo.",
    swatches: ["#334155", "#f59e0b", "#f8fafc"],
    vars: {
      "--primary": "215 25% 27%",
      "--ring": "38 92% 50%",
      "--sidebar-background": "210 35% 13%",
      "--sidebar-primary": "38 92% 50%",
      "--sidebar-ring": "38 92% 50%",
      "--sidebar-accent": "210 28% 20%",
    },
  },
];

const THEME_KEY = "greycrm-appearance-theme";
const DEFAULT_THEME: AppearanceThemeId = "grey";

/** Returns true when the base theme is "sunset" (set by ThemeProvider) */
function isSunsetActive(): boolean {
  if (typeof window === "undefined") return false;
  return localStorage.getItem("greycrm-theme") === "sunset";
}

function applyAppearance(themeId: string) {
  if (isSunsetActive()) return;

  const theme = APPEARANCE_THEMES.find((item) => item.id === themeId) ?? APPEARANCE_THEMES[0];
  Object.entries(theme.vars).forEach(([name, value]) => {
    document.documentElement.style.setProperty(name, value);
  });
  document.documentElement.dataset.appearanceTheme = theme.id;
}

export function AppearancePreferenceProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    applyAppearance(localStorage.getItem(THEME_KEY) ?? DEFAULT_THEME);

    const onStorage = (event: StorageEvent) => {
      if (event.key === THEME_KEY) applyAppearance(event.newValue ?? DEFAULT_THEME);
      if (event.key === "greycrm-theme") {
        applyAppearance(localStorage.getItem(THEME_KEY) ?? DEFAULT_THEME);
      }
    };

    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  return children;
}

export function setAppAppearance(themeId: AppearanceThemeId) {
  localStorage.setItem(THEME_KEY, themeId);
  applyAppearance(themeId);
}

export function getStoredAppAppearance(): AppearanceThemeId {
  if (typeof window === "undefined") return DEFAULT_THEME;
  const stored = localStorage.getItem(THEME_KEY) as AppearanceThemeId | null;
  return APPEARANCE_THEMES.some((item) => item.id === stored) ? stored! : DEFAULT_THEME;
}
