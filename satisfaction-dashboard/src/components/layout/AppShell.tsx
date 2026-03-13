"use client";

import { useState } from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";

interface AppShellProps {
  children: React.ReactNode;
  title?: string;
  description?: string;
}

export function AppShell({ children, title, description }: AppShellProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="relative flex h-screen overflow-hidden bg-muted/30">
      <Sidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen((prev) => !prev)} />
      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
        <Header title={title} description={description} />
        <main className="flex-1 overflow-y-auto">
          <div className="container mx-auto max-w-7xl p-6">{children}</div>
        </main>
      </div>
    </div>
  );
}
