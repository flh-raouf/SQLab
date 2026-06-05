import { Outlet, useRouterState } from "@tanstack/react-router";
import { Menu } from "lucide-react";
import { useState } from "react";
import { Sidebar } from "@/components/sidebar";
import { useProgress } from "@/hooks/use-progress";

export function AppShell() {
  const {
    completed,
    completedExerciseStatuses,
    hintedExerciseIds,
    revealedExerciseIds,
    reset: resetProgress,
  } = useProgress();

  const currentPath = useRouterState({ select: (s) => s.location.pathname });
  const exerciseMatch = currentPath.match(/\/exercise\/(.+)/);
  const activeExerciseId = exerciseMatch ? exerciseMatch[1] : undefined;

  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen w-full overflow-hidden">
      <button
        type="button"
        className="fixed top-3 right-3 z-30 lg:hidden flex h-9 w-9 items-center justify-center rounded-md border border-border bg-sidebar text-muted-foreground hover:text-foreground"
        onClick={() => setMobileSidebarOpen(true)}
        aria-label="Open sidebar"
      >
        <Menu className="h-5 w-5" />
      </button>

      <Sidebar
        completed={completed}
        completedExerciseStatuses={completedExerciseStatuses}
        hintedExerciseIds={hintedExerciseIds}
        revealedExerciseIds={revealedExerciseIds}
        activeExerciseId={activeExerciseId}
        onReset={resetProgress}
        isMobileOpen={mobileSidebarOpen}
        onMobileClose={() => setMobileSidebarOpen(false)}
      />
      <main className="flex-1 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
}
