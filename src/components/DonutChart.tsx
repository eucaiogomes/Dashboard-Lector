import React from 'react';

export interface DonutChartSlice {
  color: string;
  value: number;
}

interface DonutChartProps {
  slices: DonutChartSlice[];
  /** Classes de tamanho do anel externo (ex.: "w-[140px] h-[140px] sm:w-[170px] sm:h-[170px]") */
  outerClassName: string;
  /** Classes de tamanho do miolo/vazado — define a espessura do anel */
  holeClassName: string;
  /** Conteúdo central (rótulo/valor), renderizado dentro do miolo branco */
  children?: React.ReactNode;
  /** Mostra o percentual de cada fatia sobre o próprio anel (padrão: true) */
  showPercentLabels?: boolean;
  /** Posição radial do rótulo, de 0 (miolo) a 1 (borda externa) — padrão: meio do anel */
  labelRadius?: number;
}

/**
 * Donut padrão do app: anel em conic-gradient com costura branca fina entre fatias,
 * percentual de cada fatia escrito sobre o próprio anel, e animação de "varredura
 * angular" (chart-donut-in / chart-donut-sweep, ver index.css). Usado por todo gráfico
 * do tipo Pizza/Rosca — mesma técnica de desenho e mesma animação em qualquer card,
 * mudando só o tamanho e o conteúdo central por chamada.
 */
export const DonutChart: React.FC<DonutChartProps> = ({
  slices,
  outerClassName,
  holeClassName,
  children,
  showPercentLabels = true,
  labelRadius = 0.76
}) => {
  const total = slices.reduce((acc, s) => acc + s.value, 0) || 1;

  // Costura branca fina entre fatias adjacentes — dá o efeito de "arco com borda".
  const seamPct = 0.8;
  let accum = 0;
  const conicParts: string[] = [];
  const labeled: { pct: number; midPct: number }[] = [];
  slices.forEach((s, i) => {
    const pct = (s.value / total) * 100;
    const start = accum;
    accum += pct;
    const isLast = i === slices.length - 1;
    const drawEnd = isLast ? accum : Math.max(start, accum - seamPct);
    conicParts.push(`${s.color} ${start.toFixed(2)}% ${drawEnd.toFixed(2)}%`);
    if (!isLast) {
      conicParts.push(`#ffffff ${drawEnd.toFixed(2)}% ${accum.toFixed(2)}%`);
    }
    labeled.push({ pct, midPct: (start + accum) / 2 });
  });
  const conicStops = conicParts.join(', ');

  return (
    <div
      className={`chart-donut-in relative ${outerClassName} rounded-full flex items-center justify-center shrink-0 transition-transform hover:scale-[1.02]`}
      style={{ background: `conic-gradient(${conicStops})` }}
    >
      {showPercentLabels &&
        labeled.map((s, i) => {
          if (s.pct < 2.5) return null;
          // conic-gradient mede o ângulo em sentido horário a partir do topo (12h) —
          // convertido aqui para um deslocamento em % dentro do próprio círculo.
          const angleRad = (s.midPct / 100) * 2 * Math.PI;
          const dx = Math.sin(angleRad) * labelRadius * 50;
          const dy = -Math.cos(angleRad) * labelRadius * 50;
          return (
            <span
              key={i}
              className="chart-fade-in absolute text-[10.5px] sm:text-[11.5px] font-bold text-white leading-none pointer-events-none"
              style={{
                left: `calc(50% + ${dx}%)`,
                top: `calc(50% + ${dy}%)`,
                transform: 'translate(-50%, -50%)',
                textShadow: '0 1px 2px rgba(0,0,0,0.25)',
                animationDelay: '650ms'
              }}
            >
              {Math.round(s.pct)}%
            </span>
          );
        })}

      <div className={`${holeClassName} rounded-full bg-white flex flex-col items-center justify-center`}>
        {children}
      </div>
    </div>
  );
};
