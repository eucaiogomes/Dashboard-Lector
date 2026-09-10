import React, { useState } from 'react';
import { turmasExecucaoData } from '../data/turmasExecucaoData';
import { VerDetalhesButton } from './VerDetalhesButton';
import { ChartTypeSelector, ChartTypeOption } from './ChartTypeSelector';
import { UniversalChartRenderer } from './UniversalChartRenderer';

interface TurmasExecucaoDonutBlockProps {
  onVerDetalhes?: () => void;
}

const STATUS_COLORS = {
  realizado: '#0f6b3f',
  agendado: '#d99a24',
  naoRealizado: '#a32020'
};

const SIZE = 140;
const STROKE = 20;
const RADIUS = (SIZE - STROKE) / 2;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

export const TurmasExecucaoDonutBlock: React.FC<TurmasExecucaoDonutBlockProps> = ({ onVerDetalhes }) => {
  const [chartType, setChartType] = useState<ChartTypeOption>('Pizza');
  const [selectedMonth, setSelectedMonth] = useState(
    turmasExecucaoData[turmasExecucaoData.length - 1].mesAno
  );

  const current =
    turmasExecucaoData.find(d => d.mesAno === selectedMonth) ??
    turmasExecucaoData[turmasExecucaoData.length - 1];

  const pct = current.previsto > 0 ? (current.realizado / current.previsto) * 100 : 0;
  const pctLabel = pct.toFixed(1).replace('.', ',');

  const segments: { key: keyof typeof STATUS_COLORS; label: string; value: number; color: string }[] = [
    { key: 'realizado', label: 'Realizado', value: current.realizado, color: STATUS_COLORS.realizado },
    { key: 'agendado', label: 'Agendado', value: current.agendado, color: STATUS_COLORS.agendado },
    { key: 'naoRealizado', label: 'Não Realizado', value: current.naoRealizado, color: STATUS_COLORS.naoRealizado }
  ];

  let cumulative = 0;

  return (
    <div className="h-full w-full bg-white rounded-[6px] border border-[#e0e5eb] shadow-2xs p-3.5 sm:p-4 flex flex-col justify-between overflow-hidden relative">
      {/* Header: title + Mês/Ano filter */}
      <div className="flex items-center justify-between gap-2 pb-2 border-b border-[#f0f3f7] shrink-0">
        <div className="min-w-0 flex-1">
          <h2 className="text-[14px] sm:text-[15px] font-bold text-[#004e4c] tracking-tight truncate">
            Execução das Turmas por Período
          </h2>
          <p className="text-[10.5px] text-[#6b7684] font-medium truncate">
            Distribuição das turmas previstas por status
          </p>
        </div>

        <div className="relative shrink-0">
          <select
            value={selectedMonth}
            onChange={e => setSelectedMonth(e.target.value)}
            className="h-[26px] pl-2 pr-6 bg-[#f8fafc] hover:bg-[#f1f5f9] border border-[#cfd6e0] rounded text-[11px] text-[#334155] font-semibold appearance-none cursor-pointer outline-none focus:border-[#004e4c] transition-colors"
            title="Selecionar Mês/Ano"
          >
            {turmasExecucaoData.map(d => (
              <option key={d.mesAno} value={d.mesAno}>
                {d.mesAno}
              </option>
            ))}
          </select>
          <div className="absolute right-1.5 top-1/2 -translate-y-1/2 pointer-events-none text-[#f47920] text-[8px]">
            <i className="icon-pointer-down"></i>
          </div>
        </div>
      </div>

      {/* Body: custom Donut if Pizza, or UniversalChartRenderer if Barra/Coluna/Linha */}
      <div className="flex-1 min-h-0 flex flex-col justify-center overflow-hidden my-1">
        {chartType === 'Pizza' ? (
          <div className="flex items-center justify-around gap-3 sm:gap-6 w-full h-full py-1">
            {/* Donut Graphic */}
            <div className="relative shrink-0 flex items-center justify-center">
              <svg width={SIZE} height={SIZE} viewBox={`0 0 ${SIZE} ${SIZE}`} className="max-h-[130px] w-auto aspect-square">
                <g transform={`rotate(-90 ${SIZE / 2} ${SIZE / 2})`}>
                  {segments.map(seg => {
                    const segLength = (seg.value / (current.previsto || 1)) * CIRCUMFERENCE;
                    const dashArray = `${segLength} ${CIRCUMFERENCE - segLength}`;
                    const dashOffset = -cumulative;
                    cumulative += segLength;
                    return (
                      <circle
                        key={seg.key}
                        cx={SIZE / 2}
                        cy={SIZE / 2}
                        r={RADIUS}
                        fill="none"
                        stroke={seg.color}
                        strokeWidth={STROKE}
                        strokeDasharray={dashArray}
                        strokeDashoffset={dashOffset}
                      >
                        <title>{`${seg.label}: ${seg.value}`}</title>
                      </circle>
                    );
                  })}
                </g>
              </svg>

              {/* Center label */}
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <div className="text-[20px] sm:text-[23px] font-extrabold text-[#004e4c] leading-none">
                  {pctLabel}%
                </div>
                <div className="text-[9.5px] font-bold text-[#6b7684] mt-0.5 tracking-wide">
                  Realização
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="flex flex-col gap-2 min-w-[140px] max-w-[200px]">
              <div>
                <div className="text-[24px] sm:text-[28px] font-extrabold text-[#004e4c] leading-none">
                  {current.previsto}
                </div>
                <div className="text-[11px] font-semibold text-[#8a93a0] mt-0.5">
                  Turmas Previstas
                </div>
              </div>

              <div className="flex flex-col gap-1.5 pt-1.5 border-t border-[#f0f3f7]">
                {segments.map(seg => (
                  <div key={seg.key} className="flex items-center justify-between gap-3 text-[11.5px]">
                    <span className="flex items-center gap-1.5 text-[#334155] font-medium truncate">
                      <span
                        className="w-2 h-2 rounded-full shrink-0"
                        style={{ background: seg.color }}
                      ></span>
                      <span className="truncate">{seg.label}</span>
                    </span>
                    <span className="font-bold text-[#004e4c] font-mono shrink-0">{seg.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="w-full h-full flex-1 min-h-0 flex items-center">
            <UniversalChartRenderer
              data={segments.map(s => ({
                label: s.label,
                value: s.value,
                color: s.color
              }))}
              chartType={chartType}
              unit="turmas"
              legendPrimary="Turmas"
              primaryColor="#004e4c"
            />
          </div>
        )}
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
