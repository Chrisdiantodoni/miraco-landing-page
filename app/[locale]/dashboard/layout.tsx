"use client";

import { AuthGuard } from "@/lib/providers/AuthProvider";
import DashboardShell from "@/components/Dashboard/Shell";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthGuard>
      <DashboardShell>{children}</DashboardShell>
    </AuthGuard>
  );
}
