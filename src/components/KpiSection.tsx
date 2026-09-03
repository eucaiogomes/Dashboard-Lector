import React from 'react';
import { KPIItem } from '../types';

interface KpiSectionProps {
  kpis: KPIItem[];
}

export const KpiSection: React.FC<KpiSectionProps> = ({ kpis }) => {
  return (
    <div
      className="pt-3.5 px-7 grid gap-3.5"
      style={{ gridTemplateColumns: `repeat(${kpis.length}, minmax(0, 1fr))` }}
    >
      {kpis.map((kpi, index) => (
        <div
          key={index}
          className="bg-white border border-[#e4e8ee] rounded-[6px] p-3.5 px-4.5 pb-4 flex flex-col gap-1.5 shadow-2xs transition-all hover:shadow-xs"
          style={{ borderTop: `3px solid ${kpi.barColor}` }}
        >
          <div className="text-[11.5px] uppercase tracking-wider text-[#8a93a0] font-semibold truncate">
            {kpi.label}
          </div>
          <div className="flex items-baseline gap-1.5">
            <div className="text-[30px] font-bold text-[#004e4c] tracking-tight leading-none">
              {kpi.value}
            </div>
            {kpi.unit && (
              <div className="text-[13px] text-[#8a93a0] font-medium">
                {kpi.unit}
              </div>
            )}
          </div>
          <div className="text-[12.5px] text-[#6b7684] truncate">
            {kpi.delta}
          </div>
        </div>
      ))}
    </div>
  );
};
