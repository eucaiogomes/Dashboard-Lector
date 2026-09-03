import React, { useState } from 'react';
import { RankTab } from '../types';
import { jobPositionsData } from '../data/mockData';
import { VerDetalhesButton } from './VerDetalhesButton';

interface RankingCargoBlockProps {
  onVerDetalhes?: () => void;
}

/**
 * Exact copy of the "Ranking por Cargo" tabbed card from InternosView (Indicadores T&D →
 * Treinamentos Internos) — same markup and logic, unchanged, just relocated so it can be
 * added as a single widget on the Dashboard.
 */
export const RankingCargoBlock: React.FC<RankingCargoBlockProps> = ({ onVerDetalhes }) => {
  const cargosData = jobPositionsData;

  const [rankTab, setRankTab] = useState<RankTab>('Rank Geral');

  const porRankAdesao = rankTab === 'Rank Adesão';
  const cargosSorted = [...cargosData].sort((a, b) =>
    porRankAdesao
      ? b.treinados / b.ativos - a.treinados / a.ativos
      : b.participantes - a.participantes
  );
  const maxPart = Math.max(...cargosData.map(c => c.participantes));

  return (
    <div className="bg-white border border-[#e4e8ee] rounded-[6px] shadow-2xs overflow-hidden">
      <div className="flex border-b border-[#e4e8ee] bg-[#fcfdfe]">
        {(['Rank Geral', 'Rank Adesão'] as RankTab[]).map(tab => {
          const isActive = rankTab === tab;
          return (
            <button
              key={tab}
              onClick={() => setRankTab(tab)}
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

      <div className="p-3.5 px-4.5 pb-4">
        <div className="text-[12.5px] text-[#8a93a0] font-medium">
          {porRankAdesao
            ? 'Cargo por percentual de ativos com adesão'
            : 'Cargo por quantidade total de participantes'}
        </div>

        <div className="mt-3.5 flex flex-col gap-2.5">
          {cargosSorted.map((c, i) => {
            const pct = Math.round((c.treinados / c.ativos) * 100);
            const wBase = porRankAdesao ? '100%' : `${(c.participantes / maxPart) * 100}%`;
            const wFore = porRankAdesao ? `${pct}%` : `${(c.participantes / maxPart) * 100}%`;
            const legenda = porRankAdesao
              ? `${c.treinados}/${c.ativos} · ${pct}%`
              : c.participantes.toLocaleString('pt-BR');

            return (
              <div
                key={i}
                className="grid grid-cols-[minmax(104px,158px)_minmax(50px,1fr)_auto] gap-2.5 items-center"
              >
                <div
                  className="text-[12.5px] text-[#004e4c] font-medium truncate"
                  title={c.cargo}
                >
                  {c.cargo}
                </div>
                <div className="h-[17px] bg-[#f4f6f9] rounded-[3px] relative overflow-hidden">
                  <div
                    className="absolute inset-y-0 left-0 bg-[#cde3bb] rounded-[3px]"
                    style={{ width: wBase }}
                  ></div>
                  <div
                    className="absolute inset-y-0 left-0 bg-[#004e4c] rounded-[3px] transition-all"
                    style={{ width: wFore }}
                  ></div>
                </div>
                <div className="text-xs text-[#6b7684] whitespace-nowrap font-medium">
                  {legenda}
                </div>
              </div>
            );
          })}
        </div>

        {onVerDetalhes && <VerDetalhesButton onClick={onVerDetalhes} />}
      </div>
    </div>
  );
};
