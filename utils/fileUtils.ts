import { EXTENSION_MAP, IMAGE_FORMATS, VIDEO_FORMATS, AUDIO_FORMATS, DOCUMENT_FORMATS, EBOOK_FORMATS } from '../constants';
import { FileCategory, FormatOption } from '../types';

export const getFileExtension = (filename: string): string => {
  return filename.slice((filename.lastIndexOf(".") - 1 >>> 0) + 2).toLowerCase();
};

export const getFileCategory = (file: File): FileCategory => {
  const ext = getFileExtension(file.name);
  if (EXTENSION_MAP[ext]) return EXTENSION_MAP[ext];
  
  if (file.type.startsWith('image/')) return 'image';
  if (file.type.startsWith('video/')) return 'video';
  if (file.type.startsWith('audio/')) return 'audio';
  if (file.type.includes('pdf') || file.type.includes('document')) return 'document';
  if (file.type.includes('epub') || file.type === 'text/plain' || file.type === 'text/markdown') return 'ebook';
  
  return 'unknown';
};

export const getAvailableFormats = (category: FileCategory, filename?: string): FormatOption[] => {
  switch (category) {
    case 'image':
      return IMAGE_FORMATS;
    case 'video':
      return VIDEO_FORMATS;
    case 'audio':
      return AUDIO_FORMATS;
    case 'document':
      return DOCUMENT_FORMATS;
    case 'ebook':
      return EBOOK_FORMATS;
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