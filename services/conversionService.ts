import { ConversionResult, FileItem } from '../types';
import { convertImage } from './imageConverter';
import { convertMedia } from './mediaConverter';
import { convertDocument } from './documentConverter';

export const processFileConversion = async (
  item: FileItem, 
  onProgress?: (progress: number) => void
): Promise<ConversionResult> => {
  try {
    switch (item.category) {
      case 'image':
        return await convertImage(item.file, item.targetFormat, onProgress);
      case 'video':
      case 'audio':
        return await convertMedia(item.file, item.targetFormat, onProgress);
      case 'document':
        return await convertDocument(item.file, item.targetFormat, onProgress);
      default:
        return { success: false, error: 'Unsupported file category' };
    }
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
};