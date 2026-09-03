import React from 'react';
import { monthlyBaseData } from '../data/mockData';
import { VerDetalhesButton } from './VerDetalhesButton';

interface InstitucionaisPercentualBlockProps {
  onVerDetalhes?: () => void;
}

/**
 * Exact copy of the "Evolução — Percentual de Realização" card from InstitucionaisView
 * (Indicadores T&D → Treinamentos Institucionais) — same markup and logic, unchanged,
 * just relocated so it can be added as a single widget on the Dashboard.
 */
export const InstitucionaisPercentualBlock: React.FC<InstitucionaisPercentualBlockProps> = ({ onVerDetalhes }) => {
  const baseData = monthlyBaseData;

  return (
    <div className="bg-white border border-[#e4e8ee] rounded-[6px] p-4 px-5 pb-3.5 shadow-2xs">
      <div className="text-[15px] font-bold text-[#004e4c]">
        Evolução — Percentual de Realização
      </div>
      <div className="mt-3.5 grid grid-cols-12 gap-1.5 items-end h-[150px]">
        {baseData.map((m, i) => {
          const pct = Math.round((m.realizado / m.previsto) * 100);
          const barBg = pct >= 100 ? '#004e4c' : pct >= 50 ? '#1f8f78' : '#a9d68f';
          return (
            <div
              key={i}
              className="h-full flex flex-col justify-end items-center gap-1 group"
            >
              <div className="text-[10.5px] font-bold text-[#004e4c] leading-tight">
                {pct}%
              </div>
              <div
                className="w-full max-w-[30px] rounded-t-[3px] transition-all hover:opacity-90"
                style={{ height: `${pct}%`, background: barBg }}
                title={`${m.mesAno}: ${pct}% realizado (${m.realizado}/${m.previsto})`}
              ></div>
            </div>
          );
        })}
      </div>
      <div className="grid grid-cols-12 gap-1.5 mt-2 border-t border-[#e4e8ee] pt-2">
        {baseData.map((m, i) => (
          <div key={i} className="text-center text-[10.5px] text-[#6b7684]">
            {m.mesAno}
          </div>
        ))}
      </div>

      {onVerDetalhes && <VerDetalhesButton onClick={onVerDetalhes} />}
    </div>
  );
};
