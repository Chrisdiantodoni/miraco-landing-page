"use client";

import { useEffect, ReactNode } from "react";
import { useSiteStore } from "@/lib/store/siteStore";
import { SiteData } from "@/lib/types/settings";

interface SiteProviderProps {
  children: ReactNode;
  initialData: SiteData;
}

export function SiteProvider({ children, initialData }: SiteProviderProps) {
  const setData = useSiteStore((state) => state.setData);
  console.log(initialData);
  useEffect(() => {
    setData(initialData);
  }, [initialData, setData]);

  return <>{children}</>;
}
