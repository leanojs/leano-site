import { NextRequest, NextResponse } from 'next/server';
import { convertImages } from '@/lib/convertImages';
import { createZip } from '@/lib/createZip';
import { filterSupportedImages } from '@/lib/scanFiles';
import type { UploadedFile, ConversionResponse, OutputFormat } from '@/types/fileTypes';

export const runtime = 'nodejs';

const MAX_TOTAL_BYTES = 50 * 1024 * 1024; // 50 MB

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const formData = await request.formData();
    
    // Get quality setting (default to 80)
    const qualityStr = formData.get('quality');
    const quality = qualityStr ? parseInt(qualityStr.toString(), 10) : 80;

    // Get output format (default to webp)
    const outputFormatRaw = (formData.get('outputFormat') || 'webp').toString().toLowerCase();
    const allowedFormats: OutputFormat[] = ['webp', 'avif', 'both'];
    const outputFormat: OutputFormat = allowedFormats.includes(outputFormatRaw as OutputFormat)
      ? (outputFormatRaw as OutputFormat)
      : 'webp';

    // Get lossless flag (default to false)
    const lossless = formData.get('lossless') === 'true';

    // Get resize options
    const resize = formData.get('resize') === 'true';
    const maxWidthStr = formData.get('maxWidth')?.toString();
    const maxHeightStr = formData.get('maxHeight')?.toString();
    const maxWidth = maxWidthStr ? parseInt(maxWidthStr, 10) : undefined;
    const maxHeight = maxHeightStr ? parseInt(maxHeightStr, 10) : undefined;

    if (resize) {
      if (maxWidth !== undefined && (isNaN(maxWidth) || maxWidth <= 0)) {
        return NextResponse.json(
          { success: false, message: 'maxWidth must be a positive integer.' },
          { status: 400 }
        );
      }
      if (maxHeight !== undefined && (isNaN(maxHeight) || maxHeight <= 0)) {
        return NextResponse.json(
          { success: false, message: 'maxHeight must be a positive integer.' },
          { status: 400 }
        );
      }
    }

    // Validate quality range
    if (quality < 50 || quality > 100) {
      return NextResponse.json(
        { success: false, message: 'Quality must be between 50 and 100' },
        { status: 400 }
      );
    }

    // Extract files from formData
    const uploadedFiles: UploadedFile[] = [];
    
    for (const [key, value] of formData.entries()) {
      if (key.startsWith('file_') && value instanceof Blob) {
        const pathKey = key.replace('file_', 'path_');
        const relativePath = formData.get(pathKey)?.toString() || '';
        
        const arrayBuffer = await value.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        
        uploadedFiles.push({
          buffer,
          relativePath,
          originalName: relativePath.split('/').pop() || 'unknown',
        });
      }
    }

    // Enforce 50 MB total upload limit
    const totalBytes = uploadedFiles.reduce((acc, f) => acc + f.buffer.length, 0);
    if (totalBytes > MAX_TOTAL_BYTES) {
      return NextResponse.json(
        { success: false, message: 'Total upload size exceeds the 50 MB limit.' },
        { status: 413 }
      );
    }

    // Filter to only supported images
    const supportedFiles = filterSupportedImages(uploadedFiles);

    if (supportedFiles.length === 0) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'No supported images found. Please upload JPG, JPEG, or PNG files.' 
        },
        { status: 400 }
      );
    }

    // Convert images
    const { convertedFiles, results } = await convertImages(
      supportedFiles,
      quality,
      outputFormat,
      lossless,
      { enabled: resize, width: maxWidth, height: maxHeight }
    );

    // Check for conversion failures
    const failedConversions = results.filter(r => !r.success);
    if (failedConversions.length === results.length) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'All image conversions failed. Please try again.' 
        },
        { status: 500 }
      );
    }

    // Create ZIP file (include original .webp files unchanged)
    const zipBuffer = await createZip([
      ...convertedFiles,
      ...uploadedFiles.filter(
        (file) => file.originalName.toLowerCase().endsWith('.webp')
      ),
    ]);

    // Calculate stats from the canonical per-file results, guarding
    // against any unexpected NaN values.
    let totalOriginalSize = results.reduce(
      (acc, r) => acc + (Number.isFinite(r.originalSize) ? r.originalSize : 0),
      0,
    );

    let totalConvertedSize = results.reduce(
      (acc, r) => acc + (Number.isFinite(r.convertedSize) ? r.convertedSize : 0),
      0,
    );

    if (!Number.isFinite(totalOriginalSize)) totalOriginalSize = 0;
    if (!Number.isFinite(totalConvertedSize)) totalConvertedSize = 0;

    const savedBytes = totalOriginalSize - totalConvertedSize;
    const savedPercentage =
      totalOriginalSize > 0
        ? Math.round((savedBytes / totalOriginalSize) * 100)
        : 0;

    const response: ConversionResponse = {
      success: true,
      message: `Successfully converted ${convertedFiles.length} images`,
      zipBuffer: zipBuffer.toString('base64'),
      stats: {
        totalFiles: convertedFiles.length,
        totalOriginalSize,
        totalConvertedSize,
        savedBytes,
        savedPercentage,
      },
      fileResults: results,
    };

    return NextResponse.json(response);
    
  } catch (error) {
    console.error('Conversion error:', error);
    
    const message = error instanceof Error 
      ? error.message 
      : 'An unexpected error occurred during conversion';
    
    return NextResponse.json(
      { success: false, message },
      { status: 500 }
    );
  }
}
