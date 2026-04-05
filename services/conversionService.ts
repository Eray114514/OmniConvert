import { ConversionResult, FileItem } from '../types';
import { convertImage } from './imageConverter';
import { convertMedia } from './mediaConverter';
import { convertDocument } from './documentConverter';
import { convertToEpub, convertFromEpub } from './ebookConverter';

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
      case 'ebook':
        if (item.targetFormat === 'epub') {
          return await convertToEpub(item.file, onProgress);
        } else if (item.targetFormat === 'txt' || item.targetFormat === 'md') {
          return await convertFromEpub(item.file, item.targetFormat, onProgress);
        }
        return { success: false, error: 'Unsupported target format for ebook' };
      default:
        return { success: false, error: 'Unsupported file category' };
    }
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
};