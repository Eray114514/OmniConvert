import { FormatOption } from './types';

// Supported Image Formats
export const IMAGE_FORMATS: FormatOption[] = [
  { value: 'png', label: 'PNG Image', mimeType: 'image/png' },
  { value: 'jpeg', label: 'JPEG Image', mimeType: 'image/jpeg' },
  { value: 'webp', label: 'WebP Image', mimeType: 'image/webp' },
  { value: 'bmp', label: 'BMP Image', mimeType: 'image/bmp' },
];

// Supported E-book Formats
export const EBOOK_FORMATS: FormatOption[] = [
  { value: 'epub', label: 'EPUB E-book', mimeType: 'application/epub+zip' },
  { value: 'mobi', label: 'MOBI E-book', mimeType: 'application/x-mobipocket-ebook' },
  { value: 'pdf', label: 'PDF Document', mimeType: 'application/pdf' },
  { value: 'txt', label: 'TXT Text', mimeType: 'text/plain' },
  { value: 'azw3', label: 'AZW3 Kindle', mimeType: 'application/vnd.amazon.ebook' },
];

// Mapping extension to categories
export const EXTENSION_MAP: Record<string, 'image' | 'ebook'> = {
  'png': 'image',
  'jpg': 'image',
  'jpeg': 'image',
  'webp': 'image',
  'bmp': 'image',
  'gif': 'image',
  'svg': 'image',
  'epub': 'ebook',
  'mobi': 'ebook',
  'azw3': 'ebook',
  'pdf': 'ebook',
  'txt': 'ebook',
};

// Default target formats based on category
export const DEFAULT_TARGETS = {
  image: 'png',
  ebook: 'epub',
  document: 'pdf',
  unknown: 'txt',
};
