import { EXTENSION_MAP, IMAGE_FORMATS, EBOOK_FORMATS } from '../constants';
import { FileCategory, FormatOption } from '../types';

export const getFileExtension = (filename: string): string => {
  return filename.slice((filename.lastIndexOf(".") - 1 >>> 0) + 2).toLowerCase();
};

export const getFileCategory = (file: File): FileCategory => {
  const ext = getFileExtension(file.name);
  if (EXTENSION_MAP[ext]) return EXTENSION_MAP[ext];
  
  if (file.type.startsWith('image/')) return 'image';
  if (file.type.includes('pdf') || file.type.includes('epub') || file.name.endsWith('.mobi')) return 'ebook';
  
  return 'unknown';
};

export const getAvailableFormats = (category: FileCategory, filename?: string): FormatOption[] => {
  switch (category) {
    case 'image':
      return IMAGE_FORMATS;
    case 'ebook': {
      if (!filename) return EBOOK_FORMATS;
      const ext = getFileExtension(filename);
      // Requirement: Remove PDF output for EPUB/MOBI inputs
      if (ext === 'epub' || ext === 'mobi' || ext === 'azw3') {
        return EBOOK_FORMATS.filter(f => f.value !== 'pdf');
      }
      return EBOOK_FORMATS;
    }
    default:
      return [];
  }
};

export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

export const generateId = (): string => {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
};