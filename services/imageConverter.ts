import { ConversionResult } from '../types';
import decodeJpeg from '@jsquash/jpeg/decode';
import encodeJpeg from '@jsquash/jpeg/encode';
import decodePng from '@jsquash/png/decode';
import encodePng from '@jsquash/png/encode';
import decodeWebp from '@jsquash/webp/decode';
import encodeWebp from '@jsquash/webp/encode';

export const convertImage = async (file: File, targetFormat: string, onProgress?: (progress: number) => void): Promise<ConversionResult> => {
  try {
    if (onProgress) onProgress(10);
    const buffer = await file.arrayBuffer();
    let imageData: ImageData;

    if (onProgress) onProgress(30);

    // Decode
    if (file.type === 'image/jpeg' || file.type === 'image/jpg') {
      imageData = await decodeJpeg(buffer);
    } else if (file.type === 'image/png') {
      imageData = await decodePng(buffer);
    } else if (file.type === 'image/webp') {
      imageData = await decodeWebp(buffer);
    } else {
      // Fallback for unsupported decode formats via Canvas
      return await convertImageViaCanvas(file, targetFormat, onProgress);
    }

    if (onProgress) onProgress(60);

    // Encode
    let encodedBuffer: ArrayBuffer;
    let mimeType = '';

    if (targetFormat === 'jpeg' || targetFormat === 'jpg') {
      encodedBuffer = await encodeJpeg(imageData);
      mimeType = 'image/jpeg';
    } else if (targetFormat === 'png') {
      encodedBuffer = await encodePng(imageData);
      mimeType = 'image/png';
    } else if (targetFormat === 'webp') {
      encodedBuffer = await encodeWebp(imageData);
      mimeType = 'image/webp';
    } else {
      return await convertImageViaCanvas(file, targetFormat, onProgress);
    }

    if (onProgress) onProgress(100);

    return {
      success: true,
      blob: new Blob([encodedBuffer], { type: mimeType }),
    };
  } catch (error: any) {
    console.error('Image conversion error:', error);
    return await convertImageViaCanvas(file, targetFormat, onProgress);
  }
};

const convertImageViaCanvas = (file: File, targetFormat: string, onProgress?: (progress: number) => void): Promise<ConversionResult> => {
  return new Promise((resolve) => {
    if (onProgress) onProgress(10);
    const img = new Image();
    const objectUrl = URL.createObjectURL(file);

    img.onload = () => {
      if (onProgress) onProgress(40);
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');

      if (!ctx) {
        URL.revokeObjectURL(objectUrl);
        resolve({ success: false, error: 'Canvas context not available' });
        return;
      }

      if (['jpeg', 'jpg', 'bmp'].includes(targetFormat)) {
          ctx.fillStyle = '#FFFFFF';
          ctx.fillRect(0, 0, canvas.width, canvas.height);
      } else {
          ctx.clearRect(0, 0, canvas.width, canvas.height);
      }

      ctx.drawImage(img, 0, 0);

      if (onProgress) onProgress(70);

      const targetMime = `image/${targetFormat === 'jpg' ? 'jpeg' : targetFormat}`;
      
      canvas.toBlob((blob) => {
        URL.revokeObjectURL(objectUrl);
        if (onProgress) onProgress(100);
        if (blob) {
          resolve({ success: true, blob });
        } else {
          resolve({ success: false, error: 'Conversion failed during blob creation' });
        }
      }, targetMime, 0.9);
    };

    img.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      resolve({ success: false, error: 'Failed to load image data' });
    };

    img.src = objectUrl;
  });
};
