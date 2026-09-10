import React, { useMemo } from 'react';
import { getSimulatedData } from '../utils/filterSimulator';
import { DateFilterValue } from './DateFilterPicker';

interface InternosKpiBlockProps {
  period?: string;
  onVerDetalhes?: () => void;
}

export const InternosKpiBlock: React.FC<InternosKpiBlockProps> = ({ period = 'Agosto - 2026' }) => {
  const dateFilter: DateFilterValue = useMemo(() => ({
    mode: 'mensal',
    year: 2026,
    month: 7,
    monthName: 'Agosto',
    startDate: '2026-08-01',
    endDate: '2026-08-31',
    displayText: period
  }), [period]);

  const simulatedData = useMemo(
    () => getSimulatedData('Treinamentos Internos', dateFilter, {
      Unidades: 'Todas as unidades',
      'Tipo de Treinamento': 'Todos os tipos'
    }, true),
    [dateFilter]
  );

  const turmasStats = useMemo(() => {
    const sumPlan = simulatedData.costCenterRowsData.reduce((acc, r) => acc + r.turmasPlanejadas, 0);
    const sumExc = simulatedData.costCenterRowsData.reduce((acc, r) => acc + r.turmasExcedentes, 0);
    return {
      planejadas: sumPlan > 0 ? sumPlan * 18 : 414,
      excedentes: sumExc > 0 ? sumExc * 3 : 18
    };
  }, [simulatedData]);

  const esforcoPct = turmasStats.planejadas > 0
    ? ((turmasStats.excedentes / turmasStats.planejadas) * 100).toFixed(1).replace('.', ',')
    : '4,3';

  return (
    <div className="h-full w-full bg-white rounded-[6px] border border-[#e0e5eb] shadow-2xs p-4 flex flex-col select-none">
      {/* 4 KPIs grid — flex-1 lets the tiles themselves grow into extra card height
          (and recenter their content) instead of leaving a dead gap before the strip below. */}
      <div className="flex-1 min-h-0 grid grid-cols-2 md:grid-cols-4 gap-3">
        {simulatedData.kpis.map((kpi, index) => (
          <div
            key={index}
            className="bg-[#f8fafc] border border-[#e4e8ee] rounded-[6px] p-3 flex flex-col justify-center gap-1 shadow-2xs transition-all hover:bg-white"
            style={{ borderTop: `3px solid ${kpi.barColor || '#004e4c'}` }}
          >
            <div className="text-[11px] uppercase tracking-wider text-[#8a93a0] font-semibold truncate">
              {kpi.label}
            </div>
            <div className="flex items-baseline gap-1">
              <div className="text-[26px] font-bold text-[#004e4c] tracking-tight leading-none">
                {kpi.value}
              </div>
              {kpi.unit && (
                <div className="text-[12px] text-[#8a93a0] font-medium">
                  {kpi.unit}
                </div>
              )}
            </div>
            <div className="text-[11.5px] text-[#6b7684] truncate">
              {kpi.delta}
            </div>
          </div>
        ))}
      </div>

      {/* Turmas planejadas x excedentes strip */}
      <div className="mt-3 pt-3 border-t border-[#f0f3f7] flex flex-wrap items-center justify-between gap-4 shrink-0">
        <div>
          <div className="text-[12.5px] font-bold text-[#004e4c]">
            Turmas planejadas x excedentes
          </div>
          <div className="text-[11px] text-[#8a93a0]">
            Acompanhamento de esforço operacional e turmas extraordinárias
          </div>
        </div>

        <div className="flex items-center gap-6 text-right">
          <div>
            <div className="text-[18px] font-bold text-[#004e4c] leading-tight">
              {turmasStats.planejadas}
            </div>
            <div className="text-[10.5px] text-[#8a93a0] font-medium">
              Planejadas
            </div>
          </div>
          <div>
            <div className="text-[18px] font-bold text-[#00995d] leading-tight">
              {turmasStats.excedentes}
            </div>
            <div className="text-[10.5px] text-[#8a93a0] font-medium">
              Excedentes
            </div>
          </div>
          <div>
            <div className="text-[18px] font-bold text-[#004e4c] leading-tight">
              {esforcoPct}%
            </div>
            <div className="text-[10.5px] text-[#8a93a0] font-medium">
              Esforço extra
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
