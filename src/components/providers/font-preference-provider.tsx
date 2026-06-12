"use client";

import { useEffect } from "react";

const FONT_KEY = "greycrm-font-family";
export const DEFAULT_APP_FONT = "var(--font-poppins), Poppins, var(--font-geist-sans), system-ui, sans-serif";

function applyFont(fontFamily: string) {
  const value = fontFamily || DEFAULT_APP_FONT;
  document.documentElement.style.setProperty("--app-font-family", value);
  document.documentElement.dataset.appFont = value;
}

export function FontPreferenceProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    applyFont(localStorage.getItem(FONT_KEY) ?? DEFAULT_APP_FONT);

    const onStorage = (event: StorageEvent) => {
      if (event.key === FONT_KEY) applyFont(event.newValue ?? DEFAULT_APP_FONT);
    };

    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  return children;
}

export function setAppFont(fontFamily: string) {
  localStorage.setItem(FONT_KEY, fontFamily);
  applyFont(fontFamily);
}

export function getStoredAppFont() {
  if (typeof window === "undefined") return DEFAULT_APP_FONT;
  return localStorage.getItem(FONT_KEY) ?? DEFAULT_APP_FONT;
}
