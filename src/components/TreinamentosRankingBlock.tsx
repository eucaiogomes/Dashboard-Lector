import React, { useState } from 'react';
import { InternalTraining } from '../types';
import { internalTrainingsData } from '../data/mockData';
import { VerDetalhesButton } from './VerDetalhesButton';
import { ChartTypeSelector, ChartTypeOption } from './ChartTypeSelector';
import { UniversalChartRenderer } from './UniversalChartRenderer';

interface TreinamentosRankingBlockProps {
  treinamentosData?: InternalTraining[];
  onVerDetalhes?: () => void;
}

export const TreinamentosRankingBlock: React.FC<TreinamentosRankingBlockProps> = ({
  treinamentosData = internalTrainingsData,
  onVerDetalhes
}) => {
  const [chartType, setChartType] = useState<ChartTypeOption>('Barra');

  const dataPoints = treinamentosData.map(t => ({
    label: t.nome,
    value: t.horasVal,
    extra: t.horasFormatted
  }));

  return (
    <div className="bg-white border border-[#e4e8ee] rounded-[6px] p-3.5 sm:p-4 shadow-2xs h-full w-full flex flex-col justify-between overflow-hidden relative">
      <div className="shrink-0 pb-1.5 border-b border-[#f0f3f7]">
        <div className="text-[13.5px] sm:text-[14.5px] font-bold text-[#004e4c] truncate">
          Treinamentos
        </div>
        <div className="text-[10.5px] text-[#8a93a0] font-medium truncate">
          Horas treinadas por treinamento interno
        </div>
      </div>

      <div className="flex-1 min-h-0 flex flex-col justify-center overflow-hidden my-1">
        <UniversalChartRenderer
          data={dataPoints}
          chartType={chartType}
          unit="h"
          legendPrimary="Horas Treinadas"
          primaryColor="#004e4c"
        />
      </div>

      {/* Card Footer: Tipo de gráfico + Ver Detalhes */}
      <div className="shrink-0 pt-2 border-t border-[#f0f3f7] flex flex-wrap items-center justify-between gap-2">
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
