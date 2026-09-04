import React, { useState, useMemo } from 'react';
import { DashboardCardItem, SupportedChartType, CHART_CATALOG } from '../data/dashboardCatalog';
import { DashboardChartRenderer } from './DashboardChartRenderer';
import { ViewType } from '../types';
import { getSimulatedData } from '../utils/filterSimulator';
import { exportToExcel } from '../utils/exportUtils';
import { DateFilterValue } from './DateFilterPicker';
import { KpiSection } from './KpiSection';
import { TurmasPlanejadasCard } from './TurmasPlanejadasCard';
import { InstitucionaisView } from './InstitucionaisView';
import { InternosView } from './InternosView';
import { CentroCustoView } from './CentroCustoView';

interface DetailedIndicadoresModalProps {
  isOpen: boolean;
  onClose: () => void;
  card: DashboardCardItem | null;
  onUpdateCardType?: (cardId: string, newType: SupportedChartType) => void;
  onUpdateCardCategory?: (cardId: string, newCategory: string) => void;
}

export const DetailedIndicadoresModal: React.FC<DetailedIndicadoresModalProps> = ({
  isOpen,
  onClose,
  card,
  onUpdateCardType,
  onUpdateCardCategory
}) => {
  const [activeReportTab, setActiveReportTab] = useState<ViewType>('Treinamentos Institucionais');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [exportNotice, setExportNotice] = useState('');

  // Default date filter for simulated T&D report
  const dateFilter: DateFilterValue = useMemo(
    () => ({
      mode: 'mensal',
      year: 2026,
      month: 7, // Agosto
      monthName: 'Agosto',
      startDate: '2026-08-01',
      endDate: '2026-08-31',
      displayText: 'Agosto - 2026'
    }),
    []
  );

  // Derive report data for the full T&D report
  const simulatedData = useMemo(() => {
    return getSimulatedData(activeReportTab, dateFilter, { 'Tipo de Treinamento': card?.selectedCategory || 'Todos os tipos' }, true);
  }, [activeReportTab, dateFilter, card?.selectedCategory]);

  const turmasStats = useMemo(() => {
    const sumPlan = simulatedData.costCenterRowsData.reduce((acc, r) => acc + r.turmasPlanejadas, 0);
    const sumExc = simulatedData.costCenterRowsData.reduce((acc, r) => acc + r.turmasExcedentes, 0);
    return {
      planejadas: sumPlan > 0 ? sumPlan * 18 : 142,
      excedentes: sumExc > 0 ? sumExc * 3 : 18
    };
  }, [simulatedData]);

  if (!isOpen || !card) return null;

  const handleExportReportExcel = () => {
    const filters = [
      { label: 'Período', value: dateFilter.displayText, options: [] },
      { label: 'Tipo de Treinamento', value: card.selectedCategory, options: [] }
    ];
    exportToExcel(
      activeReportTab,
      simulatedData.kpis,
      filters,
      true,
      simulatedData.monthlyData,
      simulatedData.trainingTypesData,
      simulatedData.agendaData,
      simulatedData.internalTrainingsData,
      simulatedData.jobPositionsData,
      simulatedData.costCenterRowsData
    );
    setExportNotice('Relatório Excel exportado com sucesso!');
    setTimeout(() => setExportNotice(''), 3500);
  };

  const handlePrint = () => {
    window.print();
  };

  // Calculate quick stats from chart data
  const totalValue = card.data.reduce((acc, d) => acc + d.value, 0);
  const maxValue = Math.max(...card.data.map(d => d.value), 0);
  const avgValue = card.data.length > 0 ? Math.round((totalValue / card.data.length) * 10) / 10 : 0;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 overflow-y-auto animate-fade-in select-none">
      <div
        className={`bg-[#f4f6f9] rounded-xl border border-[#cfd6e0] shadow-2xl flex flex-col transition-all overflow-hidden ${
          isFullscreen ? 'w-full h-full max-w-none max-h-none rounded-none' : 'w-full max-w-6xl max-h-[92vh]'
        }`}
      >
        {/* Modal Top Header */}
        <div className="p-4 px-6 bg-white text-[#1f2733] flex items-center justify-between border-b border-[#e4e8ee] shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[#f0f4f8] border border-[#d8e0ea] flex items-center justify-center">
              <i className="icon-performance text-[20px] text-[#f47920]"></i>
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-[17px] font-bold tracking-tight text-[#004e4c]">
                  Relatório &amp; Indicadores T&amp;D Detalhados
                </h2>
                <span className="text-[11px] font-bold bg-[#f47920] text-white px-2.5 py-0.5 rounded-full shadow-2xs">
                  {card.title}
                </span>
              </div>
              <p className="text-[12px] text-[#64748b] mt-0.5">
                Visão ampliada do gráfico em destaque com o relatório analítico completo da aba Indicadores T&amp;D.
              </p>
            </div>
          </div>

          {/* Quick Header Actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleExportReportExcel}
              className="h-8 px-3 rounded bg-white hover:bg-[#f0f4f8] text-[#004e4c] text-[12px] font-semibold flex items-center gap-1.5 transition-colors cursor-pointer border border-[#cfd6e0]"
              title="Exportar dados para planilha Excel"
            >
              <i className="icon-excel text-[13px] text-emerald-600"></i>
              <span className="hidden sm:inline">Exportar Excel</span>
            </button>

            <button
              onClick={handlePrint}
              className="h-8 px-3 rounded bg-white hover:bg-[#f0f4f8] text-[#004e4c] text-[12px] font-semibold flex items-center gap-1.5 transition-colors cursor-pointer border border-[#cfd6e0]"
              title="Imprimir ou Salvar em PDF"
            >
              <i className="icon-pdf text-[13px] text-rose-600"></i>
              <span className="hidden sm:inline">Imprimir / PDF</span>
            </button>

            <button
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="w-8 h-8 rounded-md bg-white hover:bg-[#f0f4f8] text-[#64748b] hover:text-[#004e4c] flex items-center justify-center transition-colors cursor-pointer border border-[#cfd6e0]"
              title={isFullscreen ? 'Restaurar janela' : 'Tela cheia'}
            >
              <i className="icon-fullscreen text-[14px]"></i>
            </button>

            <button
              onClick={onClose}
              className="w-8 h-8 rounded-md bg-[#f8fafc] hover:bg-rose-50 text-[#64748b] hover:text-rose-600 flex items-center justify-center transition-colors cursor-pointer border border-[#cfd6e0] ml-1"
              title="Fechar"
            >
              <i className="icon-close-mini text-[15px]"></i>
            </button>
          </div>
        </div>

        {/* Feedback notification toast */}
        {exportNotice && (
          <div className="bg-[#0f6b3f] text-white text-xs px-6 py-2 flex items-center justify-between animate-fade-in shrink-0">
            <div className="flex items-center gap-2">
              <i className="icon-calendar-today"></i>
              <span>{exportNotice}</span>
            </div>
            <button onClick={() => setExportNotice('')} className="text-white/80 hover:text-white">
              <i className="icon-close-mini"></i>
            </button>
          </div>
        )}

        {/* Modal Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6">
          {/* ============================================================ */}
          {/* SECTION 1: TOP HIGHLIGHTED CHART AREA */}
          {/* ============================================================ */}
          <div className="bg-white rounded-lg border border-[#cfd6e0] shadow-sm p-5">
            {/* Top Chart Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#e5e9f0]">
              <div>
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#f47920]"></span>
                  <h3 className="text-[17px] font-bold text-[#004e4c] tracking-tight">
                    {card.title}
                  </h3>
                  <span className="text-[11px] font-bold text-[#004e4c] bg-[#004e4c]/10 px-2 py-0.5 rounded">
                    Gráfico em Destaque
                  </span>
                </div>
                {card.subtitle && (
                  <p className="text-[12px] text-[#6b7684] mt-0.5 font-medium">
                    {card.subtitle}
                  </p>
                )}
              </div>

              {/* Chart Controls: Category & Type Selector */}
              <div className="flex flex-wrap items-center gap-2.5">
                {/* Category select */}
                <div className="flex items-center gap-1.5 text-xs text-[#4a5462]">
                  <span className="font-medium text-[#64748b]">Filtro:</span>
                  <div className="relative">
                    <select
                      value={card.selectedCategory}
                      onChange={e => onUpdateCardCategory?.(card.id, e.target.value)}
                      className="h-[30px] pl-2.5 pr-7 bg-[#f8fafc] border border-[#cfd6e0] rounded text-xs font-semibold text-[#004e4c] appearance-none cursor-pointer outline-none focus:border-[#004e4c]"
                    >
                      {card.availableCategories.map(c => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </select>
                    <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-[#f47920] text-[9px]">
                      <i className="icon-pointer-down"></i>
                    </div>
                  </div>
                </div>

                {/* Chart type selector pills */}
                <div className="flex items-center bg-[#f1f5f9] p-0.5 rounded border border-[#e2e8f0]">
                  {card.allowedTypes.map(t => (
                    <button
                      key={t}
                      onClick={() => onUpdateCardType?.(card.id, t)}
                      className={`px-2.5 py-1 text-[11px] font-bold rounded transition-all cursor-pointer ${
                        card.chartType === t
                          ? 'bg-[#004e4c] text-white shadow-2xs'
                          : 'text-[#64748b] hover:text-[#004e4c]'
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Quick KPI Strip for this Chart */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 my-4 bg-[#f8fafc] p-3 rounded-md border border-[#e8edf2]">
              <div className="text-center sm:text-left sm:pl-2">
                <span className="text-[10.5px] font-bold text-[#8a93a0] uppercase tracking-wider block">
                  Total Acumulado
                </span>
                <span className="text-[17px] font-bold text-[#004e4c]">
                  {totalValue.toLocaleString('pt-BR')} {card.unit ? <span className="text-[11px] font-medium text-[#6b7684]">{card.unit}</span> : ''}
                </span>
              </div>
              <div className="text-center sm:text-left sm:pl-2">
                <span className="text-[10.5px] font-bold text-[#8a93a0] uppercase tracking-wider block">
                  Média por Item
                </span>
                <span className="text-[17px] font-bold text-[#0f6b3f]">
                  {avgValue.toLocaleString('pt-BR')} {card.unit ? <span className="text-[11px] font-medium text-[#6b7684]">{card.unit}</span> : ''}
                </span>
              </div>
              <div className="text-center sm:text-left sm:pl-2">
                <span className="text-[10.5px] font-bold text-[#8a93a0] uppercase tracking-wider block">
                  Maior Registro
                </span>
                <span className="text-[17px] font-bold text-[#f47920]">
                  {maxValue.toLocaleString('pt-BR')} {card.unit ? <span className="text-[11px] font-medium text-[#6b7684]">{card.unit}</span> : ''}
                </span>
              </div>
              <div className="text-center sm:text-left sm:pl-2">
                <span className="text-[10.5px] font-bold text-[#8a93a0] uppercase tracking-wider block">
                  Formato Ativo
                </span>
                <span className="text-[14px] font-bold text-[#4a5462] flex items-center justify-center sm:justify-start gap-1 mt-0.5">
                  <i className="icon-performance text-[#f47920] text-[13px]"></i>
                  <span>Gráfico de {card.chartType}</span>
                </span>
              </div>
            </div>

            {/* Render High-Res Chart */}
            <div className="min-h-[260px] py-3 flex flex-col justify-center">
              <DashboardChartRenderer card={card} />
            </div>
          </div>

          {/* ============================================================ */}
          {/* SECTION 2: COMPLETE T&D INDICATORS REPORT (ABA COMPLETA) */}
          {/* ============================================================ */}
          <div className="bg-white rounded-lg border border-[#cfd6e0] shadow-sm overflow-hidden">
            {/* Section Header & Subtabs */}
            <div className="p-4 px-6 bg-white border-b border-[#e4e8ee] flex items-center justify-between">
              <div>
                <h3 className="text-[16px] font-bold flex items-center gap-2 text-[#004e4c]">
                  <i className="icon-performance text-[#f47920] text-[18px]"></i>
                  <span>Relatório Completo de Indicadores T&amp;D</span>
                </h3>
                <p className="text-xs text-[#64748b] mt-0.5">
                  Consolidação oficial de dados, metas, participantes e execução por centro de custo.
                </p>
              </div>
            </div>

            {/* View Subtabs: Treinamentos Institucionais / Internos / Centro de Custo */}
            <div className="flex border-b border-[#e4e8ee] bg-[#f8fafc] px-4 overflow-x-auto">
              {(['Treinamentos Institucionais', 'Treinamentos Internos', 'Por Centro de Custo'] as ViewType[]).map(tab => {
                const isActive = activeReportTab === tab;
                return (
                  <button
                    key={tab}
                    onClick={() => setActiveReportTab(tab)}
                    className={`h-[44px] px-5 border-none text-[13px] font-bold cursor-pointer transition-all border-b-2 whitespace-nowrap flex items-center gap-2 ${
                      isActive
                        ? 'bg-white text-[#004e4c] border-[#f47920] shadow-2xs'
                        : 'text-[#6b7684] border-transparent hover:text-[#004e4c] hover:bg-white/50'
                    }`}
                  >
                    <i
                      className={`${
                        tab === 'Treinamentos Institucionais'
                          ? 'icon-legal-document'
                          : tab === 'Treinamentos Internos'
                          ? 'icon-courses'
                          : 'icon-manage'
                      } text-[13px] ${isActive ? 'text-[#f47920]' : 'text-[#8a93a0]'}`}
                    ></i>
                    <span>{tab}</span>
                  </button>
                );
              })}
            </div>

            {/* Report Content Body */}
            <div className="p-5 sm:p-6 space-y-6">
              {/* 1. KPIs Section */}
              <div>
                <div className="text-[12px] font-bold text-[#8a93a0] uppercase tracking-wider mb-2">
                  Indicadores Chave de Desempenho (KPIs)
                </div>
                <KpiSection kpis={simulatedData.kpis} />
              </div>

              {/* 2. Turmas Planejadas x Excedentes */}
              <div>
                <TurmasPlanejadasCard
                  planejadas={turmasStats.planejadas}
                  excedentes={turmasStats.excedentes}
                />
              </div>

              {/* 3. Detailed Data View corresponding to Active Tab */}
              <div className="pt-2">
                <div className="text-[12px] font-bold text-[#8a93a0] uppercase tracking-wider mb-3">
                  Detalhamento Analítico — {activeReportTab}
                </div>

                {activeReportTab === 'Treinamentos Institucionais' && (
                  <InstitucionaisView
                    baseData={simulatedData.monthlyData}
                    tiposData={simulatedData.trainingTypesData}
                    agendaData={simulatedData.agendaData}
                  />
                )}

                {activeReportTab === 'Treinamentos Internos' && (
                  <InternosView
                    baseData={simulatedData.monthlyData}
                    treinamentosData={simulatedData.internalTrainingsData}
                    cargosData={simulatedData.jobPositionsData}
                  />
                )}

                {activeReportTab === 'Por Centro de Custo' && (
                  <CentroCustoView rowsData={simulatedData.costCenterRowsData} />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
