import React, { useState, useMemo, useRef, useEffect } from 'react';
import { Search, X, Check, ChevronDown } from 'lucide-react';

export interface MultiSelectFilterDropdownProps {
  label: string;
  options: string[];
  selected: string[];
  onChange: (selected: string[]) => void;
  isOpen: boolean;
  onToggle: () => void;
  onClose: () => void;
  placeholder?: string;
  singularName?: string;
  pluralName?: string;
}

export const MultiSelectFilterDropdown: React.FC<MultiSelectFilterDropdownProps> = ({
  label,
  options,
  selected,
  onChange,
  isOpen,
  onToggle,
  onClose,
  placeholder,
  singularName,
  pluralName
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setSearchTerm('');
    }
  }, [isOpen]);

  // Click outside listener for this dropdown
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        onClose();
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  // Search filtering
  // If typed >= 3 chars, filter; if empty, show all; if 1-2 chars, show all with tooltip
  const filteredOptions = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    if (!term || term.length < 3) return options;
    return options.filter(opt => opt.toLowerCase().includes(term));
  }, [options, searchTerm]);

  const toggleOption = (opt: string) => {
    if (selected.includes(opt)) {
      onChange(selected.filter(item => item !== opt));
    } else {
      onChange([...selected, opt]);
    }
  };

  const handleSelectAll = () => {
    const allUnique = Array.from(new Set([...selected, ...filteredOptions]));
    onChange(allUnique);
  };

  const handleClearAll = () => {
    onChange([]);
  };

  const hasSelections = selected.length > 0;

  // Compute button display label with proper Portuguese pluralization
  const buttonLabel = useMemo(() => {
    if (selected.length === 0) return label;
    if (selected.length === 1) return selected[0];
    const category = singularName || label.replace(' Geral', '');
    const plural = pluralName || (
      category.endsWith('r') || category.endsWith('z')
        ? `${category}es`
        : category.endsWith('m')
          ? `${category.slice(0, -1)}ns`
          : category.endsWith('s')
            ? category
            : `${category}s`
    );
    return `${selected.length} ${plural}`;
  }, [selected, label, singularName, pluralName]);

  return (
    <div className="relative inline-block" ref={dropdownRef}>
      {/* Trigger Button */}
      <button
        type="button"
        onClick={onToggle}
        className={`flex items-center h-[34px] px-3.5 border rounded-[6px] text-[13px] font-medium cursor-pointer shadow-2xs transition-colors select-none whitespace-nowrap ${
          hasSelections
            ? 'bg-[#eef7f4] border-[#004e4c] text-[#004e4c]'
            : 'bg-[#f8fafc] border-[#cfd6e0] text-[#4a5462] hover:border-[#004e4c]'
        } ${isOpen ? 'ring-1 ring-[#004e4c] border-[#004e4c]' : ''}`}
        title={`Filtrar por ${label}`}
      >
        <span className="truncate max-w-[200px]">{buttonLabel}</span>

        {hasSelections && (
          <span
            onClick={(e) => {
              e.stopPropagation();
              handleClearAll();
            }}
            className="ml-2 p-0.5 rounded-full hover:bg-[#d6ede4] text-[#004e4c] transition-colors"
            title="Limpar filtro"
          >
            <X className="w-3 h-3" />
          </span>
        )}

        <ChevronDown
          className={`w-3.5 h-3.5 ml-2 text-[#8a93a0] transition-transform duration-150 shrink-0 ${
            isOpen ? 'rotate-180 text-[#004e4c]' : ''
          }`}
        />
      </button>

      {/* Dropdown Popover */}
      {isOpen && (
        <div className="absolute top-full left-0 mt-1.5 w-[290px] bg-white border border-[#cfd6e0] rounded-xl shadow-xl z-50 py-2.5 px-3 animate-in fade-in duration-100 flex flex-col gap-2.5">
          {/* Pill Search Input with divider and Search Icon (matches user reference images) */}
          <div className="relative">
            <div className="flex items-center bg-[#f8fafc] border border-[#cfd6e0] rounded-full h-[34px] px-3 focus-within:border-[#004e4c] focus-within:bg-white transition-all shadow-inner">
              <input
                ref={inputRef}
                type="text"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                placeholder={placeholder || `Buscar ${singularName?.toLowerCase() || 'item'}...`}
                className="flex-1 bg-transparent text-[12.5px] text-[#334155] placeholder-[#8a93a0] outline-none min-w-0"
              />

              {/* Clear search text (X) */}
              {searchTerm.length > 0 && (
                <button
                  type="button"
                  onClick={() => setSearchTerm('')}
                  className="p-1 text-[#8a93a0] hover:text-[#334155] transition-colors cursor-pointer"
                  title="Limpar pesquisa"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}

              {/* Vertical divider */}
              <div className="h-4 w-px bg-[#cfd6e0] mx-1.5 shrink-0" />

              {/* Search Icon */}
              <button
                type="button"
                className="text-[#64748b] hover:text-[#004e4c] transition-colors shrink-0 p-0.5 cursor-pointer"
                title="Pesquisar"
              >
                <Search className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Validation tooltip bubble: "Informe ao menos 3 caracteres para pesquisar" */}
            {searchTerm.length > 0 && searchTerm.length < 3 && (
              <div className="absolute left-1/2 -translate-x-1/2 top-full mt-2 z-60 bg-white border border-[#cfd6e0] shadow-md rounded-full px-3.5 py-1 text-[11px] text-[#4a5462] whitespace-nowrap animate-in fade-in slide-in-from-top-1 duration-150 flex items-center justify-center">
                {/* Arrow up pointing to input */}
                <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-white border-t border-l border-[#cfd6e0] rotate-45" />
                <span>Informe ao menos 3 caracteres para pesquisar</span>
              </div>
            )}
          </div>

          {/* Quick Actions Row */}
          <div className="flex items-center justify-between text-[11px] text-[#6b7684] px-1 pt-0.5 border-b border-[#f0f3f7] pb-1.5">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleSelectAll}
                className="text-[#004e4c] hover:underline font-semibold cursor-pointer"
              >
                Selecionar todos
              </button>
              <span>•</span>
              <button
                type="button"
                onClick={handleClearAll}
                disabled={!hasSelections}
                className={`${
                  hasSelections
                    ? 'text-[#e04040] hover:underline cursor-pointer'
                    : 'text-[#a0aec0] cursor-not-allowed'
                }`}
              >
                Limpar
              </button>
            </div>
            {hasSelections && (
              <span className="font-semibold text-[#004e4c] bg-[#eef7f4] px-1.5 py-0.5 rounded">
                {selected.length} {selected.length === 1 ? 'selecionado' : 'selecionados'}
              </span>
            )}
          </div>

          {/* Options List with Checkboxes */}
          <div className="max-h-56 overflow-y-auto pr-0.5 space-y-0.5">
            {filteredOptions.length === 0 ? (
              <div className="py-4 text-center text-[12px] text-[#8a93a0] italic">
                Nenhum item encontrado
              </div>
            ) : (
              filteredOptions.map(opt => {
                const isSelected = selected.includes(opt);
                return (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => toggleOption(opt)}
                    className={`w-full text-left px-2.5 py-1.5 text-[12px] flex items-center gap-2.5 transition-colors cursor-pointer rounded-[5px] select-none ${
                      isSelected
                        ? 'bg-[#eef7f4] text-[#004e4c] font-semibold'
                        : 'text-[#4a5462] hover:bg-[#f0f4f8]'
                    }`}
                  >
                    {/* Custom Styled Checkbox */}
                    <div
                      className={`w-4 h-4 rounded-[4px] border flex items-center justify-center transition-colors shrink-0 ${
                        isSelected
                          ? 'bg-[#00995d] border-[#00995d] text-white shadow-2xs'
                          : 'border-[#cfd6e0] bg-white hover:border-[#004e4c]'
                      }`}
                    >
                      {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                    </div>
                    <span className="truncate flex-1">{opt}</span>
                  </button>
                );
              })
            )}
          </div>

          {/* Footer Actions */}
          <div className="pt-2 border-t border-[#f0f3f7] flex items-center justify-between">
            <span className="text-[11px] text-[#8a93a0]">
              {selected.length} de {options.length} marcados
            </span>
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1 bg-[#004e4c] hover:bg-[#003837] text-white text-[11.5px] font-semibold rounded-[5px] shadow-2xs transition-colors cursor-pointer"
            >
              Concluir
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
