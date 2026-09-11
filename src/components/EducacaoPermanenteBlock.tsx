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
    <div className="bg-white border border-[#e4e8ee] rounded-2xl shadow-[0_10px_25px_-14px_rgba(0,78,76,0.45)] overflow-hidden h-full flex flex-col justify-between">
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

        {/* Grade de KPIs — mesmo padrão "bento" do Resumo Geral de Treinamentos (KPIs):
            card branco próprio, sombra verde suave, badge de ícone e número em destaque. */}
        <div className="grid grid-cols-2 gap-3 py-4 flex-1">
          {/* Colaboradores */}
          <div className="bg-white border border-[#e4e8ee] rounded-2xl p-3.5 flex flex-col justify-center gap-1.5 shadow-[0_10px_25px_-14px_rgba(0,78,76,0.45)] transition-all hover:shadow-[0_14px_28px_-12px_rgba(0,78,76,0.5)] hover:-translate-y-0.5">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-[#cde3bb]/60 flex items-center justify-center shrink-0">
                <i className="icon-participants text-[15px] text-[#00995d]"></i>
              </div>
              <div className="text-[10.5px] uppercase tracking-wide text-[#8a93a0] font-semibold leading-tight">
                Colaboradores
              </div>
            </div>
            <div className="text-[28px] font-bold text-[#004e4c] tracking-tight leading-none">
              {r.colaboradoresTreinados}
            </div>
            <div className="text-[11px] text-[#6b7684]">
              de {r.colaboradoresElegiveis} elegíveis
            </div>
          </div>

          {/* Adesão Mensal */}
          <div className="bg-white border border-[#e4e8ee] rounded-2xl p-3.5 flex flex-col justify-center gap-1.5 shadow-[0_10px_25px_-14px_rgba(0,78,76,0.45)] transition-all hover:shadow-[0_14px_28px_-12px_rgba(0,78,76,0.5)] hover:-translate-y-0.5">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-[#cde3bb]/60 flex items-center justify-center shrink-0">
                <i className="icon-performance text-[15px] text-[#00995d]"></i>
              </div>
              <div className="text-[10.5px] uppercase tracking-wide text-[#8a93a0] font-semibold leading-tight">
                Adesão Mensal
              </div>
            </div>
            <div className="flex items-baseline gap-1">
              <div className="text-[28px] font-bold text-[#004e4c] tracking-tight leading-none">
                {r.adesaoMensalPct}
              </div>
              <div className="text-[14px] text-[#8a93a0] font-medium">%</div>
            </div>
            <div className="text-[11px] font-semibold text-[#8a5a00]">Meta {r.adesaoMetaPct}%</div>
          </div>

          {/* Esforço Extra */}
          <div className="bg-white border border-[#e4e8ee] rounded-2xl p-3.5 flex flex-col justify-center gap-1.5 shadow-[0_10px_25px_-14px_rgba(0,78,76,0.45)] transition-all hover:shadow-[0_14px_28px_-12px_rgba(0,78,76,0.5)] hover:-translate-y-0.5">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-[#cde3bb]/60 flex items-center justify-center shrink-0">
                <i className="icon-checked text-[15px] text-[#00995d]"></i>
              </div>
              <div className="text-[10.5px] uppercase tracking-wide text-[#8a93a0] font-semibold leading-tight">
                Esforço Extra
              </div>
            </div>
            <div className="flex items-baseline gap-1">
              <div className="text-[28px] font-bold text-[#004e4c] tracking-tight leading-none">
                {r.esforcoExtraPct}
              </div>
              <div className="text-[14px] text-[#8a93a0] font-medium">%</div>
            </div>
            <div className="text-[11px] text-[#6b7684]">Além do planejamento habitual</div>
          </div>

          {/* Quantidade de Turmas */}
          <div className="bg-white border border-[#e4e8ee] rounded-2xl p-3.5 flex flex-col justify-center gap-1.5 shadow-[0_10px_25px_-14px_rgba(0,78,76,0.45)] transition-all hover:shadow-[0_14px_28px_-12px_rgba(0,78,76,0.5)] hover:-translate-y-0.5">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-[#cde3bb]/60 flex items-center justify-center shrink-0">
                <i className="icon-presential-lesson text-[15px] text-[#00995d]"></i>
              </div>
              <div className="text-[10.5px] uppercase tracking-wide text-[#8a93a0] font-semibold leading-tight">
                Quantidade de Turmas
              </div>
            </div>
            <div className="text-[28px] font-bold text-[#004e4c] tracking-tight leading-none">
              {String(r.turmasExecutadas).padStart(2, '0')}
            </div>
            <div className="text-[11px] text-[#6b7684]">
              de {String(r.turmasPlanejadas).padStart(2, '0')} planejadas
            </div>
          </div>
        </div>

        {onVerDetalhes && <VerDetalhesButton onClick={onVerDetalhes} className="mt-2" />}
      </div>
    </div>
  );
};
