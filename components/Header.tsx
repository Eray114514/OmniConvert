import React from 'react';
import { Layers, Sparkles } from 'lucide-react';

const Header: React.FC = () => {
  return (
    <header className="py-12 text-center relative z-10">
      <div className="inline-flex items-center justify-center gap-3 mb-4">
        <div className="relative">
          <div className="absolute inset-0 bg-primary-500 blur-xl opacity-20 rounded-full"></div>
          <div className="relative bg-gradient-to-br from-primary-600 to-indigo-600 p-3 rounded-2xl shadow-lg shadow-primary-500/20">
            <Layers className="text-white w-8 h-8" />
          </div>
        </div>
        <h1 className="text-4xl font-black bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:via-primary-100 dark:to-primary-300 tracking-tight">
          OmniConverter
        </h1>
      </div>
      <p className="text-slate-500 dark:text-gray-400 max-w-lg mx-auto text-lg flex items-center justify-center gap-2 font-medium">
        <Sparkles size={16} className="text-yellow-500" />
        万能、极速、私密的文件格式转换工具
      </p>
    </header>
  );
};

export default Header;