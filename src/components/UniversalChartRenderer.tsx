import React, { useId, useState } from 'react';
import { ChartTypeOption } from './ChartTypeSelector';
import { DonutChart } from './DonutChart';
import { COLUNA_PRIMARY_GREEN, COLUNA_PRIMARY_GREEN_HOVER, CHART_CATEGORY_PALETTE } from '../utils/chartColors';

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
}

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
  secondaryColor = '#cde3bb'
}) => {
  const [hoverIdx, setHoverIdx] = useState<number | null>(null);
  const areaGradientId = useId();
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
          <div className="flex-1 min-w-0 relative" onMouseLeave={() => setHoverIdx(null)}>
            <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
              {gridRatios.map(r => (
                <div key={r} className={`border-t ${r === 0 ? 'border-[#e4e8ee]' : 'border-dashed border-[#e2e8f0]'}`} />
              ))}
            </div>

            <div className="absolute inset-0 flex items-end justify-around gap-[3px] px-0.5">
              {data.map((item, idx) => {
                const hPct = Math.min(100, Math.max(4, (item.value / maxAll) * 100));
                const hSecPct =
                  item.valueSecondary !== undefined ? Math.min(100, Math.max(4, (item.valueSecondary / maxAll) * 100)) : 0;
                const isHovered = hoverIdx === idx;
                // Coluna é sempre verde sólido — sem gradiente e sem herdar cores por item,
                // para manter um padrão único em todo gráfico de Coluna do Dashboard.
                const barColor = isHovered ? COLUNA_PRIMARY_GREEN_HOVER : COLUNA_PRIMARY_GREEN;

                return (
                  <div key={`${item.label}-${idx}`} className="flex flex-col items-center justify-end h-full flex-1 max-w-[42px] group">
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
                        className={`chart-grow-h relative transition-colors ${
                          item.valueSecondary !== undefined ? 'w-1/2 max-w-[9px]' : 'w-full max-w-[18px]'
                        } rounded-t-[3px]`}
                        style={{
                          height: `${hPct}%`,
                          animationDelay: `${idx * 30 + 60}ms`,
                          backgroundColor: barColor
                        }}
                        onMouseEnter={() => setHoverIdx(idx)}
                        onFocus={() => setHoverIdx(idx)}
                        tabIndex={0}
                        role="img"
                        aria-label={`${item.label} — ${legendPrimary}: ${item.value}${unit}`}
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
                                  {item.value.toLocaleString('pt-BR')}
                                  {unit === '%' ? '%' : unit ? ` ${unit}` : ''} {legendPrimary.toLowerCase()}
                                </span>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
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

          <div className="h-full flex flex-col overflow-y-auto pr-0.5">
            {data.map((item, idx) => {
              const wPct = Math.min(100, Math.max(3, (item.value / maxAll) * 100));
              const wSecPct =
                item.valueSecondary !== undefined ? Math.min(100, Math.max(3, (item.valueSecondary / maxAll) * 100)) : 0;
              const barColor = item.color || primaryColor;

              return (
                <div
                  key={`${item.label}-${idx}`}
                  className="flex-1 min-h-[22px] flex items-stretch gap-2.5 text-[11px] group px-0.5 rounded-[5px] hover:bg-[#f8fafc] transition-colors"
                >
                  <div
                    className={`${labelColW} shrink-0 flex items-center justify-end text-right text-[#4a5462] font-semibold truncate text-[10.5px] leading-tight`}
                    title={item.label}
                  >
                    {item.label}
                  </div>

                  {/* A trilha ocupa toda a altura da linha e cresce junto com o card — só a
                      espessura da barra (não o espaçamento entre linhas) aumenta ao redimensionar. */}
                  <div className="flex-1 flex flex-col justify-center gap-[3px] min-w-[36px]">
                    {item.valueSecondary !== undefined && (
                      <div className="h-1 shrink-0 overflow-hidden">
                        <div
                          key={`${chartType}-sec-${item.label}-${item.valueSecondary}`}
                          className="chart-grow-w h-full"
                          style={{ width: `${wSecPct}%`, animationDelay: `${idx * 30}ms`, backgroundColor: secondaryColor }}
                          title={`${legendSecondary}: ${item.valueSecondary}${unit}`}
                        />
                      </div>
                    )}
                    <div className="flex-1 max-h-[18px] min-h-[8px] overflow-hidden">
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

                  <div className={`${valueColW} shrink-0 flex items-center justify-end text-right text-[10.5px] font-bold text-[#004e4c] tabular-nums`}>
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
    // Duração da subida (área + linhas crescendo juntas de baixo para cima) — os pontos e o
    // badge final aguardam essa animação terminar antes de aparecer.
    const riseMs = 700;

    // Percentage position within the plot box — used for the HTML overlay (dots, end badge)
    // so those stay perfectly round/proportioned even when the SVG (preserveAspectRatio="none")
    // stretches X and Y by different factors to fill the card.
    const relX = (x: number) => `${(x / svgWidth) * 100}%`;
    const relY = (y: number) => `${(y / svgHeight) * 100}%`;

    return (
      <div className="w-full h-full flex-1 min-h-0 flex flex-col justify-center overflow-hidden">
        {hasSecondary && (
          <ChartLegend
            primaryColor={primaryColor}
            secondaryColor={secondaryColor}
            legendPrimary={legendPrimary}
            legendSecondary={legendSecondary}
          />
        )}

        {/* Altura máxima no plot: em cards muito altos, "preserveAspectRatio=none" esticaria o
            eixo Y muito mais que o X, transformando qualquer variação em picos exagerados
            ("esticado"/"grotesco"). Travar a altura e centralizar mantém a curva proporcional. */}
        <div className="flex-1 min-h-0 max-h-[240px] flex">
          {/* Y scale — plain HTML, fixed font size, so it never stretches with the plot below */}
          <div className="flex flex-col justify-between text-right pr-1.5 shrink-0 w-[22px]">
            {gridRatios.map(ratio => (
              <span key={ratio} className="text-[8px] text-[#b6bdc7] font-semibold leading-none tabular-nums">
                {formatVal(Math.round(ratio * range))}
              </span>
            ))}
          </div>

          {/* Plot area: only this — the grid + the curve — stretches to fill the card */}
          <div className="relative flex-1 min-w-0" onMouseLeave={() => setHoverIdx(null)}>
            <svg
              viewBox={`0 0 ${svgWidth} ${svgHeight}`}
              className="absolute inset-0 w-full h-full"
              preserveAspectRatio="none"
            >
              <defs>
                <linearGradient id={areaGradientId} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={primaryColor} stopOpacity={0.5} />
                  <stop offset="100%" stopColor={primaryColor} stopOpacity={0.02} />
                </linearGradient>
              </defs>

              {/* Grade tracejada: horizontal (valor) + vertical (uma por categoria) */}
              {gridRatios.map(ratio => {
                const yPos = svgHeight - padY - ratio * (svgHeight - padY * 2);
                return (
                  <line
                    key={`h-${ratio}`}
                    x1={padLeft}
                    y1={yPos}
                    x2={svgWidth - padRight}
                    y2={yPos}
                    stroke="#e2e8f0"
                    strokeDasharray="3 3"
                  />
                );
              })}
              {pointsPrimary.map((p, idx) => (
                <line
                  key={`v-${idx}`}
                  x1={p.x}
                  y1={padY}
                  x2={p.x}
                  y2={svgHeight - padY}
                  stroke="#e2e8f0"
                  strokeDasharray="3 3"
                />
              ))}

              {/* Guia vertical tracejada no ponto em foco (hover, ou o último por padrão) */}
              {(() => {
                const focusIdx = hoverIdx ?? pointsPrimary.length - 1;
                const focusPoint = pointsPrimary[focusIdx];
                if (!focusPoint) return null;
                return (
                  <line
                    x1={focusPoint.x}
                    y1={padY}
                    x2={focusPoint.x}
                    y2={svgHeight - padY}
                    stroke="#9fb0c3"
                    strokeDasharray="2 3"
                    strokeWidth="1"
                  />
                );
              })()}

              {/* Área + linhas sobem juntas de baixo para cima, ancoradas na base do gráfico */}
              <g className="chart-line-rise">
                <path d={areaPrimary} fill={`url(#${areaGradientId})`} />

                {hasSecondary && (
                  <path
                    d={pathSecondary}
                    fill="none"
                    stroke={secondaryColor}
                    strokeWidth="1.75"
                    strokeLinecap="round"
                  />
                )}

                <path
                  d={pathPrimary}
                  fill="none"
                  stroke={primaryColor}
                  strokeWidth="2.25"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </g>
            </svg>

            {/* Dots + tooltip vivem fora do sistema de coordenadas esticado do SVG, posicionados
                por porcentagem, para renderizarem como círculos/pílulas de verdade. */}
            {hasSecondary &&
              pointsSecondary.map((p, idx) => (
                <span
                  key={`sec-${idx}`}
                  className="chart-fade absolute -translate-x-1/2 -translate-y-1/2 p-[5px] cursor-pointer"
                  style={{ left: relX(p.x), top: relY(p.y), animationDelay: `${riseMs * 0.75}ms` }}
                  title={`${p.label} — ${legendSecondary}: ${p.value}${unit}`}
                >
                  <span className="block w-[5px] h-[5px] rounded-full ring-2 ring-white" style={{ backgroundColor: secondaryColor }} />
                </span>
              ))}

            {pointsPrimary.map((p, idx) => {
              const isLast = idx === pointsPrimary.length - 1;
              const isFocused = (hoverIdx ?? pointsPrimary.length - 1) === idx;
              return (
                <span
                  key={`prim-${idx}`}
                  className="chart-fade absolute -translate-x-1/2 -translate-y-1/2 p-[7px] cursor-pointer"
                  style={{ left: relX(p.x), top: relY(p.y), animationDelay: `${riseMs * 0.75}ms` }}
                  onMouseEnter={() => setHoverIdx(idx)}
                  onFocus={() => setHoverIdx(idx)}
                  tabIndex={0}
                >
                  <span
                    className={`block rounded-full bg-white transition-all ${isFocused ? 'w-[11px] h-[11px]' : 'w-[7px] h-[7px]'}`}
                    style={{ border: `${isFocused ? '2.5px' : '2px'} solid ${p.color || primaryColor}` }}
                  />
                  {isLast && (
                    <span
                      className="absolute inset-0 m-auto w-[5px] h-[5px] rounded-full pointer-events-none"
                      style={{ backgroundColor: p.color || primaryColor }}
                    />
                  )}
                </span>
              );
            })}

            {/* Badge fixo do valor mais recente — sempre visível junto ao último ponto */}
            {last && (
              <div
                className="chart-fade-in absolute -translate-x-1/2 -translate-y-[calc(100%+10px)] pointer-events-none"
                style={{ left: relX(last.x), top: relY(last.y), animationDelay: `${riseMs + 80}ms` }}
              >
                <span
                  className="inline-flex items-center justify-center h-4 min-w-[26px] px-1.5 rounded-full text-[9.5px] font-bold text-white whitespace-nowrap tabular-nums"
                  style={{ backgroundColor: primaryColor }}
                >
                  {badgeText}
                </span>
              </div>
            )}

            {/* Tooltip do ponto sob o mouse — mês, legenda e valor, como um card flutuante.
                Quando o ponto está perto do topo do gráfico, o tooltip nasce abaixo dele em
                vez de acima, senão fica cortado pela borda do card. */}
            {hoverIdx !== null && pointsPrimary[hoverIdx] && (
              <div
                className={`chart-fade-in absolute z-10 -translate-x-1/2 pointer-events-none ${
                  pointsPrimary[hoverIdx].y < svgHeight * 0.3
                    ? 'translate-y-[14px]'
                    : '-translate-y-[calc(100%+14px)]'
                }`}
                style={{ left: relX(pointsPrimary[hoverIdx].x), top: relY(pointsPrimary[hoverIdx].y) }}
              >
                <div className="bg-white rounded-lg shadow-lg border border-[#e4e8ee] px-3 py-2 whitespace-nowrap">
                  <div className="text-[11px] font-bold text-[#004e4c] mb-1">{pointsPrimary[hoverIdx].label}</div>
                  <div className="flex items-center gap-2 text-[11px]">
                    <span
                      className="w-2 h-2 rounded-full shrink-0"
                      style={{ backgroundColor: pointsPrimary[hoverIdx].color || primaryColor }}
                    />
                    <span className="text-[#6b7684] font-medium">{legendPrimary}</span>
                    <span className="font-bold text-[#004e4c] tabular-nums">
                      {formatVal(pointsPrimary[hoverIdx].value)}
                      {unit === '%' ? '%' : ''}
                    </span>
                  </div>
                </div>
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
      const color = d.color || CHART_CATEGORY_PALETTE[i % CHART_CATEGORY_PALETTE.length];
      return { ...d, color, start, end: accum };
    });

    const maxSliceValue = Math.max(...slices.map(s => s.value), 1);

    return (
      <div className="w-full h-full flex-1 min-h-0 @container">
      <div className="w-full h-full flex flex-col @[380px]:flex-row items-center justify-center gap-3 @[380px]:gap-5 overflow-hidden">
        <DonutChart
          key={chartType}
          slices={slices}
          showPercentLabels={false}
          outerClassName="w-[190px] h-[190px] @[380px]:w-[230px] @[380px]:h-[230px] @[520px]:w-[264px] @[520px]:h-[264px]"
          holeClassName="w-[148px] h-[148px] @[380px]:w-[179px] @[380px]:h-[179px] @[520px]:w-[206px] @[520px]:h-[206px]"
        >
          <div className="text-[24px] @[380px]:text-[28px] font-extrabold text-[#004e4c] leading-none">
            {total.toLocaleString('pt-BR')}
          </div>
          <div className="text-[9.5px] font-bold text-[#8a93a0] mt-1 tracking-wide text-center px-2">
            {(unit || 'Total').toUpperCase()}
          </div>
        </DonutChart>

        <div className="flex-1 min-w-0 w-full max-w-[380px] max-h-full overflow-y-auto">
          <div className="grid grid-cols-[minmax(60px,100px)_minmax(40px,60px)_minmax(90px,115px)] gap-x-3 text-[9.5px] uppercase tracking-wide text-[#8a93a0] font-bold pb-1.5 border-b border-[#f0f3f7]">
            <span>Categoria</span>
            <span className="text-right">Valor</span>
            <span className="text-right">% do total</span>
          </div>
          <div className="divide-y divide-[#f5f7f9]">
            {slices.map((item, idx) => {
              const pct = ((item.value / total) * 100).toFixed(1).replace('.', ',');
              const barPct = Math.max(4, (item.value / maxSliceValue) * 100);
              return (
                <div
                  key={`${item.label}-${idx}`}
                  className="chart-fade-in grid grid-cols-[minmax(60px,100px)_minmax(40px,60px)_minmax(90px,115px)] items-center gap-x-3 py-1.5"
                  style={{ animationDelay: `${250 + idx * 40}ms` }}
                >
                  <span className="flex items-center gap-1.5 min-w-0 text-[12px] text-[#4a5462] font-medium">
                    <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                    <span className="truncate">{item.label}</span>
                  </span>
                  <span className="text-right text-[12px] font-bold text-[#004e4c] tabular-nums">
                    {item.value.toLocaleString('pt-BR')}
                  </span>
                  <span className="flex items-center gap-1.5 justify-end">
                    <span className="text-[11px] text-[#6b7684] tabular-nums w-[38px] text-right shrink-0">{pct}%</span>
                    <span className="w-10 h-1.5 rounded-full bg-[#eef1f5] overflow-hidden hidden sm:block">
                      <span
                        className="chart-grow-w block h-full rounded-full"
                        style={{ width: `${barPct}%`, backgroundColor: item.color, animationDelay: `${300 + idx * 40}ms` }}
                      />
                    </span>
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
      </div>
    );
  }

  return null;
};
