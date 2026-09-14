"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import { useState, type ReactNode } from "react";
import { AppShell } from "@/components/chrome/AppShell";

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
        <AppShell>{children}</AppShell>
      </QueryClientProvider>
    </NuqsAdapter>
  );
}
