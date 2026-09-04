import React, { useState, useRef, useEffect } from 'react';
import { FilterItem } from '../types';
import { ChevronDown, Check } from 'lucide-react';
import { DateFilterPicker, DateFilterValue } from './DateFilterPicker';

export interface FilterBarProps {
  filters: FilterItem[];
  onFilterChange: (label: string, value: string) => void;
  dateFilter: DateFilterValue;
  onDateFilterChange: (value: DateFilterValue) => void;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  filters,
  onFilterChange,
  dateFilter,
  onDateFilterChange
}) => {
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpenDropdown(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div ref={containerRef} className="no-print pt-3.5 px-7">
      <div className="flex flex-wrap items-center gap-2.5">
        {/* Unified Date Filter Picker */}
        <DateFilterPicker value={dateFilter} onChange={onDateFilterChange} />

        {/* View-specific Dropdown Filters */}
        {filters.map(filter => {
          const isOpen = openDropdown === filter.label;
          return (
            <div key={filter.label} className="relative">
              <button
                type="button"
                onClick={() => setOpenDropdown(isOpen ? null : filter.label)}
                className={`flex items-center gap-2 h-9 px-3 bg-white border text-left rounded-[6px] text-xs transition-all shadow-2xs hover:border-[#b6bdc7] cursor-pointer ${
                  isOpen ? 'border-[#004e4c] ring-1 ring-[#004e4c]' : 'border-[#dfe4ea]'
                }`}
              >
                <span className="text-[#8a93a0] text-[11px] uppercase tracking-wider whitespace-nowrap font-medium">
                  {filter.label}:
                </span>
                <span className="font-semibold text-[#1f2733] whitespace-nowrap overflow-hidden text-ellipsis max-w-[160px]">
                  {filter.value}
                </span>
                <ChevronDown className="w-3.5 h-3.5 text-[#004e4c] shrink-0" />
              </button>

              {/* Dropdown Popover */}
              {isOpen && (
                <div className="absolute top-full left-0 mt-1 w-full min-w-[200px] bg-white border border-[#dfe4ea] rounded-md shadow-lg py-1 z-30 max-h-56 overflow-y-auto">
                  {filter.options.map(option => {
                    const isSelected = filter.value === option;
                    return (
                      <button
                        key={option}
                        type="button"
                        onClick={() => {
                          onFilterChange(filter.label, option);
                          setOpenDropdown(null);
                        }}
                        className={`w-full text-left px-3 py-1.5 text-xs flex items-center justify-between hover:bg-[#f6f8fa] transition-colors cursor-pointer ${
                          isSelected ? 'text-[#004e4c] font-bold bg-[#eef0f3]/60' : 'text-[#4a5462]'
                        }`}
                      >
                        <span className="truncate">{option}</span>
                        {isSelected && <Check className="w-3.5 h-3.5 text-[#f47920]" />}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

