import { AlertTriangle, Loader2, RefreshCw } from "lucide-react";
import type { ResultDiff } from "@/lib/validation";

type ValidationFeedbackProps = {
  passed: boolean;
  matchedSolutionIndex?: number;
  result?: { columns: string[]; rows: Record<string, unknown>[] };
  diff?: ResultDiff;
  verificationLabel?: string;
  status?: string;
  jobId?: string;
  error?: string;
  onRetry?: () => void;
};

function getSolutionLabel(solutionIndex?: number) {
  if (!solutionIndex || solutionIndex <= 1) return "Teacher solution";
  return `Alternative solution ${solutionIndex - 1}`;
}

function formatSchemaValue(value: unknown) {
  if (value === null || value === undefined || value === "") return "empty";
  return String(value);
}

function describeSchemaField(key: string, expected: unknown, actual: unknown) {
  if (key === "isNullable") {
    return expected === "NO"
      ? "should be NOT NULL"
      : "should allow NULL values";
  }

  if (key === "extra") {
    if (String(expected).includes("auto_increment")) {
      return "should use AUTO_INCREMENT";
    }
    if (String(actual).includes("auto_increment")) {
      return "should not use AUTO_INCREMENT";
    }
  }

  if (key === "dataType" || key === "columnType") {
    return `should be ${formatSchemaValue(expected)}, but got ${formatSchemaValue(actual)}`;
  }

  if (key === "columnDefault") {
    return `should have default ${formatSchemaValue(expected)}, but got ${formatSchemaValue(actual)}`;
  }

  return `should have ${key} ${formatSchemaValue(expected)}, but got ${formatSchemaValue(actual)}`;
}

function formatSchemaDiffMessage(
  verificationLabel: string | undefined,
  diff?: ResultDiff["dataDiff"],
) {
  const expected = diff?.missingRows[0];
  const actual = diff?.extraRows[0];

  if (!expected || !actual) return null;

  if (verificationLabel?.includes("columns must match")) {
    return `Expected columns: ${formatSchemaValue(expected.columnNames)}. Got: ${formatSchemaValue(actual.columnNames)}.`;
  }

  if (!verificationLabel?.startsWith("Column '")) return null;

  const columnName = formatSchemaValue(
    expected.columnName ?? actual.columnName ?? "This column",
  );
  const differences = Object.keys(expected)
    .filter((key) => key !== "columnName")
    .filter(
      (key) =>
        formatSchemaValue(expected[key]) !== formatSchemaValue(actual[key]),
    )
    .filter((key, _index, keys) => {
      if (key !== "columnType") return true;
      return !keys.includes("dataType");
    })
    .map((key) => describeSchemaField(key, expected[key], actual[key]));

  if (differences.length === 0) return null;

  return `Column '${columnName}' ${differences.join(" and ")}.`;
}

function shouldShowSchemaExpectedGot(verificationLabel?: string) {
  return (
    verificationLabel?.includes("columns must match") ||
    verificationLabel?.startsWith("Column '")
  );
}

export function ValidationFeedback({
  passed,
  matchedSolutionIndex,
  result,
  diff,
  verificationLabel,
  status,
  jobId,
  error,
  onRetry,
}: ValidationFeedbackProps) {
  const schemaDiffMessage = shouldShowSchemaExpectedGot(verificationLabel)
    ? formatSchemaDiffMessage(verificationLabel, diff?.dataDiff)
    : null;

  if (passed) {
    const solutionLabel = getSolutionLabel(matchedSolutionIndex);

    return (
      <div className="rounded-md border border-success/50 bg-success/10 p-4">
        <h3 className="font-semibold text-success">Correct!</h3>
        <p className="mt-1 text-sm font-medium text-foreground">
          Matched: {solutionLabel}
        </p>
        {result && (
          <p className="mt-1 text-sm text-muted-foreground">
            Your query returned {result.rows.length} row
            {result.rows.length !== 1 ? "s" : ""} matching the expected output.
          </p>
        )}
      </div>
    );
  }

  if (status === "pending" || status === "running") {
    return (
      <div className="rounded-md border border-yellow-500/50 bg-yellow-500/10 p-4">
        <div className="flex items-center gap-2">
          <Loader2 className="h-4 w-4 animate-spin text-yellow-400" />
          <h3 className="font-semibold text-yellow-400">
            {status === "pending" ? "Queued" : "Validating..."}
          </h3>
        </div>
        <p className="mt-1 text-sm text-muted-foreground">
          {status === "pending"
            ? "Your DDL submission has been enqueued. A worker will validate it shortly."
            : "Running your DDL statements in an isolated environment..."}
        </p>
        {jobId && (
          <p className="mt-1 text-xs text-muted-foreground font-mono">
            Job: {jobId.slice(0, 8)}...
          </p>
        )}
      </div>
    );
  }

  if (status === "failed" || status === "timeout") {
    return (
      <div className="rounded-md border border-destructive/50 bg-destructive/10 p-4">
        <div className="mb-2 flex items-start gap-2">
          <AlertTriangle className="mt-0.5 h-4 w-4 text-destructive shrink-0" />
          <h3 className="font-semibold text-destructive">
            {status === "timeout"
              ? "Validation timed out"
              : "Validation failed"}
          </h3>
        </div>
        {error && <p className="mb-3 text-sm text-muted-foreground">{error}</p>}
        {onRetry && (
          <button
            type="button"
            onClick={onRetry}
            className="inline-flex items-center gap-1.5 rounded-md border border-border px-3 py-1.5 text-sm text-foreground hover:bg-sidebar transition-colors"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            Retry
          </button>
        )}
      </div>
    );
  }

  if (!diff) {
    return (
      <div className="rounded-md border border-destructive/50 bg-destructive/10 p-4">
        <h3 className="font-semibold text-destructive">Incorrect</h3>
      </div>
    );
  }

  return (
    <div className="rounded-md border border-destructive/50 bg-destructive/10 p-4">
      <h3 className="mb-2 font-semibold text-destructive">Incorrect</h3>

      {verificationLabel && (
        <p className="mb-3 text-sm font-medium">{verificationLabel}</p>
      )}

      {schemaDiffMessage && (
        <p className="mb-3 text-sm text-muted-foreground">
          {schemaDiffMessage}
        </p>
      )}

      {!verificationLabel && diff.sqlError && (
        <div className="mb-3 rounded bg-card p-3 font-mono text-sm text-red-400 whitespace-pre-wrap">
          {diff.sqlError}
        </div>
      )}

      {!verificationLabel && diff.columnDiff && (
        <div className="mb-3">
          <p className="mb-1 text-sm font-medium">Column mismatch</p>
          <div className="flex gap-4 text-xs">
            <span className="text-muted-foreground">
              Expected:{" "}
              <span className="text-foreground">
                {diff.columnDiff.expected.join(", ")}
              </span>
            </span>
            <span className="text-muted-foreground">
              Got:{" "}
              <span className="text-foreground">
                {diff.columnDiff.actual.join(", ")}
              </span>
            </span>
          </div>
          {diff.columnDiff.missing.length > 0 && (
            <p className="text-xs text-red-400">
              Missing: {diff.columnDiff.missing.join(", ")}
            </p>
          )}
          {diff.columnDiff.extra.length > 0 && (
            <p className="text-xs text-red-400">
              Extra: {diff.columnDiff.extra.join(", ")}
            </p>
          )}
        </div>
      )}

      {!verificationLabel && diff.rowCountDiff && (
        <p className="mb-3 text-sm">
          Row count mismatch: expected {diff.rowCountDiff.expected}, got{" "}
          {diff.rowCountDiff.actual}
        </p>
      )}

      {!verificationLabel && diff.dataDiff && (
        <div>
          {diff.dataDiff.missingRows.length > 0 && (
            <div className="mb-2">
              <p className="text-sm text-red-400">
                {diff.dataDiff.missingRows.length} expected row
                {diff.dataDiff.missingRows.length !== 1 ? "s" : ""} missing
              </p>
              {diff.dataDiff.missingRows.slice(0, 5).map((row, index) => (
                <pre
                  key={`missing-${index}`}
                  className="mt-1 rounded bg-card px-2 py-1 font-mono text-xs text-muted-foreground"
                >
                  {JSON.stringify(row, null, 2)}
                </pre>
              ))}
            </div>
          )}
          {diff.dataDiff.extraRows.length > 0 && (
            <div>
              <p className="text-sm text-red-400">
                {diff.dataDiff.extraRows.length} unexpected row
                {diff.dataDiff.extraRows.length !== 1 ? "s" : ""} returned
              </p>
              {diff.dataDiff.extraRows.slice(0, 5).map((row, index) => (
                <pre
                  key={`extra-${index}`}
                  className="mt-1 rounded bg-card px-2 py-1 font-mono text-xs text-muted-foreground"
                >
                  {JSON.stringify(row, null, 2)}
                </pre>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
