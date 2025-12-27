import React, { useCallback, useState } from 'react';
import { Upload } from 'lucide-react';

interface DropzoneProps {
  onFilesAdded: (files: File[]) => void;
}

const Dropzone: React.FC<DropzoneProps> = ({ onFilesAdded }) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      onFilesAdded(Array.from(e.dataTransfer.files));
    }
  }, [onFilesAdded]);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      onFilesAdded(Array.from(e.target.files));
    }
  }, [onFilesAdded]);

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`
        relative w-full h-64 border-2 border-dashed rounded-2xl transition-all duration-300 ease-in-out cursor-pointer
        flex flex-col items-center justify-center gap-4 group overflow-hidden
        ${isDragging 
          ? 'border-primary-500 bg-primary-500/10 scale-[1.01]' 
          : 'border-slate-200 dark:border-dark-border bg-white dark:bg-dark-card hover:border-primary-400 dark:hover:border-primary-500/50 hover:bg-slate-50 dark:hover:bg-dark-card/80 shadow-sm'
        }
      `}
    >
      <input
        type="file"
        multiple
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
        onChange={handleFileInput}
      />
      
      <div className={`p-4 rounded-full bg-primary-500/10 dark:bg-primary-500/20 text-primary-500 dark:text-primary-400 transition-transform duration-300 ${isDragging ? 'scale-110' : 'group-hover:scale-110'}`}>
        <Upload size={40} strokeWidth={1.5} />
      </div>

      <div className="text-center z-0">
        <h3 className="text-xl font-medium text-slate-700 dark:text-gray-200 mb-2 px-6">
          {isDragging ? '释放文件以添加' : '拖拽文件到此处，或点击上传'}
        </h3>
        <p className="text-sm text-slate-500 dark:text-gray-400">
          支持 JPG, PNG, WEBP, MOBI, EPUB, PDF 等多种格式
        </p>
      </div>

      {/* Decorative background blurs */}
      <div className="absolute -top-10 -right-10 w-40 h-40 bg-primary-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-violet-500/5 rounded-full blur-3xl pointer-events-none" />
    </div>
  );
};

export default Dropzone;