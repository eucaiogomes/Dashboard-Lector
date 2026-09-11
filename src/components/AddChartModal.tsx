import React, { useEffect, useState, useMemo } from 'react';
import { CHART_CATALOG, CatalogChartDef } from '../data/dashboardCatalog';
import { X } from 'lucide-react';

interface AddChartModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddCharts: (charts: CatalogChartDef[]) => void;
  existingChartIds: string[];
}

export const AddChartModal: React.FC<AddChartModalProps> = ({
  isOpen,
  onClose,
  onAddCharts,
  existingChartIds
}) => {
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (isOpen) setSelectedIds(new Set());
  }, [isOpen]);

  // Order: Client-requested widgets (Cursos presenciais) first, followed by standard Lector platform widgets
  const orderedCatalog = useMemo(() => {
    const clientWidgets = CHART_CATALOG.filter(c => c.isClientWidget);
    const standardWidgets = CHART_CATALOG.filter(c => !c.isClientWidget);
    return [...clientWidgets, ...standardWidgets];
  }, []);

  if (!isOpen) return null;

  const toggle = (chartId: string, disabled: boolean) => {
    if (disabled) return;
    setSelectedIds(prev => {
      const next = new Set(prev);
      if (next.has(chartId)) {
        next.delete(chartId);
      } else {
        next.add(chartId);
      }
      return next;
    });
  };

  const handleAddSelected = () => {
    const toAdd = orderedCatalog.filter(
      chart => selectedIds.has(chart.id) && !existingChartIds.includes(chart.id)
    );
    if (toAdd.length > 0) {
      onAddCharts(toAdd);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4 animate-fade-in select-none">
      <div className="bg-white rounded-[24px] shadow-2xl w-full max-w-[440px] sm:max-w-[460px] flex flex-col max-h-[85vh] overflow-hidden">
        {/* Header */}
        <div className="px-6 pt-6 pb-2 flex items-start justify-between shrink-0">
          <div>
            <h2 className="text-[19px] font-bold text-[#103554] tracking-tight">
              Adicionar Widget
            </h2>
            <p className="mt-1 text-[13.5px] text-[#4a5462] font-normal">
              Selecione os widgets que deseja adicionar
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 -mt-1 -mr-1 rounded-full text-[#8a93a0] hover:text-[#1f2733] hover:bg-[#f1f5f9] flex items-center justify-center transition-colors cursor-pointer"
            title="Fechar"
            aria-label="Fechar"
          >
            <X size={18} strokeWidth={2} />
          </button>
        </div>

        {/* Checklist */}
        <div className="flex-1 min-h-0 overflow-y-auto px-6 py-2">
          <div className="flex flex-col space-y-1">
            {orderedCatalog.map(chart => {
              const isAdded = existingChartIds.includes(chart.id);
              const isSelected = selectedIds.has(chart.id);
              const checked = isAdded || isSelected;
              const disabled = isAdded;

              return (
                <div
                  key={chart.id}
                  onClick={() => toggle(chart.id, disabled)}
                  className={`group flex items-center gap-3 py-1.5 px-2 -mx-2 rounded-md transition-colors ${
                    disabled
                      ? 'cursor-default'
                      : 'cursor-pointer hover:bg-[#f8fafc]'
                  }`}
                >
                  {/* Custom Checkbox matching the reference image */}
                  <div
                    className={`w-[16px] h-[16px] shrink-0 rounded-[3.5px] flex items-center justify-center transition-all ${
                      disabled
                        ? 'bg-[#b8c2cc] border border-[#b8c2cc] text-white'
                        : isSelected
                        ? 'bg-[#00995d] border border-[#00995d] text-white shadow-2xs'
                        : 'bg-white border border-[#cfd6e0] group-hover:border-[#00995d]'
                    }`}
                  >
                    {checked && (
                      <svg
                        className="w-2.5 h-2.5"
                        viewBox="0 0 12 12"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <polyline points="2 6 4.8 9 10 3" />
                      </svg>
                    )}
                  </div>

                  {/* Widget Label */}
                  <span
                    className={`text-[13.5px] leading-snug flex-1 min-w-0 truncate select-none ${
                      disabled
                        ? 'text-[#8a93a0] font-normal'
                        : isSelected
                        ? 'text-[#103554] font-semibold'
                        : 'text-[#334155] font-normal group-hover:text-[#103554]'
                    }`}
                    title={`${chart.title}${chart.isClientWidget ? ' (Curso presencial)' : ''}`}
                  >
                    {chart.title}
                    {chart.isClientWidget && (
                      <span
                        className={`ml-1 font-medium ${
                          disabled ? 'text-[#8a93a0]' : 'text-[#64748b]'
                        }`}
                      >
                        (Curso presencial)
                      </span>
                    )}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 pt-4 flex items-center gap-3 shrink-0 bg-white border-t border-[#f1f4f8]">
          <button
            onClick={handleAddSelected}
            disabled={selectedIds.size === 0}
            className="flex-[1.4] h-11 rounded-full bg-[#00995d] hover:bg-[#00824f] disabled:bg-[#00995d]/50 disabled:opacity-60 disabled:cursor-not-allowed text-white text-[13.5px] font-bold transition-all cursor-pointer shadow-xs active:scale-[0.98]"
          >
            Adicionar selecionados
          </button>
          <button
            onClick={onClose}
            className="flex-1 h-11 rounded-full bg-[#eaedf0] hover:bg-[#dfe3e8] text-[#4a5462] text-[13.5px] font-bold transition-colors cursor-pointer"
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
};
