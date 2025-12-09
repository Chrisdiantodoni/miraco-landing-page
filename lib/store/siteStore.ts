"use client";

import { create } from "zustand";
import { SiteData } from "@/lib/types/settings";

interface SiteStore {
  data: SiteData | null;
  isLoading: boolean;
  error: string | null;
  setData: (data: SiteData) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  fetchData: () => Promise<void>;
}

export const useSiteStore = create<SiteStore>((set) => ({
  data: null,
  isLoading: false,
  error: null,

  setData: (data) => set({ data }),
  setLoading: (loading) => set({ isLoading: loading }),
  setError: (error) => set({ error }),

  fetchData: async () => {
    set({ isLoading: true });
    try {
      const res = await fetch("/api/site-settings");
      if (!res.ok) throw new Error("Failed to fetch");
      const data = await res.json();
      set({ data, error: null });
    } catch (err) {
      set({ error: (err as Error).message });
    } finally {
      set({ isLoading: false });
    }
  },
}));
