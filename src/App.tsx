import { useState, useMemo } from 'react';
import { ViewType, FilterItem } from './types';
import { getSimulatedData } from './utils/filterSimulator';
import { exportToExcel } from './utils/exportUtils';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { ViewHeader } from './components/ViewHeader';
import { FilterBar } from './components/FilterBar';
import { DateFilterValue } from './components/DateFilterPicker';
import { KpiSection } from './components/KpiSection';
import { TurmasPlanejadasCard } from './components/TurmasPlanejadasCard';
import { InstitucionaisView } from './components/InstitucionaisView';
import { InternosView } from './components/InternosView';
import { CentroCustoView } from './components/CentroCustoView';
import { DashboardView } from './components/DashboardView';
import { OtherViews } from './components/OtherViews';
import { Footer } from './components/Footer';

export default function App() {
  const [view, setView] = useState<ViewType>('Treinamentos Institucionais');
  const [sidebarItem, setSidebarItem] = useState('Dashboard');
  const [afastados, setAfastados] = useState(true);
  const [exportMsg, setExportMsg] = useState('');

  // Unified Date Filter State
  const [dateFilter, setDateFilter] = useState<DateFilterValue>({
    mode: 'mensal',
    year: 2026,
    month: 7, // 7 = Agosto
    monthName: 'Agosto',
    startDate: '2026-08-01',
    endDate: '2026-08-31',
    displayText: 'Agosto - 2026'
  });

  // Non-date contextual filters for each view
  const [institucionaisFilters, setInstitucionaisFilters] = useState<Record<string, string>>({
    Unidades: 'Todas as unidades',
    'Tipo de Treinamento': 'Todos os tipos'
  });

  const [internosFilters, setInternosFilters] = useState<Record<string, string>>({
    Unidades: 'Todas as unidades',
    'Tipo de Treinamento': 'Todos os tipos'
  });

  const [centroCustoFilters, setCentroCustoFilters] = useState<Record<string, string>>({
    Unidades: 'Todas as unidades',
    'Tipo de Treinamento': 'Todos os tipos'
  });

  const getActiveFiltersMap = (): Record<string, string> => {
    if (view === 'Treinamentos Institucionais') return institucionaisFilters;
    if (view === 'Treinamentos Internos') return internosFilters;
    return centroCustoFilters;
  };

  const getActiveFilters = (): FilterItem[] => {
    const unidadesOptions = ['Todas as unidades', 'Hospital Unimed', 'Pronto Atendimento', 'Unidade Retiro', 'Sede Administrativa'];
    const tipoOptions = ['Todos os tipos', 'Institucional', 'Institucional - Assistencial', 'Comportamental', 'Técnico / Operacional', 'Obrigatório (NR)'];

    if (view === 'Treinamentos Institucionais') {
      return [
        { label: 'Unidades', value: institucionaisFilters.Unidades || 'Todas as unidades', options: unidadesOptions },
        { label: 'Tipo de Treinamento', value: institucionaisFilters['Tipo de Treinamento'] || 'Todos os tipos', options: tipoOptions }
      ];
    } else if (view === 'Treinamentos Internos') {
      return [
        { label: 'Unidades', value: internosFilters.Unidades || 'Todas as unidades', options: unidadesOptions },
        { label: 'Tipo de Treinamento', value: internosFilters['Tipo de Treinamento'] || 'Todos os tipos', options: tipoOptions }
      ];
    } else {
      return [
        { label: 'Unidades', value: centroCustoFilters.Unidades || 'Todas as unidades', options: unidadesOptions },
        { label: 'Tipo de Treinamento', value: centroCustoFilters['Tipo de Treinamento'] || 'Todos os tipos', options: tipoOptions }
      ];
    }
  };

  const handleFilterChange = (label: string, value: string) => {
    if (view === 'Treinamentos Institucionais') {
      setInstitucionaisFilters(prev => ({ ...prev, [label]: value }));
    } else if (view === 'Treinamentos Internos') {
      setInternosFilters(prev => ({ ...prev, [label]: value }));
    } else {
      setCentroCustoFilters(prev => ({ ...prev, [label]: value }));
    }
  };

  // Dynamic simulated datasets that react to all active filters
  const simulatedData = useMemo(() => {
    return getSimulatedData(view, dateFilter, getActiveFiltersMap(), afastados);
  }, [view, dateFilter, institucionaisFilters, internosFilters, centroCustoFilters, afastados]);

  // Derived turmas calculations
  const turmasStats = useMemo(() => {
    const sumPlan = simulatedData.costCenterRowsData.reduce((acc, r) => acc + r.turmasPlanejadas, 0);
    const sumExc = simulatedData.costCenterRowsData.reduce((acc, r) => acc + r.turmasExcedentes, 0);
    return {
      planejadas: sumPlan > 0 ? sumPlan * 18 : 142,
      excedentes: sumExc > 0 ? sumExc * 3 : 18
    };
  }, [simulatedData]);

  const handleExportExcel = () => {
    const filters = [{ label: 'Período', value: dateFilter.displayText, options: [] }, ...getActiveFilters()];
    exportToExcel(
      view,
      simulatedData.kpis,
      filters,
      afastados,
      simulatedData.monthlyData,
      simulatedData.trainingTypesData,
      simulatedData.agendaData,
      simulatedData.internalTrainingsData,
      simulatedData.jobPositionsData,
      simulatedData.costCenterRowsData
    );
    setExportMsg('Excel gerado com sucesso');
    setTimeout(() => setExportMsg(''), 3500);
  };

  const handleExportPdf = () => {
    setExportMsg('Montando relatório para impressão...');
    setTimeout(() => {
      window.print();
      setTimeout(() => setExportMsg(''), 500);
    }, 300);
  };

  const currentFilters = getActiveFilters();
  const printFiltersStr = [`Período: ${dateFilter.displayText}`, ...currentFilters.map(f => `${f.label}: ${f.value}`)].join('  ·  ');
  const printAfastadosStr = afastados
    ? 'Afastados (status bloqueado) incluídos na base de ativos'
    : 'Afastados excluídos da base de ativos';

  return (
    <div className="min-h-screen min-w-[1024px] bg-[#f4f6f9] text-[#1f2733] flex flex-col font-['Barlow'] antialiased">
      {/* 1. Print Only Header */}
      <div className="print-only hidden items-end justify-between gap-5 px-7 pb-3 border-b-2 border-[#004e4c] mb-3.5 pt-1">
        <div>
          <div className="flex items-center gap-2.5">
            <img src="/logo-lector.svg" alt="Lector" className="h-5 w-auto object-contain" />
            <div className="text-[13px] font-bold text-[#004e4c] tracking-wider uppercase">
              Unimed Volta Redonda
            </div>
          </div>
          <div className="mt-1.5 text-[19px] font-bold text-[#004e4c]">
            Indicadores T&amp;D — {view}
          </div>
          <div className="mt-0.5 text-[11px] text-[#6b7684]">
            {printFiltersStr}
          </div>
        </div>
        <div className="text-right text-[11px] text-[#6b7684]">
          <div>{printAfastadosStr}</div>
        </div>
      </div>

      {/* 2. Web Top Header with Banner */}
      <Header />

      {/* 3. Main Layout Container: Sidebar + Content */}
      <div className="flex flex-1 items-stretch">
        {/* Left Sidebar */}
        <Sidebar activeItem={sidebarItem} onSelectItem={item => setSidebarItem(item)} />

        {/* Center/Right Dynamic Body */}
        <main className="flex-1 min-w-0 pb-6">
          {sidebarItem === 'Dashboard' ? (
            <DashboardView
              onGoToIndicadores={(subView?: ViewType) => {
                setSidebarItem('Indicadores T&D');
                if (subView) setView(subView);
              }}
            />
          ) : sidebarItem !== 'Indicadores T&D' ? (
            <OtherViews
              activeItem={sidebarItem}
              onGoToIndicadores={(subView?: ViewType) => {
                setSidebarItem('Indicadores T&D');
                if (subView) setView(subView);
              }}
            />
          ) : (
            <>
              {/* View Title, Breadcrumbs & Export CTA Buttons */}
              <ViewHeader
                view={view}
                onViewChange={setView}
                onExportExcel={handleExportExcel}
                onExportPdf={handleExportPdf}
                exportStatus={exportMsg}
              />

              {/* Dynamic Filters Bar */}
              <FilterBar
                filters={currentFilters}
                onFilterChange={handleFilterChange}
                dateFilter={dateFilter}
                onDateFilterChange={setDateFilter}
              />

              {/* KPI Summary Cards */}
              <KpiSection kpis={simulatedData.kpis} />

              {/* Turmas planejadas x excedentes */}
              <TurmasPlanejadasCard
                planejadas={turmasStats.planejadas}
                excedentes={turmasStats.excedentes}
              />

              {/* Active View Component */}
              {view === 'Treinamentos Institucionais' && (
                <InstitucionaisView
                  baseData={simulatedData.monthlyData}
                  tiposData={simulatedData.trainingTypesData}
                  agendaData={simulatedData.agendaData}
                />
              )}

              {view === 'Treinamentos Internos' && (
                <InternosView
                  baseData={simulatedData.monthlyData}
                  treinamentosData={simulatedData.internalTrainingsData}
                  cargosData={simulatedData.jobPositionsData}
                />
              )}

              {view === 'Por Centro de Custo' && (
                <CentroCustoView rowsData={simulatedData.costCenterRowsData} />
              )}
            </>
          )}
        </main>
      </div>

      {/* 4. Web Bottom Footer Banner */}
      <Footer />

      {/* 5. Print Only Footer */}
      <div className="print-only hidden items-center justify-between px-7 pt-2 border-t border-[#dfe4ea] text-[10px] text-[#8a93a0] mt-auto">
        <span>Lector Live · Indicadores T&amp;D — Unimed Volta Redonda</span>
        <span>{printAfastadosStr}</span>
        <span>Emitido em 31/08/2026</span>
      </div>
    </div>
  );
}
