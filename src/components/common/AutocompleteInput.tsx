import React, { useState, useRef, useEffect, useMemo } from 'react';
import { Search, ChevronDown, Check, X, Building2, MapPin } from 'lucide-react';

export interface AutocompleteOption {
  label: string;
  sublabel?: string;
  badge?: string;
  category?: string;
  value?: string;
}

interface AutocompleteInputProps {
  id?: string;
  label: string;
  value: string;
  onChange: (val: string) => void;
  options: (string | AutocompleteOption)[];
  placeholder?: string;
  icon?: React.ReactNode;
  hint?: string;
  badge?: string;
  className?: string;
  popularSuggestions?: string[];
}

export const AutocompleteInput: React.FC<AutocompleteInputProps> = ({
  id,
  label,
  value,
  onChange,
  options,
  placeholder = 'Type to search or enter custom name...',
  icon,
  hint,
  badge,
  className = '',
  popularSuggestions = []
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState(value);
  const [highlightedIndex, setHighlightedIndex] = useState<number>(-1);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  // Sync external value
  useEffect(() => {
    setQuery(value);
  }, [value]);

  // Standardize options into AutocompleteOption objects
  const normalizedOptions = useMemo<AutocompleteOption[]>(() => {
    return options.map(opt => {
      if (typeof opt === 'string') {
        return { label: opt, value: opt };
      }
      return { ...opt, value: opt.value || opt.label };
    });
  }, [options]);

  // Filter options based on query
  const filteredOptions = useMemo(() => {
    const trimmed = query.trim().toLowerCase();
    if (!trimmed) {
      // If empty query, show first 40 or popular
      return normalizedOptions.slice(0, 40);
    }

    const words = trimmed.split(/\s+/).filter(Boolean);

    return normalizedOptions.filter(opt => {
      const target = `${opt.label} ${opt.sublabel || ''} ${opt.badge || ''} ${opt.category || ''}`.toLowerCase();
      // Match if all words are present
      return words.every(w => target.includes(w));
    }).slice(0, 60); // limit to 60 for performance
  }, [normalizedOptions, query]);

  // Handle outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
        setHighlightedIndex(-1);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (selectedVal: string) => {
    setQuery(selectedVal);
    onChange(selectedVal);
    setIsOpen(false);
    setHighlightedIndex(-1);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setQuery(val);
    onChange(val);
    setIsOpen(true);
    setHighlightedIndex(0);
  };

  const handleClear = () => {
    setQuery('');
    onChange('');
    setIsOpen(false);
    setHighlightedIndex(-1);
    inputRef.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (!isOpen) {
        setIsOpen(true);
        setHighlightedIndex(0);
      } else {
        setHighlightedIndex(prev => 
          prev < filteredOptions.length - 1 ? prev + 1 : 0
        );
      }
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (isOpen) {
        setHighlightedIndex(prev => (prev > 0 ? prev - 1 : filteredOptions.length - 1));
      }
    } else if (e.key === 'Enter') {
      if (isOpen && highlightedIndex >= 0 && filteredOptions[highlightedIndex]) {
        e.preventDefault();
        handleSelect(filteredOptions[highlightedIndex].value || filteredOptions[highlightedIndex].label);
      }
    } else if (e.key === 'Escape') {
      setIsOpen(false);
      setHighlightedIndex(-1);
    }
  };

  // Auto-scroll to highlighted item
  useEffect(() => {
    if (highlightedIndex >= 0 && listRef.current) {
      const items = listRef.current.querySelectorAll('li');
      const item = items[highlightedIndex];
      if (item) {
        item.scrollIntoView({ block: 'nearest' });
      }
    }
  }, [highlightedIndex]);

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      <div className="flex items-center justify-between mb-1.5">
        <label htmlFor={id} className="block text-xs font-medium text-slate-300">
          {label}
        </label>
        {badge && (
          <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded-md bg-purple-950/60 text-purple-300 border border-purple-500/20">
            {badge}
          </span>
        )}
      </div>

      <div className="relative flex items-center">
        {icon && (
          <div className="absolute left-3.5 text-slate-400 pointer-events-none flex items-center">
            {icon}
          </div>
        )}

        <input
          ref={inputRef}
          id={id}
          type="text"
          value={query}
          onChange={handleInputChange}
          onFocus={() => setIsOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          autoComplete="off"
          className={`w-full py-2.5 rounded-xl bg-black/40 border border-white/15 text-white text-sm focus:outline-none focus:border-purple-500 transition-colors ${
            icon ? 'pl-10' : 'pl-3.5'
          } ${query ? 'pr-16' : 'pr-9'}`}
        />

        <div className="absolute right-2.5 flex items-center space-x-1.5">
          {query && (
            <button
              type="button"
              onClick={handleClear}
              className="p-1 rounded-md text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
              title="Clear text"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}

          <button
            type="button"
            onClick={() => {
              setIsOpen(prev => !prev);
              inputRef.current?.focus();
            }}
            className="p-1 rounded-md text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
          </button>
        </div>
      </div>

      {hint && (
        <p className="mt-1 text-[11px] text-slate-400 font-sans">
          {hint}
        </p>
      )}

      {/* Dropdown Options Menu */}
      {isOpen && (
        <div className="absolute z-50 left-0 right-0 mt-1.5 rounded-xl bg-[#0c1017] border border-purple-500/30 shadow-2xl backdrop-blur-xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-150">
          
          {/* Header Bar */}
          <div className="px-3.5 py-2 border-b border-white/10 bg-white/[0.02] flex items-center justify-between text-[11px] font-mono text-slate-400">
            <span className="flex items-center space-x-1.5">
              <Search className="w-3 h-3 text-purple-400" />
              <span>
                {filteredOptions.length > 0 
                  ? `${filteredOptions.length} matching in India` 
                  : 'No exact matches found'}
              </span>
            </span>
            <span className="text-[10px] text-slate-500">
              Use ↑↓ + Enter or click
            </span>
          </div>

          {/* Quick Popular Suggestions if query is empty */}
          {!query && popularSuggestions.length > 0 && (
            <div className="p-2.5 border-b border-white/10 bg-purple-950/20">
              <span className="text-[10px] font-mono uppercase text-purple-300 block mb-1.5">
                Popular In Maharashtra / India:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {popularSuggestions.map((pop, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleSelect(pop)}
                    className="text-[11px] px-2.5 py-1 rounded-lg bg-white/5 hover:bg-purple-600/30 hover:text-purple-200 text-slate-300 border border-white/10 transition-colors text-left"
                  >
                    {pop}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Scrollable List */}
          <ul
            ref={listRef}
            className="max-h-64 overflow-y-auto divide-y divide-white/5 focus:outline-none"
            style={{ scrollbarWidth: 'thin' }}
          >
            {filteredOptions.length > 0 ? (
              filteredOptions.map((option, index) => {
                const isSelected = value === (option.value || option.label);
                const isHighlighted = highlightedIndex === index;

                return (
                  <li
                    key={`${option.label}-${index}`}
                    onMouseDown={(e) => {
                      e.preventDefault(); // prevent input blur before select
                      handleSelect(option.value || option.label);
                    }}
                    onMouseEnter={() => setHighlightedIndex(index)}
                    className={`px-3.5 py-2.5 cursor-pointer flex items-start justify-between transition-colors ${
                      isHighlighted
                        ? 'bg-purple-600/20 text-white'
                        : isSelected
                        ? 'bg-purple-950/40 text-purple-200'
                        : 'text-slate-200 hover:bg-white/5'
                    }`}
                  >
                    <div className="space-y-0.5 pr-2">
                      <div className="text-xs font-semibold text-white flex items-center space-x-1.5">
                        <span>{option.label}</span>
                        {isSelected && (
                          <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0 inline" />
                        )}
                      </div>

                      {option.sublabel && (
                        <div className="text-[11px] text-slate-400 flex items-center space-x-1">
                          <MapPin className="w-3 h-3 text-cyan-400/80 shrink-0" />
                          <span>{option.sublabel}</span>
                        </div>
                      )}
                    </div>

                    {option.badge && (
                      <span className="shrink-0 text-[10px] font-mono px-2 py-0.5 rounded bg-white/5 text-slate-300 border border-white/10 mt-0.5">
                        {option.badge}
                      </span>
                    )}
                  </li>
                );
              })
            ) : (
              <li className="p-4 text-center">
                <p className="text-xs text-slate-300">
                  No predefined listing for <span className="font-mono text-purple-300 font-semibold">"{query}"</span>
                </p>
                <p className="text-[11px] text-slate-500 mt-1">
                  You can still keep typing your exact college or institution name — custom entries are fully saved!
                </p>
                <button
                  type="button"
                  onMouseDown={(e) => {
                    e.preventDefault();
                    handleSelect(query);
                  }}
                  className="mt-3 px-3 py-1.5 rounded-lg text-xs font-semibold bg-purple-600 hover:bg-purple-500 text-white transition-colors inline-flex items-center space-x-1.5"
                >
                  <Check className="w-3 h-3" />
                  <span>Use "{query}"</span>
                </button>
              </li>
            )}
          </ul>

          {/* Footer note */}
          <div className="px-3 py-1.5 bg-black/40 border-t border-white/10 text-[10px] text-slate-500 flex items-center justify-between">
            <span>Instant Search Across All Colleges & Universities in India</span>
            <span>Type anything to customize</span>
          </div>

        </div>
      )}
    </div>
  );
};
