import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';
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
      const target = event.target as Node;
      if (containerRef.current && !containerRef.current.contains(target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleOutsideClick);
    }
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, [isOpen]);

  const handleToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsOpen(!isOpen);
  };

  return (
    <div className={cn("relative", className)} ref={containerRef}>
      <button
        type="button"
        disabled={disabled}
        onClick={handleToggle}
        className={cn(
          "w-full flex items-center justify-between bg-white/70 dark:bg-dark-card/70 backdrop-blur-md border border-slate-200 dark:border-gray-700 text-slate-700 dark:text-gray-200 text-sm rounded-lg p-2.5 outline-none transition-all shadow-sm hover:shadow-md hover:bg-white/90 dark:hover:bg-dark-card/90",
          disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer hover:border-primary-400 dark:hover:border-primary-500",
          isOpen && "border-primary-500 ring-2 ring-primary-500/20 dark:ring-primary-500/30 shadow-primary-500/10 bg-white dark:bg-dark-card"
        )}
      >
        <span className="truncate pr-2 font-medium pointer-events-none">
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <ChevronDown
          size={16}
          className={cn("text-slate-400 transition-transform duration-200 pointer-events-none", isOpen && "rotate-180 text-primary-500")}
        />
      </button>

      {isOpen && (
        <div
          className="absolute top-[calc(100%+6px)] left-0 w-full z-[9999] bg-white/60 dark:bg-gray-900/60 backdrop-blur-xl border border-slate-200/80 dark:border-gray-700/80 rounded-xl shadow-2xl py-1.5 max-h-60 overflow-y-auto ring-1 ring-black/5 dark:ring-white/5"
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
                onClick={(e) => {
                  e.stopPropagation();
                  onChange(option.value);
                  setIsOpen(false);
                }}
                className={cn(
                  "w-[calc(100%-8px)] mx-1 text-left px-3 py-2.5 text-sm transition-colors rounded-md flex items-center justify-between group cursor-pointer",
                  value === option.value
                    ? "bg-primary-50 dark:bg-primary-500/20 text-primary-600 dark:text-primary-400 font-semibold"
                    : "text-slate-700 dark:text-gray-300 hover:bg-slate-200/80 dark:hover:bg-white/20 hover:text-slate-900 dark:hover:text-white"
                )}
              >
                <span className="relative z-10 pointer-events-none">{option.label}</span>
                {value === option.value && (
                  <div className="w-1.5 h-1.5 rounded-full bg-primary-500 shadow-[0_0_5px_rgba(14,165,233,0.5)] pointer-events-none"></div>
                )}
              </button>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default CustomSelect;