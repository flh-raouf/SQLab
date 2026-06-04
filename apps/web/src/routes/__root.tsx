import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createRootRoute, Outlet } from "@tanstack/react-router";
import { httpBatchLink } from "@trpc/client";
import { useEffect, useState } from "react";
import { TourOverlay } from "@/components/tour-overlay";
import { ProgressProvider } from "@/hooks/use-progress";
import { shouldAutoStartTour, TourProvider, useTour } from "@/hooks/use-tour";
import { trpc } from "@/lib/trpc";

function RootInner() {
  const { start } = useTour();

  useEffect(() => {
    if (shouldAutoStartTour()) {
      const timer = setTimeout(start, 1200);
      return () => clearTimeout(timer);
    }
  }, [start]);

  return (
    <>
      <Outlet />
      <TourOverlay />
    </>
  );
}

export function RootComponent() {
  const [queryClient] = useState(() => new QueryClient());
  const [trpcClient] = useState(() =>
    trpc.createClient({
      links: [httpBatchLink({ url: "http://localhost:3001" })],
    }),
  );

  return (
    <ProgressProvider>
      <TourProvider>
        <trpc.Provider client={trpcClient} queryClient={queryClient}>
          <QueryClientProvider client={queryClient}>
            <RootInner />
          </QueryClientProvider>
        </trpc.Provider>
      </TourProvider>
    </ProgressProvider>
  );
}

export const rootRoute = createRootRoute({
  component: RootComponent,
});
