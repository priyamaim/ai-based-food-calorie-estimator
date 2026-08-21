export interface CompressionResult {
  base64: string;
  mimeType: string;
  originalSizeMb: number;
  compressedSizeMb: number;
  wasCompressed: boolean;
  previewUrl: string;
}

/**
 * Compresses an image file if it exceeds targetSizeBytes (default 4MB) or maxDimensions.
 * Converts to JPEG base64 payload ready for Gemini API.
 */
export async function compressImageIfNeeded(
  file: File,
  maxSizeBytes: number = 4 * 1024 * 1024, // 4MB
  maxDimension: number = 1920,
  quality: number = 0.85
): Promise<CompressionResult> {
  const originalSizeMb = file.size / (1024 * 1024);

  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        let width = img.width;
        let height = img.height;
        let shouldResize = file.size > maxSizeBytes || width > maxDimension || height > maxDimension;

        if (shouldResize) {
          if (width > height) {
            if (width > maxDimension) {
              height = Math.round((height * maxDimension) / width);
              width = maxDimension;
            }
          } else {
            if (height > maxDimension) {
              width = Math.round((width * maxDimension) / height);
              height = maxDimension;
            }
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Failed to get 2D canvas context'));
          return;
        }

        // Draw image with smooth scaling
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(img, 0, 0, width, height);

        // Convert canvas to Data URL (JPEG)
        const mimeType = 'image/jpeg';
        const dataUrl = canvas.toDataURL(mimeType, quality);
        const base64Data = dataUrl.split(',')[1];

        // Approximate compressed size from base64 length
        const compressedSizeBytes = Math.round((base64Data.length * 3) / 4);
        const compressedSizeMb = compressedSizeBytes / (1024 * 1024);

        resolve({
          base64: base64Data,
          mimeType,
          originalSizeMb,
          compressedSizeMb,
          wasCompressed: shouldResize || compressedSizeBytes < file.size,
          previewUrl: dataUrl,
        });
      };

      img.onerror = () => {
        reject(new Error('Failed to load image file into browser memory.'));
      };

      img.src = event.target?.result as string;
    };

    reader.onerror = () => {
      reject(new Error('Failed to read image file.'));
    };

    reader.readAsDataURL(file);
  });
}
