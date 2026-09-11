import React, { useMemo } from 'react';
import { getSimulatedData } from '../utils/filterSimulator';
import { DateFilterValue } from './DateFilterPicker';

interface InstitucionaisKpiBlockProps {
  period?: string;
  onVerDetalhes?: () => void;
}

// Protótipo "bento": ícone de destaque por KPI, mapeado pelo rótulo.
const KPI_ICONS: Record<string, string> = {
  'Total Previsto': 'icon-calendar-month',
  Agendado: 'icon-calendar-day',
  Realizado: 'icon-checked',
  'Não Realizado': 'icon-close-mini',
  'Percentual de Realização': 'icon-performance'
};

export const InstitucionaisKpiBlock: React.FC<InstitucionaisKpiBlockProps> = ({ period = 'Agosto - 2026' }) => {
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

  const simulatedData = useMemo(
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

  return (
    <div className="h-full w-full bg-white border border-[#e4e8ee] rounded-2xl shadow-[0_10px_25px_-14px_rgba(0,78,76,0.45)] p-4 @[420px]:p-5 flex flex-col gap-4 select-none @container overflow-hidden">
      {/* Cabeçalho do widget */}
      <div className="pb-4 border-b border-[#f0f3f7] shrink-0">
        <h2 className="text-[15px] font-bold text-[#004e4c] tracking-tight truncate">
          Resumo Geral de Treinamentos Institucionais (KPIs)
        </h2>
        <p className="text-[11px] text-[#6b7684] font-medium truncate">
          Previsto, agendado, realizado, pendente, adesão e turmas
        </p>
      </div>

      {/* 5 KPIs — seções internas da mesma caixa, sem sombra/elevação própria: nada aqui
          "flutua" separado, é tudo uma única superfície. As colunas e o tamanho do texto
          respondem à largura do próprio widget (container query), não à largura da janela —
          assim ele continua legível quando o card é redimensionado para menor no grid do
          Dashboard, em vez de truncar os rótulos. */}
      <div className="flex-1 min-h-0 grid grid-cols-2 @[360px]:grid-cols-3 @[520px]:grid-cols-4 @[680px]:grid-cols-5 gap-3">
        {simulatedData.kpis.map((kpi, index) => (
          <div
            key={index}
            className="bg-[#f8fafc] border border-[#e4e8ee] rounded-xl p-3.5 @[420px]:p-4 flex flex-col justify-center gap-1.5 min-w-0"
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
              <div className="text-[28px] @[360px]:text-[32px] @[520px]:text-[36px] font-bold text-[#004e4c] tracking-tight leading-none">
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
    </div>
  );
};
