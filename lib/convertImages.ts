import sharp from 'sharp';
import type { UploadedFile, ConversionResult, OutputFormat } from '@/types/fileTypes';
import { getAvifFilename, getWebPFilename, isSupportedImage } from './scanFiles';

interface ConvertedFile {
  buffer: Buffer;
  relativePath: string;
  originalSize: number;
  convertedSize: number;
}

async function convertToFormat(
  file: UploadedFile,
  quality: number,
  format: Exclude<OutputFormat, 'both'>
): Promise<ConvertedFile> {
  const image = sharp(file.buffer);

  const buffer =
    format === 'avif'
      // effort 2 (scale 0–9): ~10× faster than the default of 4 with
      // negligible quality loss for web use. The default locks the CPU.
      ? await image.avif({ quality, effort: 2 }).toBuffer()
      : await image.webp({ quality }).toBuffer();

  const relativePath =
    format === 'avif'
      ? getAvifFilename(file.relativePath)
      : getWebPFilename(file.relativePath);

  return {
    buffer,
    relativePath,
    originalSize: file.buffer.length,
    convertedSize: buffer.length,
  };
}

/**
 * Convert multiple images in parallel
 * Uses Promise.all for parallel processing to avoid blocking the event loop
 */
export async function convertImages(
  files: UploadedFile[],
  quality: number = 80,
  outputFormat: OutputFormat = 'webp'
): Promise<{ convertedFiles: ConvertedFile[]; results: ConversionResult[] }> {
  // Filter only supported images
  const supportedFiles = files.filter(f => isSupportedImage(f.originalName));

  if (supportedFiles.length === 0) {
    return { convertedFiles: [], results: [] };
  }

  // AVIF encoding is ~20–100× heavier than WebP, so use a much smaller
  // concurrency to avoid saturating all CPU cores and hanging the server.
  const BATCH_SIZE = outputFormat === 'avif' ? 3 : outputFormat === 'both' ? 2 : 8;
  const convertedFiles: ConvertedFile[] = [];
  const results: ConversionResult[] = [];

  for (let i = 0; i < supportedFiles.length; i += BATCH_SIZE) {
    const batch = supportedFiles.slice(i, i + BATCH_SIZE);
    
    const batchResults = await Promise.all(
      batch.map(async (file) => {
        try {
          const conversions: ConvertedFile[] = [];

          if (outputFormat === 'webp' || outputFormat === 'both') {
            conversions.push(await convertToFormat(file, quality, 'webp'));
          }

          if (outputFormat === 'avif' || outputFormat === 'both') {
            conversions.push(await convertToFormat(file, quality, 'avif'));
          }

          return { success: true, file, converted: conversions };
        } catch (error) {
          return {
            success: false,
            file,
            error: error instanceof Error ? error.message : 'Unknown error',
          };
        }
      })
    );

    for (const result of batchResults) {
      if (result.success && result.converted) {
        for (const converted of result.converted) {
          convertedFiles.push(converted);
          results.push({
            originalPath: result.file.relativePath,
            convertedPath: converted.relativePath,
            originalSize: converted.originalSize,
            convertedSize: converted.convertedSize,
            success: true,
          });
        }
      } else {
        results.push({
          originalPath: result.file.relativePath,
          convertedPath: '',
          originalSize: result.file.buffer.length,
          convertedSize: 0,
          success: false,
          error: result.error,
        });
      }
    }
  }

  return { convertedFiles, results };
}
