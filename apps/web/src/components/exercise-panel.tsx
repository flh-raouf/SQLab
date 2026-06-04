import { Eye, Lightbulb } from "lucide-react";
import { useState } from "react";
import { SchemaViewer } from "@/components/schema-viewer";
import { Button } from "@/components/ui/button";

type ExercisePanelProps = {
  title: string;
  description: string;
  hints: string[];
  solutionQueries: string[];
  onHintRevealed: () => void;
  onSolutionRevealed: () => void;
  onSchemaModalClose: () => void;
};

export function ExercisePanel({
  title,
  description,
  hints,
  solutionQueries,
  onHintRevealed,
  onSolutionRevealed,
  onSchemaModalClose,
}: ExercisePanelProps) {
  const [visibleHints, setVisibleHints] = useState(0);
  const [showSolution, setShowSolution] = useState(false);
  const [confirmSolution, setConfirmSolution] = useState(false);

  return (
    <div className="px-4 pt-4 pb-1">
      <h1 className="mb-3 font-mono text-xl font-semibold">{title}</h1>

      <div className="mb-4 flex items-center gap-2" data-tour="help-buttons">
        {hints.length > 0 && (
          <>
            <Button
              size="sm"
              onClick={() => {
                onHintRevealed();
                setVisibleHints((h) => h + 1);
              }}
              disabled={visibleHints >= hints.length}
              className="border-yellow-500/40 bg-yellow-500/10 text-yellow-400 hover:bg-yellow-500/20"
            >
              <Lightbulb className="mr-1 h-4 w-4" />
              Hint {visibleHints + 1} of {hints.length}
            </Button>

            {!showSolution && (
              <Button
                size="sm"
                onClick={() => setConfirmSolution(true)}
                className="border-red-500/40 bg-red-500/10 text-red-400 hover:bg-red-500/20"
              >
                <Eye className="mr-1 h-4 w-4" />
                Solution
              </Button>
            )}
          </>
        )}

        <div className="flex-1" />
        <SchemaViewer onClose={onSchemaModalClose} />
      </div>

      {visibleHints > 0 && (
        <div className="mb-4">
          {hints.slice(0, visibleHints).map((hint, index) => (
            <div
              key={hint}
              className="mb-2 rounded-md border border-yellow-500/30 bg-yellow-500/5 p-3 text-sm text-yellow-200"
            >
              <span className="mr-1 font-medium text-yellow-400">
                Hint {index + 1}:
              </span>
              {hint}
            </div>
          ))}
        </div>
      )}

      {showSolution && (
        <div className="mb-4">
          {solutionQueries.map((solution) => (
            <pre
              key={solution}
              className="mb-2 rounded-md border border-red-500/30 bg-red-500/5 p-3 font-mono text-sm text-red-200 whitespace-pre-wrap overflow-auto"
            >
              {solution}
            </pre>
          ))}
        </div>
      )}

      <div
        className="mb-4 overflow-hidden rounded-lg border border-accent/30 bg-accent/[0.06] shadow-sm"
        data-tour="question"
      >
        <div className="border-b border-accent/20 bg-accent/[0.08] px-4 py-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-accent">
            Question
          </span>
        </div>
        <div className="p-4">
          <p className="text-base leading-relaxed text-foreground whitespace-pre-wrap">
            {description}
          </p>
        </div>
      </div>

      {confirmSolution && (
        <div>
          <div className="fixed inset-0 z-50 bg-black/60" />
          <div className="fixed left-[50%] top-[50%] z-50 w-full max-w-lg translate-x-[-50%] translate-y-[-50%] rounded-lg border border-red-500/40 bg-card p-6 shadow-lg">
            <h2 className="mb-2 flex items-center gap-2 text-lg font-semibold text-red-400">
              <Eye className="h-5 w-5" />
              Reveal solution?
            </h2>
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
                  onSolutionRevealed();
                  setShowSolution(true);
                  setConfirmSolution(false);
                }}
              >
                Reveal solution
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
