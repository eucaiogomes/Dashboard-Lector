import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';

export type ChartTypeOption = 'Barra' | 'Coluna' | 'Linha' | 'Pizza';

interface ChartTypeSelectorProps {
  currentType: ChartTypeOption;
  onChangeType: (type: ChartTypeOption) => void;
  allowedTypes?: ChartTypeOption[];
  direction?: 'up' | 'down';
  className?: string;
}

export const ChartTypeSelector: React.FC<ChartTypeSelectorProps> = ({
  currentType,
  onChangeType,
  allowedTypes = ['Barra', 'Coluna', 'Linha', 'Pizza'],
  direction = 'up',
  className = ''
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div
      ref={containerRef}
      className={`relative inline-flex items-center gap-1.5 text-[12.5px] select-none no-drag ${className}`}
    >
      <span className="text-[#8a93a0] font-semibold">Tipo:</span>

      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="font-bold text-[#004e4c] hover:text-[#00706c] flex items-center gap-1 cursor-pointer transition-colors"
      >
        <span className="w-1.5 h-1.5 rounded-full bg-[#f47920] shrink-0"></span>
        <span>{currentType}</span>
        <ChevronDown
          className={`w-3 h-3 text-[#8a93a0] transition-transform duration-200 ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>

      {isOpen && (
        <div
          className={`absolute left-0 bg-white border border-[#e4e8ee] rounded-[8px] shadow-lg py-1 z-50 min-w-[118px] overflow-hidden ${
            direction === 'up' ? 'bottom-full mb-1.5' : 'top-full mt-1.5'
          }`}
        >
          {allowedTypes.map(type => {
            const isSelected = currentType === type;
            return (
              <button
                key={type}
                type="button"
                onClick={() => {
                  onChangeType(type);
                  setIsOpen(false);
                }}
                className={`w-full text-left px-3 py-1.5 text-[12px] font-semibold transition-colors flex items-center justify-between cursor-pointer ${
                  isSelected
                    ? 'text-[#004e4c] bg-[#f6f8fa]'
                    : 'text-[#6b7684] hover:bg-[#f6f8fa] hover:text-[#004e4c]'
                }`}
              >
                <span>{type}</span>
                {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-[#f47920]"></span>}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};
