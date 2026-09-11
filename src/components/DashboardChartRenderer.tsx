import React, { useRef, useMemo, useState } from 'react';
import { motion, useInView } from 'motion/react';
import { DashboardCardItem } from '../data/dashboardCatalog';
import { DonutChart } from './DonutChart';

interface DashboardChartRendererProps {
  card: DashboardCardItem;
}

/** Unique gradient id per card instance to avoid SVG id collisions when
 *  multiple line charts are rendered on the same page. */
const useUniqueId = (prefix: string) =>
  useMemo(() => `${prefix}_${Math.random().toString(36).slice(2, 9)}`, [prefix]);

export const DashboardChartRenderer: React.FC<DashboardChartRendererProps> = ({ card }) => {
  const { chartType, data, ticks = [], maxScale = 100, meta } = card;

  // Shared ref for viewport-triggered animations
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, amount: 0.15 });
  const [hoverIdx, setHoverIdx] = useState<number | null>(null);
  // Hooks must run unconditionally on every render (Rules of Hooks) — this was previously
  // called only inside the "Linha" branch below, so switching chartType to/from Linha on the
  // same card changed the number of hooks called and crashed React ("Rendered more hooks
  // than during the previous render").
  const gradientId = useUniqueId('lineGrad');

  // 1. Horizontal Bar Chart
  if (chartType === 'Barra') {
    const hasSecondary = data.some(d => d.valueSecondary !== undefined);

    return (
      <div ref={containerRef} className="w-full h-full py-2 flex flex-col">
        {/* Legend if secondary exists */}
        {hasSecondary && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.4 }}
            className="flex items-center justify-end gap-4 text-[11px] text-[#6b7684] mb-3 pr-2 shrink-0"
          >
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-xs bg-[#004e4c]"></span>
              <span>{meta?.legendPrimary || 'Realizado'}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-xs bg-[#cde3bb]"></span>
              <span>{meta?.legendSecondary || 'Previsto'}</span>
            </div>
          </motion.div>
        )}

        <div className="relative w-full flex-1 min-h-0 flex flex-col">
          {/* Ticks and Grid lines */}
          <div className="ml-[120px] relative flex-1 min-h-[100px]">
            <div className="absolute inset-0 flex justify-between pointer-events-none">
              {ticks.map((tick, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0 }}
                  animate={isInView ? { opacity: 1 } : {}}
                  transition={{ delay: 0.2 + idx * 0.06, duration: 0.35 }}
                  className="h-full border-r border-[#e8ecf1] last:border-r-0 relative"
                >
                  <span className="absolute -bottom-5 -translate-x-1/2 text-[10.5px] text-[#606d80] font-normal">
                    {tick}
                  </span>
                </motion.div>
              ))}
            </div>

            {/* Bars */}
            <div className="absolute inset-0 flex flex-col justify-around py-1 z-10 space-y-1.5">
              {data.map((item, idx) => {
                const widthPct = Math.min(100, Math.max(1, (item.value / maxScale) * 100));
                const widthSecPct = item.valueSecondary !== undefined
                  ? Math.min(100, Math.max(1, (item.valueSecondary / maxScale) * 100))
                  : 0;

                return (
                  <motion.div
                    key={item.label}
                    initial={{ opacity: 0, x: -20 }}
                    animate={isInView ? { opacity: 1, x: 0 } : {}}
                    transition={{ delay: 0.1 + idx * 0.08, duration: 0.4, ease: 'easeOut' }}
                    className="flex flex-col justify-center relative min-h-[26px]"
                  >
                    {/* Label aligned left */}
                    <div
                      className="absolute -left-[120px] w-[110px] text-right text-[12px] text-[#4a5462] font-medium pr-2.5 truncate"
                      title={item.label}
                    >
                      {item.label}
                    </div>

                    {/* Bars Container */}
                    <div className="relative w-full flex flex-col gap-0.5">
                      {item.valueSecondary !== undefined ? (
                        <>
                          {/* Secondary bar (Previsto) */}
                          <motion.div
                            initial={{ width: 0 }}
                            animate={isInView ? { width: `${widthSecPct}%` } : { width: 0 }}
                            transition={{
                              delay: 0.25 + idx * 0.1,
                              duration: 0.7,
                              ease: [0.25, 0.46, 0.45, 0.94]
                            }}
                            className="h-3 rounded-xs bg-[#cde3bb] group relative overflow-hidden"
                          >
                            <span className="opacity-0 group-hover:opacity-100 transition-opacity absolute -top-5 right-0 bg-[#4a5462] text-white text-[9.5px] px-1 py-0.5 rounded pointer-events-none whitespace-nowrap z-20">
                              Previsto: {item.valueSecondary} {card.unit || ''}
                            </span>
                          </motion.div>
                          {/* Primary bar (Realizado) */}
                          <motion.div
                            initial={{ width: 0 }}
                            animate={isInView ? { width: `${widthPct}%` } : { width: 0 }}
                            transition={{
                              delay: 0.35 + idx * 0.1,
                              duration: 0.7,
                              ease: [0.25, 0.46, 0.45, 0.94]
                            }}
                            className="h-4 rounded-xs shadow-2xs group relative overflow-hidden"
                            style={{ backgroundColor: item.color || '#004e4c' }}
                          >
                            <span className="opacity-0 group-hover:opacity-100 transition-opacity absolute -top-5 right-0 bg-[#004e4c] text-white text-[9.5px] px-1 py-0.5 rounded pointer-events-none whitespace-nowrap z-20">
                              Realizado: {item.value} {card.unit || ''}
                            </span>
                          </motion.div>
                        </>
                      ) : (
                        <motion.div
                          initial={{ width: 0 }}
                          animate={isInView ? { width: `${widthPct}%` } : { width: 0 }}
                          transition={{
                            delay: 0.2 + idx * 0.1,
                            duration: 0.7,
                            ease: [0.25, 0.46, 0.45, 0.94]
                          }}
                          className="h-6 rounded-[2px] shadow-2xs group relative flex items-center justify-end pr-1.5 overflow-hidden"
                          style={{ backgroundColor: item.color || '#004e4c' }}
                        >
                          {widthPct > 20 && (
                            <motion.span
                              initial={{ opacity: 0 }}
                              animate={isInView ? { opacity: 1 } : {}}
                              transition={{ delay: 0.7 + idx * 0.1, duration: 0.3 }}
                              className="text-white text-[10.5px] font-bold drop-shadow-xs relative z-10"
                            >
                              {item.value} {card.unit === '%' ? '%' : ''}
                            </motion.span>
                          )}
                          <div className="opacity-0 group-hover:opacity-100 transition-opacity absolute -top-6 right-0 bg-[#004e4c] text-white text-[10px] font-bold px-1.5 py-0.5 rounded shadow pointer-events-none whitespace-nowrap z-30">
                            {item.value} {card.unit || ''}
                          </div>
                        </motion.div>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
          <motion.div
            initial={{ scaleX: 0 }}
            animate={isInView ? { scaleX: 1 } : {}}
            transition={{ delay: 0.6, duration: 0.5 }}
            style={{ transformOrigin: 'left' }}
            className="ml-[120px] border-b border-[#cbd5e1] mt-6 shrink-0"
          />
        </div>
      </div>
    );
  }

  // 2. Vertical Column Chart
  if (chartType === 'Coluna') {
    const hasSecondary = data.some(d => d.valueSecondary !== undefined);

    return (
      <div ref={containerRef} className="w-full h-full py-2 flex flex-col justify-between">
        {/* Header Legend if secondary exists */}
        {hasSecondary && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.4 }}
            className="flex items-center justify-end gap-4 text-[11px] text-[#6b7684] mb-1 pr-2 shrink-0"
          >
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-xs bg-[#004e4c]"></span>
              <span>{meta?.legendPrimary || 'Realizado'}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-xs bg-[#cde3bb]"></span>
              <span>{meta?.legendSecondary || 'Previsto'}</span>
            </div>
          </motion.div>
        )}

        <div
          className="flex-1 min-h-0 flex items-end justify-around gap-2 px-3 border-b border-[#cbd5e1] pb-2 relative"
          onMouseLeave={() => setHoverIdx(null)}
        >
          {data.map((item, idx) => {
            const hPct = Math.min(100, Math.max(4, (item.value / maxScale) * 100));
            const hSecPct = item.valueSecondary !== undefined
              ? Math.min(100, Math.max(4, (item.valueSecondary / maxScale) * 100))
              : 0;
            const barColor = item.color || '#004e4c';
            const isHovered = hoverIdx === idx;

            return (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.1 + idx * 0.06, duration: 0.4, ease: 'easeOut' }}
                className="flex flex-col items-center justify-end h-full flex-1 max-w-[60px] group"
              >
                <motion.span
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={isInView ? { opacity: 1, scale: 1 } : {}}
                  transition={{ delay: 0.5 + idx * 0.08, duration: 0.3, type: 'spring', stiffness: 300 }}
                  className="text-[10px] font-bold text-[#004e4c] mb-1 group-hover:scale-110 transition-transform"
                >
                  {item.value}
                </motion.span>

                <div className="w-full flex items-end justify-center gap-1 flex-1 min-h-0">
                  {item.valueSecondary !== undefined && (
                    <motion.div
                      initial={{ height: 0 }}
                      animate={isInView ? { height: `${hSecPct}%` } : { height: 0 }}
                      transition={{
                        delay: 0.2 + idx * 0.08,
                        duration: 0.65,
                        ease: [0.25, 0.46, 0.45, 0.94]
                      }}
                      className="w-1/2 max-w-[14px] bg-[#cde3bb] rounded-t-[2px] hover:opacity-80 relative overflow-hidden"
                      title={`Previsto: ${item.valueSecondary}`}
                    />
                  )}
                  <motion.div
                    initial={{ height: 0 }}
                    animate={isInView ? { height: `${hPct}%` } : { height: 0 }}
                    transition={{
                      delay: 0.3 + idx * 0.08,
                      duration: 0.65,
                      ease: [0.25, 0.46, 0.45, 0.94]
                    }}
                    className={`${item.valueSecondary !== undefined ? 'w-1/2 max-w-[14px]' : 'w-full max-w-[28px]'} rounded-t-[3px] shadow-2xs relative overflow-visible transition-[background]`}
                    style={{ background: isHovered ? barColor : `linear-gradient(180deg, ${barColor} 0%, ${barColor}77 100%)` }}
                    onMouseEnter={() => setHoverIdx(idx)}
                    onFocus={() => setHoverIdx(idx)}
                    tabIndex={0}
                    role="img"
                    aria-label={`${item.label}: ${item.value}`}
                  >
                    {isHovered && (
                      <div
                        className={`absolute left-1/2 -translate-x-1/2 z-10 pointer-events-none ${
                          hPct > 75 ? 'top-2' : 'bottom-full mb-2'
                        }`}
                      >
                        <div className="bg-[#004e4c] text-white rounded-lg shadow-lg px-3 py-2 whitespace-nowrap">
                          <div className="text-[11px] font-bold mb-1">{item.label}</div>
                          <div className="flex items-center gap-1.5 text-[11px]">
                            <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: barColor }} />
                            <span className="tabular-nums font-semibold">
                              {item.value.toLocaleString('pt-BR')} {(meta?.legendPrimary || 'Realizado').toLowerCase()}
                            </span>
                          </div>
                        </div>
                      </div>
                    )}
                  </motion.div>
                </div>

                <motion.span
                  initial={{ opacity: 0 }}
                  animate={isInView ? { opacity: 1 } : {}}
                  transition={{ delay: 0.6 + idx * 0.06, duration: 0.3 }}
                  className="text-[10px] text-[#4a5462] mt-1.5 font-medium truncate w-full text-center"
                  title={item.label}
                >
                  {item.label}
                </motion.span>
              </motion.div>
            );
          })}
        </div>
      </div>
    );
  }

  // 3. Line Chart
  if (chartType === 'Linha') {
    const hasSecondary = data.some(d => d.valueSecondary !== undefined);
    const totalPoints = data.length;
    const valuesPrimary = data.map(d => d.value);
    const valuesSecondary = data.map(d => d.valueSecondary ?? 0);
    const minVal = Math.min(...valuesPrimary, ...valuesSecondary, 0);
    const maxVal = Math.max(...valuesPrimary, ...valuesSecondary, maxScale);
    const range = maxVal - minVal || 1;

    // SVG coordinates
    const width = 450;
    const height = 140;
    const paddingX = 35;
    const paddingY = 20;

    const points = data.map((d, idx) => {
      const x = paddingX + (idx / (totalPoints - 1 || 1)) * (width - paddingX * 2);
      const y = height - paddingY - ((d.value - minVal) / range) * (height - paddingY * 2);
      return { x, y, ...d };
    });

    const pointsSecondary = hasSecondary
      ? data.map((d, idx) => {
          const sec = d.valueSecondary ?? 0;
          const x = paddingX + (idx / (totalPoints - 1 || 1)) * (width - paddingX * 2);
          const y = height - paddingY - ((sec - minVal) / range) * (height - paddingY * 2);
          return { x, y, value: sec, label: d.label };
        })
      : [];

    const pathD = points.reduce((acc, p, idx) => {
      return idx === 0 ? `M ${p.x},${p.y}` : `${acc} L ${p.x},${p.y}`;
    }, '');

    const pathSecondary = hasSecondary
      ? pointsSecondary.reduce((acc, p, idx) => {
          return idx === 0 ? `M ${p.x},${p.y}` : `${acc} L ${p.x},${p.y}`;
        }, '')
      : '';

    return (
      <div ref={containerRef} className="w-full h-full py-2 flex flex-col justify-between">
        {hasSecondary && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.4 }}
            className="flex items-center justify-end gap-4 text-[11px] text-[#6b7684] mb-1 pr-2 shrink-0"
          >
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-0.5 bg-[#84cc16]"></span>
              <span>{meta?.legendSecondary || 'Previsto'}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-0.5 bg-[#004e4c]"></span>
              <span>{meta?.legendPrimary || 'Realizado'}</span>
            </div>
          </motion.div>
        )}
        <div className="relative w-full flex-1 min-h-[100px] flex items-center justify-center">
          <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full overflow-visible">
            {/* Grid horizontal lines */}
            {[0.25, 0.5, 0.75, 1].map((ratio, idx) => {
              const yPos = height - paddingY - ratio * (height - paddingY * 2);
              return (
                <motion.line
                  key={ratio}
                  x1={paddingX}
                  y1={yPos}
                  x2={width - paddingX}
                  y2={yPos}
                  stroke="#e2e8f0"
                  strokeDasharray="3 3"
                  initial={{ opacity: 0 }}
                  animate={isInView ? { opacity: 1 } : {}}
                  transition={{ delay: 0.1 + idx * 0.08, duration: 0.3 }}
                />
              );
            })}

            <defs>
              <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#f47920" />
                <stop offset="100%" stopColor="#004e4c" />
              </linearGradient>
            </defs>

            {/* Área + linhas sobem juntas de baixo para cima, ancoradas na base do gráfico —
                em vez de a linha se desenhar da esquerda para a direita. */}
            <motion.g
              initial={{ scaleY: 0 }}
              animate={isInView ? { scaleY: 1 } : {}}
              transition={{ delay: 0.1, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              style={{ transformOrigin: 'bottom' }}
            >
              {/* Area gradient under curve */}
              <path
                d={`${pathD} L ${points[points.length - 1]?.x || width},${height - paddingY} L ${points[0]?.x || 0},${height - paddingY} Z`}
                fill={`url(#${gradientId})`}
                opacity={0.25}
              />

              {/* Secondary line if available */}
              {hasSecondary && pathSecondary && (
                <path
                  d={pathSecondary}
                  fill="none"
                  stroke="#84cc16"
                  strokeWidth="2"
                  strokeDasharray="4 3"
                  strokeLinecap="round"
                />
              )}

              {/* Line Path */}
              <path
                d={pathD}
                fill="none"
                stroke="#004e4c"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </motion.g>

            {/* Secondary Points */}
            {hasSecondary &&
              pointsSecondary.map((p, idx) => (
                <g key={`sec-${idx}`} className="group cursor-pointer">
                  <motion.circle
                    cx={p.x}
                    cy={p.y}
                    r="4"
                    fill="#84cc16"
                    stroke="#ffffff"
                    strokeWidth="1.5"
                    initial={{ scale: 0, opacity: 0 }}
                    animate={isInView ? { scale: 1, opacity: 1 } : {}}
                    transition={{
                      delay: 0.75 + idx * 0.05,
                      duration: 0.3,
                      type: 'spring'
                    }}
                  />
                  <title>{`${p.label} — ${meta?.legendSecondary || 'Previsto'}: ${p.value}`}</title>
                </g>
              ))}

            {/* Points & Values */}
            {points.map((p, idx) => (
              <g key={idx} className="group cursor-pointer">
                <motion.circle
                  cx={p.x}
                  cy={p.y}
                  r="5"
                  fill={p.color || '#f47920'}
                  stroke="#ffffff"
                  strokeWidth="2"
                  initial={{ scale: 0, opacity: 0 }}
                  animate={isInView ? { scale: 1, opacity: 1 } : {}}
                  transition={{
                    delay: 0.8 + idx * 0.05,
                    duration: 0.4,
                    type: 'spring',
                    stiffness: 400,
                    damping: 15
                  }}
                  className="group-hover:scale-150 transition-transform"
                  style={{ transformOrigin: `${p.x}px ${p.y}px` }}
                />
                <motion.text
                  x={p.x}
                  y={p.y - 9}
                  textAnchor="middle"
                  fontSize="10"
                  fontWeight="bold"
                  fill="#004e4c"
                  initial={{ opacity: 0, y: p.y - 4 }}
                  animate={isInView ? { opacity: 1, y: p.y - 9 } : {}}
                  transition={{ delay: 0.9 + idx * 0.05, duration: 0.3 }}
                >
                  {p.value}
                </motion.text>
                <motion.text
                  x={p.x}
                  y={height - 2}
                  textAnchor="middle"
                  fontSize="9.5"
                  fill="#64748b"
                  initial={{ opacity: 0 }}
                  animate={isInView ? { opacity: 1 } : {}}
                  transition={{ delay: 0.95 + idx * 0.05, duration: 0.3 }}
                >
                  {p.label}
                </motion.text>
              </g>
            ))}
          </svg>
        </div>
      </div>
    );
  }

  // 4. Donut / Pie Chart
  if (chartType === 'Pizza') {
    const total = data.reduce((acc, d) => acc + d.value, 0) || 1;
    let accumulatedAngle = 0;

    const slices = data.map(d => {
      const pct = (d.value / total) * 100;
      const startAngle = accumulatedAngle;
      accumulatedAngle += pct;
      return {
        ...d,
        pct: Math.round(pct),
        startAngle,
        endAngle: accumulatedAngle
      };
    });

    return (
      <div ref={containerRef} className="w-full h-full py-4 @container">
      <div className="w-full h-full flex flex-col @[380px]:flex-row items-center gap-6 @[380px]:gap-10">
        {/* Donut graphic — mesmo anel (conic-gradient com costura branca) e mesma animação
            de varredura angular (chart-donut-in) usados em todo gráfico Pizza/Rosca do app. */}
        <DonutChart
          slices={slices.map(s => ({ color: s.color || '#004e4c', value: s.value }))}
          showPercentLabels={false}
          outerClassName="w-[150px] h-[150px] @[380px]:w-[180px] @[380px]:h-[180px] @[520px]:w-[204px] @[520px]:h-[204px]"
          holeClassName="w-[84px] h-[84px] @[380px]:w-[101px] @[380px]:h-[101px] @[520px]:w-[115px] @[520px]:h-[115px]"
        >
          <motion.span
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ delay: 0.7, duration: 0.3 }}
            className="text-[20px] @[380px]:text-[22px] @[520px]:text-[24px] font-black text-[#004e4c] leading-none"
          >
            {total}
          </motion.span>
          <motion.span
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ delay: 0.8, duration: 0.3 }}
            className="text-[10px] @[380px]:text-[10.5px] text-[#8a93a0] font-medium uppercase mt-0.5"
          >
            {card.unit || 'Total'}
          </motion.span>
        </DonutChart>

        {/* Legend Breakdown — tabela com categoria, valor e % com barrinha de proporção,
            mesmo padrão usado no gráfico de pizza das telas de Indicadores T&D. */}
        <div className="flex-1 min-h-0 min-w-0 w-full max-w-[380px] overflow-y-auto">
          <div className="grid grid-cols-[minmax(60px,180px)_auto_auto] gap-x-3 text-[9.5px] uppercase tracking-wide text-[#8a93a0] font-bold pb-1.5 border-b border-[#f0f3f7]">
            <span>Categoria</span>
            <span className="text-right">Valor</span>
            <span className="text-right">% do total</span>
          </div>
          <div className="divide-y divide-[#f5f7f9]">
            {slices.map((item, idx) => {
              const barPct = Math.max(4, (item.value / Math.max(...slices.map(s => s.value), 1)) * 100);
              return (
                <motion.div
                  key={item.label}
                  initial={{ opacity: 0, x: 20 }}
                  animate={isInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ delay: 0.4 + idx * 0.08, duration: 0.35, ease: 'easeOut' }}
                  className="grid grid-cols-[minmax(60px,180px)_auto_auto] items-center gap-x-3 py-1.5"
                >
                  <span className="flex items-center gap-1.5 min-w-0 text-[12px] text-[#4a5462] font-medium">
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={isInView ? { scale: 1 } : {}}
                      transition={{ delay: 0.5 + idx * 0.08, duration: 0.25, type: 'spring', stiffness: 400 }}
                      className="w-2 h-2 rounded-full shrink-0"
                      style={{ backgroundColor: item.color || '#004e4c' }}
                    ></motion.span>
                    <span className="truncate" title={item.label}>
                      {item.label}
                    </span>
                  </span>
                  <span className="text-right text-[12px] font-bold text-[#004e4c] tabular-nums">{item.value}</span>
                  <span className="flex items-center gap-1.5 justify-end">
                    <span className="text-[11px] text-[#6b7684] tabular-nums w-[34px] text-right shrink-0">{item.pct}%</span>
                    <span className="w-10 h-1.5 rounded-full bg-[#eef1f5] overflow-hidden hidden sm:block">
                      <span
                        className="chart-grow-w block h-full rounded-full"
                        style={{ width: `${barPct}%`, backgroundColor: item.color || '#004e4c', animationDelay: `${550 + idx * 40}ms` }}
                      />
                    </span>
                  </span>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
      </div>
    );
  }

  // 5. Table / Summary View
  if (chartType === 'Tabela') {
    return (
      <div ref={containerRef} className="w-full h-full py-2 overflow-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <motion.tr
              initial={{ opacity: 0, y: -10 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.35 }}
              className="bg-[#f8fafc] text-[#4a5462] font-semibold border-b border-[#dfe4ea]"
            >
              <th className="py-2 px-3">Item / Categoria</th>
              <th className="py-2 px-3 text-right">Valor Realizado</th>
              {data.some(d => d.valueSecondary !== undefined) && (
                <th className="py-2 px-3 text-right">Meta / Previsto</th>
              )}
              <th className="py-2 px-3 text-center">Status / %</th>
            </motion.tr>
          </thead>
          <tbody className="divide-y divide-[#eef0f3]">
            {data.map((item, idx) => {
              const pct = maxScale ? Math.round((item.value / maxScale) * 100) : 0;
              return (
                <motion.tr
                  key={item.label}
                  initial={{ opacity: 0, x: -15 }}
                  animate={isInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ delay: 0.1 + idx * 0.07, duration: 0.35, ease: 'easeOut' }}
                  className="hover:bg-[#fdfefe]"
                >
                  <td className="py-2 px-3 font-medium text-[#004e4c] flex items-center gap-2">
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={isInView ? { scale: 1 } : {}}
                      transition={{ delay: 0.2 + idx * 0.07, duration: 0.25, type: 'spring', stiffness: 400 }}
                      className="w-2.5 h-2.5 rounded-full shrink-0"
                      style={{ backgroundColor: item.color || '#004e4c' }}
                    ></motion.span>
                    <span className="truncate max-w-[180px]">{item.label}</span>
                  </td>
                  <td className="py-2 px-3 text-right font-bold text-[#1f2733]">
                    {item.value} {card.unit || ''}
                  </td>
                  {item.valueSecondary !== undefined && (
                    <td className="py-2 px-3 text-right text-[#6b7684]">
                      {item.valueSecondary} {card.unit || ''}
                    </td>
                  )}
                  <td className="py-2 px-3 text-center">
                    <motion.span
                      initial={{ opacity: 0, scale: 0.7 }}
                      animate={isInView ? { opacity: 1, scale: 1 } : {}}
                      transition={{ delay: 0.35 + idx * 0.07, duration: 0.3, type: 'spring', stiffness: 300 }}
                      className="bg-[#004e4c]/10 text-[#004e4c] font-semibold px-2 py-0.5 rounded text-[10.5px] inline-block"
                    >
                      {pct}%
                    </motion.span>
                  </td>
                </motion.tr>
              );
            })}
          </tbody>
        </table>
      </div>
    );
  }

  return null;
};
