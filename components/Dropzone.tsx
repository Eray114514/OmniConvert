import React, { useCallback, useState, useRef } from 'react';
import { UploadCloud, FileImage, FileAudio, FileVideo, FileText, Book } from 'lucide-react';
import { motion } from 'framer-motion';

interface DropzoneProps {
  onFilesAdded: (files: File[]) => void;
}

const Dropzone: React.FC<DropzoneProps> = ({ onFilesAdded }) => {
  const [isDragActive, setIsDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragEnter = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      onFilesAdded(Array.from(e.dataTransfer.files));
      e.dataTransfer.clearData();
    }
  }, [onFilesAdded]);

  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      onFilesAdded(Array.from(e.target.files));
      e.target.value = '';
    }
  }, [onFilesAdded]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
      className={`
        relative overflow-hidden group w-full p-10 md:p-16 border-2 border-dashed rounded-3xl text-center cursor-pointer transition-all duration-300 ease-in-out
        ${isDragActive 
          ? 'border-primary-500 bg-primary-50/50 dark:bg-primary-900/20 shadow-[0_0_30px_rgba(59,130,246,0.3)]' 
          : 'border-slate-300 dark:border-gray-700 bg-white/50 dark:bg-dark-card/50 hover:border-primary-400 hover:bg-slate-50 dark:hover:bg-dark-card shadow-lg shadow-slate-200/50 dark:shadow-none backdrop-blur-md'
        }
      `}
      onDragEnter={handleDragEnter}
      onDragOver={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={() => fileInputRef.current?.click()}
    >
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
        multiple
      />

      {/* Decorative background elements */}
      <div className="absolute top-[-50px] left-[-50px] w-32 h-32 bg-primary-400/20 rounded-full blur-[40px] pointer-events-none group-hover:scale-150 transition-transform duration-700" />
      <div className="absolute bottom-[-50px] right-[-50px] w-32 h-32 bg-indigo-400/20 rounded-full blur-[40px] pointer-events-none group-hover:scale-150 transition-transform duration-700" />

      <div className="flex flex-col items-center justify-center relative z-10">
        <motion.div 
          animate={{ scale: isDragActive ? 1.1 : 1, y: isDragActive ? -5 : 0 }}
          className={`
            p-5 rounded-full mb-6 transition-colors duration-300
            ${isDragActive ? 'bg-primary-100 text-primary-600 dark:bg-primary-900/50 dark:text-primary-400' : 'bg-slate-100 text-slate-500 dark:bg-gray-800 dark:text-gray-400 group-hover:bg-primary-50 dark:group-hover:bg-primary-900/30 group-hover:text-primary-500'}
          `}
        >
          <UploadCloud size={48} strokeWidth={1.5} />
        </motion.div>

        <h3 className="text-xl md:text-2xl font-bold text-slate-800 dark:text-gray-100 mb-2">
          {isDragActive ? '松开鼠标以上传文件' : '点击或拖拽文件到这里'}
        </h3>
        
        <p className="text-slate-500 dark:text-gray-400 mb-8 max-w-md mx-auto">
          全部在您的浏览器本地处理，数据绝不会上传至任何服务器，确保 100% 隐私安全。
        </p>

        <div className="flex flex-wrap justify-center gap-4 text-xs font-medium text-slate-500 dark:text-gray-400">
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-white dark:bg-gray-900 rounded-full shadow-sm border border-slate-100 dark:border-gray-800">
            <FileImage size={14} className="text-blue-500" /> 图片 (JPG, PNG, WebP, AVIF)
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-white dark:bg-gray-900 rounded-full shadow-sm border border-slate-100 dark:border-gray-800">
            <FileVideo size={14} className="text-purple-500" /> 视频 (MP4, WebM, GIF)
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-white dark:bg-gray-900 rounded-full shadow-sm border border-slate-100 dark:border-gray-800">
            <FileAudio size={14} className="text-pink-500" /> 音频 (MP3, WAV)
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-white dark:bg-gray-900 rounded-full shadow-sm border border-slate-100 dark:border-gray-800">
            <FileText size={14} className="text-orange-500" /> 文档 (PDF, DOCX)
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-white dark:bg-gray-900 rounded-full shadow-sm border border-slate-100 dark:border-gray-800">
            <Book size={14} className="text-emerald-500" /> 电子书 (TXT, MD 转 EPUB)
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Dropzone;