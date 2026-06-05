import { type ErrorComponentProps, Link } from "@tanstack/react-router";
import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";

function getErrorMessage(error: unknown) {
  if (error instanceof Error) {
    return error.message;
  }

  return "Something went wrong.";
}

type RouteErrorProps = ErrorComponentProps & {
  title?: string;
  description?: string;
  fullScreen?: boolean;
};

export function RouteError({
  error,
  title = "Application error",
  description = "The app hit an unexpected problem. You can reload or return home.",
  fullScreen = true,
}: RouteErrorProps) {
  return (
    <div
      className={
        fullScreen
          ? "flex min-h-screen items-center justify-center bg-background p-6"
          : "flex h-full min-h-96 items-center justify-center p-6"
      }
    >
      <div className="w-full max-w-lg rounded-lg border border-destructive/30 bg-card p-6 shadow-lg">
        <div className="mb-4 flex items-center gap-3">
          <div className="rounded-full border border-destructive/40 bg-destructive/10 p-2 text-destructive">
            <AlertTriangle className="h-5 w-5" />
          </div>
          <div>
            <h1 className="font-mono text-lg font-semibold text-foreground">
              {title}
            </h1>
            <p className="text-sm text-muted-foreground">{description}</p>
          </div>
        </div>

        <pre className="mb-4 max-h-40 overflow-auto whitespace-pre-wrap rounded-md border border-border bg-background/60 p-3 font-mono text-xs text-muted-foreground">
          {getErrorMessage(error)}
        </pre>

        <div className="flex flex-wrap gap-2">
          <Button type="button" onClick={() => window.location.reload()}>
            Reload
          </Button>
          <Button variant="ghost" asChild>
            <Link to="/">Go Home</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
