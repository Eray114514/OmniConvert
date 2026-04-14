import { FormatOption, FileCategory } from './types';

// Supported Image Formats
export const IMAGE_FORMATS: FormatOption[] = [
  { value: 'png', label: 'PNG Image', mimeType: 'image/png' },
  { value: 'jpeg', label: 'JPEG Image', mimeType: 'image/jpeg' },
  { value: 'webp', label: 'WebP Image', mimeType: 'image/webp' },
  { value: 'bmp', label: 'BMP Image', mimeType: 'image/bmp' },
];

// Supported Video Formats
export const VIDEO_FORMATS: FormatOption[] = [
  { value: 'mp4', label: 'MP4 Video', mimeType: 'video/mp4' },
  { value: 'webm', label: 'WebM Video', mimeType: 'video/webm' },
  { value: 'gif', label: 'GIF Animation', mimeType: 'image/gif' },
  { value: 'mov', label: 'MOV Video', mimeType: 'video/quicktime' },
  { value: 'avi', label: 'AVI Video', mimeType: 'video/x-msvideo' },
];

// Supported Audio Formats
export const AUDIO_FORMATS: FormatOption[] = [
  { value: 'mp3', label: 'MP3 Audio', mimeType: 'audio/mpeg' },
  { value: 'wav', label: 'WAV Audio', mimeType: 'audio/wav' },
  { value: 'ogg', label: 'OGG Audio', mimeType: 'audio/ogg' },
];

// Supported Document Formats
export const DOCUMENT_FORMATS: FormatOption[] = [
  { value: 'pdf', label: 'PDF Document', mimeType: 'application/pdf' },
];

// Supported Ebook Formats
export const EBOOK_FORMATS: FormatOption[] = [
  { value: 'epub', label: 'EPUB E-book', mimeType: 'application/epub+zip' },
  { value: 'txt', label: 'Plain Text', mimeType: 'text/plain' },
  { value: 'md', label: 'Markdown', mimeType: 'text/markdown' },
];

// Mapping extension to categories
export const EXTENSION_MAP: Record<string, FileCategory> = {
  'png': 'image',
  'jpg': 'image',
  'jpeg': 'image',
  'webp': 'image',
  'bmp': 'image',
  'svg': 'image',
  'mp4': 'video',
  'webm': 'video',
  'mov': 'video',
  'avi': 'video',
  'mp3': 'audio',
  'wav': 'audio',
  'ogg': 'audio',
  'docx': 'document',
  'pdf': 'document',
  'txt': 'ebook',
  'md': 'ebook',
  'epub': 'ebook',
};

// Default target formats based on category
export const DEFAULT_TARGETS: Record<FileCategory, string> = {
  image: 'png',
  video: 'mp4',
  audio: 'mp3',
  document: 'pdf',
  ebook: 'epub',
  unknown: 'txt',
};
