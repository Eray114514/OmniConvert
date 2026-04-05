import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import clsx from 'clsx';
import { twMerge } from 'tailwind-merge';

export interface SelectOption {
  value: string;
  label: string;
}

interface CustomSelectProps {
  options: SelectOption[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
}

export function cn(...inputs: (string | undefined | null | false)[]) {
  return twMerge(clsx(inputs));
}

const CustomSelect: React.FC<CustomSelectProps> = ({
  options,
  value,
  onChange,
  placeholder = '请选择',
  disabled = false,
  className = '',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find((opt) => opt.value === value);

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  return (
    <div className={cn("relative", className)} ref={containerRef}>
      <button
        type="button"
        disabled={disabled}
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "w-full flex items-center justify-between bg-white/70 dark:bg-dark-card/70 backdrop-blur-md border border-slate-200 dark:border-gray-700 text-slate-700 dark:text-gray-200 text-sm rounded-lg p-2.5 outline-none transition-all shadow-sm hover:shadow-md hover:bg-white/90 dark:hover:bg-dark-card/90",
          disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer hover:border-primary-400 dark:hover:border-primary-500",
          isOpen && "border-primary-500 ring-2 ring-primary-500/20 dark:ring-primary-500/30 shadow-primary-500/10 bg-white dark:bg-dark-card"
        )}
      >
        <span className="truncate pr-2 font-medium">
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <ChevronDown
          size={16}
          className={cn("text-slate-400 transition-transform duration-200", isOpen && "rotate-180 text-primary-500")}
        />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -5, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -5, scale: 0.98 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className="absolute z-50 w-full mt-1.5 bg-white/70 dark:bg-gray-900/70 backdrop-blur-xl border border-slate-200/80 dark:border-gray-700/80 rounded-xl shadow-xl py-1.5 max-h-60 overflow-y-auto ring-1 ring-black/5 dark:ring-white/5 custom-scrollbar"
          >
            {options.length === 0 ? (
               <div className="px-3 py-2 text-sm text-slate-500 dark:text-gray-400 text-center">
                 无可用选项
               </div>
            ) : (
              options.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => {
                    onChange(option.value);
                    setIsOpen(false);
                  }}
                  className={cn(
                    "w-[calc(100%-8px)] mx-1 text-left px-3 py-2.5 text-sm transition-all rounded-md flex items-center justify-between group",
                    value === option.value
                      ? "bg-primary-50/80 dark:bg-primary-500/20 text-primary-600 dark:text-primary-400 font-semibold hover:bg-primary-100/80 dark:hover:bg-primary-500/30"
                      : "text-slate-600 dark:text-gray-300 hover:bg-slate-100/70 dark:hover:bg-gray-800/50 hover:text-slate-900 dark:hover:text-white"
                  )}
                >
                  <span className="relative z-10">{option.label}</span>
                  {value === option.value && (
                    <div className="w-1.5 h-1.5 rounded-full bg-primary-500 shadow-[0_0_5px_rgba(14,165,233,0.5)]"></div>
                  )}
                </button>
              ))
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CustomSelect;
