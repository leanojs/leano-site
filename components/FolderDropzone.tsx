'use client';

import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, FolderOpen, X, Image } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import type { FileWithPath } from '@/types/fileTypes';

interface FolderDropzoneProps {
  files: FileWithPath[];
  onFilesChange: (files: FileWithPath[]) => void;
  disabled?: boolean;
  className?: string;
}

const MAX_TOTAL_BYTES = 50 * 1024 * 1024; // 50 MB

// OS/editor-generated junk that should never be uploaded
const IGNORED_SYSTEM_FILES = new Set([
  '.ds_store',
  'thumbs.db',
  'desktop.ini',
  '.gitkeep',
  '.gitignore',
]);

function isIgnoredSystemFile(filename: string): boolean {
  return IGNORED_SYSTEM_FILES.has(filename.toLowerCase());
}

export function FolderDropzone({ files, onFilesChange, disabled, className }: FolderDropzoneProps) {
  const onDrop = useCallback((acceptedFiles: File[]) => {
    const filtered: FileWithPath[] = acceptedFiles
      .filter(file => !isIgnoredSystemFile(file.name))
      .map(file => ({
        file,
        relativePath: (file as File & { path?: string }).path ||
                      (file as File & { webkitRelativePath?: string }).webkitRelativePath ||
                      file.name,
      }));

    const totalBytes = filtered.reduce((acc, f) => acc + f.file.size, 0);
    if (totalBytes > MAX_TOTAL_BYTES) {
      // Pass an empty array so the parent's error state can surface this,
      // but also keep any existing files so the UI doesn't go blank silently.
      // We call onFilesChange with the oversized set so the hook can catch it.
      onFilesChange(filtered);
      return;
    }

    onFilesChange(filtered);
  }, [onFilesChange]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    disabled,
    noClick: false,
    noKeyboard: false,
  });

  const clearFiles = () => {
    onFilesChange([]);
  };

  const totalSize = files.reduce((acc, f) => acc + f.file.size, 0);
  const isTooLarge = totalSize > MAX_TOTAL_BYTES;
  const formatSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // Group files by folder for display
  const folderCounts = files.reduce((acc, file) => {
    const folder = file.relativePath.substring(0, file.relativePath.lastIndexOf('/')) || 'root';
    acc[folder] = (acc[folder] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const hasFiles = files.length > 0;

  return (
    <div
      {...getRootProps()}
      className={cn(
        'relative flex flex-col rounded-lg border-2 border-dashed transition-colors cursor-pointer overflow-hidden',
        className,
        isDragActive
          ? 'border-primary bg-primary/5'
          : hasFiles && isTooLarge
            ? 'border-destructive bg-destructive/5'
            : hasFiles
              ? 'border-primary/40 bg-primary/5'
              : 'border-muted-foreground/25 hover:border-primary/50',
        disabled && 'opacity-50 cursor-not-allowed'
      )}
    >
      <input
        {...getInputProps()}
        aria-label="Upload folder"
        /* @ts-expect-error - webkitdirectory is not in standard types */
        webkitdirectory=""
        directory=""
      />

      {hasFiles ? (
        /* ── file summary — same fixed height as the empty state ── */
        <div className="flex flex-col h-full p-4">
          {/* header row */}
          <div className="flex items-center justify-between mb-2 shrink-0">
            <div className="flex items-center gap-1.5 min-w-0">
              <Image className={cn("h-4 w-4 shrink-0", isTooLarge ? "text-destructive" : "text-primary")} />
              <span className="font-medium text-sm truncate">
                {files.length} files
              </span>
              <span className={cn("text-xs shrink-0", isTooLarge ? "text-destructive font-semibold" : "text-muted-foreground")}>
                ({formatSize(totalSize)})
              </span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => { e.stopPropagation(); clearFiles(); }}
              disabled={disabled}
              className="h-7 w-7 p-0 shrink-0"
            >
              <X className="h-3.5 w-3.5" />
              <span className="sr-only">Clear files</span>
            </Button>
          </div>

          {isTooLarge && (
            <p className="text-[11px] text-destructive mb-1.5 shrink-0">
              Exceeds 50 MB limit — please drop a smaller folder.
            </p>
          )}

          {/* scrollable folder list — fixed height, never grows the card */}
          <div className="overflow-y-auto flex-1 space-y-0.5 min-h-0">
            {Object.entries(folderCounts).map(([folder, count]) => (
              <div key={folder} className="flex items-center gap-2 text-xs text-muted-foreground py-0.5">
                <FolderOpen className="h-3.5 w-3.5 shrink-0" />
                <span className="truncate flex-1">{folder}</span>
                <span className="tabular-nums shrink-0">{count}</span>
              </div>
            ))}
          </div>

          <p className="text-[10px] text-muted-foreground/60 mt-2 shrink-0">
            Drop a different folder to replace
          </p>
        </div>
      ) : (
        /* ── empty / drag state ── */
        <div className="flex flex-col items-center justify-center gap-4 text-center p-8">
          {isDragActive ? (
            <>
              <FolderOpen className="h-12 w-12 text-primary" />
              <p className="text-lg font-medium text-primary">Drop your folder here</p>
            </>
          ) : (
            <>
              <Upload className="h-12 w-12 text-muted-foreground" />
              <div>
                <p className="text-lg font-medium">Drag and drop a folder here</p>
                <p className="text-sm text-muted-foreground mt-1">or click to browse for a folder</p>
              </div>
              <p className="text-xs text-muted-foreground">Converts JPG, JPEG &amp; PNG → WebP/AVIF · SVG, ICO, WebP &amp; other files are preserved as-is</p>
            </>
          )}
        </div>
      )}
    </div>
  );
}
