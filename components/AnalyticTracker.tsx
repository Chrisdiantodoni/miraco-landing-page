"use client";

import { storeAnalytic } from "@/lib/api/queries/analytic";
import { usePathname } from "next/navigation";
import { useEffect } from "react";

export default function AnalyticsTracker() {
  const pathname = usePathname();

  useEffect(() => {
    storeAnalytic({ path: pathname });
  }, [pathname]);

  return null;
}
