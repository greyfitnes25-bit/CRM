"use client";

import { useEffect } from "react";

const FONT_KEY = "greycrm-font-family";
export const DEFAULT_APP_FONT = "var(--font-poppins), Poppins, var(--font-geist-sans), system-ui, sans-serif";

function sanitizeFont(fontFamily: string | null | undefined) {
  if (!fontFamily) return DEFAULT_APP_FONT;
  const unsafeSerif = /\b(serif|georgia|times|cambria|garamond|baskerville)\b/i.test(fontFamily);
  return unsafeSerif ? DEFAULT_APP_FONT : fontFamily;
}

function applyFont(fontFamily: string) {
  const value = sanitizeFont(fontFamily);
  document.documentElement.style.setProperty("--app-font-family", value);
  document.documentElement.dataset.appFont = value;
  document.body?.style.setProperty("--app-font-family", value);
  document.body?.style.setProperty("font-family", value);
}

export function FontPreferenceProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const stored = localStorage.getItem(FONT_KEY);
    const sanitized = sanitizeFont(stored);
    if (stored !== sanitized) localStorage.setItem(FONT_KEY, sanitized);
    applyFont(sanitized);

    const onStorage = (event: StorageEvent) => {
      if (event.key === FONT_KEY) applyFont(sanitizeFont(event.newValue));
    };

    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  return children;
}

export function setAppFont(fontFamily: string) {
  const sanitized = sanitizeFont(fontFamily);
  localStorage.setItem(FONT_KEY, sanitized);
  applyFont(sanitized);
}

export function getStoredAppFont() {
  if (typeof window === "undefined") return DEFAULT_APP_FONT;
  return sanitizeFont(localStorage.getItem(FONT_KEY));
}
