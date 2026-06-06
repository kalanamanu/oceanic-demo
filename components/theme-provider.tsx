"use client";

import * as React from "react";
import {
  ThemeProvider as NextThemesProvider,
  type ThemeProviderProps,
  useTheme,
} from "next-themes";

function ThemeSync() {
  const { setTheme } = useTheme();

  React.useEffect(() => {
    try {
      const stored = localStorage.getItem("user_data");

      if (!stored) return;

      const user = JSON.parse(stored);

      const dbTheme = user?.profile?.theme;

      if (dbTheme) {
        setTheme(dbTheme);
      }
    } catch (err) {
      console.error("Theme sync failed", err);
    }
  }, [setTheme]);

  return null;
}

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return (
    <NextThemesProvider {...props}>
      <ThemeSync />
      {children}
    </NextThemesProvider>
  );
}
