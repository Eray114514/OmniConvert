import React, { useMemo } from 'react';
import { FileItem, ConversionStatus } from '../types';
import { getAvailableFormats, formatFileSize } from '../utils/fileUtils';
import { X, FileText, Image as ImageIcon, ArrowRight, AlertCircle, Loader2, Download, Check } from 'lucide-react';

interface FileCardProps {
  item: FileItem;
  onRemove: (id: string) => void;
  onFormatChange: (id: string, format: string) => void;
}

const FileCard: React.FC<FileCardProps> = ({ item, onRemove, onFormatChange }) => {
  const formats = useMemo(() => getAvailableFormats(item.category, item.name), [item.category, item.name]);
  const isConverting = item.status === ConversionStatus.CONVERTING;
  const isPending = item.status === ConversionStatus.PENDING;
  const isCompleted = item.status === ConversionStatus.COMPLETED;
  const isError = item.status === ConversionStatus.ERROR;

  return (
    <div className={`
      relative bg-white dark:bg-dark-card border rounded-xl p-4 flex items-center gap-4 transition-all duration-300 animate-slide-up group
      ${isError ? 'border-red-500/50 bg-red-50 dark:bg-red-900/10 dark:border-red-900/50' : 'border-slate-200 dark:border-dark-border hover:border-primary-300 dark:hover:border-gray-600 shadow-sm'}
      ${isCompleted ? 'bg-primary-50 dark:bg-primary-900/5 border-primary-100 dark:border-primary-900/30' : ''}
    `}>
      {/* Thumbnail / Icon */}
      <div className="relative w-14 h-14 sm:w-16 sm:h-16 flex-shrink-0 rounded-lg overflow-hidden bg-slate-100 dark:bg-black/40 border border-slate-200 dark:border-white/10 flex items-center justify-center">
        {item.previewUrl ? (
          <img src={item.previewUrl} alt={item.name} className="w-full h-full object-cover" />
        ) : (
          <div className="text-slate-400 dark:text-gray-500">
            {item.category === 'image' ? <ImageIcon size={24} /> : <FileText size={24} />}
          </div>
        )}
        
        {isCompleted && (
          <div className="absolute inset-0 bg-primary-600/10 dark:bg-primary-600/20 backdrop-blur-[1px] flex items-center justify-center">
            <div className="bg-primary-500 rounded-full p-1 shadow-lg">
              <Check size={14} className="text-white" strokeWidth={3} />
            </div>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="flex-grow min-w-0">
        <div className="flex items-center justify-between mb-1">
          <h4 className="font-medium text-slate-800 dark:text-gray-200 truncate pr-4 text-sm sm:text-base" title={item.name}>
            {item.name}
          </h4>
          <button 
            onClick={() => onRemove(item.id)}
            className="text-slate-400 dark:text-gray-500 hover:text-red-500 dark:hover:text-red-400 transition-colors p-1.5 rounded-md hover:bg-slate-100 dark:hover:bg-white/5 opacity-0 group-hover:opacity-100 focus:opacity-100"
            disabled={isConverting}
            title="移除文件"
          >
            <X size={16} />
          </button>
        </div>
        
        <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-gray-400">
          <span>{formatFileSize(item.size)}</span>
          <div className="w-1 h-1 rounded-full bg-slate-300 dark:bg-gray-600" />
          <span className="uppercase">{item.name.split('.').pop()}</span>
        </div>

        {/* Status Bar / Error Message */}
        {isError && (
            <div className="mt-2 text-xs text-red-600 dark:text-red-400 flex items-center gap-1 font-medium">
                <AlertCircle size={12} />
                {item.errorMessage || "转换失败"}
            </div>
        )}
        
        {(isConverting || isPending) && (
            <div className="mt-3 w-full h-1.5 bg-slate-200 dark:bg-gray-800 rounded-full overflow-hidden relative">
                 {isPending && <div className="absolute inset-0 bg-slate-300 dark:bg-gray-700 animate-pulse" />}
                <div 
                    className="h-full bg-gradient-to-r from-primary-600 to-indigo-500 transition-all duration-300 ease-out shadow-[0_0_10px_rgba(14,165,233,0.5)]"
                    style={{ width: `${Math.max(item.progress, 5)}%` }}
                />
            </div>
        )}
      </div>

      {/* Controls */}
      <div className="flex items-center gap-3 flex-shrink-0">
        
        {!isCompleted && !isConverting && !isPending && (
          <>
            <ArrowRight size={16} className="text-slate-300 dark:text-gray-600 hidden sm:block" />
            <select
              value={item.targetFormat}
              onChange={(e) => onFormatChange(item.id, e.target.value)}
              className="bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-700 text-slate-700 dark:text-gray-200 text-xs sm:text-sm rounded-lg focus:ring-1 focus:ring-primary-500 focus:border-primary-500 block p-2 outline-none transition-colors hover:border-primary-300 dark:hover:border-gray-600 cursor-pointer shadow-sm"
            >
              {formats.map(f => (
                <option key={f.value} value={f.value}>{f.value.toUpperCase()}</option>
              ))}
            </select>
          </>
        )}

        {isConverting && (
            <div className="flex items-center gap-2 text-primary-600 dark:text-primary-400 px-2 sm:px-4">
                <Loader2 size={18} className="animate-spin" />
                <span className="text-xs sm:text-sm font-medium hidden sm:inline">转换中...</span>
            </div>
        )}

        {isCompleted && (
           <a 
             href={item.resultUrl} 
             download={`converted_${item.name.substring(0, item.name.lastIndexOf('.'))}.${item.targetFormat}`}
             className="flex items-center gap-2 bg-primary-600 hover:bg-primary-500 text-white shadow-lg shadow-primary-900/10 dark:shadow-primary-900/20 px-4 py-2 rounded-lg transition-all text-sm font-medium hover:scale-105 active:scale-95"
           >
             <Download size={16} />
             <span className="hidden sm:inline">下载</span>
           </a>
        )}
      </div>
    </div>
  );
};

export default FileCard;