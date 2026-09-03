import React, { useState } from 'react';
import { AtivosTab } from '../types';
import { monthlyBaseData } from '../data/mockData';
import { VerDetalhesButton } from './VerDetalhesButton';

interface AtivosTreinadosBlockProps {
  onVerDetalhes?: () => void;
}

/**
 * Exact copy of the "Ativos x Treinados" tabbed card from InternosView (Indicadores T&D →
 * Treinamentos Internos) — same markup and logic, unchanged, just relocated so it can be
 * added as a single widget on the Dashboard.
 */
export const AtivosTreinadosBlock: React.FC<AtivosTreinadosBlockProps> = ({ onVerDetalhes }) => {
  const baseData = monthlyBaseData;

  const [ativosTab, setAtivosTab] = useState<AtivosTab>('Ativos x Treinados');

  const last6 = baseData.slice(-6);
  const porAdesao = ativosTab === 'Adesão';

  return (
    <div className="bg-white border border-[#e4e8ee] rounded-[6px] shadow-2xs overflow-hidden">
      <div className="flex border-b border-[#e4e8ee] bg-[#fcfdfe]">
        {(['Ativos x Treinados', 'Adesão'] as AtivosTab[]).map(tab => {
          const isActive = ativosTab === tab;
          return (
            <button
              key={tab}
              onClick={() => setAtivosTab(tab)}
              className={`h-10 px-4 border-none text-[13px] font-semibold cursor-pointer transition-all border-b-2 ${
                isActive
                  ? 'bg-white text-[#004e4c] border-[#f47920]'
                  : 'bg-[#f6f8fa] text-[#6b7684] border-transparent hover:text-[#004e4c]'
              }`}
            >
              {tab}
            </button>
          );
        })}
      </div>

      <div className="p-3.5 px-4.5 pb-3">
        <div className="text-[12.5px] text-[#8a93a0] font-medium">
          {porAdesao
            ? 'Percentual de colaboradores ativos treinados por mês'
            : 'Colaboradores ativos e treinados por mês'}
        </div>

        <div className="mt-3 grid grid-cols-6 gap-3 items-end h-[168px]">
          {last6.map((s, i) => {
            const pct = Math.round((s.colabTreinados / s.ativos) * 100);
            const hAtivos = porAdesao ? 100 : (s.ativos / 1300) * 100;
            const hTreinados = (s.colabTreinados / s.ativos) * 100;

            return (
              <div
                key={i}
                className="h-full flex flex-col justify-end items-center gap-1 group"
              >
                <div className="text-[11.5px] font-bold text-[#004e4c]">
                  {porAdesao ? `${pct}%` : String(s.colabTreinados)}
                </div>
                <div
                  className="w-full max-w-[52px] bg-[#cde3bb] rounded-t-[3px] relative"
                  style={{ height: `${hAtivos}%` }}
                  title={`${s.mesAno} - Ativos: ${s.ativos}`}
                >
                  <div
                    className="absolute inset-x-0 bottom-0 bg-[#004e4c] rounded-t-[3px] transition-all group-hover:bg-[#00706c]"
                    style={{ height: `${hTreinados}%` }}
                    title={`${s.mesAno} - Treinados: ${s.colabTreinados} (${pct}%)`}
                  ></div>
                </div>
                <div className="text-[11px] text-[#6b7684] mt-0.5">{s.mesAno}</div>
              </div>
            );
          })}
        </div>

        <div className="mt-2.5 flex items-center gap-4 text-xs text-[#4a5462]">
          <span className="inline-flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 bg-[#cde3bb] rounded-[2px]"></span>
            Ativos
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 bg-[#004e4c] rounded-[2px]"></span>
            Treinados
          </span>
        </div>

        {onVerDetalhes && <VerDetalhesButton onClick={onVerDetalhes} />}
      </div>
    </div>
  );
};
