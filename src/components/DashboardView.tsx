import React, { useEffect, useRef, useState } from 'react';
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
import { EducacaoPermanenteBlock } from './EducacaoPermanenteBlock';
import { AddChartModal } from './AddChartModal';
import { AddPanelModal } from './AddPanelModal';
import { IndicadoresFullPageView } from './IndicadoresFullPageView';
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
  saveStoredLayout,
  clearStoredLayout,
  loadStoredPanels,
  saveStoredPanels,
  loadActivePanelId,
  saveActivePanelId
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
  [SPECIAL_WIDGET_IDS.turmasExecucao]: TurmasExecucaoDonutBlock,
  [SPECIAL_WIDGET_IDS.educacaoPermanente]: EducacaoPermanenteBlock
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
  { catalogId: SPECIAL_WIDGET_IDS.centroCustoTabela, x: 0, y: 40, w: 12, h: 8 },

  // Educação Permanente — ficha por setor, abaixo de tudo.
  { catalogId: SPECIAL_WIDGET_IDS.educacaoPermanente, x: 0, y: 48, w: 6, h: 10 }
];

/** Presets offered by the "Adicionar Painel" list — each creates a new tab that renders an
 * exact, self-contained replica of its Indicadores T&D screen (IndicadoresFullPageView),
 * not a grid of individual widgets. `id` doubles as the ViewType passed to that component. */
const PANEL_TEMPLATES: { id: ViewType; name: string }[] = [
  { id: 'Treinamentos Institucionais', name: 'Treinamentos Institucionais' },
  { id: 'Treinamentos Internos', name: 'Treinamentos Internos' },
  { id: 'Por Centro de Custo', name: 'Por Centro de Custo' }
];

/** Builds cards + a grid layout from a subset of DEFAULT_LAYOUT_SPEC, so each card id lines up
 * with its fixed slot. Positions are normalized to start at y=0 so a template panel doesn't
 * inherit a big empty gap from where its section sits in the full default dashboard. */
const buildDashboardFromSpec = (
  specs: typeof DEFAULT_LAYOUT_SPEC,
  period: string
): { cards: DashboardCardItem[]; layout: LayoutItem[] } => {
  const cards: DashboardCardItem[] = [];
  const layout: LayoutItem[] = [];
  const defaultCat = 'Todos os Treinamentos';
  const minY = specs.reduce((min, s) => Math.min(min, s.y), Infinity);

  specs.forEach(spec => {
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
      y: spec.y - minY,
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

/** The default panel's cards + layout, built from the full DEFAULT_LAYOUT_SPEC. */
const createDefaultDashboard = (period: string): { cards: DashboardCardItem[]; layout: LayoutItem[] } =>
  buildDashboardFromSpec(DEFAULT_LAYOUT_SPEC, period);

/** A dashboard "aba". The default panel holds its own cards + grid layout (the original card
 * set). A panel created from PANEL_TEMPLATES instead carries a `templateId` (one of the
 * ViewType values) and renders IndicadoresFullPageView — a full replica of that Indicadores
 * T&D screen — in place of the card grid; its cards/layout stay empty and unused. Any other
 * panel is a blank card grid the user builds up via "Adicionar Gráfico". */
interface DashboardPanel {
  id: string;
  name: string;
  cards: DashboardCardItem[];
  layout: LayoutItem[];
  templateId?: ViewType;
}

const DEFAULT_PANEL_ID = 'default';

const createEmptyPanel = (id: string, name: string): DashboardPanel => ({ id, name, cards: [], layout: [] });

interface DashboardViewProps {
  // Bumping `token` re-triggers the focus even when `view` repeats the previous request —
  // set by App.tsx when a "Ver Indicadores"-style CTA elsewhere in the app wants to jump
  // straight to one of the Indicadores T&D panels (creating it if it doesn't exist yet).
  focusViewRequest?: { view: ViewType; token: number } | null;
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

export const DashboardView: React.FC<DashboardViewProps> = ({ focusViewRequest }) => {
  const [selectedPeriod, setSelectedPeriod] = useState('Agosto - 2026');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showAddPanelModal, setShowAddPanelModal] = useState(false);
  const [openTypeDropdown, setOpenTypeDropdown] = useState<string | null>(null);
  const [selectedCardForModal, setSelectedCardForModal] = useState<DashboardCardItem | null>(null);
  const [detailsReportCatalogId, setDetailsReportCatalogId] = useState<string | null>(null);
  const [editingPanelId, setEditingPanelId] = useState<string | null>(null);

  // Dashboard panels ("abas") — the default panel starts with the 8 default "bloco completo"
  // widgets, any panel the user adds afterwards starts blank. Panel names/order persist to
  // localStorage; each panel's own grid layout is restored from localStorage when available.
  const [panels, setPanels] = useState<DashboardPanel[]>(() => {
    const storedMeta = loadStoredPanels();
    const metas = storedMeta.length > 0 ? storedMeta : [{ id: DEFAULT_PANEL_ID, name: 'Dashboard' }];

    return metas.map(meta => {
      if (meta.id === DEFAULT_PANEL_ID) {
        const { cards: defaultCards, layout: defaultLayout } = createDefaultDashboard('Agosto - 2026');
        const cardIds = defaultCards.map(c => c.id);
        const storedLayout = loadStoredLayout(meta.id);
        return {
          id: meta.id,
          name: meta.name,
          cards: defaultCards,
          layout: storedLayout.length > 0 ? reconcileLayout(storedLayout, cardIds) : defaultLayout
        };
      }
      const knownTemplate = PANEL_TEMPLATES.find(t => t.id === meta.templateId);
      if (knownTemplate) {
        return { id: meta.id, name: meta.name, templateId: knownTemplate.id, cards: [], layout: [] };
      }
      // Blank panels only persist metadata + layout, not chart cards — they start blank
      // on reload (same limitation the single-dashboard layout already had).
      return createEmptyPanel(meta.id, meta.name);
    });
  });

  const [activePanelId, setActivePanelId] = useState<string>(() => {
    const stored = loadActivePanelId();
    const metas = loadStoredPanels();
    const validIds = metas.length > 0 ? metas.map(m => m.id) : [DEFAULT_PANEL_ID];
    return stored && validIds.includes(stored) ? stored : validIds[0];
  });

  const activePanel = panels.find(p => p.id === activePanelId) ?? panels[0];
  const cards = activePanel.cards;
  const layout = activePanel.layout;

  const updateActivePanel = (updater: (panel: DashboardPanel) => DashboardPanel) => {
    setPanels(prev => prev.map(p => (p.id === activePanelId ? updater(p) : p)));
  };

  // Kept as drop-in replacements for the old top-level setCards/setLayout so every handler
  // below (add/remove/reset chart type/category) can stay unchanged — they just now write
  // into whichever panel is currently active.
  const setCards = (updater: React.SetStateAction<DashboardCardItem[]>) => {
    updateActivePanel(p => ({
      ...p,
      cards: typeof updater === 'function' ? (updater as (prev: DashboardCardItem[]) => DashboardCardItem[])(p.cards) : updater
    }));
  };

  const setLayout = (updater: React.SetStateAction<LayoutItem[]>) => {
    updateActivePanel(p => ({
      ...p,
      layout: typeof updater === 'function' ? (updater as (prev: LayoutItem[]) => LayoutItem[])(p.layout) : updater
    }));
  };

  const isDesktop = useIsDesktop();
  const { width: gridWidth, mounted: gridMounted, containerRef: gridContainerRef } = useContainerWidth();

  useEffect(() => {
    saveStoredLayout(layout, activePanelId);
  }, [layout, activePanelId]);

  useEffect(() => {
    saveStoredPanels(panels.map(p => ({ id: p.id, name: p.name, templateId: p.templateId })));
  }, [panels]);

  useEffect(() => {
    saveActivePanelId(activePanelId);
  }, [activePanelId]);

  // A "Ver Indicadores" CTA elsewhere in the app asked to jump to one of the template panels —
  // reuse it if it already exists, otherwise create it. Keyed on the whole object (not just
  // `view`) so requesting the same view twice in a row still re-focuses it. Guarded by
  // `handledFocusTokenRef` so this only ever runs once per token — without it, React 18
  // StrictMode's double-invoked effects (or any other re-render before the new panel commits)
  // would each read the same stale `panels` snapshot and both append a panel, creating a dupe.
  const handledFocusTokenRef = useRef<number | null>(null);
  useEffect(() => {
    if (!focusViewRequest || handledFocusTokenRef.current === focusViewRequest.token) return;
    handledFocusTokenRef.current = focusViewRequest.token;

    const { view } = focusViewRequest;
    const existing = panels.find(p => p.templateId === view);
    if (existing) {
      setActivePanelId(existing.id);
      return;
    }
    const template = PANEL_TEMPLATES.find(t => t.id === view);
    if (!template) return;
    const newPanel: DashboardPanel = {
      id: `panel_${Date.now()}`,
      name: template.name,
      templateId: template.id,
      cards: [],
      layout: []
    };
    setPanels(prev => [...prev, newPanel]);
    setActivePanelId(newPanel.id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [focusViewRequest]);

  const handleAddPanelsFromTemplates = (templateIds: string[]) => {
    if (templateIds.length === 0) return;
    const newPanels: DashboardPanel[] = [];

    templateIds.forEach((templateId, index) => {
      const template = PANEL_TEMPLATES.find(t => t.id === templateId);
      if (!template) return;
      newPanels.push({
        id: `panel_${Date.now()}_${index}`,
        name: template.name,
        templateId: template.id,
        cards: [],
        layout: []
      });
    });

    if (newPanels.length === 0) return;
    setPanels(prev => [...prev, ...newPanels]);
    setActivePanelId(newPanels[newPanels.length - 1].id);
    setShowAddPanelModal(false);
  };

  const handleRemovePanel = (panelId: string) => {
    if (panels.length <= 1) return;
    const remaining = panels.filter(p => p.id !== panelId);
    setPanels(remaining);
    clearStoredLayout(panelId);
    if (activePanelId === panelId) {
      setActivePanelId(remaining[0].id);
    }
  };

  const handleRenamePanel = (panelId: string, name: string) => {
    const trimmed = name.trim();
    if (!trimmed) return;
    setPanels(prev => prev.map(p => (p.id === panelId ? { ...p, name: trimmed } : p)));
  };

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

  // On the default panel this restores the original "bloco completo" widget set; on a panel
  // the user created (which never had a default set) it just clears it back to blank.
  const handleResetDefaultCards = () => {
    if (activePanelId === DEFAULT_PANEL_ID) {
      const { cards: defaultCards, layout: defaultLayout } = createDefaultDashboard(selectedPeriod);
      setCards(defaultCards);
      setLayout(defaultLayout);
    } else {
      setCards([]);
      setLayout([]);
    }
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
              className="absolute inset-x-0 top-0 h-7 flex items-center justify-end px-2 z-10 opacity-0 group-hover/special:opacity-100 transition-opacity"
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
        <div className="pb-2 border-b border-[#f0f3f7] shrink-0">
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
      {/* Dashboard chrome (header, panel tabs, toolbar) — hidden when printing. A template
          panel's IndicadoresFullPageView renders further down, outside any no-print wrapper,
          so it — not this chrome — is what actually prints/exports to PDF. */}
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

      {/* Panel Tabs — switch between independent dashboard "abas" */}
      <div className="flex items-center gap-1.5 mb-3 flex-wrap">
        {panels.map(panel => (
          <div
            key={panel.id}
            onClick={() => setActivePanelId(panel.id)}
            onDoubleClick={() => setEditingPanelId(panel.id)}
            className={`group relative flex items-center gap-1.5 h-[30px] pl-3 pr-2 rounded-[6px] border text-[12.5px] font-semibold cursor-pointer transition-colors ${
              panel.id === activePanelId
                ? 'bg-[#004e4c] border-[#004e4c] text-[#eef7f4]'
                : 'bg-white border-[#e0e5eb] text-[#4a5462] hover:border-[#004e4c] hover:text-[#004e4c]'
            }`}
            title="Clique para abrir a aba, duplo clique para renomear"
          >
            {editingPanelId === panel.id ? (
              <input
                autoFocus
                defaultValue={panel.name}
                onClick={e => e.stopPropagation()}
                onBlur={e => {
                  handleRenamePanel(panel.id, e.target.value);
                  setEditingPanelId(null);
                }}
                onKeyDown={e => {
                  if (e.key === 'Enter') e.currentTarget.blur();
                  if (e.key === 'Escape') setEditingPanelId(null);
                }}
                className="bg-transparent outline-none border-b border-current w-24 text-inherit"
              />
            ) : (
              <span className="truncate max-w-[140px]">{panel.name}</span>
            )}

            {panels.length > 1 && (
              <button
                onClick={e => {
                  e.stopPropagation();
                  handleRemovePanel(panel.id);
                }}
                className={`no-drag opacity-0 group-hover:opacity-100 transition-opacity p-0.5 rounded cursor-pointer ${
                  panel.id === activePanelId ? 'hover:bg-white/20 text-[#eef7f4]' : 'hover:bg-[#f0f4f8] text-[#8a93a0]'
                }`}
                title="Remover painel"
              >
                <i className="icon-close-mini text-[11px]"></i>
              </button>
            )}
          </div>
        ))}
      </div>

      {/* Filter Row & Add Chart Action — stays in this same top position on every panel
          (including template ones), right below the panel tabs. */}
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

          {/* Add Panel Button (+) */}
          <button
            onClick={() => setShowAddPanelModal(true)}
            className="h-[34px] px-3.5 rounded-[6px] bg-white hover:bg-[#f0f4f8] text-[#004e4c] border border-[#cfd6e0] hover:border-[#004e4c] text-[12.5px] font-bold flex items-center gap-2 transition-all cursor-pointer shadow-2xs active:scale-95"
            title="Criar uma nova aba de dashboard"
          >
            <i className="icon-plus text-[12px] font-bold"></i>
            <span>Adicionar Painel</span>
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
      </div>
      {/* IndicadoresFullPageView renders OUTSIDE the no-print wrapper above: it's its own
          printable report (own print-only masthead, .no-print on just its interactive chrome),
          so "Gerar PDF" from inside a panel actually prints the report instead of a blank page —
          everything under the Dashboard's own .no-print wrapper is hidden on print. */}
      {activePanel.templateId && (
        <IndicadoresFullPageView key={activePanel.id} initialView={activePanel.templateId} />
      )}
      <div className="no-print">
      {/* Empty State — skipped on template panels, where "no extra charts yet" below a full
          report reads as a stray error message rather than a real empty dashboard. */}
      {cards.length === 0 ? (
        activePanel.templateId ? null : (
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
        )
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
                  dragConfig={{ cancel: 'select, button, .no-drag' }}
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

      {/* Add Panel Modal — pick a preset tab (Institucionais / Internos / Centro de Custo) */}
      <AddPanelModal
        isOpen={showAddPanelModal}
        onClose={() => setShowAddPanelModal(false)}
        templates={PANEL_TEMPLATES}
        onCreatePanels={handleAddPanelsFromTemplates}
      />

      {/* Detailed T&D Indicators Modal with Chart on Top + Full Report Below */}
      <DetailedIndicadoresModal
        isOpen={!!selectedCardForModal}
        onClose={() => setSelectedCardForModal(null)}
        card={selectedCardForModal}
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

      {/* Ver Detalhes report overlay — also prints on its own, same pattern as
          IndicadoresFullPageView above (own .no-print chrome, otherwise printable). */}
      <ReportDetailOverlay
        definition={detailsReportCatalogId ? REPORT_DEFINITIONS[detailsReportCatalogId] ?? null : null}
        onClose={() => setDetailsReportCatalogId(null)}
      />
    </div>
  );
};
