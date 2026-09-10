import React, { useState } from 'react';
import { AtivosTab, MonthData } from '../types';
import { monthlyBaseData } from '../data/mockData';
import { VerDetalhesButton } from './VerDetalhesButton';
import { ChartTypeSelector, ChartTypeOption } from './ChartTypeSelector';
import { UniversalChartRenderer } from './UniversalChartRenderer';

interface AtivosTreinadosBlockProps {
  baseData?: MonthData[];
  onVerDetalhes?: () => void;
}

export const AtivosTreinadosBlock: React.FC<AtivosTreinadosBlockProps> = ({
  baseData = monthlyBaseData,
  onVerDetalhes
}) => {
  const [ativosTab, setAtivosTab] = useState<AtivosTab>('Ativos x Treinados');
  const [chartType, setChartType] = useState<ChartTypeOption>('Coluna');

  const last6 = baseData.slice(-6);
  const porAdesao = ativosTab === 'Adesão';

  const dataPoints = porAdesao
    ? last6.map(s => ({
        label: s.mesAno,
        value: s.ativos > 0 ? Math.round((s.colabTreinados / s.ativos) * 100) : 0
      }))
    : last6.map(s => ({
        label: s.mesAno,
        value: s.colabTreinados,
        valueSecondary: s.ativos
      }));

  return (
    <div className="bg-white border border-[#e4e8ee] rounded-[6px] shadow-2xs h-full w-full flex flex-col justify-between overflow-hidden relative">
      <div className="flex border-b border-[#e4e8ee] bg-[#fcfdfe] items-center justify-between rounded-t-[6px] overflow-hidden shrink-0">
        <div className="flex">
          {(['Ativos x Treinados', 'Adesão'] as AtivosTab[]).map(tab => {
            const isActive = ativosTab === tab;
            return (
              <button
                key={tab}
                onClick={() => setAtivosTab(tab)}
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
          {porAdesao
            ? 'Percentual de colaboradores ativos treinados por mês'
            : 'Colaboradores ativos e treinados por mês'}
        </div>

        <div className="flex-1 min-h-0 flex flex-col justify-center overflow-hidden">
          <UniversalChartRenderer
            data={dataPoints}
            chartType={chartType}
            unit={porAdesao ? '%' : ''}
            legendPrimary="Treinados"
            legendSecondary="Ativos"
            primaryColor="#004e4c"
            secondaryColor="#cde3bb"
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
