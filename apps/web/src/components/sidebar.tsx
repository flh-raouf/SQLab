import { Link } from "@tanstack/react-router";
import { CheckCircle2, Database, FlaskConical, RotateCcw } from "lucide-react";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogOverlay,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { trpc } from "@/lib/trpc";
import { cn } from "@/lib/utils";

type SidebarProps = {
  completed: string[];
  hintedExerciseIds: string[];
  revealedExerciseIds: string[];
  activeExerciseId?: string;
  onReset: () => void;
};

export function Sidebar({
  completed,
  hintedExerciseIds,
  revealedExerciseIds,
  activeExerciseId,
  onReset,
}: SidebarProps) {
  const { data: groups, isLoading } = trpc.exercises.byPart.useQuery();
  const [showReset, setShowReset] = useState(false);

  return (
    <aside className="flex h-full w-72 shrink-0 flex-col border-r border-sidebar-border bg-sidebar">
      <div className="flex items-center justify-between px-4 py-3">
        <Link
          to="/"
          className="flex items-center gap-2 font-mono font-semibold text-foreground no-underline"
        >
          <Database className="h-5 w-5 text-accent" />
          BDD Revision
        </Link>
      </div>

      <Separator />

      <ScrollArea className="flex-1 px-2 py-2" data-tour="sidebar">
        {isLoading && (
          <p className="px-3 py-6 text-center text-sm text-muted-foreground">
            Loading exercises...
          </p>
        )}

        {groups?.map((group) => (
          <div key={group.part} className="mb-2">
            <Badge variant="accent" className="mb-1 ml-2 text-xs">
              {group.part}
            </Badge>
            <div className="space-y-0.5">
              {group.exercises.map((exercise) => {
                const isActive = exercise.id === activeExerciseId;
                const isCompleted = completed.includes(exercise.id);
                const isRevealed = revealedExerciseIds.includes(exercise.id);
                const isHinted = hintedExerciseIds.includes(exercise.id);
                const checkColor = isRevealed
                  ? "text-destructive"
                  : isHinted
                    ? "text-yellow-400"
                    : isCompleted
                      ? "text-success"
                      : "text-muted-foreground";

                return (
                  <Link
                    key={exercise.id}
                    to="/exercise/$exerciseId"
                    params={{ exerciseId: exercise.id }}
                    className={cn(
                      "flex items-center gap-2 rounded-md px-3 py-1.5 text-sm transition-colors no-underline",
                      isActive
                        ? "bg-sidebar-active text-foreground"
                        : "text-muted-foreground hover:bg-sidebar-hover hover:text-foreground",
                    )}
                  >
                    <CheckCircle2
                      className={cn("h-4 w-4 shrink-0", checkColor)}
                    />
                    <span className="truncate">{exercise.title}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        ))}

        {!isLoading && groups?.length === 0 && (
          <p className="px-3 py-6 text-center text-sm text-muted-foreground">
            No exercises found.
          </p>
        )}
      </ScrollArea>

      <Separator />

      <div className="px-3 py-2">
        <div className="mb-1 flex items-center justify-between text-xs text-muted-foreground">
          <span>Progress</span>
          <span>
            {completed.length} /{" "}
            {groups?.reduce((sum, g) => sum + g.exercises.length, 0) ?? 0}
          </span>
        </div>
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-sidebar-active">
          <div
            className="h-full rounded-full bg-accent transition-all duration-300"
            style={{
              width: `${
                groups
                  ? (
                      completed.length /
                        Math.max(
                          groups.reduce(
                            (sum, g) => sum + g.exercises.length,
                            0,
                          ),
                          1,
                        )
                    ) * 100
                  : 0
              }%`,
            }}
          />
        </div>
      </div>

      <div className="px-2 py-2 space-y-1">
        <Link
          to="/sandbox"
          className="flex w-full items-center gap-2 rounded-md px-3 py-1.5 text-sm text-muted-foreground no-underline transition-colors hover:bg-sidebar-hover hover:text-foreground"
          data-tour="sandbox"
        >
          <FlaskConical className="h-4 w-4" />
          Sandbox
        </Link>
        <Button
          variant="ghost"
          size="sm"
          className="w-full justify-start gap-2"
          onClick={() => setShowReset(true)}
        >
          <RotateCcw className="h-4 w-4" />
          Reset progress
        </Button>
      </div>

      {showReset && (
        <div>
          <DialogOverlay />
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Reset progress?</DialogTitle>
              <DialogDescription>
                This will clear all completed exercise marks. You can redo any
                exercise at any time.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="default" onClick={() => setShowReset(false)}>
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={() => {
                  onReset();
                  setShowReset(false);
                }}
              >
                Reset
              </Button>
            </DialogFooter>
          </DialogContent>
        </div>
      )}
    </aside>
  );
}
