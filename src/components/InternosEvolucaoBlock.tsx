import React, { useState } from 'react';
import { MetricaType, MonthData } from '../types';
import { monthlyBaseData } from '../data/mockData';
import { VerDetalhesButton } from './VerDetalhesButton';
import { ChartTypeSelector, ChartTypeOption } from './ChartTypeSelector';
import { UniversalChartRenderer } from './UniversalChartRenderer';

interface InternosEvolucaoBlockProps {
  baseData?: MonthData[];
  onVerDetalhes?: () => void;
}

export const InternosEvolucaoBlock: React.FC<InternosEvolucaoBlockProps> = ({
  baseData = monthlyBaseData,
  onVerDetalhes
}) => {
  const [metrica, setMetrica] = useState<MetricaType>('Qtd. Colab. Treinados');
  const [chartType, setChartType] = useState<ChartTypeOption>('Coluna');

  const metricas: MetricaType[] = [
    'Qtd. Colab. Treinados',
    'Qtd. Horas Treinadas',
    'Qtd. Total Participantes',
    'Qtd. Treinamentos Internos'
  ];

  const getMetricValue = (m: MonthData): number => {
    switch (metrica) {
      case 'Qtd. Colab. Treinados':
        return m.colabTreinados;
      case 'Qtd. Horas Treinadas':
        return m.horasTreinadas;
      case 'Qtd. Total Participantes':
        return m.totalParticipantes;
      case 'Qtd. Treinamentos Internos':
        return m.qtdTreinamentos;
    }
  };

  const unit = metrica === 'Qtd. Horas Treinadas' ? 'h' : '';

  const dataPoints = baseData.map(m => ({
    label: m.mesAno,
    value: getMetricValue(m)
  }));

  return (
    <div className="bg-white border border-[#e4e8ee] rounded-[6px] p-3.5 sm:p-4 shadow-2xs h-full w-full flex flex-col justify-between overflow-hidden relative">
      <div className="shrink-0 pb-2 border-b border-[#f0f3f7]">
        <div className="flex flex-wrap items-center justify-between gap-1.5">
          <div className="flex items-center gap-1.5 min-w-0">
            <div className="text-[13.5px] sm:text-[14.5px] font-bold text-[#004e4c] truncate">
              Evolução
            </div>
            <span className="text-[10.5px] text-[#8a93a0] font-medium hidden sm:inline truncate">
              — {metrica}
            </span>
          </div>

          {/* Metric pills */}
          <div className="flex flex-wrap gap-1 justify-end">
            {metricas.map(m => {
              const isActive = metrica === m;
              return (
                <button
                  key={m}
                  onClick={() => setMetrica(m)}
                  className={`h-[22px] px-1.5 text-[10.5px] font-semibold rounded-[3px] cursor-pointer transition-all border ${
                    isActive
                      ? 'bg-[#004e4c] text-[#eef7f4] border-[#004e4c]'
                      : 'bg-white text-[#4a5462] border-[#dfe4ea] hover:border-[#004e4c]'
                  }`}
                >
                  {m.replace('Qtd. ', '')}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="flex-1 min-h-0 flex flex-col justify-center overflow-hidden my-1">
        <UniversalChartRenderer
          data={dataPoints}
          chartType={chartType}
          unit={unit}
          legendPrimary={metrica}
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
