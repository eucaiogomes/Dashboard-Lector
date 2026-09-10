import React, { useState } from 'react';
import { RankTab, JobPositionData } from '../types';
import { jobPositionsData } from '../data/mockData';
import { VerDetalhesButton } from './VerDetalhesButton';
import { ChartTypeSelector, ChartTypeOption } from './ChartTypeSelector';
import { UniversalChartRenderer } from './UniversalChartRenderer';

interface RankingCargoBlockProps {
  cargosData?: JobPositionData[];
  onVerDetalhes?: () => void;
}

export const RankingCargoBlock: React.FC<RankingCargoBlockProps> = ({
  cargosData = jobPositionsData,
  onVerDetalhes
}) => {
  const [rankTab, setRankTab] = useState<RankTab>('Rank Geral');
  const [chartType, setChartType] = useState<ChartTypeOption>('Barra');

  const porRankAdesao = rankTab === 'Rank Adesão';
  const cargosSorted = [...cargosData].sort((a, b) =>
    porRankAdesao
      ? b.treinados / b.ativos - a.treinados / a.ativos
      : b.participantes - a.participantes
  );

  const dataPoints = porRankAdesao
    ? cargosSorted.map(c => ({
        label: c.cargo,
        value: c.ativos > 0 ? Math.round((c.treinados / c.ativos) * 100) : 0,
        extra: `${c.treinados}/${c.ativos}`
      }))
    : cargosSorted.map(c => ({
        label: c.cargo,
        value: c.participantes
      }));

  return (
    <div className="bg-white border border-[#e4e8ee] rounded-[6px] shadow-2xs h-full w-full flex flex-col justify-between overflow-hidden relative">
      <div className="flex border-b border-[#e4e8ee] bg-[#fcfdfe] items-center justify-between rounded-t-[6px] overflow-hidden shrink-0">
        <div className="flex">
          {(['Rank Geral', 'Rank Adesão'] as RankTab[]).map(tab => {
            const isActive = rankTab === tab;
            return (
              <button
                key={tab}
                onClick={() => setRankTab(tab)}
                className={`h-[38px] px-3 sm:px-4 border-none text-[12px] sm:text-[12.5px] font-semibold cursor-pointer transition-all border-b-2 ${
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
      </div>

      <div className="flex-1 min-h-0 flex flex-col p-3 sm:p-3.5 overflow-hidden">
        <div className="text-[11.5px] text-[#8a93a0] font-medium mb-1 shrink-0 truncate">
          {porRankAdesao
            ? 'Cargo por percentual de ativos com adesão'
            : 'Cargo por quantidade total de participantes'}
        </div>

        <div className="flex-1 min-h-0 flex flex-col justify-center overflow-hidden">
          <UniversalChartRenderer
            data={dataPoints}
            chartType={chartType}
            unit={porRankAdesao ? '%' : ''}
            legendPrimary={porRankAdesao ? '% Adesão' : 'Participantes'}
            primaryColor="#004e4c"
          />
        </div>
      </div>

      {/* Card Footer: Tipo de gráfico + Ver Detalhes */}
      <div className="shrink-0 pt-2 border-t border-[#f0f3f7] px-4 pb-2.5 flex flex-wrap items-center justify-between gap-2">
        <ChartTypeSelector
          currentType={chartType}
          onChangeType={setChartType}
          direction="up"
        />
        {onVerDetalhes && <VerDetalhesButton onClick={onVerDetalhes} className="mt-0" />}
      </div>
    </div>
  );
};
