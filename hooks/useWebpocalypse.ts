import { useCallback, useMemo, useState } from "react";
import type {
  ConversionProgress,
  ConversionResponse,
  ConversionResult,
  ConversionSettings,
  FileWithPath,
} from "@/types/fileTypes";

// Maximum bytes per server request — safely under Vercel's 4.5 MB limit
const BATCH_MAX_BYTES = 3.5 * 1024 * 1024;

const CONVERTIBLE_EXTS = new Set([".jpg", ".jpeg", ".png"]);

function isConvertibleFile(filename: string): boolean {
  const ext = filename.toLowerCase().slice(filename.lastIndexOf("."));
  return CONVERTIBLE_EXTS.has(ext);
}

const MAX_TOTAL_BYTES = 50 * 1024 * 1024; // 50 MB

interface UseWebpocalypseResult {
  files: FileWithPath[];
  settings: ConversionSettings;
  progress: ConversionProgress;
  stats: ConversionResponse["stats"] | null;
  fileResults: ConversionResult[] | null;
  downloadUrl: string | null;
  isProcessing: boolean;
  canConvert: boolean;
  statsDisplay: {
    totalFiles: string;
    totalOriginalSize: string;
    totalConvertedSize: string;
    savedPercentage: string;
  } | null;
  handleFilesChange: (newFiles: FileWithPath[]) => void;
  handleQualityChange: (value: number) => void;
  handleFormatChange: (format: ConversionSettings["outputFormat"]) => void;
  handleLosslessChange: (value: boolean) => void;
  handleResizeChange: (value: boolean) => void;
  handleMaxWidthChange: (value: number | undefined) => void;
  handleMaxHeightChange: (value: number | undefined) => void;
  handleConvert: () => Promise<void>;
  handleDownload: () => void;
  handleAgain: () => void;
}

function formatBytes(bytes: number): string {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
}

export function useWebpocalypse(): UseWebpocalypseResult {
  const [files, setFiles] = useState<FileWithPath[]>([]);
  const [settings, setSettings] = useState<ConversionSettings>({
    quality: 80,
    keepOriginals: false,
    outputFormat: "webp",
    lossless: false,
    resize: false,
    maxWidth: undefined,
    maxHeight: undefined,
  });
  const [progress, setProgress] = useState<ConversionProgress>({
    total: 0,
    completed: 0,
    currentFile: "",
    status: "idle",
  });
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [stats, setStats] = useState<ConversionResponse["stats"] | null>(null);
  const [fileResults, setFileResults] = useState<ConversionResult[] | null>(null);

  const isProcessing = useMemo(
    () => ["uploading", "converting", "zipping"].includes(progress.status),
    [progress.status],
  );

  const totalFileSize = useMemo(
    () => files.reduce((acc, f) => acc + f.file.size, 0),
    [files],
  );

  const isOverLimit = totalFileSize > MAX_TOTAL_BYTES;

  const canConvert = useMemo(
    () => files.length > 0 && !isProcessing && !isOverLimit,
    [files.length, isProcessing, isOverLimit],
  );

  const statsDisplay = useMemo(() => {
    if (!stats) return null;

    return {
      totalFiles: String(stats.totalFiles),
      totalOriginalSize: formatBytes(stats.totalOriginalSize),
      totalConvertedSize: formatBytes(stats.totalConvertedSize),
      savedPercentage: `${stats.savedPercentage}%`,
    };
  }, [stats]);

  const resetStateForNewRun = useCallback(() => {
    setDownloadUrl(null);
    setStats(null);
    setFileResults(null);
    setProgress({
      total: 0,
      completed: 0,
      currentFile: "",
      status: "idle",
    });
  }, []);

  const handleFilesChange = useCallback(
    (newFiles: FileWithPath[]) => {
      setFiles(newFiles);
      resetStateForNewRun();
    },
    [resetStateForNewRun],
  );

  const handleQualityChange = useCallback((value: number) => {
    setSettings((prev) => ({
      ...prev,
      quality: value,
    }));
  }, []);

  const handleFormatChange = useCallback(
    (format: ConversionSettings["outputFormat"]) => {
      setSettings((prev) => ({
        ...prev,
        outputFormat: format,
      }));
    },
    [],
  );

  const handleLosslessChange = useCallback((value: boolean) => {
    setSettings((prev) => ({
      ...prev,
      lossless: value,
    }));
  }, []);

  const handleResizeChange = useCallback((value: boolean) => {
    setSettings((prev) => ({
      ...prev,
      resize: value,
    }));
  }, []);

  const handleMaxWidthChange = useCallback((value: number | undefined) => {
    setSettings((prev) => ({
      ...prev,
      maxWidth: value,
    }));
  }, []);

  const handleMaxHeightChange = useCallback((value: number | undefined) => {
    setSettings((prev) => ({
      ...prev,
      maxHeight: value,
    }));
  }, []);

  const handleConvert = useCallback(async () => {
    if (files.length === 0) return;

    if (isOverLimit) {
      setProgress((prev) => ({
        ...prev,
        status: "error",
        error: "Total file size exceeds the 50 MB limit. Please drop a smaller folder.",
      }));
      return;
    }

    // Split files: only jpg/jpeg/png go to the server; everything else is
    // kept in the browser and zipped client-side (avoids Vercel's 4.5 MB limit)
    const convertibleFiles = files.filter((f) => isConvertibleFile(f.file.name));
    const passthroughFiles = files.filter((f) => !isConvertibleFile(f.file.name));

    // Build batches of convertible files, each ≤ BATCH_MAX_BYTES
    const batches: FileWithPath[][] = [];
    let currentBatch: FileWithPath[] = [];
    let currentBatchSize = 0;
    for (const file of convertibleFiles) {
      if (currentBatch.length > 0 && currentBatchSize + file.file.size > BATCH_MAX_BYTES) {
        batches.push(currentBatch);
        currentBatch = [file];
        currentBatchSize = file.file.size;
      } else {
        currentBatch.push(file);
        currentBatchSize += file.file.size;
      }
    }
    if (currentBatch.length > 0) batches.push(currentBatch);

    setProgress({
      total: convertibleFiles.length,
      completed: 0,
      currentFile: "",
      status: convertibleFiles.length > 0 ? "uploading" : "zipping",
      currentBatch: batches.length > 0 ? 1 : undefined,
      totalBatches: batches.length > 0 ? batches.length : undefined,
    });
    setDownloadUrl(null);
    setStats(null);
    setFileResults(null);

    try {
      const batchZipB64s: string[] = [];
      const allFileResults: ConversionResult[] = [];
      const aggregatedStats = {
        totalFiles: 0,
        totalOriginalSize: 0,
        totalConvertedSize: 0,
        savedBytes: 0,
        savedPercentage: 0,
      };
      let completedCount = 0;

      // --- Upload and convert each batch ---
      for (let i = 0; i < batches.length; i++) {
        const batch = batches[i];

        setProgress((prev) => ({
          ...prev,
          status: "uploading",
          currentBatch: i + 1,
          totalBatches: batches.length,
        }));

        const formData = new FormData();
        formData.append("quality", settings.quality.toString());
        formData.append("outputFormat", settings.outputFormat);
        formData.append("lossless", settings.lossless.toString());
        formData.append("resize", settings.resize.toString());
        if (settings.resize && settings.maxWidth) {
          formData.append("maxWidth", settings.maxWidth.toString());
        }
        if (settings.resize && settings.maxHeight) {
          formData.append("maxHeight", settings.maxHeight.toString());
        }
        batch.forEach((fileWithPath, index) => {
          formData.append(`file_${index}`, fileWithPath.file);
          formData.append(`path_${index}`, fileWithPath.relativePath);
        });

        setProgress((prev) => ({ ...prev, status: "converting" }));

        const response = await fetch("/api/convert", {
          method: "POST",
          body: formData,
        });

        const result: ConversionResponse = await response.json();

        if (!result.success) {
          setProgress((prev) => ({
            ...prev,
            status: "error",
            error: result.message,
          }));
          return;
        }

        if (result.zipBuffer) batchZipB64s.push(result.zipBuffer);
        if (result.fileResults) allFileResults.push(...result.fileResults);
        if (result.stats) {
          aggregatedStats.totalFiles += result.stats.totalFiles;
          aggregatedStats.totalOriginalSize += result.stats.totalOriginalSize;
          aggregatedStats.totalConvertedSize += result.stats.totalConvertedSize;
          aggregatedStats.savedBytes += result.stats.savedBytes;
        }

        completedCount += batch.length;
        setProgress((prev) => ({ ...prev, completed: completedCount }));
      }

      // --- Assemble final ZIP client-side ---
      setProgress((prev) => ({ ...prev, status: "zipping" }));

      const { default: JSZip } = await import("jszip");
      const finalZip = new JSZip();

      // Unzip each batch result and merge into the final archive
      for (const zipB64 of batchZipB64s) {
        const byteChars = atob(zipB64);
        const byteArray = new Uint8Array(byteChars.length);
        for (let i = 0; i < byteChars.length; i++) byteArray[i] = byteChars.charCodeAt(i);
        const batchZip = await JSZip.loadAsync(byteArray);
        for (const [path, entry] of Object.entries(batchZip.files)) {
          if (!entry.dir) finalZip.file(path, entry.async("arraybuffer"));
        }
      }

      // Add pass-through files directly from browser memory — never uploaded
      for (const pt of passthroughFiles) {
        const cleanPath = pt.relativePath.startsWith("/")
          ? pt.relativePath.slice(1)
          : pt.relativePath;
        finalZip.file(cleanPath, await pt.file.arrayBuffer());
      }

      const finalBlob = await finalZip.generateAsync({
        type: "blob",
        compression: "DEFLATE",
        compressionOptions: { level: 6 },
      });

      const url = URL.createObjectURL(finalBlob);
      setDownloadUrl(url);

      aggregatedStats.savedPercentage =
        aggregatedStats.totalOriginalSize > 0
          ? Math.round((aggregatedStats.savedBytes / aggregatedStats.totalOriginalSize) * 100)
          : 0;

      setStats(aggregatedStats.totalFiles > 0 ? aggregatedStats : null);
      setFileResults(allFileResults.length > 0 ? allFileResults : null);
      setProgress({
        total: aggregatedStats.totalFiles || convertibleFiles.length,
        completed: aggregatedStats.totalFiles || convertibleFiles.length,
        currentFile: "",
        status: "complete",
      });
    } catch (error) {
      setProgress((prev) => ({
        ...prev,
        status: "error",
        error:
          error instanceof Error
            ? error.message
            : "An unexpected error occurred",
      }));
    }
  }, [files, settings.quality, settings.outputFormat, settings.lossless, settings.resize, settings.maxWidth, settings.maxHeight, isOverLimit]);

  const handleDownload = useCallback(() => {
    if (!downloadUrl) return;

    const link = document.createElement("a");
    link.href = downloadUrl;
    link.download = `webpocalypse-${new Date().toISOString().slice(0, 10)}.zip`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }, [downloadUrl]);

  const handleAgain = useCallback(() => {
    if (downloadUrl) URL.revokeObjectURL(downloadUrl);
    setDownloadUrl(null);
    setStats(null);
    setFileResults(null);
    setFiles([]);
    setProgress({
      total: 0,
      completed: 0,
      currentFile: "",
      status: "idle",
    });
  }, [downloadUrl]);

  return {
    files,
    settings,
    progress,
    stats,
    fileResults,
    downloadUrl,
    isProcessing,
    canConvert,
    statsDisplay,
    handleFilesChange,
    handleQualityChange,
    handleFormatChange,
    handleLosslessChange,
    handleResizeChange,
    handleMaxWidthChange,
    handleMaxHeightChange,
    handleConvert,
    handleDownload,
    handleAgain,
  };
}

