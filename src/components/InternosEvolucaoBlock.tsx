import React, { useState } from 'react';
import { MetricaType, MonthData } from '../types';
import { monthlyBaseData } from '../data/mockData';
import { VerDetalhesButton } from './VerDetalhesButton';

interface InternosEvolucaoBlockProps {
  onVerDetalhes?: () => void;
}

/**
 * Exact copy of the "Evolução" (metric switcher) card from InternosView (Indicadores T&D →
 * Treinamentos Internos) — same markup and logic, unchanged, just relocated so it can be
 * added as a single widget on the Dashboard.
 */
export const InternosEvolucaoBlock: React.FC<InternosEvolucaoBlockProps> = ({ onVerDetalhes }) => {
  const baseData = monthlyBaseData;

  const [metrica, setMetrica] = useState<MetricaType>('Qtd. Colab. Treinados');

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

  const metricValues = baseData.map(getMetricValue);
  const maxMetric = Math.max(...metricValues);

  return (
    <div className="bg-white border border-[#e4e8ee] rounded-[6px] p-4 px-5 pb-3.5 shadow-2xs">
      <div className="flex flex-wrap items-start justify-between gap-2.5">
        <div className="text-[15px] font-bold text-[#004e4c]">
          Evolução
        </div>
        <div className="flex flex-wrap gap-1.5 justify-end">
          {metricas.map(m => {
            const isActive = metrica === m;
            return (
              <button
                key={m}
                onClick={() => setMetrica(m)}
                className={`h-[26px] px-2.5 text-[11.5px] font-semibold rounded-[3px] cursor-pointer transition-all border ${
                  isActive
                    ? 'bg-[#004e4c] text-[#eef7f4] border-[#004e4c]'
                    : 'bg-white text-[#4a5462] border-[#dfe4ea] hover:border-[#004e4c]'
                }`}
              >
                {m}
              </button>
            );
          })}
        </div>
      </div>

      <div className="text-[12.5px] text-[#8a93a0] mt-0.5 font-medium">
        {metrica} por MêsAno
      </div>

      <div className="mt-3.5 grid grid-cols-12 gap-1.5 items-end h-[200px]">
        {baseData.map((m, i) => {
          const val = getMetricValue(m);
          const heightPct = (val / maxMetric) * 100;
          const labelStr =
            val >= 1000
              ? (val / 1000).toFixed(1).replace('.', ',') + 'k'
              : String(val);

          return (
            <div
              key={i}
              className="h-full flex flex-col justify-end items-center gap-1 group"
            >
              <div className="text-[10.5px] font-bold text-[#004e4c] leading-tight group-hover:scale-105 transition-transform">
                {labelStr}
              </div>
              <div
                className="w-full max-w-[34px] bg-[#004e4c] rounded-t-[3px] transition-all group-hover:bg-[#00706c]"
                style={{ height: `${heightPct}%` }}
                title={`${m.mesAno}: ${val.toLocaleString('pt-BR')}`}
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
