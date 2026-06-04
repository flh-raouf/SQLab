import { Link } from "@tanstack/react-router";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";
import { ExercisePanel } from "@/components/exercise-panel";
import { ResultsTable } from "@/components/results-table";
import { SqlEditor } from "@/components/sql-editor";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ValidationFeedback } from "@/components/validation-feedback";
import { useProgress } from "@/hooks/use-progress";
import { trpc } from "@/lib/trpc";
import type { ResultDiff } from "@/lib/validation";

type QueryResultData = {
  columns: string[];
  rows: Record<string, unknown>[];
  affectedRows?: number;
};

export function ExerciseWorkspace({ exerciseId }: { exerciseId: string }) {
  const { data: exercise, isLoading } = trpc.exercises.get.useQuery(exerciseId);
  const { completed, markComplete } = useProgress();

  const [sql, setSql] = useState("");
  const [runResult, setRunResult] = useState<QueryResultData | null>(null);
  const [runError, setRunError] = useState<string | null>(null);
  const [validationResult, setValidationResult] = useState<{
    passed: boolean;
    diff?: ResultDiff;
    result?: QueryResultData;
  } | null>(null);

  const runMutation = trpc.query.execute.useMutation({
    onSuccess: (data) => {
      setRunResult(data as QueryResultData);
      setRunError(null);
    },
    onError: (error) => {
      setRunError(error.message);
      setRunResult(null);
    },
  });

  const submitMutation = trpc.validation.submit.useMutation({
    onSuccess: (data) => {
      setValidationResult(data);
      if (data.passed) {
        markComplete(exerciseId);
      }
    },
    onError: (error) => {
      setValidationResult({ passed: false, diff: { sqlError: error.message } });
    },
  });

  if (isLoading || !exercise) {
    return (
      <div className="flex h-full items-center justify-center">
        <p className="text-muted-foreground">Loading exercise...</p>
      </div>
    );
  }

  const isSubmitted =
    validationResult?.passed ?? completed.includes(exerciseId);

  const handleSubmit = () => {
    setValidationResult(null);
    submitMutation.mutate({ exerciseId, userSql: sql });
  };

  const handleRun = () => {
    setValidationResult(null);
    setRunError(null);
    runMutation.mutate({
      sql,
      allowAlter: (exercise as { allowAlter?: boolean }).allowAlter ?? false,
    });
  };

  return (
    <div className="flex h-full flex-col">
      <ExercisePanel
        title={exercise.title}
        description={exercise.description}
        hints={exercise.hints}
        solutionQueries={exercise.solutionQueries}
      />

      <Separator />

      <div className="flex-1 overflow-auto p-4 space-y-4">
        <SqlEditor
          value={sql}
          onChange={setSql}
          onSubmit={handleSubmit}
          onRun={handleRun}
          isSubmitting={submitMutation.isPending}
          isRunning={runMutation.isPending}
        />

        {runError && (
          <div className="rounded-md border border-destructive/50 bg-destructive/10 p-4 font-mono text-sm text-red-400 whitespace-pre-wrap">
            {runError}
          </div>
        )}

        {runResult && (
          <div>
            <p className="mb-2 text-xs font-medium text-muted-foreground">
              Run output
            </p>
            <ResultsTable {...runResult} />
          </div>
        )}

        {validationResult && (
          <div>
            <p className="mb-2 text-xs font-medium text-muted-foreground">
              Submission result
            </p>
            <ValidationFeedback {...validationResult} />
          </div>
        )}
      </div>

      <Separator />

      <div className="flex items-center justify-between px-4 py-3">
        <Button
          variant="ghost"
          size="sm"
          asChild
          disabled={!exercise.previousExerciseId}
        >
          <Link
            to="/exercise/$exerciseId"
            params={{ exerciseId: exercise.previousExerciseId ?? exerciseId }}
            className="gap-1 no-underline"
          >
            <ChevronLeft className="h-4 w-4" />
            Previous
          </Link>
        </Button>

        <span className="text-xs text-muted-foreground">
          {exercise.id} {isSubmitted ? "- Completed" : ""}
        </span>

        <Button
          variant="ghost"
          size="sm"
          asChild
          disabled={!exercise.nextExerciseId}
        >
          <Link
            to="/exercise/$exerciseId"
            params={{ exerciseId: exercise.nextExerciseId ?? exerciseId }}
            className="gap-1 no-underline"
          >
            Next
            <ChevronRight className="h-4 w-4" />
          </Link>
        </Button>
      </div>
    </div>
  );
}
