import React, { useMemo } from 'react';
import { getSimulatedData } from '../utils/filterSimulator';
import { DateFilterValue } from './DateFilterPicker';

interface TurmasPlanejadasExcedentesBlockProps {
  period?: string;
  simulatedData?: ReturnType<typeof getSimulatedData>;
  onVerDetalhes?: () => void;
}

/**
 * Faixa isolada de "Turmas planejadas x excedentes" — mesmo cálculo (e mesmos números)
 * que já saía embutido nos dois Resumos Gerais (Institucionais/Internos), agora como um
 * card próprio para quem quiser esse indicador sozinho no Dashboard.
 */
export const TurmasPlanejadasExcedentesBlock: React.FC<TurmasPlanejadasExcedentesBlockProps> = ({
  period = 'Agosto - 2026',
  simulatedData: propSimulatedData,
  onVerDetalhes
}) => {
  const dateFilter: DateFilterValue = useMemo(
    () => ({
      mode: 'mensal',
      year: 2026,
      month: 7,
      monthName: 'Agosto',
      startDate: '2026-08-01',
      endDate: '2026-08-31',
      displayText: period
    }),
    [period]
  );

  const localSimulatedData = useMemo(
    () =>
      getSimulatedData(
        'Treinamentos Institucionais',
        dateFilter,
        {
          Unidades: 'Todas as unidades',
          'Tipo de Treinamento': 'Todos os tipos'
        },
        true
      ),
    [dateFilter]
  );

  const simulatedData = propSimulatedData || localSimulatedData;

  const turmasStats = useMemo(() => {
    const sumPlan = simulatedData.costCenterRowsData.reduce((acc, r) => acc + r.turmasPlanejadas, 0);
    const sumExc = simulatedData.costCenterRowsData.reduce((acc, r) => acc + r.turmasExcedentes, 0);
    return {
      planejadas: sumPlan > 0 ? sumPlan * 18 : 414,
      excedentes: sumExc > 0 ? sumExc * 3 : 18
    };
  }, [simulatedData]);

  const esforcoPct =
    turmasStats.planejadas > 0
      ? ((turmasStats.excedentes / turmasStats.planejadas) * 100).toFixed(1).replace('.', ',')
      : '4,3';

  return (
    <div className="h-full w-full bg-white border border-[#e4e8ee] rounded-2xl shadow-[0_10px_25px_-14px_rgba(0,78,76,0.45)] p-4 flex flex-wrap items-center justify-between gap-4 select-none">
      <div className="min-w-0">
        <div className="text-[14px] font-bold text-[#004e4c]">
          Turmas planejadas x excedentes
        </div>
        <div className="text-[12px] text-[#8a93a0]">
          Acompanhamento de esforço operacional e turmas extraordinárias
        </div>
      </div>

      <div className="flex items-center gap-7 text-center shrink-0">
        <div>
          <div className="text-[22px] font-bold text-[#004e4c] leading-tight">
            {turmasStats.planejadas}
          </div>
          <div className="text-[11.5px] text-[#8a93a0] font-medium">
            Planejadas
          </div>
        </div>
        <div>
          <div className="text-[22px] font-bold text-[#00995d] leading-tight">
            {turmasStats.excedentes}
          </div>
          <div className="text-[11.5px] text-[#8a93a0] font-medium">
            Excedentes
          </div>
        </div>
        <div>
          <div className="text-[22px] font-bold text-[#00995d] leading-tight">
            {esforcoPct}%
          </div>
          <div className="text-[11.5px] text-[#8a93a0] font-medium">
            Esforço extra
          </div>
        </div>
      </div>
    </div>
  );
};
