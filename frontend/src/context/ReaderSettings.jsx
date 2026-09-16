import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { DEFAULT_SETTINGS, getSettings, saveSettings } from "@/lib/storage";

const ReaderSettingsContext = createContext(null);

export function ReaderSettingsProvider({ children }) {
  const [settings, setSettings] = useState(() => getSettings());

  useEffect(() => {
    saveSettings(settings);
  }, [settings]);

  const value = useMemo(
    () => ({
      settings,
      setSettings,
      update: (patch) => setSettings((s) => ({ ...s, ...patch })),
      reset: () => setSettings(DEFAULT_SETTINGS),
    }),
    [settings]
  );

  return (
    <ReaderSettingsContext.Provider value={value}>
      {children}
    </ReaderSettingsContext.Provider>
  );
}

export function useReaderSettings() {
  const ctx = useContext(ReaderSettingsContext);
  if (!ctx) throw new Error("useReaderSettings must be used within ReaderSettingsProvider");
  return ctx;
}

export const widthMap = {
  narrow: "max-w-[58ch]",
  medium: "max-w-[72ch]",
  wide: "max-w-[92ch]",
  full: "max-w-none",
};

export const fontFamilyMap = {
  serif: "font-body-serif",
  sans: "font-body-sans",
  mono: "font-body-mono",
};
