import React from 'react';
import { Sparkles, ShieldCheck, Zap } from 'lucide-react';
import { motion } from 'framer-motion';

const Header: React.FC = () => {
  return (
    <header className="py-12 md:py-16 text-center animate-fade-in relative z-10">
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="inline-flex items-center justify-center space-x-2 mb-6 bg-white/10 dark:bg-black/20 backdrop-blur-md px-4 py-1.5 rounded-full border border-slate-200/50 dark:border-white/10 shadow-sm"
      >
        <ShieldCheck size={16} className="text-green-500 dark:text-green-400" />
        <span className="text-sm font-medium text-slate-600 dark:text-gray-300">
          100% 纯本地处理 · 绝对隐私安全
        </span>
      </motion.div>

      <motion.h1 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="text-5xl md:text-6xl font-extrabold text-slate-800 dark:text-white mb-6 tracking-tight flex items-center justify-center gap-3 drop-shadow-sm"
      >
        Omni<span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-500 to-indigo-600 dark:from-primary-400 dark:to-indigo-400">Converter</span>
        <Sparkles className="text-indigo-500 dark:text-indigo-400 hidden sm:block animate-pulse" size={40} />
      </motion.h1>
      
      <motion.p 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="text-lg md:text-xl text-slate-500 dark:text-gray-400 max-w-2xl mx-auto leading-relaxed"
      >
        最强大的 WebAssembly 客户端格式转换器。<br className="hidden sm:block" />
        支持图片、音视频与文档格式，极速、免费、无需上传服务器。
      </motion.p>
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="flex flex-wrap justify-center gap-4 mt-8"
      >
        <div className="flex items-center gap-1.5 text-sm text-slate-500 dark:text-gray-400 bg-white/50 dark:bg-white/5 px-3 py-1 rounded-md border border-slate-200 dark:border-white/5">
          <Zap size={14} className="text-yellow-500" /> WebAssembly 引擎
        </div>
        <div className="flex items-center gap-1.5 text-sm text-slate-500 dark:text-gray-400 bg-white/50 dark:bg-white/5 px-3 py-1 rounded-md border border-slate-200 dark:border-white/5">
          <Zap size={14} className="text-yellow-500" /> FFmpeg.wasm 驱动
        </div>
      </motion.div>
    </header>
  );
};

export default Header;