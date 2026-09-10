import React, { useState } from 'react';
import { MonthData } from '../types';
import { monthlyBaseData } from '../data/mockData';
import { VerDetalhesButton } from './VerDetalhesButton';
import { ChartTypeSelector, ChartTypeOption } from './ChartTypeSelector';
import { UniversalChartRenderer } from './UniversalChartRenderer';

interface InstitucionaisPercentualBlockProps {
  baseData?: MonthData[];
  onVerDetalhes?: () => void;
}

export const InstitucionaisPercentualBlock: React.FC<InstitucionaisPercentualBlockProps> = ({
  baseData = monthlyBaseData,
  onVerDetalhes
}) => {
  const [chartType, setChartType] = useState<ChartTypeOption>('Coluna');

  const dataPercentual = baseData.map(m => {
    const pct = m.previsto > 0 ? Math.round((m.realizado / m.previsto) * 100) : 0;
    const color = pct >= 100 ? '#004e4c' : pct >= 50 ? '#1f8f78' : '#a9d68f';
    return {
      label: m.mesAno,
      value: pct,
      color
    };
  });

  return (
    <div className="bg-white border border-[#e4e8ee] rounded-[6px] p-3.5 sm:p-4 shadow-2xs h-full w-full flex flex-col justify-between overflow-hidden relative">
      <div className="pb-2 border-b border-[#f0f3f7] shrink-0">
        <div className="text-[13.5px] sm:text-[14.5px] font-bold text-[#004e4c] truncate">
          Evolução — Percentual de Realização
        </div>
      </div>

      <div className="flex-1 min-h-0 flex flex-col justify-center overflow-hidden my-1">
        <UniversalChartRenderer
          data={dataPercentual}
          chartType={chartType}
          unit="%"
          legendPrimary="% Realizado"
          primaryColor="#004e4c"
        />
      </div>

      {/* Card Footer: Tipo de gráfico + Ver Detalhes */}
      <div className="pt-2 border-t border-[#f0f3f7] flex flex-wrap items-center justify-between gap-2 shrink-0">
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
