import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createRootRoute, Outlet } from "@tanstack/react-router";
import { httpBatchLink } from "@trpc/client";
import { useState } from "react";
import { RouteError } from "@/components/route-error";
import { TourOverlay } from "@/components/tour-overlay";
import { ExerciseStateProvider } from "@/hooks/use-exercise-state";
import { useMountEffect } from "@/hooks/use-mount-effect";
import { ProgressProvider } from "@/hooks/use-progress";
import { ThemeProvider } from "@/hooks/use-theme";
import { shouldAutoStartTour, TourProvider, useTour } from "@/hooks/use-tour";
import { trpc } from "@/lib/trpc";

const apiUrl = import.meta.env.VITE_API_URL ?? "/trpc";

function RootInner() {
  const { start } = useTour();

  useMountEffect(() => {
    if (shouldAutoStartTour()) {
      const timer = setTimeout(start, 1200);
      return () => clearTimeout(timer);
    }
  });

  return (
    <>
      <Outlet />
      <TourOverlay />
    </>
  );
}

export function RootComponent() {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 5 * 60 * 1000,
            refetchOnWindowFocus: false,
          },
        },
      }),
  );
  const [trpcClient] = useState(() =>
    trpc.createClient({
      links: [httpBatchLink({ url: apiUrl })],
    }),
  );

  return (
    <ThemeProvider>
      <ExerciseStateProvider>
        <ProgressProvider>
          <TourProvider>
            <trpc.Provider client={trpcClient} queryClient={queryClient}>
              <QueryClientProvider client={queryClient}>
                <RootInner />
              </QueryClientProvider>
            </trpc.Provider>
          </TourProvider>
        </ProgressProvider>
      </ExerciseStateProvider>
    </ThemeProvider>
  );
}

export const rootRoute = createRootRoute({
  component: RootComponent,
  errorComponent: RouteError,
});
