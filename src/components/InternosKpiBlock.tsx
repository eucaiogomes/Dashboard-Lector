import React, { useMemo } from 'react';
import { getSimulatedData } from '../utils/filterSimulator';
import { DateFilterValue } from './DateFilterPicker';

interface InternosKpiBlockProps {
  period?: string;
  onVerDetalhes?: () => void;
}

// Mesmo padrão "bento" do InstitucionaisKpiBlock: ícone de destaque por KPI, mapeado pelo rótulo.
const KPI_ICONS: Record<string, string> = {
  'Qtd. Treinamentos Internos': 'icon-courses',
  'Qtd. Total Participantes': 'icon-participants',
  'Qtd. Colab. Treinados': 'icon-students',
  'Horas Treinadas': 'icon-clock'
};

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
    <div className="h-full w-full flex flex-col gap-3 select-none @container">
      {/* 4 KPIs — cada um é seu próprio card (fundo branco, sombra e borda superior verde),
          em vez de uma faixa de blocos dentro de um único card agrupador. As colunas e o
          tamanho do texto respondem à largura do próprio widget (container query), não à
          largura da janela — assim ele continua legível quando o card é redimensionado
          para menor no grid do Dashboard, em vez de truncar os rótulos. */}
      <div className="flex-1 min-h-0 grid grid-cols-2 @[420px]:grid-cols-3 @[560px]:grid-cols-4 gap-3">
        {simulatedData.kpis.map((kpi, index) => (
          <div
            key={index}
            className="bg-white border border-[#e4e8ee] rounded-2xl p-3.5 @[420px]:p-4 flex flex-col justify-center gap-1.5 shadow-[0_10px_25px_-14px_rgba(0,78,76,0.45)] transition-all hover:shadow-[0_14px_28px_-12px_rgba(0,78,76,0.5)] hover:-translate-y-0.5 min-w-0"
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 @[420px]:w-9 @[420px]:h-9 rounded-full bg-[#cde3bb]/60 flex items-center justify-center shrink-0">
                <i className={`${KPI_ICONS[kpi.label] || 'icon-performance'} text-[15px] @[420px]:text-[16px] text-[#00995d]`}></i>
              </div>
              <div className="text-[10.5px] @[420px]:text-[12px] uppercase tracking-wide @[420px]:tracking-wider text-[#8a93a0] font-semibold leading-tight line-clamp-3 min-w-0">
                {kpi.label}
              </div>
            </div>
            <div className="flex items-baseline gap-1.5">
              <div className="text-[28px] @[380px]:text-[32px] @[560px]:text-[36px] font-bold text-[#004e4c] tracking-tight leading-none">
                {kpi.value}
              </div>
              {kpi.unit && (
                <div className="text-[14px] text-[#8a93a0] font-medium">
                  {kpi.unit}
                </div>
              )}
            </div>
            <div className="text-[12px] @[420px]:text-[12.5px] text-[#6b7684] truncate">
              {kpi.delta}
            </div>
          </div>
        ))}
      </div>

      {/* Turmas planejadas x excedentes — também seu próprio card */}
      <div className="bg-white border border-[#e4e8ee] rounded-2xl p-4 shadow-[0_10px_25px_-14px_rgba(0,78,76,0.45)] flex flex-wrap items-center justify-between gap-4 shrink-0">
        <div>
          <div className="text-[14px] font-bold text-[#004e4c]">
            Turmas planejadas x excedentes
          </div>
          <div className="text-[12px] text-[#8a93a0]">
            Acompanhamento de esforço operacional e turmas extraordinárias
          </div>
        </div>

        <div className="flex items-center gap-7 text-right">
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
    </div>
  );
};
