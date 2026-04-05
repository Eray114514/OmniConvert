import React from 'react';
import { FileItem, ConversionStatus } from '../types';
import { formatFileSize, getAvailableFormats } from '../utils/fileUtils';
import { X, CheckCircle2, AlertCircle, FileImage, FileAudio, FileVideo, FileText, Book, File as FileIcon, Loader2, Download } from 'lucide-react';
import { motion } from 'framer-motion';
import CustomSelect from './CustomSelect';

interface FileCardProps {
  item: FileItem;
  onRemove: (id: string) => void;
  onFormatChange: (id: string, format: string) => void;
}

const FileCard: React.FC<FileCardProps> = ({ item, onRemove, onFormatChange }) => {
  const isConverting = item.status === ConversionStatus.CONVERTING;
  const isPending = item.status === ConversionStatus.PENDING;
  const isCompleted = item.status === ConversionStatus.COMPLETED;
  const isError = item.status === ConversionStatus.ERROR;
  const isIdle = item.status === ConversionStatus.IDLE;

  const availableFormats = getAvailableFormats(item.category, item.name);

  const getCategoryIcon = () => {
    switch (item.category) {
      case 'image': return <FileImage className="text-blue-500" size={24} />;
      case 'video': return <FileVideo className="text-purple-500" size={24} />;
      case 'audio': return <FileAudio className="text-pink-500" size={24} />;
      case 'document': return <FileText className="text-orange-500" size={24} />;
      case 'ebook': return <Book className="text-emerald-500" size={24} />;
      default: return <FileIcon className="text-slate-400" size={24} />;
    }
  };

  const downloadFile = () => {
    if (item.resultUrl) {
      const link = document.createElement('a');
      link.href = item.resultUrl;
      const dotIndex = item.name.lastIndexOf('.');
      const baseName = dotIndex > -1 ? item.name.substring(0, dotIndex) : item.name;
      link.download = `converted_${baseName}.${item.targetFormat}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      layout
      className={`
        relative bg-white dark:bg-dark-card border rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center gap-4 transition-all shadow-sm
        ${isConverting ? 'border-primary-300 dark:border-primary-500/50 shadow-primary-500/10' : 'border-slate-200 dark:border-dark-border hover:shadow-md'}
        ${isCompleted ? 'border-green-300 dark:border-green-500/50 bg-green-50/30 dark:bg-green-500/5' : ''}
        ${isError ? 'border-red-300 dark:border-red-500/50 bg-red-50/30 dark:bg-red-500/5' : ''}
      `}
    >
      {/* Progress Bar Background */}
      {(isConverting || isPending) && (
        <div className="absolute inset-0 rounded-xl overflow-hidden pointer-events-none z-0">
          <div 
            className="absolute top-0 left-0 h-full bg-primary-50 dark:bg-primary-900/20 transition-all duration-300 ease-out"
            style={{ width: `${item.progress}%` }}
          />
        </div>
      )}

      <div className="flex items-center gap-4 flex-1 min-w-0 w-full relative z-10">
        <div className="w-12 h-12 rounded-lg bg-slate-100 dark:bg-gray-800 flex items-center justify-center shrink-0 overflow-hidden border border-slate-200 dark:border-gray-700">
          {item.previewUrl ? (
            <img src={item.previewUrl} alt="preview" className="w-full h-full object-cover" />
          ) : (
            getCategoryIcon()
          )}
        </div>
        
        <div className="flex-1 min-w-0">
          <h4 className="text-sm font-semibold text-slate-800 dark:text-gray-200 truncate" title={item.name}>
            {item.name}
          </h4>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-xs text-slate-500 dark:text-gray-400 font-medium bg-slate-100 dark:bg-gray-800 px-2 py-0.5 rounded">
              {formatFileSize(item.size)}
            </span>
            {isError && <span className="text-xs text-red-500 truncate" title={item.errorMessage}>{item.errorMessage}</span>}
            {isConverting && <span className="text-xs text-primary-500 font-medium">转换中 {Math.round(item.progress)}%</span>}
            {isCompleted && <span className="text-xs text-green-500 font-medium">转换成功</span>}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3 w-full sm:w-auto relative z-10 mt-2 sm:mt-0">
        {!isCompleted && !isConverting && !isPending && availableFormats.length > 0 && (
          <div className="flex items-center gap-2 flex-1 sm:flex-none">
            <span className="text-xs text-slate-400 dark:text-gray-500 font-medium whitespace-nowrap">转为</span>
            <CustomSelect
              value={item.targetFormat}
              onChange={(val) => onFormatChange(item.id, val)}
              disabled={isConverting || isPending}
              options={availableFormats.map(f => ({ value: f.value, label: f.value.toUpperCase() }))}
              className="flex-1 sm:w-28"
            />
          </div>
        )}

        {/* Status Icons & Actions */}
        <div className="flex items-center justify-end gap-2 shrink-0 ml-auto">
          {isConverting && <Loader2 size={20} className="text-primary-500 animate-spin" />}
          {isCompleted && (
            <button 
              onClick={downloadFile}
              className="p-2 text-white bg-green-500 hover:bg-green-600 rounded-lg shadow-sm shadow-green-500/30 transition-all active:scale-95"
              title="下载文件"
            >
              <Download size={18} />
            </button>
          )}
          {isError && <AlertCircle size={20} className="text-red-500" />}
          
          {(isIdle || isError || isCompleted) && (
            <button 
              onClick={() => onRemove(item.id)}
              className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-colors"
              title="移除文件"
            >
              <X size={18} />
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default FileCard;