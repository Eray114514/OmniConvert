export type FileCategory = 'image' | 'ebook' | 'document' | 'unknown';

export enum ConversionStatus {
  IDLE = 'IDLE',
  PENDING = 'PENDING',
  CONVERTING = 'CONVERTING',
  COMPLETED = 'COMPLETED',
  ERROR = 'ERROR',
}

export interface FormatOption {
  value: string;
  label: string;
  mimeType: string;
}

export interface FileItem {
  id: string;
  file: File;
  name: string;
  size: number;
  category: FileCategory;
  previewUrl?: string; // For images
  targetFormat: string;
  status: ConversionStatus;
  progress: number;
  resultUrl?: string;
  resultBlob?: Blob;
  errorMessage?: string;
  timestamp: number;
}

export interface ConversionResult {
  success: boolean;
  blob?: Blob;
  error?: string;
}