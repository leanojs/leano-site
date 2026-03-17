import archiver from 'archiver';
import { Writable } from 'stream';

interface ZipFile {
  buffer: Buffer;
  relativePath: string;
}

/**
 * Create a ZIP file from converted images
 * Preserves the original folder structure
 */
export async function createZip(files: ZipFile[]): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];
    
    // Create a writable stream that collects chunks
    const writableStream = new Writable({
      write(chunk, encoding, callback) {
        chunks.push(chunk);
        callback();
      },
    });

    // Create archiver instance
    const archive = archiver('zip', {
      zlib: { level: 6 }, // Compression level (0-9)
    });

    // Handle stream events
    writableStream.on('finish', () => {
      resolve(Buffer.concat(chunks));
    });

    archive.on('error', (err) => {
      reject(new Error(`ZIP generation failed: ${err.message}`));
    });

    archive.on('warning', (err) => {
      if (err.code !== 'ENOENT') {
        console.warn('Archiver warning:', err);
      }
    });

    // Pipe archive to writable stream
    archive.pipe(writableStream);

    // Add each file to the archive with its relative path
    for (const file of files) {
      // Remove leading slash if present
      const cleanPath = file.relativePath.startsWith('/')
        ? file.relativePath.slice(1)
        : file.relativePath;
      
      archive.append(file.buffer, { name: cleanPath });
    }

    // Finalize the archive
    archive.finalize();
  });
}
