import React, { useState, useCallback, useEffect } from 'react';
import { FileItem, ConversionStatus, FileCategory } from './types';
import { getFileCategory, generateId, getAvailableFormats } from './utils/fileUtils';
import { DEFAULT_TARGETS } from './constants';
import { processFileConversion } from './services/conversionService';
import Dropzone from './components/Dropzone';
import FileCard from './components/FileCard';
import Header from './components/Header';
import { Trash2, Play, Settings2, DownloadCloud, Sparkles, Sun, Moon } from 'lucide-react';

const App: React.FC = () => {
  const [files, setFiles] = useState<FileItem[]>([]);
  const [globalTargetFormat, setGlobalTargetFormat] = useState<string>('');
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('theme');
      return saved === 'dark' || (!saved && window.matchMedia('(prefers-color-scheme: dark)').matches);
    }
    return true;
  });
  
  // Theme management
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [darkMode]);

  // To avoid memory leaks, revoke object URLs when files are removed or app unmounts
  useEffect(() => {
    return () => {
      files.forEach(file => {
        if (file.previewUrl) URL.revokeObjectURL(file.previewUrl);
        if (file.resultUrl) URL.revokeObjectURL(file.resultUrl);
      });
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleFilesAdded = useCallback((newFiles: File[]) => {
    const newFileItems: FileItem[] = newFiles.map(file => {
      const category = getFileCategory(file);
      const isImage = category === 'image';
      
      // Determine default target
      let defaultTarget = DEFAULT_TARGETS[category] || 'txt';
      // If global target is set and compatible, use it
      const availableFormats = getAvailableFormats(category, file.name);
      if (globalTargetFormat && availableFormats.some(f => f.value === globalTargetFormat)) {
          defaultTarget = globalTargetFormat;
      }

      return {
        id: generateId(),
        file,
        name: file.name,
        size: file.size,
        category,
        previewUrl: isImage ? URL.createObjectURL(file) : undefined,
        targetFormat: defaultTarget,
        status: ConversionStatus.IDLE,
        progress: 0,
        timestamp: Date.now()
      };
    });

    setFiles(prev => [...prev, ...newFileItems]);
  }, [globalTargetFormat]);

  const removeFile = useCallback((id: string) => {
    setFiles(prev => {
      const fileToRemove = prev.find(f => f.id === id);
      if (fileToRemove?.previewUrl) URL.revokeObjectURL(fileToRemove.previewUrl);
      if (fileToRemove?.resultUrl) URL.revokeObjectURL(fileToRemove.resultUrl);
      return prev.filter(f => f.id !== id);
    });
  }, []);

  const clearAllFiles = useCallback(() => {
    files.forEach(f => {
      if (f.previewUrl) URL.revokeObjectURL(f.previewUrl);
      if (f.resultUrl) URL.revokeObjectURL(f.resultUrl);
    });
    setFiles([]);
  }, [files]);

  const updateFileFormat = useCallback((id: string, format: string) => {
    setFiles(prev => prev.map(f => f.id === id ? { ...f, targetFormat: format, status: ConversionStatus.IDLE } : f));
  }, []);

  const applyGlobalFormat = (format: string, category: FileCategory) => {
    setFiles(prev => prev.map(f => {
      // Re-validate if format is available for this specific file
      const formats = getAvailableFormats(f.category, f.name);
      if (f.category === category && f.status !== ConversionStatus.CONVERTING && formats.some(avail => avail.value === format)) {
        return { ...f, targetFormat: format, status: ConversionStatus.IDLE, errorMessage: undefined };
      }
      return f;
    }));
  };

  const startConversion = async () => {
    const filesToConvert = files.filter(f => f.status === ConversionStatus.IDLE || f.status === ConversionStatus.ERROR);
    
    if (filesToConvert.length === 0) return;

    setFiles(prev => prev.map(f => 
      filesToConvert.some(ftc => ftc.id === f.id) 
        ? { ...f, status: ConversionStatus.PENDING } 
        : f
    ));

    const conversionPromises = filesToConvert.map(async (item) => {
      setFiles(prev => prev.map(f => f.id === item.id ? { ...f, status: ConversionStatus.CONVERTING, progress: 10, errorMessage: undefined } : f));

      const progressInterval = setInterval(() => {
        setFiles(prev => prev.map(f => {
          if (f.id === item.id && f.status === ConversionStatus.CONVERTING) {
             const nextProgress = f.progress + Math.random() * 15;
             return { ...f, progress: Math.min(nextProgress, 90) };
          }
          return f;
        }));
      }, 200);

      const result = await processFileConversion(item);

      clearInterval(progressInterval);

      if (result.success && result.blob) {
        const url = URL.createObjectURL(result.blob);
        setFiles(prev => prev.map(f => f.id === item.id ? { 
          ...f, 
          status: ConversionStatus.COMPLETED, 
          progress: 100, 
          resultUrl: url,
          resultBlob: result.blob 
        } : f));
      } else {
        setFiles(prev => prev.map(f => f.id === item.id ? { 
          ...f, 
          status: ConversionStatus.ERROR, 
          errorMessage: result.error 
        } : f));
      }
    });

    await Promise.all(conversionPromises);
  };

  const downloadAllCompleted = useCallback(() => {
    const completedFiles = files.filter(f => f.status === ConversionStatus.COMPLETED && f.resultUrl);
    
    if (completedFiles.length === 0) return;

    completedFiles.forEach((file, index) => {
      setTimeout(() => {
        const link = document.createElement('a');
        link.href = file.resultUrl!;
        link.download = `converted_${file.name.substring(0, file.name.lastIndexOf('.'))}.${file.targetFormat}`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }, index * 200);
    });
  }, [files]);

  const hasFiles = files.length > 0;
  const convertingCount = files.filter(f => f.status === ConversionStatus.CONVERTING || f.status === ConversionStatus.PENDING).length;
  const completedCount = files.filter(f => f.status === ConversionStatus.COMPLETED).length;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-dark-bg text-slate-800 dark:text-gray-200 selection:bg-primary-500/30 font-sans transition-colors duration-300">
      
      {/* Background Gradients */}
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
         <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-primary-500/5 dark:bg-primary-900/10 rounded-full blur-[120px]" />
         <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-indigo-500/5 dark:bg-indigo-900/10 rounded-full blur-[120px]" />
      </div>

      {/* Theme Toggle Button */}
      <button 
        onClick={() => setDarkMode(!darkMode)}
        className="fixed top-6 right-6 z-[60] p-3 rounded-full bg-white dark:bg-dark-card border border-slate-200 dark:border-dark-border shadow-lg hover:scale-110 transition-all text-slate-600 dark:text-gray-400"
        title={darkMode ? "切换到浅色模式" : "切换到深色模式"}
      >
        {darkMode ? <Sun size={20} /> : <Moon size={20} />}
      </button>

      <div className="container mx-auto max-w-5xl px-4 pb-20 relative z-10">
        <Header />

        <div className="space-y-6">
          {/* Upload Area */}
          <Dropzone onFilesAdded={handleFilesAdded} />

          {/* Controls Bar */}
          {hasFiles && (
            <div className="bg-white/80 dark:bg-dark-card/90 border border-slate-200 dark:border-dark-border rounded-xl p-4 flex flex-col lg:flex-row items-center justify-between gap-4 shadow-xl shadow-slate-200/50 dark:shadow-black/20 animate-fade-in sticky top-4 z-50 backdrop-blur-md">
              <div className="flex flex-col sm:flex-row items-center gap-4 w-full lg:w-auto">
                <div className="flex items-center gap-2 text-slate-500 dark:text-gray-400 text-sm whitespace-nowrap">
                  <Settings2 size={16} />
                  <span>批量目标:</span>
                </div>
                
                <div className="flex gap-2 w-full sm:w-auto">
                  <select 
                    className="flex-1 sm:flex-none bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-700 text-slate-700 dark:text-gray-300 text-sm rounded-lg p-2.5 outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-all cursor-pointer shadow-sm"
                    onChange={(e) => {
                       const val = e.target.value;
                       if(val) applyGlobalFormat(val, 'image');
                       setGlobalTargetFormat(val);
                    }}
                    defaultValue=""
                  >
                    <option value="" disabled>图片格式 (JPG/PNG...)</option>
                    <option value="png">全部转为 PNG</option>
                    <option value="jpeg">全部转为 JPG</option>
                    <option value="webp">全部转为 WEBP</option>
                  </select>
                  <select 
                    className="flex-1 sm:flex-none bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-700 text-slate-700 dark:text-gray-300 text-sm rounded-lg p-2.5 outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-all cursor-pointer shadow-sm"
                    onChange={(e) => {
                       const val = e.target.value;
                       if(val) applyGlobalFormat(val, 'ebook');
                    }}
                    defaultValue=""
                  >
                     <option value="" disabled>电子书 (EPUB/TXT...)</option>
                     <option value="txt">全部转为 TXT</option>
                     <option value="epub">全部转为 EPUB</option>
                     <option value="mobi">全部转为 MOBI</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center gap-3 w-full lg:w-auto justify-end">
                {completedCount > 0 && (
                  <button
                    onClick={downloadAllCompleted}
                    className="px-4 py-2.5 rounded-lg text-green-600 bg-green-50 hover:bg-green-100 dark:text-green-400 dark:bg-green-500/10 dark:hover:bg-green-500/20 border border-green-200 dark:border-green-500/20 transition-all flex items-center gap-2 text-sm font-medium shadow-sm"
                    title="下载所有已完成的文件"
                  >
                    <DownloadCloud size={18} />
                    <span className="hidden sm:inline">下载全部 ({completedCount})</span>
                  </button>
                )}

                <button
                  onClick={clearAllFiles}
                  disabled={convertingCount > 0}
                  className="px-4 py-2.5 rounded-lg text-slate-500 dark:text-gray-400 hover:text-red-500 dark:hover:text-red-400 hover:bg-slate-100 dark:hover:bg-white/5 border border-transparent hover:border-slate-200 dark:hover:border-white/10 transition-colors flex items-center gap-2 text-sm disabled:opacity-50"
                >
                  <Trash2 size={18} />
                  <span className="hidden sm:inline">清空</span>
                </button>
                
                <button
                  onClick={startConversion}
                  disabled={convertingCount > 0}
                  className={`
                    px-6 py-2.5 rounded-lg font-bold text-white flex items-center gap-2 shadow-lg shadow-primary-500/20 transition-all
                    ${convertingCount > 0 
                      ? 'bg-slate-400 dark:bg-gray-700 cursor-not-allowed' 
                      : 'bg-gradient-to-r from-primary-600 to-indigo-600 hover:from-primary-500 hover:to-indigo-500 hover:shadow-primary-500/30 active:scale-95 active:shadow-none'
                    }
                  `}
                >
                  {convertingCount > 0 ? (
                    <>
                      <Sparkles size={18} className="animate-pulse" />
                      <span>处理中...</span>
                    </>
                  ) : (
                    <>
                      <Play size={18} fill="currentColor" />
                      <span>开始转换</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {/* File List */}
          <div className="grid gap-3 min-h-[200px]">
            {files.map(file => (
              <FileCard 
                key={file.id} 
                item={file} 
                onRemove={removeFile}
                onFormatChange={updateFileFormat}
              />
            ))}
            
            {!hasFiles && (
                <div className="h-48 flex flex-col items-center justify-center text-slate-400 dark:text-gray-500 border-2 border-dashed border-slate-200 dark:border-gray-800 rounded-xl bg-white/50 dark:bg-dark-card/30">
                    <Settings2 size={32} className="mb-2 opacity-50" />
                    <span className="text-sm">暂无文件，请添加文件开始体验极速转换</span>
                </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;