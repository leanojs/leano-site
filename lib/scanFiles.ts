import type { UploadedFile } from '@/types/fileTypes';

// Supported image extensions for conversion
const SUPPORTED_EXTENSIONS = ['.jpg', '.jpeg', '.png'];

/**
 * Check if a file has a supported image extension
 */
export function isSupportedImage(filename: string): boolean {
  const ext = filename.toLowerCase().slice(filename.lastIndexOf('.'));
  return SUPPORTED_EXTENSIONS.includes(ext);
}

/**
 * Filter uploaded files to only include supported images
 */
export function filterSupportedImages(files: UploadedFile[]): UploadedFile[] {
  return files.filter(file => isSupportedImage(file.originalName));
}

/**
 * Get the new filename with .webp extension
 */
export function getWebPFilename(originalPath: string): string {
  const lastDotIndex = originalPath.lastIndexOf('.');
  if (lastDotIndex === -1) return originalPath + '.webp';
  return originalPath.slice(0, lastDotIndex) + '.webp';
}

export function getAvifFilename(originalPath: string): string {
  const lastDotIndex = originalPath.lastIndexOf('.');
  if (lastDotIndex === -1) return originalPath + '.avif';
  return originalPath.slice(0, lastDotIndex) + '.avif';
}

/**
 * Extract folder structure from file paths
 */
export function extractFolderStructure(files: UploadedFile[]): Map<string, UploadedFile[]> {
  const structure = new Map<string, UploadedFile[]>();
  
  for (const file of files) {
    const dir = file.relativePath.substring(0, file.relativePath.lastIndexOf('/')) || '/';
    const existing = structure.get(dir) || [];
    existing.push(file);
    structure.set(dir, existing);
  }
  
  return structure;
}
