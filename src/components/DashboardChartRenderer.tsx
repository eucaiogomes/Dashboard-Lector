import React, { useRef, useMemo } from 'react';
import { motion, useInView } from 'motion/react';
import { DashboardCardItem } from '../data/dashboardCatalog';

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
              <span className="w-3 h-3 rounded-xs bg-[#183a75]"></span>
              <span>{meta?.legendPrimary || 'Realizado'}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-xs bg-[#cdd6e6]"></span>
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
                            className="h-3 rounded-xs bg-[#cdd6e6] group relative overflow-hidden"
                          >
                            <motion.div
                              initial={{ x: '-100%' }}
                              animate={isInView ? { x: '200%' } : {}}
                              transition={{ delay: 0.9 + idx * 0.1, duration: 0.6 }}
                              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                            />
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
                            style={{ backgroundColor: item.color || '#183a75' }}
                          >
                            <motion.div
                              initial={{ x: '-100%' }}
                              animate={isInView ? { x: '200%' } : {}}
                              transition={{ delay: 1.0 + idx * 0.1, duration: 0.6 }}
                              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                            />
                            <span className="opacity-0 group-hover:opacity-100 transition-opacity absolute -top-5 right-0 bg-[#183a75] text-white text-[9.5px] px-1 py-0.5 rounded pointer-events-none whitespace-nowrap z-20">
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
                          style={{ backgroundColor: item.color || '#183a75' }}
                        >
                          <motion.div
                            initial={{ x: '-100%' }}
                            animate={isInView ? { x: '200%' } : {}}
                            transition={{ delay: 0.8 + idx * 0.1, duration: 0.6 }}
                            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                          />
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
                          <div className="opacity-0 group-hover:opacity-100 transition-opacity absolute -top-6 right-0 bg-[#183a75] text-white text-[10px] font-bold px-1.5 py-0.5 rounded shadow pointer-events-none whitespace-nowrap z-30">
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
              <span className="w-3 h-3 rounded-xs bg-[#183a75]"></span>
              <span>{meta?.legendPrimary || 'Realizado'}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-xs bg-[#cdd6e6]"></span>
              <span>{meta?.legendSecondary || 'Previsto'}</span>
            </div>
          </motion.div>
        )}

        <div className="flex-1 min-h-0 flex items-end justify-around gap-2 px-3 border-b border-[#cbd5e1] pb-2 relative">
          {data.map((item, idx) => {
            const hPct = Math.min(100, Math.max(4, (item.value / maxScale) * 100));
            const hSecPct = item.valueSecondary !== undefined
              ? Math.min(100, Math.max(4, (item.valueSecondary / maxScale) * 100))
              : 0;

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
                  className="text-[10px] font-bold text-[#183a75] mb-1 group-hover:scale-110 transition-transform"
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
                      className="w-1/2 max-w-[14px] bg-[#cdd6e6] rounded-t-[2px] hover:opacity-80 relative overflow-hidden"
                      title={`Previsto: ${item.valueSecondary}`}
                    >
                      <motion.div
                        initial={{ y: '100%' }}
                        animate={isInView ? { y: '-100%' } : {}}
                        transition={{ delay: 0.8 + idx * 0.08, duration: 0.5 }}
                        className="absolute inset-0 bg-gradient-to-b from-transparent via-white/30 to-transparent"
                      />
                    </motion.div>
                  )}
                  <motion.div
                    initial={{ height: 0 }}
                    animate={isInView ? { height: `${hPct}%` } : { height: 0 }}
                    transition={{
                      delay: 0.3 + idx * 0.08,
                      duration: 0.65,
                      ease: [0.25, 0.46, 0.45, 0.94]
                    }}
                    className={`${item.valueSecondary !== undefined ? 'w-1/2 max-w-[14px]' : 'w-full max-w-[28px]'} rounded-t-[2px] hover:opacity-90 shadow-2xs relative overflow-hidden`}
                    style={{ backgroundColor: item.color || '#183a75' }}
                    title={`${item.label}: ${item.value}`}
                  >
                    <motion.div
                      initial={{ y: '100%' }}
                      animate={isInView ? { y: '-100%' } : {}}
                      transition={{ delay: 0.9 + idx * 0.08, duration: 0.5 }}
                      className="absolute inset-0 bg-gradient-to-b from-transparent via-white/20 to-transparent"
                    />
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
    const gradientId = useUniqueId('lineGrad');
    const totalPoints = data.length;
    const values = data.map(d => d.value);
    const minVal = Math.min(...values);
    const maxVal = Math.max(...values, maxScale);
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

    const pathD = points.reduce((acc, p, idx) => {
      return idx === 0 ? `M ${p.x},${p.y}` : `${acc} L ${p.x},${p.y}`;
    }, '');

    // Calculate approximate path length for stroke animation
    let pathLength = 0;
    for (let i = 1; i < points.length; i++) {
      const dx = points[i].x - points[i - 1].x;
      const dy = points[i].y - points[i - 1].y;
      pathLength += Math.sqrt(dx * dx + dy * dy);
    }

    return (
      <div ref={containerRef} className="w-full h-full py-2 flex flex-col justify-between">
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
                <stop offset="0%" stopColor="#eb6200" />
                <stop offset="100%" stopColor="#183a75" />
              </linearGradient>
            </defs>

            {/* Area gradient under curve — fades in after line draws */}
            <motion.path
              d={`${pathD} L ${points[points.length - 1]?.x || width},${height - paddingY} L ${points[0]?.x || 0},${height - paddingY} Z`}
              fill={`url(#${gradientId})`}
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 0.25 } : {}}
              transition={{ delay: 1.0, duration: 0.6 }}
            />

            {/* Line Path — draws itself */}
            <motion.path
              d={pathD}
              fill="none"
              stroke="#183a75"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={isInView ? { pathLength: 1, opacity: 1 } : {}}
              transition={{
                pathLength: { delay: 0.3, duration: 1.0, ease: 'easeInOut' },
                opacity: { delay: 0.3, duration: 0.1 }
              }}
            />

            {/* Points & Values */}
            {points.map((p, idx) => (
              <g key={idx} className="group cursor-pointer">
                <motion.circle
                  cx={p.x}
                  cy={p.y}
                  r="5"
                  fill={p.color || '#eb6200'}
                  stroke="#ffffff"
                  strokeWidth="2"
                  initial={{ scale: 0, opacity: 0 }}
                  animate={isInView ? { scale: 1, opacity: 1 } : {}}
                  transition={{
                    delay: 0.5 + idx * 0.12,
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
                  fill="#183a75"
                  initial={{ opacity: 0, y: p.y - 4 }}
                  animate={isInView ? { opacity: 1, y: p.y - 9 } : {}}
                  transition={{ delay: 0.7 + idx * 0.12, duration: 0.3 }}
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
                  transition={{ delay: 0.8 + idx * 0.1, duration: 0.3 }}
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

    // Conic gradient string
    const conicStops = slices
      .map(s => `${s.color || '#183a75'} ${s.startAngle}% ${s.endAngle}%`)
      .join(', ');

    return (
      <div ref={containerRef} className="w-full h-full py-4 flex flex-col sm:flex-row items-center justify-around gap-6">
        {/* Donut graphic */}
        <motion.div
          initial={{ scale: 0, rotate: -90, opacity: 0 }}
          animate={isInView ? { scale: 1, rotate: 0, opacity: 1 } : {}}
          transition={{
            scale: { delay: 0.15, duration: 0.6, type: 'spring', stiffness: 200, damping: 18 },
            rotate: { delay: 0.15, duration: 0.8, ease: [0.34, 1.56, 0.64, 1] },
            opacity: { delay: 0.15, duration: 0.2 }
          }}
          className="relative w-32 h-32 rounded-full border-4 border-white shadow-md flex items-center justify-center shrink-0"
          style={{
            background: `conic-gradient(${conicStops})`
          }}
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={isInView ? { scale: 1 } : {}}
            transition={{ delay: 0.5, duration: 0.4, type: 'spring', stiffness: 300 }}
            className="w-18 h-18 rounded-full bg-white shadow-inner flex flex-col items-center justify-center"
          >
            <motion.span
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : {}}
              transition={{ delay: 0.7, duration: 0.3 }}
              className="text-[14px] font-black text-[#183a75]"
            >
              {total}
            </motion.span>
            <motion.span
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : {}}
              transition={{ delay: 0.8, duration: 0.3 }}
              className="text-[9px] text-[#8a93a0] font-medium uppercase"
            >
              {card.unit || 'Total'}
            </motion.span>
          </motion.div>
        </motion.div>

        {/* Legend Breakdown */}
        <div className="flex-1 min-h-0 max-w-[240px] w-full space-y-2 text-xs overflow-y-auto">
          {slices.map((item, idx) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, x: 20 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ delay: 0.4 + idx * 0.08, duration: 0.35, ease: 'easeOut' }}
              className="flex items-center justify-between gap-2 p-1 rounded hover:bg-[#f8fafc]"
            >
              <div className="flex items-center gap-2 truncate">
                <motion.span
                  initial={{ scale: 0 }}
                  animate={isInView ? { scale: 1 } : {}}
                  transition={{ delay: 0.5 + idx * 0.08, duration: 0.25, type: 'spring', stiffness: 400 }}
                  className="w-3 h-3 rounded-xs shrink-0"
                  style={{ backgroundColor: item.color || '#183a75' }}
                ></motion.span>
                <span className="text-[#4a5462] truncate text-[11.5px]" title={item.label}>
                  {item.label}
                </span>
              </div>
              <div className="flex items-center gap-1.5 shrink-0 text-right">
                <span className="font-bold text-[#1f2733] text-[12px]">{item.value}</span>
                <span className="text-[10px] text-[#8a93a0]">({item.pct}%)</span>
              </div>
            </motion.div>
          ))}
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
                  <td className="py-2 px-3 font-medium text-[#183a75] flex items-center gap-2">
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={isInView ? { scale: 1 } : {}}
                      transition={{ delay: 0.2 + idx * 0.07, duration: 0.25, type: 'spring', stiffness: 400 }}
                      className="w-2.5 h-2.5 rounded-full shrink-0"
                      style={{ backgroundColor: item.color || '#183a75' }}
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
                      className="bg-[#183a75]/10 text-[#183a75] font-semibold px-2 py-0.5 rounded text-[10.5px] inline-block"
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
