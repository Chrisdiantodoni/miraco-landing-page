/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { createContext, ReactNode, useContext } from "react";
import { SiteData } from "../types/settings";

const Ctx = createContext<SiteData | null>(null);

interface SiteSettingProviderProps {
  settings: SiteData;
  children: ReactNode;
}

export function SiteSettingsProvider({
  settings,
  children,
}: SiteSettingProviderProps) {
  return <Ctx.Provider value={settings}>{children}</Ctx.Provider>;
}

export function useSiteSettings() {
  return useContext(Ctx);
}
