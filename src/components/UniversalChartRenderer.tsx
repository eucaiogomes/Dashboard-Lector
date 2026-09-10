import React from 'react';
import { ChartTypeOption } from './ChartTypeSelector';

export interface UniversalChartDataPoint {
  label: string;
  value: number;
  valueSecondary?: number;
  color?: string;
  extra?: string;
}

interface UniversalChartRendererProps {
  data: UniversalChartDataPoint[];
  chartType: ChartTypeOption;
  unit?: string;
  legendPrimary?: string;
  legendSecondary?: string;
  primaryColor?: string;
  secondaryColor?: string;
  heightPx?: number;
  showValuesOnBars?: boolean;
}

const PALETTE = [
  '#004e4c',
  '#f47920',
  '#00995d',
  '#1f8f78',
  '#2a7b9b',
  '#e65100',
  '#5c6bc0',
  '#7e57c2',
  '#26a69a',
  '#ab47bc',
  '#d4e157',
  '#ff7043'
];

const formatVal = (v: number) => (v >= 1000 ? `${(v / 1000).toFixed(1).replace('.', ',')}k` : `${v}`);

const ChartLegend: React.FC<{ primaryColor: string; secondaryColor: string; legendPrimary: string; legendSecondary: string }> = ({
  primaryColor,
  secondaryColor,
  legendPrimary,
  legendSecondary
}) => (
  <div className="flex items-center justify-end gap-3 text-[10px] text-[#8a93a0] font-medium mb-1 pr-0.5 shrink-0">
    <div className="flex items-center gap-1">
      <span className="w-2 h-2 rounded-[2px]" style={{ backgroundColor: secondaryColor }}></span>
      <span>{legendSecondary}</span>
    </div>
    <div className="flex items-center gap-1">
      <span className="w-2 h-2 rounded-[2px]" style={{ backgroundColor: primaryColor }}></span>
      <span>{legendPrimary}</span>
    </div>
  </div>
);

export const UniversalChartRenderer: React.FC<UniversalChartRendererProps> = ({
  data,
  chartType,
  unit = '',
  legendPrimary = 'Realizado',
  legendSecondary = 'Previsto',
  primaryColor = '#004e4c',
  secondaryColor = '#cde3bb',
  showValuesOnBars = true
}) => {
  const hasSecondary = data.some(d => d.valueSecondary !== undefined);

  const valuesPrimary = data.map(d => d.value);
  const valuesSecondary = data.map(d => d.valueSecondary ?? 0);
  const maxAll = Math.max(...valuesPrimary, ...valuesSecondary, 1);

  // 1. COLUNA (Colunas Verticais)
  if (chartType === 'Coluna') {
    const gridRatios = [1, 0.75, 0.5, 0.25, 0];

    return (
      <div className="w-full h-full flex-1 min-h-0 flex flex-col overflow-hidden">
        {hasSecondary && (
          <ChartLegend
            primaryColor={primaryColor}
            secondaryColor={secondaryColor}
            legendPrimary={legendPrimary}
            legendSecondary={legendSecondary}
          />
        )}

        <div className="flex-1 min-h-0 flex overflow-hidden">
          {/* Y scale */}
          <div className="flex flex-col justify-between text-right pr-1.5 shrink-0 w-[24px]">
            {gridRatios.map(r => (
              <span key={r} className="text-[8px] text-[#b6bdc7] font-semibold leading-none tabular-nums">
                {formatVal(Math.round(r * maxAll))}
              </span>
            ))}
          </div>

          {/* Plot area */}
          <div className="flex-1 min-w-0 relative">
            <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
              {gridRatios.map(r => (
                <div key={r} className={`border-t ${r === 0 ? 'border-[#e4e8ee]' : 'border-[#eef1f5]'}`} />
              ))}
            </div>

            <div className="absolute inset-0 flex items-end justify-around gap-[3px] px-0.5">
              {data.map((item, idx) => {
                const hPct = Math.min(100, Math.max(4, (item.value / maxAll) * 100));
                const hSecPct =
                  item.valueSecondary !== undefined ? Math.min(100, Math.max(4, (item.valueSecondary / maxAll) * 100)) : 0;

                return (
                  <div key={`${item.label}-${idx}`} className="flex flex-col items-center justify-end h-full flex-1 max-w-[42px] group">
                    {showValuesOnBars && (
                      <span className="text-[9px] font-bold text-[#004e4c] mb-0.5 tabular-nums leading-none opacity-80 group-hover:opacity-100 transition-opacity">
                        {formatVal(item.value)}
                        {unit === '%' ? '%' : ''}
                      </span>
                    )}

                    <div className="w-full flex items-end justify-center gap-0.5 flex-1 min-h-0">
                      {item.valueSecondary !== undefined && (
                        <div
                          key={`${chartType}-sec-${item.label}-${item.valueSecondary}`}
                          className="chart-grow-h w-1/2 max-w-[9px] rounded-t-[1.5px] transition-[opacity] hover:opacity-80"
                          style={{
                            height: `${hSecPct}%`,
                            animationDelay: `${idx * 30}ms`,
                            backgroundColor: secondaryColor
                          }}
                          title={`${item.label} — ${legendSecondary}: ${item.valueSecondary}${unit}`}
                        />
                      )}
                      <div
                        key={`${chartType}-pri-${item.label}-${item.value}`}
                        className={`chart-grow-h ${
                          item.valueSecondary !== undefined ? 'w-1/2 max-w-[9px]' : 'w-full max-w-[18px]'
                        } rounded-t-[2px] transition-[opacity] hover:opacity-85`}
                        style={{
                          height: `${hPct}%`,
                          animationDelay: `${idx * 30 + 60}ms`,
                          backgroundColor: item.color || primaryColor
                        }}
                        title={`${item.label} — ${legendPrimary}: ${item.value}${unit}`}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="flex items-center pl-[27px] justify-around gap-[3px] px-0.5 pt-1">
          {data.map((item, idx) => (
            <span
              key={`${item.label}-lbl-${idx}`}
              className="flex-1 max-w-[42px] text-center text-[9px] text-[#8a93a0] font-medium truncate leading-tight"
              title={item.label}
            >
              {item.label}
            </span>
          ))}
        </div>
      </div>
    );
  }

  // 2. BARRA (Barras Horizontais — trilha com progresso)
  if (chartType === 'Barra') {
    const gridRatios = [0, 0.25, 0.5, 0.75, 1];
    const labelColW = 'w-[92px] sm:w-[122px]';
    const valueColW = 'w-[48px]';

    return (
      <div className="w-full h-full flex-1 min-h-0 flex flex-col overflow-hidden">
        {hasSecondary && (
          <ChartLegend
            primaryColor={primaryColor}
            secondaryColor={secondaryColor}
            legendPrimary={legendPrimary}
            legendSecondary={legendSecondary}
          />
        )}

        <div className="flex-1 min-h-0 relative overflow-hidden">
          {/* Vertical scale grid, aligned to the track column (after label, before value) */}
          <div className="absolute inset-y-0 left-[102px] sm:left-[132px] right-[58px] flex justify-between pointer-events-none">
            {gridRatios.map(r => (
              <div key={r} className={`w-px ${r === 0 ? 'bg-[#e4e8ee]' : 'bg-[#eef1f5]'}`} />
            ))}
          </div>

          <div className="relative h-full flex flex-col justify-center gap-[3px] overflow-y-auto pr-0.5 -mx-1">
            {data.map((item, idx) => {
              const wPct = Math.min(100, Math.max(3, (item.value / maxAll) * 100));
              const wSecPct =
                item.valueSecondary !== undefined ? Math.min(100, Math.max(3, (item.valueSecondary / maxAll) * 100)) : 0;
              const barColor = item.color || primaryColor;

              return (
                <div
                  key={`${item.label}-${idx}`}
                  className="flex items-center gap-2.5 text-[11px] group min-h-0 px-1 py-[3px] rounded-[5px] hover:bg-[#f8fafc] transition-colors"
                >
                  <div
                    className={`${labelColW} shrink-0 text-right text-[#4a5462] font-semibold truncate text-[10.5px] leading-tight`}
                    title={item.label}
                  >
                    {item.label}
                  </div>

                  <div className="flex-1 flex flex-col gap-[3px] min-w-[36px]">
                    {item.valueSecondary !== undefined && (
                      <div className="h-1 overflow-hidden">
                        <div
                          key={`${chartType}-sec-${item.label}-${item.valueSecondary}`}
                          className="chart-grow-w h-full"
                          style={{ width: `${wSecPct}%`, animationDelay: `${idx * 30}ms`, backgroundColor: secondaryColor }}
                          title={`${legendSecondary}: ${item.valueSecondary}${unit}`}
                        />
                      </div>
                    )}
                    <div className="h-[10px] overflow-hidden">
                      <div
                        key={`${chartType}-pri-${item.label}-${item.value}`}
                        className="chart-grow-w h-full group-hover:brightness-110"
                        style={{
                          width: `${wPct}%`,
                          animationDelay: `${idx * 30 + 60}ms`,
                          backgroundColor: barColor
                        }}
                        title={`${legendPrimary}: ${item.value}${unit}`}
                      />
                    </div>
                  </div>

                  <div className={`${valueColW} shrink-0 text-right text-[10.5px] font-bold text-[#004e4c] tabular-nums`}>
                    {item.value.toLocaleString('pt-BR')}
                    <span className="text-[#8a93a0] font-semibold">
                      {unit && unit !== '%' ? ` ${unit}` : unit === '%' ? '%' : ''}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* X scale row, aligned with the track column above */}
        <div className={`flex items-center gap-2.5 pt-1 shrink-0`}>
          <div className={`${labelColW} shrink-0`} />
          <div className="flex-1 flex justify-between min-w-[36px]">
            {gridRatios.map(r => (
              <span key={r} className="text-[8px] text-[#b6bdc7] font-semibold tabular-nums">
                {formatVal(Math.round(r * maxAll))}
                {r === 1 && unit === '%' ? '%' : ''}
              </span>
            ))}
          </div>
          <div className={`${valueColW} shrink-0`} />
        </div>
      </div>
    );
  }

  // 3. LINHA (Tendência)
  if (chartType === 'Linha') {
    const totalPoints = data.length;
    const svgWidth = 500;
    const svgHeight = 150;
    const padRight = 8;
    const padLeft = 8;
    const padY = 16;

    const range = maxAll || 1;
    const innerW = svgWidth - padLeft - padRight;

    const xFor = (idx: number) => padLeft + (idx / Math.max(totalPoints - 1, 1)) * innerW;
    const yFor = (v: number) => svgHeight - padY - (v / range) * (svgHeight - padY * 2);

    const pointsPrimary = data.map((d, idx) => ({ x: xFor(idx), y: yFor(d.value), ...d }));
    const pointsSecondary = hasSecondary
      ? data.map((d, idx) => ({ x: xFor(idx), y: yFor(d.valueSecondary ?? 0), value: d.valueSecondary ?? 0, label: d.label }))
      : [];

    // Catmull-Rom → Bézier smoothing for a refined, non-jagged trend line
    const smoothPath = (pts: { x: number; y: number }[]) => {
      if (pts.length === 0) return '';
      if (pts.length === 1) return `M ${pts[0].x},${pts[0].y}`;
      let d = `M ${pts[0].x},${pts[0].y}`;
      for (let i = 0; i < pts.length - 1; i++) {
        const p0 = pts[i === 0 ? i : i - 1];
        const p1 = pts[i];
        const p2 = pts[i + 1];
        const p3 = pts[i + 2 < pts.length ? i + 2 : i + 1];
        const cp1x = p1.x + (p2.x - p0.x) / 6;
        const cp1y = p1.y + (p2.y - p0.y) / 6;
        const cp2x = p2.x - (p3.x - p1.x) / 6;
        const cp2y = p2.y - (p3.y - p1.y) / 6;
        d += ` C ${cp1x},${cp1y} ${cp2x},${cp2y} ${p2.x},${p2.y}`;
      }
      return d;
    };

    const pathPrimary = smoothPath(pointsPrimary);
    const pathSecondary = hasSecondary ? smoothPath(pointsSecondary) : '';
    const areaPrimary = `${pathPrimary} L ${pointsPrimary[pointsPrimary.length - 1]?.x ?? svgWidth},${
      svgHeight - padY
    } L ${pointsPrimary[0]?.x ?? padLeft},${svgHeight - padY} Z`;

    const last = pointsPrimary[pointsPrimary.length - 1];
    const badgeText = `${formatVal(last?.value ?? 0)}${unit === '%' ? '%' : ''}`;
    const gridRatios = [1, 0.75, 0.5, 0.25, 0];
    const lineDrawMs = 900;

    // Percentage position within the plot box — used for the HTML overlay (dots, end badge)
    // so those stay perfectly round/proportioned even when the SVG (preserveAspectRatio="none")
    // stretches X and Y by different factors to fill the card.
    const relX = (x: number) => `${(x / svgWidth) * 100}%`;
    const relY = (y: number) => `${(y / svgHeight) * 100}%`;

    return (
      <div className="w-full h-full flex-1 min-h-0 flex flex-col overflow-hidden">
        {hasSecondary && (
          <ChartLegend
            primaryColor={primaryColor}
            secondaryColor={secondaryColor}
            legendPrimary={legendPrimary}
            legendSecondary={legendSecondary}
          />
        )}

        <div className="flex-1 min-h-0 flex">
          {/* Y scale — plain HTML, fixed font size, so it never stretches with the plot below */}
          <div className="flex flex-col justify-between text-right pr-1.5 shrink-0 w-[22px]">
            {gridRatios.map(ratio => (
              <span key={ratio} className="text-[8px] text-[#b6bdc7] font-semibold leading-none tabular-nums">
                {formatVal(Math.round(ratio * range))}
              </span>
            ))}
          </div>

          {/* Plot area: only this — the grid + the curve — stretches to fill the card */}
          <div className="relative flex-1 min-w-0">
            <svg
              viewBox={`0 0 ${svgWidth} ${svgHeight}`}
              className="absolute inset-0 w-full h-full"
              preserveAspectRatio="none"
            >
              {/* Full scale grid: horizontal (value) + vertical (one per category), like a real chart canvas */}
              {gridRatios.map(ratio => {
                const yPos = svgHeight - padY - ratio * (svgHeight - padY * 2);
                return <line key={`h-${ratio}`} x1={padLeft} y1={yPos} x2={svgWidth - padRight} y2={yPos} stroke="#eef1f5" />;
              })}
              {pointsPrimary.map((p, idx) => (
                <line key={`v-${idx}`} x1={p.x} y1={padY} x2={p.x} y2={svgHeight - padY} stroke="#f3f5f8" />
              ))}

              {/* Solid fill — a flat tone reads as "premium filled area", not a washed-out gradient */}
              <path className="chart-fade" style={{ animationDelay: `${lineDrawMs * 0.55}ms` }} d={areaPrimary} fill={primaryColor} fillOpacity={0.82} />

              {hasSecondary && (
                <path
                  className="chart-line-draw"
                  pathLength={1}
                  d={pathSecondary}
                  fill="none"
                  stroke={secondaryColor}
                  strokeWidth="1.75"
                  strokeDasharray="1"
                  strokeLinecap="round"
                  style={{ animationDuration: `${lineDrawMs}ms` }}
                />
              )}

              <path
                className="chart-line-draw"
                pathLength={1}
                d={pathPrimary}
                fill="none"
                stroke={primaryColor}
                strokeWidth="2.25"
                strokeLinecap="round"
                strokeLinejoin="round"
                style={{ animationDuration: `${lineDrawMs}ms` }}
              />
            </svg>

            {/* Dots + end badge live outside the SVG's stretched coordinate system, positioned by
                percentage, so they render as true circles/pills instead of ellipses. */}
            {hasSecondary &&
              pointsSecondary.map((p, idx) => (
                <span
                  key={`sec-${idx}`}
                  className="chart-fade absolute -translate-x-1/2 -translate-y-1/2 p-[5px] cursor-pointer"
                  style={{ left: relX(p.x), top: relY(p.y), animationDelay: `${(idx / Math.max(totalPoints - 1, 1)) * lineDrawMs}ms` }}
                  title={`${p.label} — ${legendSecondary}: ${p.value}${unit}`}
                >
                  <span className="block w-[5px] h-[5px] rounded-full ring-2 ring-white" style={{ backgroundColor: secondaryColor }} />
                </span>
              ))}

            {pointsPrimary.map((p, idx) => {
              const isLast = idx === pointsPrimary.length - 1;
              const delay = (idx / Math.max(totalPoints - 1, 1)) * lineDrawMs;
              return (
                <span
                  key={`prim-${idx}`}
                  className="chart-fade absolute -translate-x-1/2 -translate-y-1/2 p-[6px] cursor-pointer"
                  style={{ left: relX(p.x), top: relY(p.y), animationDelay: `${delay}ms` }}
                  title={`${p.label} — ${legendPrimary}: ${p.value}${unit}`}
                >
                  <span
                    className={`block rounded-full ring-[1.5px] ring-white ${isLast ? 'w-[9px] h-[9px]' : 'w-[5px] h-[5px]'}`}
                    style={{ backgroundColor: p.color || primaryColor }}
                  />
                </span>
              );
            })}

            {last && (
              <div
                className="chart-fade-in absolute -translate-x-1/2 -translate-y-[calc(100%+10px)]"
                style={{ left: relX(last.x), top: relY(last.y), animationDelay: `${lineDrawMs + 80}ms` }}
              >
                <span
                  className="inline-flex items-center justify-center h-4 min-w-[26px] px-1.5 rounded-full text-[9.5px] font-bold text-white whitespace-nowrap tabular-nums"
                  style={{ backgroundColor: primaryColor }}
                >
                  {badgeText}
                </span>
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center pl-[28px] justify-around px-0.5 pt-0.5">
          {data.map((item, idx) => (
            <span
              key={`${item.label}-lbl-${idx}`}
              className="flex-1 text-center text-[9px] text-[#8a93a0] font-medium truncate leading-tight"
              title={item.label}
            >
              {item.label}
            </span>
          ))}
        </div>
      </div>
    );
  }

  // 4. PIZZA / ROSCA (Gráfico Circular com Legenda)
  if (chartType === 'Pizza') {
    const total = data.reduce((acc, d) => acc + d.value, 0) || 1;
    let accum = 0;

    const slices = data.map((d, i) => {
      const pct = (d.value / total) * 100;
      const start = accum;
      accum += pct;
      const color = d.color || PALETTE[i % PALETTE.length];
      return { ...d, color, start, end: accum };
    });

    const conicStops = slices.map(s => `${s.color} ${s.start.toFixed(2)}% ${s.end.toFixed(2)}%`).join(', ');

    return (
      <div className="w-full h-full flex-1 min-h-0 flex items-center justify-around gap-3 overflow-hidden">
        <div className="relative shrink-0 flex items-center justify-center">
          <div
            key={chartType}
            className="chart-donut-in w-[88px] h-[88px] sm:w-[96px] sm:h-[96px] rounded-full flex items-center justify-center transition-transform hover:scale-[1.03]"
            style={{ background: `conic-gradient(${conicStops})` }}
          >
            <div className="w-[58px] h-[58px] sm:w-16 sm:h-16 rounded-full bg-white" />
          </div>
        </div>

        <div className="flex-1 min-w-[124px] max-w-[240px] max-h-full overflow-y-auto space-y-1">
          {slices.map((item, idx) => (
            <div
              key={`${item.label}-${idx}`}
              className="chart-fade-in flex items-center gap-1.5"
              style={{ animationDelay: `${250 + idx * 40}ms` }}
            >
              <span className="w-2 h-2 rounded-[2px] shrink-0" style={{ backgroundColor: item.color }} />
              <span className="text-[#4a5462] truncate text-[11px] font-medium">
                {item.label} <span className="text-[#8a93a0]">-</span>{' '}
                <span className="font-bold text-[#004e4c] tabular-nums">{item.value.toLocaleString('pt-BR')}</span>
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return null;
};
