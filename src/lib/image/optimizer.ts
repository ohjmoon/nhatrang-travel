import sharp from 'sharp';

export interface OptimizeOptions {
  maxWidth?: number;
  maxHeight?: number;
  maxSizeKB?: number;
  format?: 'webp' | 'jpeg' | 'png';
  quality?: number;
}

const DEFAULT_OPTIONS: Required<OptimizeOptions> = {
  maxWidth: 1200,
  maxHeight: 1200,
  maxSizeKB: 300,
  format: 'webp',
  quality: 85,
};

/**
 * Optimize image buffer to meet size and format requirements
 */
export async function optimizeImage(
  buffer: Buffer,
  options: OptimizeOptions = {}
): Promise<{
  buffer: Buffer;
  format: string;
  width: number;
  height: number;
  sizeKB: number;
}> {
  const opts = { ...DEFAULT_OPTIONS, ...options };
  const maxSizeBytes = opts.maxSizeKB * 1024;

  const metadata = await sharp(buffer).metadata();

  let width = metadata.width || opts.maxWidth;
  let height = metadata.height || opts.maxHeight;

  if (width > opts.maxWidth || height > opts.maxHeight) {
    const ratio = Math.min(opts.maxWidth / width, opts.maxHeight / height);
    width = Math.round(width * ratio);
    height = Math.round(height * ratio);
  }

  let quality = opts.quality;
  let outputBuffer: Buffer;
  let attempts = 0;
  const maxAttempts = 10;

  do {
    const sharpInstance = sharp(buffer).resize(width, height, {
      fit: 'inside',
      withoutEnlargement: true,
    });

    switch (opts.format) {
      case 'webp':
        outputBuffer = await sharpInstance.webp({ quality, effort: 6 }).toBuffer();
        break;
      case 'jpeg':
        outputBuffer = await sharpInstance.jpeg({ quality, mozjpeg: true }).toBuffer();
        break;
      case 'png':
        outputBuffer = await sharpInstance.png({ compressionLevel: 9 }).toBuffer();
        break;
      default:
        outputBuffer = await sharpInstance.webp({ quality, effort: 6 }).toBuffer();
    }

    if (outputBuffer.length > maxSizeBytes && attempts < maxAttempts) {
      if (quality > 30) {
        quality -= 10;
      } else {
        width = Math.round(width * 0.9);
        height = Math.round(height * 0.9);
        quality = opts.quality;
      }
    }
    attempts++;
  } while (outputBuffer.length > maxSizeBytes && attempts < maxAttempts);

  const finalMetadata = await sharp(outputBuffer).metadata();

  return {
    buffer: outputBuffer,
    format: opts.format,
    width: finalMetadata.width || width,
    height: finalMetadata.height || height,
    sizeKB: Math.round(outputBuffer.length / 1024),
  };
}

export function getContentType(format: string): string {
  const types: Record<string, string> = {
    webp: 'image/webp',
    jpeg: 'image/jpeg',
    jpg: 'image/jpeg',
    png: 'image/png',
  };
  return types[format] || 'image/webp';
}

export function generateImageFilename(prefix: string, format: string = 'webp'): string {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 8);
  return `${prefix}-${timestamp}-${random}.${format}`;
}
