import React, { useEffect, useState } from 'react';
import { CHART_CATALOG, CatalogChartDef } from '../data/dashboardCatalog';

interface AddChartModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectChart: (chartDef: CatalogChartDef) => void;
  existingChartIds: string[];
}

export const AddChartModal: React.FC<AddChartModalProps> = ({
  isOpen,
  onClose,
  onSelectChart,
  existingChartIds
}) => {
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (isOpen) setSelectedIds(new Set());
  }, [isOpen]);

  if (!isOpen) return null;

  const toggle = (chartId: string) => {
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
    CHART_CATALOG.forEach(chart => {
      if (selectedIds.has(chart.id)) onSelectChart(chart);
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4 animate-fade-in select-none">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-[420px] flex flex-col max-h-[85vh] overflow-hidden">
        {/* Header */}
        <div className="px-6 pt-6 flex items-start justify-between shrink-0">
          <h2 className="text-[19px] font-bold text-[#183a75] tracking-tight">Adicionar Widget</h2>
          <button
            onClick={onClose}
            className="w-8 h-8 -mt-1 -mr-1 rounded-full text-[#8a93a0] hover:text-[#1f2733] hover:bg-[#f5f8fa] flex items-center justify-center transition-colors cursor-pointer"
            title="Fechar"
          >
            <i className="icon-close-mini text-[16px]"></i>
          </button>
        </div>
        <p className="px-6 mt-1 mb-3 text-[13px] text-[#4a5462] font-medium shrink-0">
          Selecione os widgets que deseja adicionar
        </p>

        {/* Checklist */}
        <div className="flex-1 min-h-0 overflow-y-auto px-6 pb-1">
          {CHART_CATALOG.map(chart => {
            const isAdded = existingChartIds.includes(chart.id);
            const checked = isAdded || selectedIds.has(chart.id);

            return (
              <label
                key={chart.id}
                className={`flex items-center gap-2.5 py-2 px-1.5 -mx-1.5 rounded-md transition-colors ${
                  isAdded ? 'cursor-default' : 'cursor-pointer hover:bg-[#f8fafc]'
                }`}
              >
                <input
                  type="checkbox"
                  checked={checked}
                  disabled={isAdded}
                  onChange={() => toggle(chart.id)}
                  className="w-[15px] h-[15px] shrink-0 rounded-[4px] border-[#cfd6e0] accent-[#eb6200] cursor-pointer disabled:cursor-default"
                />
                <span
                  className={`text-[13.5px] font-medium ${isAdded ? 'text-[#a7afba]' : 'text-[#334155]'}`}
                >
                  {chart.title}
                </span>
              </label>
            );
          })}
        </div>

        {/* Footer */}
        <div className="p-5 pt-4 flex items-center gap-3 shrink-0">
          <button
            onClick={handleAddSelected}
            disabled={selectedIds.size === 0}
            className="flex-[1.6] h-11 rounded-full bg-[#eb6200] hover:bg-[#cf5700] disabled:bg-[#f3c9a8] disabled:cursor-not-allowed text-white text-[13.5px] font-bold transition-colors cursor-pointer active:scale-[0.98]"
          >
            Adicionar selecionados
          </button>
          <button
            onClick={onClose}
            className="flex-1 h-11 rounded-full bg-[#e7eaee] hover:bg-[#dde1e7] text-[#4a5462] text-[13.5px] font-bold transition-colors cursor-pointer"
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
};
