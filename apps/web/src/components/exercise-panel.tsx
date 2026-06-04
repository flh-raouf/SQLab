import { useState } from "react";
import { Button } from "@/components/ui/button";

type ExercisePanelProps = {
  title: string;
  description: string;
  hints: string[];
  solutionQueries: string[];
};

export function ExercisePanel({
  title,
  description,
  hints,
  solutionQueries,
}: ExercisePanelProps) {
  const [visibleHints, setVisibleHints] = useState(0);
  const [showSolution, setShowSolution] = useState(false);
  const [confirmSolution, setConfirmSolution] = useState(false);

  return (
    <div className="p-4">
      <h1 className="mb-2 text-xl font-semibold">{title}</h1>
      <p className="mb-4 text-sm text-muted-foreground whitespace-pre-wrap">
        {description}
      </p>

      {hints.length > 0 && (
        <div className="mb-4">
          {hints.slice(0, visibleHints).map((hint, index) => (
            <div
              key={index}
              className="mb-2 rounded-md border border-border bg-card p-3 text-sm text-muted-foreground"
            >
              <span className="mr-1 font-medium text-accent">
                Hint {index + 1}:
              </span>
              {hint}
            </div>
          ))}
          {visibleHints < hints.length && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setVisibleHints((h) => h + 1)}
            >
              Show hint {visibleHints + 1}
            </Button>
          )}
        </div>
      )}

      <div className="mb-4">
        {!showSolution ? (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setConfirmSolution(true)}
            className="text-muted-foreground"
          >
            Show solution
          </Button>
        ) : (
          <div>
            <p className="mb-2 text-xs font-medium text-muted-foreground">
              Solution:
            </p>
            {solutionQueries.map((solution, index) => (
              <pre
                key={index}
                className="mb-2 rounded-md border border-border bg-card p-3 font-mono text-sm text-foreground whitespace-pre-wrap overflow-auto"
              >
                {solution}
              </pre>
            ))}
          </div>
        )}

        {confirmSolution && (
          <div>
            <div className="fixed inset-0 z-50 bg-black/60" />
            <div className="fixed left-[50%] top-[50%] z-50 w-full max-w-lg translate-x-[-50%] translate-y-[-50%] rounded-lg border border-border bg-card p-6 shadow-lg">
              <h2 className="mb-2 text-lg font-semibold">Reveal solution?</h2>
              <p className="mb-4 text-sm text-muted-foreground">
                Are you sure? Try the hints first before looking at the answer.
              </p>
              <div className="flex justify-end gap-3">
                <Button
                  variant="default"
                  onClick={() => setConfirmSolution(false)}
                >
                  Cancel
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => {
                    setShowSolution(true);
                    setConfirmSolution(false);
                  }}
                >
                  Reveal
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
