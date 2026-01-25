"use client";

import { usePathname } from "next/navigation";
import { Header } from "@/components/layout/Header";
import { LegalGuard } from "@/components/legal/LegalGuard";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // Dashboard hat seinen eigenen Header in DashboardLayout
  const isDashboard = pathname?.startsWith("/dashboard");

  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      {!isDashboard && <Header variant="app" />}
      <main className="flex-1">
        <LegalGuard>{children}</LegalGuard>
      </main>
    </div>
  );
}
