import { sql } from "@codemirror/lang-sql";
import CodeMirror, { type ReactCodeMirrorRef } from "@uiw/react-codemirror";
import { forwardRef, useCallback } from "react";
import { modKey } from "@/lib/platform";

type SqlEditorProps = {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  onRun: () => void;
  isSubmitting: boolean;
  isRunning: boolean;
  "data-tour"?: string;
};

export const SqlEditor = forwardRef<ReactCodeMirrorRef, SqlEditorProps>(
  function SqlEditor(
    {
      value,
      onChange,
      onSubmit,
      onRun,
      isSubmitting,
      isRunning,
      "data-tour": dataTour,
    },
    ref,
  ) {
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
      <div
        className="flex flex-col"
        onKeyDown={handleKeyDown}
        role="application"
        data-tour={dataTour}
      >
        <div className="rounded-md border border-border overflow-hidden">
          <CodeMirror
            ref={ref}
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
            {modKey()}+Enter to submit, {modKey()}+Shift+Enter to run
          </span>
        </div>
      </div>
    );
  },
);
