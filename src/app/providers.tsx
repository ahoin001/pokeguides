"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import { useState, type ReactNode } from "react";
import { AppShell } from "@/components/chrome/AppShell";
import { ThemeProvider } from "@/components/chrome/ThemeProvider";

export function Providers({ children }: { children: ReactNode }) {
  const [client] = useState(
    () =>
      new QueryClient({
        defaultOptions: { queries: { staleTime: 1000 * 60 * 60 * 24, gcTime: Infinity } },
      }),
  );
  return (
    <NuqsAdapter>
      <QueryClientProvider client={client}>
        <ThemeProvider>
          <AppShell>{children}</AppShell>
        </ThemeProvider>
      </QueryClientProvider>
    </NuqsAdapter>
  );
}
