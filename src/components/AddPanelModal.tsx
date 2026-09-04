import React, { useEffect, useState } from 'react';

export interface PanelTemplateOption {
  id: string;
  name: string;
}

interface AddPanelModalProps {
  isOpen: boolean;
  onClose: () => void;
  templates: PanelTemplateOption[];
  onCreatePanels: (templateIds: string[]) => void;
}

export const AddPanelModal: React.FC<AddPanelModalProps> = ({ isOpen, onClose, templates, onCreatePanels }) => {
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (isOpen) setSelectedIds(new Set());
  }, [isOpen]);

  if (!isOpen) return null;

  const toggle = (templateId: string) => {
    setSelectedIds(prev => {
      const next = new Set(prev);
      if (next.has(templateId)) {
        next.delete(templateId);
      } else {
        next.add(templateId);
      }
      return next;
    });
  };

  const handleCreateSelected = () => {
    onCreatePanels(templates.filter(t => selectedIds.has(t.id)).map(t => t.id));
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4 animate-fade-in select-none">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-[420px] flex flex-col max-h-[85vh] overflow-hidden">
        {/* Header */}
        <div className="px-6 pt-6 flex items-start justify-between shrink-0">
          <h2 className="text-[19px] font-bold text-[#004e4c] tracking-tight">Adicionar Painel</h2>
          <button
            onClick={onClose}
            className="w-8 h-8 -mt-1 -mr-1 rounded-full text-[#8a93a0] hover:text-[#1f2733] hover:bg-[#f5f8fa] flex items-center justify-center transition-colors cursor-pointer"
            title="Fechar"
          >
            <i className="icon-close-mini text-[16px]"></i>
          </button>
        </div>
        <p className="px-6 mt-1 mb-3 text-[13px] text-[#4a5462] font-medium shrink-0">
          Selecione as abas que deseja criar
        </p>

        {/* Checklist */}
        <div className="flex-1 min-h-0 overflow-y-auto px-6 pb-1">
          <div className="mb-1">
            {templates.map(template => {
              const checked = selectedIds.has(template.id);

              return (
                <label
                  key={template.id}
                  className="flex items-center gap-2.5 py-2 px-1.5 -mx-1.5 rounded-md transition-colors cursor-pointer hover:bg-[#f8fafc]"
                >
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() => toggle(template.id)}
                    className="w-[15px] h-[15px] shrink-0 rounded-[4px] border-[#cfd6e0] accent-[#f47920] cursor-pointer"
                  />
                  <span className="text-[13.5px] font-medium flex-1 min-w-0 truncate text-[#334155]">
                    {template.name}
                  </span>
                </label>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="p-5 pt-4 flex items-center gap-3 shrink-0">
          <button
            onClick={handleCreateSelected}
            disabled={selectedIds.size === 0}
            className="flex-[1.6] h-11 rounded-full bg-[#00995d] hover:bg-[#00824f] disabled:bg-[#bfe3d1] disabled:cursor-not-allowed text-[#eef7f4] text-[13.5px] font-bold transition-colors cursor-pointer active:scale-[0.98]"
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
