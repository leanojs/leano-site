"use client";

import { useMemo } from "react";
import { AlertTriangle, CheckCircle2, TrendingDown } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { ConversionResult } from "@/types/fileTypes";

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

function savings(original: number, converted: number): number | null {
  if (original <= 0) return null;
  return ((original - converted) / original) * 100;
}

function SavingsCell({
  pct,
  failed,
  error,
}: {
  pct: number | null;
  failed: boolean;
  error?: string;
}) {
  if (failed) {
    return (
      <Badge
        variant="destructive"
        className="gap-1 font-mono text-[10px]"
        title={error}
      >
        <AlertTriangle className="w-3 h-3" />
        Failed
      </Badge>
    );
  }

  if (pct === null) return <span className="text-muted-foreground">—</span>;

  const isHighSavings = pct >= 50;
  const isNegative = pct < 0;

  return (
    <span
      className={cn(
        "tabular-nums font-medium",
        isHighSavings && "text-emerald-500 dark:text-emerald-400",
        isNegative && "text-amber-500 dark:text-amber-400",
        !isHighSavings && !isNegative && "text-foreground",
      )}
    >
      {isNegative ? "+" : ""}
      {Math.abs(pct).toFixed(1)}%
      {isNegative ? " larger" : ""}
    </span>
  );
}

interface FileResultsTableProps {
  results: ConversionResult[];
}

export function FileResultsTable({ results }: FileResultsTableProps) {
  const rows = useMemo(
    () =>
      results.map((r) => ({
        ...r,
        displayName: r.success && r.convertedPath ? r.convertedPath : r.originalPath,
        savingsPct: r.success ? savings(r.originalSize, r.convertedSize) : null,
      })),
    [results],
  );

  const successCount = rows.filter((r) => r.success).length;
  const failCount = rows.length - successCount;

  return (
    <div className="flex flex-col gap-2 bg-card/95 shadow-xl backdrop-blur-md p-3 sm:p-4 border border-border/70 rounded-4xl min-w-0 w-full lg:max-w-2xl xl:max-w-3xl">
      {/* Header */}
      <div className="flex justify-between items-center gap-3 px-1">
        <div className="flex items-center gap-2">
          <span className="inline-flex justify-center items-center bg-primary/15 rounded-full w-7 h-7 shrink-0">
            <TrendingDown className="w-4 h-4 text-primary" />
          </span>
          <div>
            <p className="font-semibold text-sm leading-tight">Per-file results</p>
            <p className="text-[11px] text-muted-foreground leading-tight">
              {successCount} converted
              {failCount > 0 && (
                <span className="text-destructive"> · {failCount} failed</span>
              )}
            </p>
          </div>
        </div>
      </div>

      {/* Scrollable table */}
      <div className="border border-border/60 rounded-2xl overflow-hidden">
        <div className="overflow-y-auto max-h-[360px]">
          <Table className="text-xs">
            <TableHeader className="sticky top-0 z-10 bg-muted/80 backdrop-blur-sm">
              <TableRow className="border-b border-border/60">
                <TableHead className="pl-3 py-2 text-[11px] font-semibold text-muted-foreground w-full">
                  Filename
                </TableHead>
                <TableHead className="py-2 text-right text-[11px] font-semibold text-muted-foreground">
                  Original
                </TableHead>
                <TableHead className="py-2 text-right text-[11px] font-semibold text-muted-foreground">
                  New Size
                </TableHead>
                <TableHead className="pr-3 py-2 text-right text-[11px] font-semibold text-muted-foreground">
                  Savings
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((row, i) => {
                const isHighSavings = row.savingsPct !== null && row.savingsPct >= 50;
                return (
                  <TableRow
                    key={i}
                    className={cn(
                      "border-b border-border/40 last:border-0",
                      isHighSavings && "bg-emerald-500/5 hover:bg-emerald-500/10",
                      !row.success && "bg-destructive/5 hover:bg-destructive/10",
                    )}
                  >
                    {/* Filename */}
                    <TableCell className="pl-3 py-2 font-mono max-w-[200px]">
                      <span
                        className="block truncate text-foreground/80"
                        title={row.displayName}
                      >
                        {row.displayName}
                      </span>
                    </TableCell>

                    {/* Original size */}
                    <TableCell className="py-2 text-right tabular-nums text-muted-foreground">
                      {formatBytes(row.originalSize)}
                    </TableCell>

                    {/* Converted size */}
                    <TableCell className="py-2 text-right tabular-nums">
                      {row.success ? (
                        formatBytes(row.convertedSize)
                      ) : (
                        <span className="text-muted-foreground">—</span>
                      )}
                    </TableCell>

                    {/* Savings */}
                    <TableCell className="pr-3 py-2 text-right">
                      {row.success ? (
                        <SavingsCell pct={row.savingsPct} failed={false} />
                      ) : (
                        <SavingsCell pct={null} failed error={row.error} />
                      )}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-x-4 gap-y-1 px-1">
        <span className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
          <span className="inline-block bg-emerald-500/20 rounded w-2.5 h-2.5" />
          &gt;50% savings
        </span>
        {failCount > 0 && (
          <span className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
            <span className="inline-block bg-destructive/20 rounded w-2.5 h-2.5" />
            Conversion failed
          </span>
        )}
        <span className="flex items-center gap-1.5 text-[10px] text-muted-foreground ml-auto">
          <CheckCircle2 className="w-3 h-3 text-emerald-500" />
          {successCount} / {rows.length} succeeded
        </span>
      </div>
    </div>
  );
}
