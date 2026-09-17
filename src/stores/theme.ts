"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export type ThemeId = "light" | "dark";

export const THEME_STORAGE_KEY = "ringside-theme";

export function systemTheme(): ThemeId {
  if (typeof window === "undefined") return "dark";
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

export function applyTheme(theme: ThemeId) {
  if (typeof document === "undefined") return;
  const root = document.documentElement;
  root.dataset.theme = theme;
  root.style.colorScheme = theme;
}

type ThemeState = {
  theme: ThemeId;
  setTheme: (theme: ThemeId) => void;
  toggleTheme: () => void;
};

export const useThemeStore = create<ThemeState>()(
  persist(
    (set, get) => ({
      theme: "dark",
      setTheme: (theme) => {
        applyTheme(theme);
        set({ theme });
      },
      toggleTheme: () => {
        const next: ThemeId = get().theme === "dark" ? "light" : "dark";
        applyTheme(next);
        set({ theme: next });
      },
    }),
    {
      name: THEME_STORAGE_KEY,
      version: 1,
      onRehydrateStorage: () => (state) => {
        if (typeof window === "undefined") return;
        try {
          if (!localStorage.getItem(THEME_STORAGE_KEY)) {
            const t = systemTheme();
            applyTheme(t);
            useThemeStore.setState({ theme: t });
            return;
          }
        } catch {
          /* ignore */
        }
        if (state?.theme === "light" || state?.theme === "dark") {
          applyTheme(state.theme);
        }
      },
    },
  ),
);
