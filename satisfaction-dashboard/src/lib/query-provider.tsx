"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState, ReactNode } from "react";

export function QueryProvider({ children }: { children: ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 5 * 60 * 1000,      // 5 minutes — data treated as fresh
            gcTime: 30 * 60 * 1000,          // 30 minutes — kept in memory
            retry: 1,
            refetchOnWindowFocus: false,      // don't refetch just because user switches tabs
            refetchOnMount: false,            // don't refetch if data is still fresh
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}
