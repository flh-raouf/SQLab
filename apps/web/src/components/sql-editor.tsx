import { sql } from "@codemirror/lang-sql";
import CodeMirror from "@uiw/react-codemirror";
import { useCallback } from "react";

type SqlEditorProps = {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  onRun: () => void;
  isSubmitting: boolean;
  isRunning: boolean;
};

export function SqlEditor({
  value,
  onChange,
  onSubmit,
  onRun,
  isSubmitting,
  isRunning,
}: SqlEditorProps) {
  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key === "Enter") {
        event.preventDefault();
        if (event.shiftKey) {
          onRun();
        } else {
          onSubmit();
        }
      }
    },
    [onRun, onSubmit],
  );

  return (
    <fieldset
      className="flex flex-col border-none p-0"
      onKeyDown={handleKeyDown}
    >
      <div className="rounded-md border border-border overflow-hidden">
        <CodeMirror
          value={value}
          onChange={onChange}
          extensions={[sql()]}
          theme="dark"
          height="240px"
          basicSetup={{
            lineNumbers: true,
            bracketMatching: true,
            closeBrackets: true,
            autocompletion: true,
          }}
        />
      </div>
      <div className="mt-3 flex items-center gap-2">
        <button
          type="button"
          onClick={onRun}
          disabled={isRunning || isSubmitting}
          className="inline-flex h-8 items-center rounded-md bg-card border border-border px-4 text-sm font-medium text-foreground hover:bg-sidebar-hover disabled:opacity-50"
        >
          {isRunning ? "Running..." : "Run"}
        </button>
        <button
          type="button"
          onClick={onSubmit}
          disabled={isRunning || isSubmitting}
          className="inline-flex h-8 items-center rounded-md bg-accent px-4 text-sm font-medium text-accent-foreground hover:opacity-90 disabled:opacity-50"
        >
          {isSubmitting ? "Checking..." : "Submit"}
        </button>
        <span className="ml-2 text-xs text-muted-foreground">
          Ctrl+Enter to submit, Ctrl+Shift+Enter to run
        </span>
      </div>
    </fieldset>
  );
}
