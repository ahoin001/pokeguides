"use client";

import { useEffect, type ReactNode } from "react";
import { applyTheme, useThemeStore } from "@/stores/theme";

/** Keeps `html[data-theme]` in sync with the persisted theme store. */
export function ThemeProvider({ children }: { children: ReactNode }) {
  const theme = useThemeStore((s) => s.theme);

  useEffect(() => {
    const unsub = useThemeStore.persist.onFinishHydration(() => {
      applyTheme(useThemeStore.getState().theme);
    });
    if (useThemeStore.persist.hasHydrated()) {
      applyTheme(useThemeStore.getState().theme);
    }
    return unsub;
  }, []);

  useEffect(() => {
    applyTheme(theme);
  }, [theme]);

  return children;
}
