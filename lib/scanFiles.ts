import type { UploadedFile } from '@/types/fileTypes';

// Extensions that get converted to webp/avif
const CONVERTIBLE_EXTENSIONS = ['.jpg', '.jpeg', '.png'];

// OS/editor-generated files that should never appear in the output
const IGNORED_SYSTEM_FILES = new Set([
  '.ds_store',
  'thumbs.db',
  'desktop.ini',
  '.gitkeep',
  '.gitignore',
]);

/**
 * Returns true for OS/editor junk that should be silently skipped.
 */
export function isIgnoredSystemFile(filename: string): boolean {
  return IGNORED_SYSTEM_FILES.has(filename.toLowerCase());
}

/**
 * Check if a file has a supported image extension (will be converted)
 */
export function isSupportedImage(filename: string): boolean {
  const ext = filename.toLowerCase().slice(filename.lastIndexOf('.'));
  return CONVERTIBLE_EXTENSIONS.includes(ext);
}

/**
 * Filter uploaded files to only include images that should be converted
 */
export function filterSupportedImages(files: UploadedFile[]): UploadedFile[] {
  return files.filter(file => isSupportedImage(file.originalName));
}

/**
 * Files that are not convertible and not system junk — passed through unchanged.
 * This covers .webp, .svg, .ico, .gif, fonts, JSON, etc.
 */
export function filterPassthroughFiles(files: UploadedFile[]): UploadedFile[] {
  return files.filter(
    (file) =>
      !isSupportedImage(file.originalName) &&
      !isIgnoredSystemFile(file.originalName),
  );
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
