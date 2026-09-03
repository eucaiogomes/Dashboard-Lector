import React, { useState } from 'react';
import { turmasExecucaoData } from '../data/turmasExecucaoData';
import { VerDetalhesButton } from './VerDetalhesButton';

interface TurmasExecucaoDonutBlockProps {
  onVerDetalhes?: () => void;
}

const STATUS_COLORS = {
  realizado: '#0f6b3f',
  agendado: '#d99a24',
  naoRealizado: '#a32020'
};

const SIZE = 172;
const STROKE = 24;
const RADIUS = (SIZE - STROKE) / 2;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

/**
 * Execução das turmas por período — donut chart with the realization percentage front and
 * center, a legend for Realizado/Agendado/Não Realizado, and a Mês/Ano filter that swaps
 * the whole dataset to the selected month.
 */
export const TurmasExecucaoDonutBlock: React.FC<TurmasExecucaoDonutBlockProps> = ({ onVerDetalhes }) => {
  const [selectedMonth, setSelectedMonth] = useState(
    turmasExecucaoData[turmasExecucaoData.length - 1].mesAno
  );

  const current =
    turmasExecucaoData.find(d => d.mesAno === selectedMonth) ??
    turmasExecucaoData[turmasExecucaoData.length - 1];

  const pct = current.previsto > 0 ? (current.realizado / current.previsto) * 100 : 0;
  const pctLabel = pct.toFixed(1).replace('.', ',');

  const segments: { key: keyof typeof STATUS_COLORS; label: string; value: number }[] = [
    { key: 'realizado', label: 'Realizado', value: current.realizado },
    { key: 'agendado', label: 'Agendado', value: current.agendado },
    { key: 'naoRealizado', label: 'Não Realizado', value: current.naoRealizado }
  ];

  let cumulative = 0;

  return (
    <div className="h-full w-full bg-white rounded-[6px] border border-[#e0e5eb] shadow-2xs p-5 flex flex-col">
      {/* Header: title + Mês/Ano filter */}
      <div className="flex items-start justify-between gap-3 pb-3 border-b border-[#f0f3f7] shrink-0">
        <div>
          <h2 className="text-[15.5px] font-bold text-[#004e4c] tracking-tight">
            Execução das Turmas por Período
          </h2>
          <p className="text-[11px] text-[#6b7684] mt-0.5 font-medium">
            Distribuição das turmas previstas por status
          </p>
        </div>

        <div className="relative shrink-0">
          <select
            value={selectedMonth}
            onChange={e => setSelectedMonth(e.target.value)}
            className="h-[28px] pl-2.5 pr-7 bg-[#f8fafc] hover:bg-[#f1f5f9] border border-[#cfd6e0] rounded text-[11.5px] text-[#334155] font-semibold appearance-none cursor-pointer outline-none focus:border-[#004e4c] transition-colors"
            title="Selecionar Mês/Ano"
          >
            {turmasExecucaoData.map(d => (
              <option key={d.mesAno} value={d.mesAno}>
                {d.mesAno}
              </option>
            ))}
          </select>
          <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-[#f47920] text-[9px]">
            <i className="icon-pointer-down"></i>
          </div>
        </div>
      </div>

      {/* Body: donut + stats */}
      <div className="flex-1 min-h-0 flex flex-wrap items-center justify-center gap-x-8 gap-y-5 py-4">
        {/* Donut */}
        <div className="relative shrink-0" style={{ width: SIZE, height: SIZE }}>
          <svg width={SIZE} height={SIZE} viewBox={`0 0 ${SIZE} ${SIZE}`}>
            <g transform={`rotate(-90 ${SIZE / 2} ${SIZE / 2})`}>
              {segments.map(seg => {
                const segLength = (seg.value / current.previsto) * CIRCUMFERENCE;
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
                    stroke={STATUS_COLORS[seg.key]}
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

          {/* Center label: realization percentage */}
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <div className="text-[27px] font-extrabold text-[#004e4c] leading-none">
              {pctLabel}%
            </div>
            <div className="text-[11px] font-bold text-[#6b7684] mt-1.5 tracking-wide">
              Realização
            </div>
          </div>
        </div>

        {/* Stats: total previsto + legend */}
        <div className="flex flex-col gap-4 min-w-[168px]">
          <div>
            <div className="text-[32px] font-extrabold text-[#004e4c] leading-none">
              {current.previsto}
            </div>
            <div className="text-[12px] font-semibold text-[#8a93a0] mt-1">
              Turmas Previstas
            </div>
          </div>

          <div className="flex flex-col gap-2 pt-3 border-t border-[#f0f3f7]">
            {segments.map(seg => (
              <div key={seg.key} className="flex items-center justify-between gap-4 text-[13px]">
                <span className="flex items-center gap-2 text-[#334155] font-medium">
                  <span
                    className="w-2.5 h-2.5 rounded-full shrink-0"
                    style={{ background: STATUS_COLORS[seg.key] }}
                  ></span>
                  {seg.label}
                </span>
                <span className="font-bold text-[#004e4c]">{seg.value}</span>
              </div>
            ))}
          </div>

          {onVerDetalhes && <VerDetalhesButton onClick={onVerDetalhes} />}
        </div>
      </div>
    </div>
  );
};
