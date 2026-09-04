import React, { useMemo, useState } from 'react';
import { ViewType, FilterItem } from '../types';
import { getSimulatedData } from '../utils/filterSimulator';
import { exportToExcel } from '../utils/exportUtils';
import { ViewHeader } from './ViewHeader';
import { FilterBar } from './FilterBar';
import { DateFilterValue } from './DateFilterPicker';
import { KpiSection } from './KpiSection';
import { TurmasPlanejadasCard } from './TurmasPlanejadasCard';
import { InstitucionaisView } from './InstitucionaisView';
import { InternosView } from './InternosView';
import { CentroCustoView } from './CentroCustoView';

interface IndicadoresFullPageViewProps {
  initialView: ViewType;
}

// No UI control exposes this in the Indicadores T&D screen either — it's a fixed baseline
// used by the simulator/export, matching App.tsx's default.
const AFASTADOS = true;

const UNIDADES_OPTIONS = ['Todas as unidades', 'Hospital Unimed', 'Pronto Atendimento', 'Unidade Retiro', 'Sede Administrativa'];
const TIPO_OPTIONS = ['Todos os tipos', 'Institucional', 'Institucional - Assistencial', 'Comportamental', 'Técnico / Operacional', 'Obrigatório (NR)'];

/** Self-contained replica of the Indicadores T&D screen (ViewHeader + filters + KPIs + Turmas
 * card + the active view's body), for embedding as a Dashboard panel — same components, same
 * simulated data, its own independent view/filter state so switching tabs here never touches
 * the real Indicadores T&D screen's state. */
export const IndicadoresFullPageView: React.FC<IndicadoresFullPageViewProps> = ({ initialView }) => {
  const [view, setView] = useState<ViewType>(initialView);
  const [exportMsg, setExportMsg] = useState('');

  const [dateFilter, setDateFilter] = useState<DateFilterValue>({
    mode: 'mensal',
    year: 2026,
    month: 7,
    monthName: 'Agosto',
    startDate: '2026-08-01',
    endDate: '2026-08-31',
    displayText: 'Agosto - 2026'
  });

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
    const filtersMap = getActiveFiltersMap();
    return [
      { label: 'Unidades', value: filtersMap.Unidades || 'Todas as unidades', options: UNIDADES_OPTIONS },
      { label: 'Tipo de Treinamento', value: filtersMap['Tipo de Treinamento'] || 'Todos os tipos', options: TIPO_OPTIONS }
    ];
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

  const simulatedData = useMemo(
    () => getSimulatedData(view, dateFilter, getActiveFiltersMap(), AFASTADOS),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [view, dateFilter, institucionaisFilters, internosFilters, centroCustoFilters]
  );

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
      AFASTADOS,
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

  const activeFilters = getActiveFilters();
  const printFiltersStr = [`Período: ${dateFilter.displayText}`, ...activeFilters.map(f => `${f.label}: ${f.value}`)].join('  ·  ');
  const printAfastadosStr = AFASTADOS
    ? 'Afastados (status bloqueado) incluídos na base de ativos'
    : 'Afastados excluídos da base de ativos';
  const printEmittedAt = new Date().toLocaleDateString('pt-BR');

  return (
    <div>
      {/* Print-only masthead — this is the actual "PDF" a viewer sees, since the interactive
          chrome (ViewHeader/FilterBar/toolbar) is hidden on print via .no-print. */}
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
          <div className="mt-0.5 text-[11px] text-[#6b7684]">{printFiltersStr}</div>
        </div>
        <div className="text-right text-[11px] text-[#6b7684]">
          <div>{printAfastadosStr}</div>
          <div>Emitido em {printEmittedAt}</div>
        </div>
      </div>

      <ViewHeader
        view={view}
        onViewChange={setView}
        onExportExcel={handleExportExcel}
        onExportPdf={handleExportPdf}
        exportStatus={exportMsg}
        showBreadcrumb={false}
        showTabs={false}
      />

      <FilterBar
        filters={getActiveFilters()}
        onFilterChange={handleFilterChange}
        dateFilter={dateFilter}
        onDateFilterChange={setDateFilter}
      />

      <KpiSection kpis={simulatedData.kpis} />

      <TurmasPlanejadasCard planejadas={turmasStats.planejadas} excedentes={turmasStats.excedentes} />

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

      {view === 'Por Centro de Custo' && <CentroCustoView rowsData={simulatedData.costCenterRowsData} />}

      <div className="print-only hidden items-center justify-between px-7 pt-2 mt-3.5 border-t border-[#dfe4ea] text-[10px] text-[#8a93a0]">
        <span>Lector Live · Indicadores T&amp;D — Unimed Volta Redonda</span>
        <span>{printAfastadosStr}</span>
        <span>Emitido em {printEmittedAt}</span>
      </div>
    </div>
  );
};
