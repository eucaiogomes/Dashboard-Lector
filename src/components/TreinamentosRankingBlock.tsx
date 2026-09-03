import React from 'react';
import { internalTrainingsData } from '../data/mockData';
import { VerDetalhesButton } from './VerDetalhesButton';

interface TreinamentosRankingBlockProps {
  onVerDetalhes?: () => void;
}

/**
 * Exact copy of the "Treinamentos" (horas por treinamento interno) card from InternosView
 * (Indicadores T&D → Treinamentos Internos) — same markup and logic, unchanged, just
 * relocated so it can be added as a single widget on the Dashboard.
 */
export const TreinamentosRankingBlock: React.FC<TreinamentosRankingBlockProps> = ({ onVerDetalhes }) => {
  const treinamentosData = internalTrainingsData;
  const maxHours = 2799;

  return (
    <div className="bg-white border border-[#e4e8ee] rounded-[6px] p-4 px-4.5 pb-3.5 shadow-2xs">
      <div className="text-[15px] font-bold text-[#004e4c]">
        Treinamentos
      </div>
      <div className="text-[12.5px] text-[#8a93a0] mt-0.5 font-medium">
        Horas treinadas por treinamento interno
      </div>

      <div className="mt-3.5 flex flex-col gap-2.5">
        {treinamentosData.map((t, i) => {
          const widthPct = (t.horasVal / maxHours) * 100;
          return (
            <div
              key={i}
              className="grid grid-cols-[minmax(96px,152px)_minmax(50px,1fr)_auto] gap-2.5 items-center"
            >
              <div
                className="text-[12.5px] text-[#004e4c] font-medium truncate"
                title={t.nome}
              >
                {t.nome}
              </div>
              <div className="h-4 bg-[#f4f6f9] rounded-[3px] overflow-hidden">
                <div
                  className="h-4 bg-[#004e4c] rounded-[3px] transition-all hover:bg-[#00706c]"
                  style={{ width: `${widthPct}%` }}
                ></div>
              </div>
              <div className="text-xs text-[#6b7684] whitespace-nowrap font-mono font-medium">
                {t.horasFormatted}
              </div>
            </div>
          );
        })}
      </div>

      {onVerDetalhes && <VerDetalhesButton onClick={onVerDetalhes} />}
    </div>
  );
};
