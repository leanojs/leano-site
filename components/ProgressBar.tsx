"use client";

import { Progress } from "@/components/ui/progress";
import type { ConversionProgress } from "@/types/fileTypes";

interface ProgressBarProps {
  progress: ConversionProgress;
}

const statusMessages: Record<ConversionProgress["status"], string> = {
  idle: "Ready to convert",
  uploading: "Uploading files...",
  converting: "Converting images...",
  zipping: "Creating ZIP file...",
  complete: "Ready to download!",
  error: "An error occurred",
};

export function ProgressBar({ progress }: ProgressBarProps) {
  const percentage =
    progress.total > 0
      ? Math.round((progress.completed / progress.total) * 100)
      : 0;

  return (
    <div className="space-y-3 w-full">
      <div className="flex justify-between items-center text-sm">
        <span className="text-muted-foreground">
          {statusMessages[progress.status]}
        </span>
        {progress.status !== "idle" && progress.status !== "error" && (
          <span className="font-medium tabular-nums">
            {progress.completed} / {progress.total}
          </span>
        )}
      </div>

      <Progress
        value={progress.status === "complete" ? 100 : percentage}
        className="h-2"
      />

      {progress.currentFile && progress.status === "converting" && (
        <p className="text-muted-foreground text-xs truncate">
          Processing: {progress.currentFile}
        </p>
      )}

      {progress.error && (
        <p className="text-destructive text-sm">{progress.error}</p>
      )}
    </div>
  );
}
