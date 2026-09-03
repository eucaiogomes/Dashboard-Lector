import React, { useEffect, useState } from 'react';
import GridLayout, { LayoutItem, useContainerWidth } from 'react-grid-layout';
import {
  CHART_CATALOG,
  CHART_GROUPS,
  DEFAULT_TRAINING_CATEGORIES,
  SPECIAL_WIDGET_IDS,
  CatalogChartDef,
  DashboardCardItem,
  SupportedChartType
} from '../data/dashboardCatalog';
import { DashboardChartRenderer } from './DashboardChartRenderer';
import { InstitucionaisTabsBlock } from './InstitucionaisTabsBlock';
import { InstitucionaisPercentualBlock } from './InstitucionaisPercentualBlock';
import { AgendaBlock } from './AgendaBlock';
import { InternosEvolucaoBlock } from './InternosEvolucaoBlock';
import { AtivosTreinadosBlock } from './AtivosTreinadosBlock';
import { TreinamentosRankingBlock } from './TreinamentosRankingBlock';
import { RankingCargoBlock } from './RankingCargoBlock';
import { CentroCustoTableBlock } from './CentroCustoTableBlock';
import { TurmasExecucaoDonutBlock } from './TurmasExecucaoDonutBlock';
import { AddChartModal } from './AddChartModal';
import { DetailedIndicadoresModal } from './DetailedIndicadoresModal';
import { ReportDetailOverlay } from './ReportDetailOverlay';
import { REPORT_DEFINITIONS } from '../data/reportDefinitions';
import { ViewType } from '../types';
import {
  GRID_COLS,
  GRID_MARGIN,
  ROW_HEIGHT,
  MIN_W,
  MIN_H,
  MAX_W,
  MAX_H,
  loadStoredLayout,
  reconcileLayout,
  saveStoredLayout
} from '../utils/gridLayout';

interface SpecialWidgetProps {
  onVerDetalhes?: () => void;
}

/** Maps each special-widget catalog id to the bespoke component that renders it, bypassing
 * the generic chart renderer / card chrome. See dashboardCatalog.ts SPECIAL_WIDGET_IDS. */
const SPECIAL_WIDGETS: Record<string, React.FC<SpecialWidgetProps>> = {
  [SPECIAL_WIDGET_IDS.institucionaisTabs]: InstitucionaisTabsBlock,
  [SPECIAL_WIDGET_IDS.institucionaisPercentual]: InstitucionaisPercentualBlock,
  [SPECIAL_WIDGET_IDS.institucionaisAgenda]: AgendaBlock,
  [SPECIAL_WIDGET_IDS.internosEvolucao]: InternosEvolucaoBlock,
  [SPECIAL_WIDGET_IDS.internosAtivosTreinados]: AtivosTreinadosBlock,
  [SPECIAL_WIDGET_IDS.internosTreinamentosHoras]: TreinamentosRankingBlock,
  [SPECIAL_WIDGET_IDS.internosRankingCargo]: RankingCargoBlock,
  [SPECIAL_WIDGET_IDS.centroCustoTabela]: CentroCustoTableBlock,
  [SPECIAL_WIDGET_IDS.turmasExecucao]: TurmasExecucaoDonutBlock
};

/** Default cards shown when the Dashboard loads, with fixed positions/sizes mirroring how
 * the source screens are laid out (Indicadores T&D — Institucionais/Internos) and the
 * reference Qlik "Treinamentos Institucionais" panel: a full-width summary up top, then each
 * section grouped together — a tall "evolution" block beside its stacked companions, wide
 * tables spanning the full row. 12-column grid, 8 height-units per default row. */
const DEFAULT_LAYOUT_SPEC: { catalogId: string; x: number; y: number; w: number; h: number }[] = [
  // Execução das Turmas — full-width summary at the top, like the Qlik KPI strip.
  { catalogId: SPECIAL_WIDGET_IDS.turmasExecucao, x: 0, y: 0, w: 12, h: 8 },

  // Institucionais — tabbed evolution (tall, left) beside % Realização + Agenda (stacked, right).
  { catalogId: SPECIAL_WIDGET_IDS.institucionaisTabs, x: 0, y: 8, w: 6, h: 16 },
  { catalogId: SPECIAL_WIDGET_IDS.institucionaisPercentual, x: 6, y: 8, w: 6, h: 8 },
  { catalogId: SPECIAL_WIDGET_IDS.institucionaisAgenda, x: 6, y: 16, w: 6, h: 8 },

  // Internos — Evolução (tall, left) / Ativos x Treinados + Treinamentos (stacked, middle) /
  // Ranking por Cargo (tall, right) — same 3-column arrangement as the original screen.
  { catalogId: SPECIAL_WIDGET_IDS.internosEvolucao, x: 0, y: 24, w: 4, h: 16 },
  { catalogId: SPECIAL_WIDGET_IDS.internosAtivosTreinados, x: 4, y: 24, w: 4, h: 8 },
  { catalogId: SPECIAL_WIDGET_IDS.internosTreinamentosHoras, x: 4, y: 32, w: 4, h: 8 },
  { catalogId: SPECIAL_WIDGET_IDS.internosRankingCargo, x: 8, y: 24, w: 4, h: 16 },

  // Centro de Custo — full-width table at the bottom.
  { catalogId: SPECIAL_WIDGET_IDS.centroCustoTabela, x: 0, y: 40, w: 12, h: 8 }
];

/** Builds the default cards + their grid layout together from DEFAULT_LAYOUT_SPEC, so each
 * card id lines up with its fixed slot. */
const createDefaultDashboard = (period: string): { cards: DashboardCardItem[]; layout: LayoutItem[] } => {
  const cards: DashboardCardItem[] = [];
  const layout: LayoutItem[] = [];
  const defaultCat = 'Todos os Treinamentos';

  DEFAULT_LAYOUT_SPEC.forEach(spec => {
    const chartDef = CHART_CATALOG.find(c => c.id === spec.catalogId);
    if (!chartDef) return;

    const generated = chartDef.generateData({ period, category: defaultCat });
    const cardId = `card_${chartDef.id}`;
    cards.push({
      id: cardId,
      catalogId: chartDef.id,
      title: chartDef.title,
      subtitle: chartDef.subtitle,
      group: chartDef.group,
      chartType: chartDef.defaultType,
      allowedTypes: chartDef.allowedTypes,
      selectedCategory: defaultCat,
      availableCategories: chartDef.categories || DEFAULT_TRAINING_CATEGORIES,
      maxScale: generated.maxScale,
      ticks: generated.ticks,
      unit: chartDef.unit,
      data: generated.data,
      meta: generated.meta
    });

    layout.push({
      i: cardId,
      x: spec.x,
      y: spec.y,
      w: spec.w,
      h: spec.h,
      minW: MIN_W,
      minH: MIN_H,
      maxW: MAX_W,
      maxH: MAX_H
    });
  });

  return { cards, layout };
};

interface DashboardViewProps {
  onGoToIndicadores?: (subView?: ViewType) => void;
}

/** Mirrors the previous `lg:` Tailwind breakpoint that switched the card grid from a stacked
 * single column to a multi-column layout — below it, drag/resize is disabled and cards stack. */
const useIsDesktop = (breakpointPx = 1024): boolean => {
  const [isDesktop, setIsDesktop] = useState(
    () => typeof window !== 'undefined' && window.innerWidth >= breakpointPx
  );

  useEffect(() => {
    const mql = window.matchMedia(`(min-width: ${breakpointPx}px)`);
    const handler = () => setIsDesktop(mql.matches);
    handler();
    mql.addEventListener('change', handler);
    return () => mql.removeEventListener('change', handler);
  }, [breakpointPx]);

  return isDesktop;
};

export const DashboardView: React.FC<DashboardViewProps> = ({ onGoToIndicadores }) => {
  const [selectedPeriod, setSelectedPeriod] = useState('Agosto - 2026');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [openTypeDropdown, setOpenTypeDropdown] = useState<string | null>(null);
  const [selectedCardForModal, setSelectedCardForModal] = useState<DashboardCardItem | null>(null);
  const [detailsReportCatalogId, setDetailsReportCatalogId] = useState<string | null>(null);

  // Dashboard starts with the 8 default "bloco completo" widgets — the user can remove,
  // rearrange or add more from the catalog.
  const [cards, setCards] = useState<DashboardCardItem[]>(
    () => createDefaultDashboard('Agosto - 2026').cards
  );

  // Card layout (position/size on the grid) — restored from localStorage when available,
  // otherwise falls back to the default arrangement.
  const [layout, setLayout] = useState<LayoutItem[]>(() => {
    const cardIds = cards.map(c => c.id);
    const stored = loadStoredLayout();
    return stored.length > 0
      ? reconcileLayout(stored, cardIds)
      : createDefaultDashboard('Agosto - 2026').layout;
  });

  const isDesktop = useIsDesktop();
  const { width: gridWidth, mounted: gridMounted, containerRef: gridContainerRef } = useContainerWidth();

  useEffect(() => {
    saveStoredLayout(layout);
  }, [layout]);

  // `cards` and `layout` are updated together, synchronously, at every mutation site below
  // (add/remove/reset) rather than via a separate effect reacting to `cards`. This matters:
  // react-grid-layout also auto-assigns a (tiny, useless) default slot to any child it renders
  // without a matching layout entry — if our own reconciliation instead ran a tick later in its
  // own effect, the two would fight over the new card's slot every render and loop forever.
  const handleRemoveCard = (cardId: string) => {
    setCards(prev => prev.filter(c => c.id !== cardId));
    setLayout(prev => prev.filter(item => item.i !== cardId));
  };

  const handleAddChartFromCatalog = (chartDef: CatalogChartDef) => {
    const defaultCat = 'Todos os Treinamentos';
    const generated = chartDef.generateData({ period: selectedPeriod, category: defaultCat });
    const newCard: DashboardCardItem = {
      id: `card_${chartDef.id}_${Date.now()}`,
      catalogId: chartDef.id,
      title: chartDef.title,
      subtitle: chartDef.subtitle,
      group: chartDef.group,
      chartType: chartDef.defaultType,
      allowedTypes: chartDef.allowedTypes,
      selectedCategory: defaultCat,
      availableCategories: chartDef.categories || DEFAULT_TRAINING_CATEGORIES,
      maxScale: generated.maxScale,
      ticks: generated.ticks,
      unit: chartDef.unit,
      data: generated.data,
      meta: generated.meta
    };

    setCards(prev => [...prev, newCard]);
    setLayout(prev => reconcileLayout(prev, [...prev.map(item => item.i), newCard.id]));
  };

  const handleChangeChartType = (cardId: string, newType: SupportedChartType) => {
    setCards(prev =>
      prev.map(card => (card.id === cardId ? { ...card, chartType: newType } : card))
    );
    setOpenTypeDropdown(null);
  };

  const handleCardCategoryChange = (cardId: string, newCategory: string) => {
    setCards(prev =>
      prev.map(card => {
        if (card.id !== cardId) return card;
        const chartDef = CHART_CATALOG.find(c => c.id === card.catalogId);
        if (!chartDef) return { ...card, selectedCategory: newCategory };

        const regenerated = chartDef.generateData({ period: selectedPeriod, category: newCategory });
        return {
          ...card,
          selectedCategory: newCategory,
          data: regenerated.data,
          maxScale: regenerated.maxScale,
          ticks: regenerated.ticks,
          meta: regenerated.meta
        };
      })
    );
  };

  const handleResetDefaultCards = () => {
    const { cards: defaultCards, layout: defaultLayout } = createDefaultDashboard(selectedPeriod);
    setCards(defaultCards);
    setLayout(defaultLayout);
  };

  const existingChartIds = cards.map(c => c.catalogId);

  const renderCard = (card: DashboardCardItem, options: { interactive: boolean; heightPx?: number }) => {
    const groupInfo = CHART_GROUPS.find(g => g.id === card.group);

    // Special widgets: these blocks are embedded exactly as they are in Indicadores T&D —
    // each already has its own title, tabs/switcher and footer, so it skips the generic
    // card chrome (category filter, chart-type footer) and only keeps a drag handle +
    // remove button so it behaves like any other card on the grid.
    const SpecialWidget = SPECIAL_WIDGETS[card.catalogId];
    if (SpecialWidget) {
      const hasReport = !!REPORT_DEFINITIONS[card.catalogId];
      return (
        <div
          key={card.id}
          style={options.heightPx ? { height: options.heightPx } : undefined}
          className="h-full w-full flex flex-col relative group/special"
        >
          {options.interactive && (
            <div
              className="dash-card-drag-handle absolute inset-x-0 top-0 h-7 flex items-center justify-end px-2 cursor-move z-10 opacity-0 group-hover/special:opacity-100 transition-opacity"
              title="Arraste para mover o card"
            >
              <button
                onClick={() => handleRemoveCard(card.id)}
                className="no-drag text-[#8a93a0] hover:text-[#f47920] p-1 transition-colors cursor-pointer rounded bg-white/90 hover:bg-[#f5f8fa] shadow-2xs"
                title="Remover gráfico do Dashboard"
              >
                <i className="icon-close-mini text-[14px]"></i>
              </button>
            </div>
          )}
          <div className="flex-1 min-h-0 overflow-auto">
            {/* "Ver Detalhes" is rendered by the widget itself, as a real row inside its own
                card — so it always sits fully inside the card's frame instead of floating
                over the chart when the card is taller than its content. */}
            <SpecialWidget
              onVerDetalhes={hasReport ? () => setDetailsReportCatalogId(card.catalogId) : undefined}
            />
          </div>
        </div>
      );
    }

    return (
      <div
        key={card.id}
        style={options.heightPx ? { height: options.heightPx } : undefined}
        className="h-full w-full bg-white rounded-[6px] border border-[#e0e5eb] shadow-2xs p-5 flex flex-col hover:border-[#cfd8e3] transition-all relative"
      >
        {/* Card Top Header with Internal Category Filter and Close Button */}
        <div
          className={`pb-2 border-b border-[#f0f3f7] shrink-0 ${
            options.interactive ? 'dash-card-drag-handle' : ''
          }`}
        >
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0 flex-1 flex items-start gap-1.5">
              {options.interactive && (
                <i
                  className="icon-menu-dots text-[12px] text-[#c3cad4] mt-1 shrink-0 rotate-90"
                  title="Arraste para mover o card"
                  aria-hidden="true"
                ></i>
              )}
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <h2 className="text-[15.5px] font-bold text-[#004e4c] tracking-tight">
                    {card.title}
                  </h2>
                  {groupInfo && (
                    <span className="text-[9.5px] font-bold text-[#004e4c] bg-[#004e4c]/10 px-1.5 py-0.5 rounded">
                      {groupInfo.name.split('(')[0].trim()}
                    </span>
                  )}
                </div>

                {card.subtitle && (
                  <p className="text-[11px] text-[#6b7684] mt-0.5 font-medium truncate">
                    {card.subtitle}
                  </p>
                )}
              </div>
            </div>

            {/* Action buttons on the right of the card header */}
            <div className="flex items-center gap-2 shrink-0 no-drag">
              {/* Tipo de Treinamento Dropdown inside the chart card */}
              <div className="relative">
                <select
                  value={card.selectedCategory}
                  onChange={e => handleCardCategoryChange(card.id, e.target.value)}
                  className="h-[28px] pl-2.5 pr-7 bg-[#f8fafc] hover:bg-[#f1f5f9] border border-[#cfd6e0] rounded text-[11.5px] text-[#334155] font-semibold appearance-none cursor-pointer outline-none focus:border-[#004e4c] transition-colors max-w-[190px] sm:max-w-[210px] truncate"
                  title="Filtrar tipo de treinamento neste gráfico"
                >
                  {card.availableCategories.map(cat => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
                <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-[#f47920] text-[9px]">
                  <i className="icon-pointer-down"></i>
                </div>
              </div>

              {/* Remove card button */}
              <button
                onClick={() => handleRemoveCard(card.id)}
                className="text-[#8a93a0] hover:text-[#f47920] p-1 transition-colors cursor-pointer rounded hover:bg-[#f5f8fa]"
                title="Remover gráfico do Dashboard"
              >
                <i className="icon-close-mini text-[14px]"></i>
              </button>
            </div>
          </div>
        </div>

        {/* Chart Graphic Area */}
        <div
          className={`py-2 flex-1 min-h-0 flex flex-col ${
            card.chartType === 'Tabela' ? 'overflow-auto' : 'overflow-hidden'
          }`}
        >
          <DashboardChartRenderer card={card} />
        </div>

        {/* Card Footer / Chart Type Selector & Detailed Indicators CTA */}
        <div className="pt-3 mt-3 border-t border-[#f0f3f7] shrink-0 flex flex-wrap items-center justify-between gap-2 text-[12.5px] no-drag">
          <div className="flex items-center gap-1.5 text-[#606d80] relative">
            <span>Tipo de gráfico:</span>
            <button
              onClick={() => setOpenTypeDropdown(openTypeDropdown === card.id ? null : card.id)}
              className="font-semibold text-[#f47920] hover:underline flex items-center gap-1 cursor-pointer"
            >
              <span>{card.chartType}</span>
              <i className="icon-pointer-down text-[9px]"></i>
            </button>

            {/* Chart type dropdown menu */}
            {openTypeDropdown === card.id && (
              <div className="absolute left-24 bottom-6 bg-white border border-[#dfe4ea] rounded-[4px] shadow-lg py-1 z-30 min-w-[120px]">
                {card.allowedTypes.map(t => (
                  <button
                    key={t}
                    onClick={() => handleChangeChartType(card.id, t)}
                    className={`w-full text-left px-3 py-1.5 text-[12px] hover:bg-[#f5f8fa] hover:text-[#004e4c] flex items-center justify-between cursor-pointer ${
                      card.chartType === t
                        ? 'text-[#f47920] font-bold bg-[#f47920]/5'
                        : 'text-[#4a5462]'
                    }`}
                  >
                    <span>{t}</span>
                    {card.chartType === t && <i className="icon-calendar-today text-[10px]"></i>}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Ver Detalhes Action Button */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setSelectedCardForModal(card)}
              className="px-2.5 py-1.5 bg-[#004e4c]/8 hover:bg-[#004e4c] text-[#004e4c] hover:text-[#eef7f4] text-[11.5px] font-bold rounded border border-[#004e4c]/20 hover:border-[#004e4c] flex items-center gap-1.5 transition-all cursor-pointer group shadow-2xs active:scale-95"
              title="Abrir modal com o gráfico em destaque e o relatório analítico completo da aba Indicadores T&D"
            >
              <i className="icon-performance text-[12px] text-[#f47920] group-hover:text-[#eef7f4] transition-colors"></i>
              <span>Ver Detalhes</span>
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div
      className={`p-6 min-h-[calc(100vh-280px)] bg-[#f4f6f9] transition-all ${
        isFullscreen ? 'fixed inset-0 z-50 bg-[#f4f6f9] p-8 overflow-y-auto' : ''
      }`}
    >
      {/* Everything below is the interactive Dashboard chrome — hidden when printing so only
          the "Ver Detalhes" report overlay (rendered outside this wrapper) shows up on paper. */}
      <div className="no-print">
      {/* Top Header & Breadcrumbs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-2 text-[14px]">
          <span className="font-bold text-[#004e4c]">Minha Área</span>
          <span className="text-[#a0abb8]">/</span>
          <span className="font-semibold text-[#004e4c]">Dashboard</span>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="p-1.5 text-[#6b7684] hover:text-[#004e4c] hover:bg-white rounded transition-colors cursor-pointer border border-transparent hover:border-[#cfd6e0]"
            title={isFullscreen ? 'Sair de tela cheia' : 'Tela cheia'}
          >
            <i className="icon-fullscreen text-[16px]"></i>
          </button>
        </div>
      </div>

      {/* Filter Row & Add Chart Action (Removed the global training filter from here) */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6 bg-white p-2.5 px-3.5 rounded-[6px] border border-[#e0e5eb] shadow-2xs">
        <div className="flex flex-wrap items-center gap-3">
          {/* Date Selector Pill */}
          <div className="relative flex items-center h-[34px] px-3.5 bg-[#f8fafc] border border-[#cfd6e0] rounded-[6px] text-[13px] text-[#4a5462] font-medium cursor-pointer shadow-2xs hover:border-[#004e4c] transition-colors">
            <span>{selectedPeriod}</span>
            <i className="icon-calendar text-[#8a93a0] ml-3 text-[14px]"></i>
          </div>

          {/* Add Chart Button (+) */}
          <button
            onClick={() => setShowAddModal(true)}
            className="h-[34px] px-3.5 rounded-[6px] bg-[#00995d] hover:bg-[#00824f] text-[#eef7f4] text-[12.5px] font-bold flex items-center gap-2 transition-all cursor-pointer shadow-2xs active:scale-95"
            title="Adicionar gráfico do catálogo de indicadores"
          >
            <i className="icon-plus text-[12px] font-bold"></i>
            <span>Adicionar Gráfico</span>
          </button>
        </div>

        {/* Quick actions on the right */}
        <div className="flex items-center gap-2 text-xs">
          <button
            onClick={handleResetDefaultCards}
            className="text-[#6b7684] hover:text-[#004e4c] px-2 py-1 rounded hover:bg-[#f0f4f8] transition-colors cursor-pointer"
            title="Voltar aos gráficos padrão"
          >
            Restaurar Padrão
          </button>
        </div>
      </div>

      {/* Empty State */}
      {cards.length === 0 ? (
        <div className="bg-white rounded-lg border border-[#e0e5eb] p-12 text-center shadow-2xs">
          <div className="w-16 h-16 rounded-full bg-[#004e4c]/10 text-[#004e4c] flex items-center justify-center mx-auto mb-3">
            <i className="icon-performance text-[28px]"></i>
          </div>
          <h3 className="text-base font-bold text-[#004e4c]">Nenhum gráfico no painel</h3>
          <p className="text-xs text-[#6b7684] max-w-md mx-auto mt-1 mb-4">
            Seu Dashboard está vazio. Clique no botão abaixo para escolher entre os {CHART_CATALOG.length} gráficos disponíveis dos Indicadores T&amp;D.
          </p>
          <button
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2 bg-[#00995d] hover:bg-[#00824f] text-[#eef7f4] text-xs font-bold rounded shadow cursor-pointer transition-all"
          >
            <i className="icon-plus mr-1.5"></i>
            Explorar Catálogo de Gráficos
          </button>
        </div>
      ) : isDesktop ? (
        /* Cards Grid — desktop: drag to reposition, resize from any edge/corner */
        <div ref={gridContainerRef}>
          {gridMounted && (
            <GridLayout
              width={gridWidth}
              layout={layout}
              onLayoutChange={setLayout}
              className="dash-grid"
              gridConfig={{ cols: GRID_COLS, rowHeight: ROW_HEIGHT, margin: GRID_MARGIN }}
              dragConfig={{ handle: '.dash-card-drag-handle', cancel: 'select, button, .no-drag' }}
              resizeConfig={{ handles: ['n', 's', 'e', 'w', 'ne', 'nw', 'se', 'sw'] }}
            >
              {cards.map(card => renderCard(card, { interactive: true }))}
            </GridLayout>
          )}
        </div>
      ) : (
        /* Cards Grid — mobile/tablet: stacked single column, position/size editing is desktop-only */
        <div className="grid grid-cols-1 gap-5">
          {cards.map(card => {
            const item = layout.find(l => l.i === card.id);
            const heightPx = item ? item.h * ROW_HEIGHT + (item.h - 1) * GRID_MARGIN[1] : undefined;
            return renderCard(card, { interactive: false, heightPx });
          })}
        </div>
      )}

      {/* Add Chart Modal with Groups & Catalog */}
      <AddChartModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSelectChart={handleAddChartFromCatalog}
        existingChartIds={existingChartIds}
      />

      {/* Detailed T&D Indicators Modal with Chart on Top + Full Report Below */}
      <DetailedIndicadoresModal
        isOpen={!!selectedCardForModal}
        onClose={() => setSelectedCardForModal(null)}
        card={selectedCardForModal}
        onGoToIndicadores={onGoToIndicadores}
        onUpdateCardType={(cardId, newType) => {
          handleChangeChartType(cardId, newType);
          setSelectedCardForModal(prev => (prev ? { ...prev, chartType: newType } : null));
        }}
        onUpdateCardCategory={(cardId, newCategory) => {
          handleCardCategoryChange(cardId, newCategory);
          setSelectedCardForModal(prev => {
            if (!prev) return null;
            const chartDef = CHART_CATALOG.find(c => c.id === prev.catalogId);
            if (!chartDef) return { ...prev, selectedCategory: newCategory };
            const regenerated = chartDef.generateData({ period: selectedPeriod, category: newCategory });
            return {
              ...prev,
              selectedCategory: newCategory,
              data: regenerated.data,
              maxScale: regenerated.maxScale,
              ticks: regenerated.ticks,
              meta: regenerated.meta
            };
          });
        }}
      />
      </div>

      {/* Ver Detalhes report overlay — the only thing meant to print */}
      <ReportDetailOverlay
        definition={detailsReportCatalogId ? REPORT_DEFINITIONS[detailsReportCatalogId] ?? null : null}
        onClose={() => setDetailsReportCatalogId(null)}
      />
    </div>
  );
};
