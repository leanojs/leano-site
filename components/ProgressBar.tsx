"use client";

import { Progress } from "@/components/ui/progress";
import type { ConversionProgress } from "@/types/fileTypes";

interface ProgressBarProps {
  progress: ConversionProgress;
}

function statusLabel(progress: ConversionProgress): string {
  switch (progress.status) {
    case "idle":     return "Ready to convert";
    case "converting": return "Converting images...";
    case "zipping":  return "Creating ZIP file...";
    case "complete": return "Ready to download!";
    case "error":    return "An error occurred";
    case "uploading":
      if (progress.totalBatches && progress.totalBatches > 1) {
        return `Uploading batch ${progress.currentBatch} of ${progress.totalBatches}...`;
      }
      return "Uploading files...";
  }
}

export function ProgressBar({ progress }: ProgressBarProps) {
  const percentage =
    progress.total > 0
      ? Math.round((progress.completed / progress.total) * 100)
      : 0;

  return (
    <div className="space-y-3 w-full">
      <div className="flex justify-between items-center text-sm">
        <span className="text-muted-foreground">
          {statusLabel(progress)}
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
