import React from 'react';

interface VerDetalhesButtonProps {
  onClick: () => void;
  className?: string;
}

/**
 * "Ver Detalhes" action shared by every Dashboard "bloco completo" widget — rendered as a
 * real row inside the widget's own card (not an absolute overlay), so it always sits fully
 * inside the card's frame regardless of how much whitespace the widget leaves at the bottom.
 */
export const VerDetalhesButton: React.FC<VerDetalhesButtonProps> = ({ onClick, className }) => (
  <div className={`mt-3 flex justify-end shrink-0 ${className || ''}`}>
    <button
      onClick={onClick}
      className="px-2.5 py-1.5 bg-[#004e4c]/8 hover:bg-[#004e4c] text-[#004e4c] hover:text-[#eef7f4] text-[11.5px] font-bold rounded border border-[#004e4c]/20 hover:border-[#004e4c] flex items-center gap-1.5 transition-all cursor-pointer group active:scale-95"
      title="Abrir relatório detalhado deste gráfico"
    >
      <i className="icon-performance text-[12px] text-[#f47920] group-hover:text-[#eef7f4] transition-colors"></i>
      <span>Ver Detalhes</span>
    </button>
  </div>
);
