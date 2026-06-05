import { AlertTriangle, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

function getMessage(error: unknown) {
  if (error instanceof Error) {
    return error.message;
  }

  return "Unable to load data.";
}

export function LoadingState({
  label,
  className,
}: {
  label: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex items-center justify-center gap-2 py-8 text-sm text-muted-foreground",
        className,
      )}
    >
      <Loader2 className="h-4 w-4 animate-spin" />
      {label}
    </div>
  );
}

export function ErrorState({
  title = "Unable to load data",
  error,
  className,
}: {
  title?: string;
  error: unknown;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "rounded-md border border-destructive/30 bg-destructive/10 p-3 text-sm",
        className,
      )}
    >
      <div className="mb-1 flex items-center gap-2 font-medium text-red-300">
        <AlertTriangle className="h-4 w-4" />
        {title}
      </div>
      <p className="font-mono text-xs text-red-200/80">{getMessage(error)}</p>
    </div>
  );
}
