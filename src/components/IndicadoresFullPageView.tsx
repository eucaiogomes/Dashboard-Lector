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

  return (
    <div>
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
    </div>
  );
};
