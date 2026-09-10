import React, { useState } from 'react';
import { educacaoPermanenteData } from '../data/educacaoPermanenteData';
import { VerDetalhesButton } from './VerDetalhesButton';

interface EducacaoPermanenteBlockProps {
  onVerDetalhes?: () => void;
}

/**
 * Relatório de Educação Permanente — snapshot de um treinamento por setor: colaboradores
 * elegíveis x treinados, adesão mensal x meta, turmas planejadas x executadas e esforço
 * extra. Um seletor de Setor troca todo o card para aquele relatório.
 */
export const EducacaoPermanenteBlock: React.FC<EducacaoPermanenteBlockProps> = ({ onVerDetalhes }) => {
  const [selectedSetor, setSelectedSetor] = useState(educacaoPermanenteData[0].setor);

  const r =
    educacaoPermanenteData.find(d => d.setor === selectedSetor) ?? educacaoPermanenteData[0];

  return (
    <div className="bg-white border border-[#e4e8ee] rounded-[6px] shadow-2xs overflow-hidden h-full flex flex-col justify-between">
      {/* Header bar */}
      <div className="bg-[#004e4c] px-5 py-3 flex items-center justify-between gap-3 shrink-0 cursor-grab active:cursor-grabbing select-none">
        <h2 className="text-[13.5px] font-bold text-[#eef7f4] uppercase tracking-wide pointer-events-none select-none">
          Relatório de Educação Permanente
        </h2>

        <div className="relative shrink-0">
          <select
            value={selectedSetor}
            onChange={e => setSelectedSetor(e.target.value)}
            className="h-[26px] pl-2.5 pr-6 bg-white/10 hover:bg-white/15 border border-white/25 rounded text-[11px] text-[#eef7f4] font-semibold appearance-none cursor-pointer outline-none transition-colors"
            title="Selecionar setor"
          >
            {educacaoPermanenteData.map(d => (
              <option key={d.setor} value={d.setor} className="text-[#1f2733]">
                {d.setor}
              </option>
            ))}
          </select>
          <div className="absolute right-1.5 top-1/2 -translate-y-1/2 pointer-events-none text-[#eef7f4] text-[8px]">
            <i className="icon-pointer-down"></i>
          </div>
        </div>
      </div>

      <div className="p-5 flex-1 flex flex-col justify-between">
        {/* Setor / Supervisor + período */}
        <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-[#e4e8ee]">
          <div className="text-[12.5px] text-[#334155] leading-relaxed flex flex-wrap items-center gap-x-6 gap-y-1">
            <div>
              <span className="font-bold text-[#004e4c]">Setor:</span> {r.setor}
            </div>
            <div>
              <span className="font-bold text-[#004e4c]">Supervisor:</span> {r.supervisores}
            </div>
          </div>
          <span className="shrink-0 bg-[#004e4c] text-[#eef7f4] text-[11.5px] font-bold px-3 py-1 rounded-full">
            {r.periodo}
          </span>
        </div>

        {/* Categoria / Tema / Instrutores */}
        <div className="flex flex-wrap items-center justify-between gap-3 py-3 border-b border-[#e4e8ee]">
          <span className="bg-[#f47920] text-white text-[11px] font-bold uppercase tracking-wide px-4 py-1 rounded-full shrink-0">
            {r.categoria}
          </span>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-1 text-[13px] text-[#334155]">
            <div>
              <span className="font-bold text-[#004e4c]">Tema:</span> {r.tema}
            </div>
            <div>
              <span className="font-bold text-[#004e4c]">Instrutores:</span> {r.instrutores}
            </div>
          </div>
        </div>

        {/* Responsive KPI Grid: 4 columns when wide, 2 columns when narrow */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 py-4 flex-1 items-center">
          {/* Colaboradores */}
          <div className="flex flex-col items-center text-center gap-2 p-2 rounded bg-[#f8fafc] border border-[#edf2f7]">
            <span className="bg-[#004e4c] text-[#eef7f4] text-[10px] font-bold uppercase tracking-wide px-3 py-0.5 rounded-full">
              Colaboradores
            </span>
            <div className="flex items-center gap-2.5">
              <i className="icon-participants text-[24px] text-[#004e4c]"></i>
              <div className="text-left text-[12px] text-[#334155] leading-snug">
                <div>
                  Elegíveis: <span className="font-bold text-[#004e4c]">{r.colaboradoresElegiveis}</span>
                </div>
                <div>
                  Treinados: <span className="font-bold text-[#004e4c]">{r.colaboradoresTreinados}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Adesão Mensal */}
          <div className="flex flex-col items-center text-center gap-1.5 p-2 rounded bg-[#f8fafc] border border-[#edf2f7]">
            <span className="bg-[#004e4c] text-[#eef7f4] text-[10px] font-bold uppercase tracking-wide px-3 py-0.5 rounded-full">
              Adesão Mensal
            </span>
            <div>
              <div className="text-[26px] font-extrabold text-[#004e4c] leading-none">
                {r.adesaoMensalPct}%
              </div>
              <div className="text-[10px] italic font-semibold text-[#c07a10] mt-0.5">
                Meta {r.adesaoMetaPct}%
              </div>
            </div>
          </div>

          {/* Quantidade de Turmas */}
          <div className="flex flex-col items-center text-center gap-2 p-2 rounded bg-[#f8fafc] border border-[#edf2f7]">
            <span className="bg-[#004e4c] text-[#eef7f4] text-[10px] font-bold uppercase tracking-wide px-3 py-0.5 rounded-full">
              Quantidade de Turmas
            </span>
            <div className="flex items-center gap-2.5">
              <i className="icon-presential-lesson text-[24px] text-[#004e4c]"></i>
              <div className="text-left text-[12px] text-[#334155] leading-snug">
                <div>
                  Planejadas: <span className="font-bold text-[#004e4c]">{String(r.turmasPlanejadas).padStart(2, '0')}</span>
                </div>
                <div>
                  Executadas: <span className="font-bold text-[#004e4c]">{String(r.turmasExecutadas).padStart(2, '0')}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Esforço Extra */}
          <div className="flex flex-col items-center text-center gap-1.5 p-2 rounded bg-[#f8fafc] border border-[#edf2f7]">
            <span className="bg-[#004e4c] text-[#eef7f4] text-[10px] font-bold uppercase tracking-wide px-3 py-0.5 rounded-full">
              Esforço Extra
            </span>
            <div>
              <div className="text-[26px] font-extrabold text-[#004e4c] leading-none">
                {r.esforcoExtraPct}%
              </div>
              <p className="text-[9px] italic text-[#8a93a0] mt-0.5 max-w-[140px] leading-tight">
                Além do planejamento habitual
              </p>
            </div>
          </div>
        </div>

        {onVerDetalhes && <VerDetalhesButton onClick={onVerDetalhes} className="mt-2" />}
      </div>
    </div>
  );
};
