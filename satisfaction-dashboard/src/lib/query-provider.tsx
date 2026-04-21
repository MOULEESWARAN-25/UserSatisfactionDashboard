"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState, ReactNode } from "react";

export function QueryProvider({ children }: { children: ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 0,                   // 0 -> always fetch when mounting and window focuses
            gcTime: 30 * 60 * 1000,         // keep in memory for 30mins
            retry: 1,
            refetchOnWindowFocus: true,     // refresh when returning to tab
            refetchOnMount: true,           // refresh when navigating between pages
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}
