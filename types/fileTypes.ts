// Types for the image conversion tool

export interface FileWithPath {
  file: File;
  relativePath: string;
}

export interface ConversionResult {
  originalPath: string;
  convertedPath: string;
  originalSize: number;
  convertedSize: number;
  success: boolean;
  error?: string;
}

export interface ConversionProgress {
  total: number;
  completed: number;
  currentFile: string;
  status: 'idle' | 'uploading' | 'converting' | 'zipping' | 'complete' | 'error';
  error?: string;
  currentBatch?: number;
  totalBatches?: number;
}

export type OutputFormat = 'webp' | 'avif' | 'both';

export interface ConversionSettings {
  quality: number;
  keepOriginals: boolean;
  outputFormat: OutputFormat;
  lossless: boolean;
  resize: boolean;
  maxWidth?: number;
  maxHeight?: number;
}

export interface UploadedFile {
  buffer: Buffer;
  relativePath: string;
  originalName: string;
}

export interface ConversionResponse {
  success: boolean;
  message: string;
  zipBuffer?: string; // Base64 encoded zip
  stats?: {
    totalFiles: number;
    totalOriginalSize: number;
    totalConvertedSize: number;
    savedBytes: number;
    savedPercentage: number;
  };
  fileResults?: ConversionResult[];
}
