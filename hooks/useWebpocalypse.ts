import { useCallback, useMemo, useState } from "react";
import type {
  ConversionProgress,
  ConversionResponse,
  ConversionResult,
  ConversionSettings,
  FileWithPath,
} from "@/types/fileTypes";

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

    setProgress({
        total: files.length,
        completed: 0,
        currentFile: "",
        status: "uploading",
      });
      setDownloadUrl(null);
      setStats(null);
      setFileResults(null);

    try {
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

      files.forEach((fileWithPath, index) => {
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

      setProgress((prev) => ({ ...prev, status: "zipping" }));

      if (result.zipBuffer) {
        const byteCharacters = atob(result.zipBuffer);
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
          byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        const blob = new Blob([byteArray], { type: "application/zip" });
        const url = URL.createObjectURL(blob);
        setDownloadUrl(url);
      }

      setStats(result.stats || null);
      setFileResults(result.fileResults || null);
      setProgress({
        total: result.stats?.totalFiles || files.length,
        completed: result.stats?.totalFiles || files.length,
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
    link.download = "converted-images.zip";
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

