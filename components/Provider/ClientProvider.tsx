"use client";

import { useSyncExternalStore } from "react";

// Subscribe function kosong karena tidak ada perubahan
const subscribe = () => () => {};

export const ClientProvider = ({ children }: { children: React.ReactNode }) => {
  const isClient = useSyncExternalStore(
    subscribe,
    () => true, // Nilai di client
    () => false // Nilai di server (SSR)
  );

  if (!isClient) {
    return null;
  }

  return <>{children}</>;
};
