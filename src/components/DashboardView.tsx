import React, { useCallback, useEffect, useRef, useState } from 'react';
import GridLayout, { LayoutItem, verticalCompactor, useContainerWidth } from 'react-grid-layout';
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
import { InstitucionaisKpiBlock } from './InstitucionaisKpiBlock';
import { InternosKpiBlock } from './InternosKpiBlock';
import { TurmasPlanejadasExcedentesBlock } from './TurmasPlanejadasExcedentesBlock';
import { AddChartModal } from './AddChartModal';
import { ChartTypeSelector, ChartTypeOption } from './ChartTypeSelector';
import { DetailedIndicadoresModal } from './DetailedIndicadoresModal';
import { ReportDetailOverlay } from './ReportDetailOverlay';
import { REPORT_DEFINITIONS } from '../data/reportDefinitions';
import { ViewType } from '../types';
import { X } from 'lucide-react';
import {
  GRID_COLS,
  GRID_MARGIN,
  ROW_HEIGHT,
  MIN_W,
  MIN_H,
  MAX_W,
  MAX_H,
  customMinSizeForCardId,
  loadStoredLayout,
  reconcileLayout,
  resolveOverlaps,
  saveStoredLayout,
  clearStoredLayout,
  loadStoredPanels,
  saveStoredPanels,
  loadActivePanelId,
  saveActivePanelId,
  loadStoredCards,
  saveStoredCards,
  clearStoredCards,
  StoredCardMeta,
  StoredPanelMeta
} from '../utils/gridLayout';

interface SpecialWidgetProps {
  onVerDetalhes?: () => void;
}

/** Maps each special-widget catalog id to the bespoke component that renders it, bypassing
 * the generic chart renderer / card chrome. See dashboardCatalog.ts SPECIAL_WIDGET_IDS. */
const SPECIAL_WIDGETS: Record<string, React.FC<SpecialWidgetProps>> = {
  [SPECIAL_WIDGET_IDS.institucionaisKpis]: InstitucionaisKpiBlock,
  [SPECIAL_WIDGET_IDS.institucionaisTabs]: InstitucionaisTabsBlock,
  [SPECIAL_WIDGET_IDS.institucionaisPercentual]: InstitucionaisPercentualBlock,
  [SPECIAL_WIDGET_IDS.institucionaisAgenda]: AgendaBlock,
  [SPECIAL_WIDGET_IDS.internosKpis]: InternosKpiBlock,
  [SPECIAL_WIDGET_IDS.internosEvolucao]: InternosEvolucaoBlock,
  [SPECIAL_WIDGET_IDS.internosAtivosTreinados]: AtivosTreinadosBlock,
  [SPECIAL_WIDGET_IDS.internosTreinamentosHoras]: TreinamentosRankingBlock,
  [SPECIAL_WIDGET_IDS.internosRankingCargo]: RankingCargoBlock,
  [SPECIAL_WIDGET_IDS.centroCustoTabela]: CentroCustoTableBlock,
  [SPECIAL_WIDGET_IDS.turmasExecucao]: TurmasExecucaoDonutBlock,
  [SPECIAL_WIDGET_IDS.educacaoPermanente]: EducacaoPermanenteBlock,
  [SPECIAL_WIDGET_IDS.turmasPlanejadasExcedentes]: TurmasPlanejadasExcedentesBlock
};

type LayoutSpec = { catalogId: string; x: number; y: number; w: number; h: number };

/** Indicadores T&D presets that a "Ver Indicadores" CTA elsewhere in the app opens as a panel
 * (see `focusViewRequest`) — each seeds its panel with its own set of draggable, resizable
 * cards. "Adicionar Painel" doesn't use them: it always creates a blank panel. */
const PANEL_TEMPLATES: { id: ViewType; name: string }[] = [
  { id: 'Treinamentos Institucionais', name: 'Treinamentos Institucionais' },
  { id: 'Treinamentos Internos', name: 'Treinamentos Internos' },
  { id: 'Por Centro de Custo', name: 'Por Centro de Custo' }
];

const TEMPLATE_LAYOUT_SPECS: Record<ViewType, LayoutSpec[]> = {
  'Treinamentos Institucionais': [
    { catalogId: SPECIAL_WIDGET_IDS.institucionaisKpis, x: 0, y: 0, w: 12, h: 6 },
    { catalogId: SPECIAL_WIDGET_IDS.turmasPlanejadasExcedentes, x: 0, y: 6, w: 12, h: 2 },
    { catalogId: SPECIAL_WIDGET_IDS.institucionaisTabs, x: 0, y: 8, w: 6, h: 12 },
    { catalogId: SPECIAL_WIDGET_IDS.institucionaisPercentual, x: 6, y: 8, w: 6, h: 6 },
    { catalogId: SPECIAL_WIDGET_IDS.institucionaisAgenda, x: 6, y: 14, w: 6, h: 6 },
    { catalogId: SPECIAL_WIDGET_IDS.educacaoPermanente, x: 0, y: 20, w: 12, h: 7 }
  ],
  'Treinamentos Internos': [
    { catalogId: SPECIAL_WIDGET_IDS.internosKpis, x: 0, y: 0, w: 12, h: 6 },
    { catalogId: SPECIAL_WIDGET_IDS.internosEvolucao, x: 0, y: 6, w: 4, h: 12 },
    { catalogId: SPECIAL_WIDGET_IDS.internosAtivosTreinados, x: 4, y: 6, w: 4, h: 6 },
    { catalogId: SPECIAL_WIDGET_IDS.internosTreinamentosHoras, x: 4, y: 12, w: 4, h: 6 },
    { catalogId: SPECIAL_WIDGET_IDS.internosRankingCargo, x: 8, y: 6, w: 4, h: 12 },
    { catalogId: SPECIAL_WIDGET_IDS.educacaoPermanente, x: 0, y: 18, w: 12, h: 7 }
  ],
  'Por Centro de Custo': [
    { catalogId: SPECIAL_WIDGET_IDS.centroCustoTabela, x: 0, y: 0, w: 12, h: 9 }
  ]
};

const createPanelFromTemplate = (
  templateId: ViewType,
  period: string
): { cards: DashboardCardItem[]; layout: LayoutItem[] } => {
  const spec = TEMPLATE_LAYOUT_SPECS[templateId] ?? [];
  return buildDashboardFromSpec(spec, period);
};

const DEFAULT_CATEGORY = 'Todos os Treinamentos';
const INITIAL_PERIOD = 'Agosto - 2026';

/** Builds one card for a catalog chart, generating its data for the given period/category. */
const buildCard = (
  chartDef: CatalogChartDef,
  id: string,
  period: string,
  category: string = DEFAULT_CATEGORY,
  chartType: SupportedChartType = chartDef.defaultType
): DashboardCardItem => {
  const generated = chartDef.generateData({ period, category });
  return {
    id,
    catalogId: chartDef.id,
    title: chartDef.title,
    subtitle: chartDef.subtitle,
    group: chartDef.group,
    chartType,
    allowedTypes: chartDef.allowedTypes,
    selectedCategory: category,
    availableCategories: chartDef.categories || DEFAULT_TRAINING_CATEGORIES,
    maxScale: generated.maxScale,
    ticks: generated.ticks,
    unit: chartDef.unit,
    data: generated.data,
    meta: generated.meta
  };
};

/** Rebuilds a panel's persisted cards from the catalog, dropping any whose chart no longer exists. */
const restoreCards = (stored: StoredCardMeta[], period: string): DashboardCardItem[] =>
  stored.flatMap(meta => {
    const chartDef = CHART_CATALOG.find(c => c.id === meta.catalogId);
    if (!chartDef) return [];
    const chartType = chartDef.allowedTypes.find(t => t === meta.chartType) ?? chartDef.defaultType;
    const category = typeof meta.selectedCategory === 'string' ? meta.selectedCategory : DEFAULT_CATEGORY;
    return [buildCard(chartDef, meta.id, period, category, chartType)];
  });

const toStoredCard = (card: DashboardCardItem): StoredCardMeta => ({
  id: card.id,
  catalogId: card.catalogId,
  chartType: card.chartType,
  selectedCategory: card.selectedCategory
});

/** Builds cards + a grid layout from a template's spec, so each card id lines up with its
 * fixed slot. Positions are normalized to start at y=0. */
const buildDashboardFromSpec = (
  specs: LayoutSpec[],
  period: string
): { cards: DashboardCardItem[]; layout: LayoutItem[] } => {
  const cards: DashboardCardItem[] = [];
  const layout: LayoutItem[] = [];
  const minY = specs.reduce((min, s) => Math.min(min, s.y), Infinity);

  specs.forEach(spec => {
    const chartDef = CHART_CATALOG.find(c => c.id === spec.catalogId);
    if (!chartDef) return;

    const cardId = `card_${chartDef.id}`;
    cards.push(buildCard(chartDef, cardId, period));

    const customMin = customMinSizeForCardId(cardId);
    layout.push({
      i: cardId,
      x: spec.x,
      y: spec.y - minY,
      w: spec.w,
      h: spec.h,
      minW: customMin ? customMin.w : MIN_W,
      minH: customMin ? customMin.h : MIN_H,
      maxW: MAX_W,
      maxH: MAX_H
    });
  });

  return { cards, layout };
};

/** A dashboard "aba": its own cards + grid layout. Every panel — the default one included —
 * starts blank and the user fills it via "Adicionar Gráfico". The exception is a panel opened
 * by a "Ver Indicadores" CTA: it's seeded from PANEL_TEMPLATES and keeps that `templateId`, so
 * the CTA can re-focus it and "Restaurar Padrão" can bring its widget set back. */
interface DashboardPanel {
  id: string;
  name: string;
  cards: DashboardCardItem[];
  layout: LayoutItem[];
  templateId?: ViewType;
}

const DEFAULT_PANEL_ID = 'default';

const createEmptyPanel = (id: string, name: string): DashboardPanel => ({ id, name, cards: [], layout: [] });

/** "Painel 2", "Painel 3"… — the first number not already taken by another panel's name. */
const nextPanelName = (panels: DashboardPanel[]): string => {
  const names = new Set(panels.map(p => p.name));
  let n = panels.length + 1;
  while (names.has(`Painel ${n}`)) n++;
  return `Painel ${n}`;
};

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
  const [selectedPeriod, setSelectedPeriod] = useState(INITIAL_PERIOD);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedCardForModal, setSelectedCardForModal] = useState<DashboardCardItem | null>(null);
  const [detailsReportCatalogId, setDetailsReportCatalogId] = useState<string | null>(null);
  const [editingPanelId, setEditingPanelId] = useState<string | null>(null);

  // Dashboard panels ("abas") — every panel starts blank and the user fills each one via
  // "Adicionar Gráfico". Panel names/order, each panel's cards and its grid layout all
  // persist to localStorage and are restored here.
  const [panels, setPanels] = useState<DashboardPanel[]>(() => {
    const storedMeta = loadStoredPanels();

    // Primeiro acesso (nada salvo ainda): as duas abas padrão já nascem preenchidas com o
    // painel-modelo de Institucionais/Internos — não em branco — para dar uma tela útil de
    // cara, e com templateId setado para casar com o dedup do focusViewRequest (senão um
    // "Ver Indicadores" criaria uma segunda aba duplicada com o mesmo nome).
    if (storedMeta.length === 0) {
      const defaultTemplates: { id: string; view: ViewType }[] = [
        { id: DEFAULT_PANEL_ID, view: 'Treinamentos Institucionais' },
        { id: 'panel_2', view: 'Treinamentos Internos' }
      ];

      return defaultTemplates.map(({ id, view }) => {
        const { cards: templateCards, layout: templateLayout } = createPanelFromTemplate(view, INITIAL_PERIOD);
        return {
          id,
          name: view,
          templateId: view,
          cards: templateCards,
          layout: templateLayout
        };
      });
    }

    const metas: StoredPanelMeta[] = storedMeta;

    return metas.map(meta => {
      const panelCards = restoreCards(loadStoredCards(meta.id), INITIAL_PERIOD);
      const panelLayout = reconcileLayout(loadStoredLayout(meta.id), panelCards.map(c => c.id));
      return {
        id: meta.id,
        name: meta.name,
        templateId: PANEL_TEMPLATES.find(t => t.id === meta.templateId)?.id,
        cards: panelCards,
        // resolveOverlaps antes de compactar: cura sobreposições genuínas que uma sessão
        // anterior a uma correção no algoritmo de posicionamento possa ter salvo.
        layout: verticalCompactor.compact(resolveOverlaps(panelLayout), GRID_COLS)
      };
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

  // Automatically separate any overlapping cards from previous sessions
  useEffect(() => {
    if (layout.length > 0) {
      const compacted = verticalCompactor.compact(resolveOverlaps(layout), GRID_COLS);
      const hasCollision = compacted.some(item => {
        const orig = layout.find(l => l.i === item.i);
        return orig && (orig.x !== item.x || orig.y !== item.y);
      });
      if (hasCollision) {
        setLayout(compacted);
      }
    }
  }, [activePanelId]);

  const isDesktop = useIsDesktop();
  const { width: gridWidth, mounted: gridMounted, containerRef: gridContainerRef } = useContainerWidth();
  const rootContainerRef = useRef<HTMLDivElement>(null);

  // Auto-scroll when dragging near viewport edges so users can drag cards downwards below the fold
  const autoScrollRafRef = useRef<number | null>(null);
  const dragPointerYRef = useRef<number | null>(null);
  const dragPointerXRef = useRef<number | null>(null);

  const startAutoScroll = useCallback(() => {
    if (autoScrollRafRef.current !== null) return;

    const tick = () => {
      const y = dragPointerYRef.current;
      const x = dragPointerXRef.current ?? (typeof window !== 'undefined' ? window.innerWidth / 2 : 500);
      if (y !== null) {
        const vh = window.innerHeight;
        const edgeThreshold = 140;
        const isElementScroll = isFullscreen && rootContainerRef.current;
        const target = isElementScroll ? rootContainerRef.current : window;

        if (y > vh - edgeThreshold) {
          // Pointer near bottom: scroll down
          const intensity = Math.min(36, Math.max(8, ((y - (vh - edgeThreshold)) / edgeThreshold) * 40));
          if (isElementScroll) {
            (target as HTMLElement).scrollTop += intensity;
          } else {
            window.scrollBy({ top: intensity, behavior: 'auto' });
          }

          // Dispatch synthetic mousemove on document so react-draggable & react-grid-layout
          // recalculate parent offset and continuously advance the dragged element downwards
          document.dispatchEvent(
            new MouseEvent('mousemove', {
              clientX: x,
              clientY: y,
              bubbles: true,
              cancelable: true
            })
          );
        } else if (y < edgeThreshold) {
          // Pointer near top: scroll up
          const intensity = Math.min(36, Math.max(8, ((edgeThreshold - y) / edgeThreshold) * 40));
          if (isElementScroll) {
            if ((target as HTMLElement).scrollTop > 0) (target as HTMLElement).scrollTop -= intensity;
          } else {
            if (window.scrollY > 0) window.scrollBy({ top: -intensity, behavior: 'auto' });
          }

          document.dispatchEvent(
            new MouseEvent('mousemove', {
              clientX: x,
              clientY: y,
              bubbles: true,
              cancelable: true
            })
          );
        }
      }
      autoScrollRafRef.current = requestAnimationFrame(tick);
    };

    autoScrollRafRef.current = requestAnimationFrame(tick);
  }, [isFullscreen]);

  const stopAutoScroll = useCallback(() => {
    if (autoScrollRafRef.current !== null) {
      cancelAnimationFrame(autoScrollRafRef.current);
      autoScrollRafRef.current = null;
    }
    dragPointerYRef.current = null;
    dragPointerXRef.current = null;
  }, []);

  useEffect(() => {
    const handleMove = (e: MouseEvent) => {
      if (autoScrollRafRef.current !== null) {
        dragPointerYRef.current = e.clientY;
        dragPointerXRef.current = e.clientX;
      }
    };
    const handleUp = () => {
      stopAutoScroll();
    };
    window.addEventListener('mousemove', handleMove, { passive: true });
    window.addEventListener('mouseup', handleUp, { passive: true });
    return () => {
      window.removeEventListener('mousemove', handleMove);
      window.removeEventListener('mouseup', handleUp);
      stopAutoScroll();
    };
  }, [stopAutoScroll]);

  useEffect(() => {
    saveStoredLayout(layout, activePanelId);
  }, [layout, activePanelId]);

  useEffect(() => {
    saveStoredCards(cards.map(toStoredCard), activePanelId);
  }, [cards, activePanelId]);

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
    const { cards: templateCards, layout: templateLayout } = createPanelFromTemplate(template.id, selectedPeriod);
    const newPanel: DashboardPanel = {
      id: `panel_${Date.now()}`,
      name: template.name,
      templateId: template.id,
      cards: templateCards,
      layout: templateLayout
    };
    setPanels(prev => [...prev, newPanel]);
    setActivePanelId(newPanel.id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [focusViewRequest]);

  // "Adicionar Painel" creates a blank panel straight away — the user then fills it via
  // "Adicionar gráficos" inside it.
  const handleAddPanel = () => {
    const newPanel = createEmptyPanel(`panel_${Date.now()}`, nextPanelName(panels));
    setPanels(prev => [...prev, newPanel]);
    setActivePanelId(newPanel.id);
  };

  const handleRemovePanel = (panelId: string) => {
    if (panels.length <= 1) return;
    const remaining = panels.filter(p => p.id !== panelId);
    setPanels(remaining);
    clearStoredLayout(panelId);
    clearStoredCards(panelId);
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

  const handleAddChartsFromCatalog = (chartDefs: CatalogChartDef[]) => {
    const now = Date.now();
    const newCards = chartDefs.map((chartDef, idx) =>
      buildCard(chartDef, `card_${chartDef.id}_${now}_${idx}`, selectedPeriod)
    );

    setCards(prev => [...prev, ...newCards]);
    setLayout(prev => {
      const reconciled = reconcileLayout(prev, [
        ...prev.map(item => item.i),
        ...newCards.map(c => c.id)
      ]);
      return verticalCompactor.compact(reconciled, GRID_COLS);
    });
  };

  const handleChangeChartType = (cardId: string, newType: SupportedChartType) => {
    setCards(prev =>
      prev.map(card => (card.id === cardId ? { ...card, chartType: newType } : card))
    );
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

  // On a template panel this restores its widget set; every other panel (the default one
  // included) starts blank, so this clears it back to blank.
  const handleResetDefaultCards = () => {
    if (activePanel.templateId && TEMPLATE_LAYOUT_SPECS[activePanel.templateId]) {
      const { cards: templateCards, layout: templateLayout } = createPanelFromTemplate(activePanel.templateId, selectedPeriod);
      setCards(templateCards);
      setLayout(templateLayout);
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
              className="absolute right-3 top-3 z-20 opacity-0 group-hover/special:opacity-100 transition-opacity duration-150"
            >
              <button
                type="button"
                onClick={() => handleRemoveCard(card.id)}
                className="no-drag w-6 h-6 rounded-full flex items-center justify-center bg-white/95 text-[#94a3b8] hover:text-[#ef4444] hover:bg-[#fee2e2] border border-[#e2e8f0] hover:border-[#fca5a5] shadow-xs hover:shadow transition-all duration-150 cursor-pointer hover:scale-110 active:scale-95"
                title="Remover gráfico"
                aria-label="Remover gráfico"
              >
                <X size={12} strokeWidth={2.5} />
              </button>
            </div>
          )}
          <div className="h-full w-full flex-1 min-h-0">
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
                type="button"
                onClick={() => handleRemoveCard(card.id)}
                className="w-6 h-6 rounded-full flex items-center justify-center text-[#94a3b8] hover:text-[#ef4444] hover:bg-[#fee2e2] border border-transparent hover:border-[#fca5a5] transition-all duration-150 cursor-pointer hover:scale-110 active:scale-95"
                title="Remover gráfico"
                aria-label="Remover gráfico"
              >
                <X size={12} strokeWidth={2.5} />
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
          {/* key força remount ao trocar o tipo do gráfico — sem isso, o mesmo container
              ref/observer de entrada em viewport (useInView) fica "grudado" no estado do
              tipo anterior e a animação de entrada do novo tipo nunca dispara. */}
          <DashboardChartRenderer key={card.chartType} card={card} />
        </div>

        {/* Card Footer / Chart Type Selector & Detailed Indicators CTA */}
        <div className="pt-3 mt-3 border-t border-[#f0f3f7] shrink-0 flex flex-wrap items-center justify-between gap-2 text-[12.5px] no-drag">
          <ChartTypeSelector
            currentType={card.chartType as ChartTypeOption}
            onChangeType={newType => handleChangeChartType(card.id, newType as SupportedChartType)}
            allowedTypes={card.allowedTypes.filter(t => t !== 'Tabela') as ChartTypeOption[]}
            direction="up"
          />

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
      ref={rootContainerRef}
      className={`p-6 pb-24 lg:pb-36 min-h-[calc(100vh-280px)] bg-[#f4f6f9] transition-all ${
        isFullscreen ? 'fixed inset-0 z-50 bg-[#f4f6f9] p-8 pb-32 overflow-y-auto' : ''
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

      {/* Filter Row & Add Chart Action — stays in this same top position on every panel
          (including template ones). */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-3.5 bg-white p-2.5 px-3.5 rounded-[6px] border border-[#e0e5eb] shadow-2xs">
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

      {/* Panel Tabs — switch between independent dashboard "abas" (now positioned below the filter/action toolbar) */}
      <div className="flex items-center gap-1.5 mb-5 flex-wrap">
        {/* Add Panel Button (+) — cria um novo painel em branco, à esquerda das abas */}
        <button
          type="button"
          onClick={handleAddPanel}
          className="h-[30px] w-[30px] shrink-0 rounded-[6px] bg-white hover:bg-[#f0f4f8] text-[#004e4c] border border-[#cfd6e0] hover:border-[#004e4c] flex items-center justify-center transition-all cursor-pointer shadow-2xs active:scale-95"
          title="Criar um novo painel em branco"
          aria-label="Adicionar painel"
        >
          <i className="icon-plus text-[12px] font-bold"></i>
        </button>

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
                type="button"
                onClick={e => {
                  e.stopPropagation();
                  handleRemovePanel(panel.id);
                }}
                className={`no-drag opacity-0 group-hover:opacity-100 transition-all w-4 h-4 rounded-full flex items-center justify-center cursor-pointer ${
                  panel.id === activePanelId
                    ? 'hover:bg-white/25 text-[#eef7f4]'
                    : 'hover:bg-[#fee2e2] hover:text-[#ef4444] text-[#8a93a0]'
                }`}
                title="Remover painel"
                aria-label="Remover painel"
              >
                <X size={10} strokeWidth={2.5} />
              </button>
            )}
          </div>
        ))}
      </div>

      {/* Empty State */}
      {cards.length === 0 ? (
        <div className="bg-white rounded-lg border border-[#e0e5eb] p-12 text-center shadow-2xs">
          <div className="w-16 h-16 rounded-full bg-[#004e4c]/10 text-[#004e4c] flex items-center justify-center mx-auto mb-3">
            <i className="icon-performance text-[28px]"></i>
          </div>
          <h3 className="text-base font-bold text-[#004e4c]">Este painel está em branco</h3>
          <p className="text-xs text-[#6b7684] max-w-md mx-auto mt-1 mb-4">
            Clique em "Adicionar gráficos".
          </p>
          <button
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2 bg-[#00995d] hover:bg-[#00824f] text-[#eef7f4] text-xs font-bold rounded shadow cursor-pointer transition-all"
          >
            <i className="icon-plus mr-1.5"></i>
            Adicionar gráficos
          </button>
        </div>
      ) : isDesktop ? (
            /* Cards Grid — desktop: drag to reposition, resize from any edge/corner */
            <div ref={gridContainerRef} className="pb-48 lg:pb-64 min-h-[90vh]">
              {gridMounted && (
                <GridLayout
                  width={gridWidth}
                  layout={layout}
                  onLayoutChange={setLayout}
                  className="dash-grid min-h-[85vh]"
                  compactor={verticalCompactor}
                  gridConfig={{ cols: GRID_COLS, rowHeight: ROW_HEIGHT, margin: GRID_MARGIN }}
                  dragConfig={{ cancel: 'select, button, .no-drag' }}
                  resizeConfig={{ handles: ['n', 's', 'e', 'w', 'ne', 'nw', 'se', 'sw'] }}
                  onDragStart={(_layout, _oldItem, _newItem, _placeholder, e) => {
                    if (e && 'clientY' in e) {
                      dragPointerYRef.current = (e as MouseEvent).clientY;
                      dragPointerXRef.current = (e as MouseEvent).clientX;
                    }
                    startAutoScroll();
                  }}
                  onDrag={(_layout, _oldItem, _newItem, _placeholder, e) => {
                    if (e && 'clientY' in e) {
                      dragPointerYRef.current = (e as MouseEvent).clientY;
                      dragPointerXRef.current = (e as MouseEvent).clientX;
                    }
                  }}
                  onDragStop={() => {
                    stopAutoScroll();
                  }}
                >
                  {cards.map(card => renderCard(card, { interactive: true }))}
                </GridLayout>
              )}
              {/* Bottom breathing room spacer / drop target area */}
              <div className="h-20 lg:h-32 w-full" aria-hidden="true" />
            </div>
          ) : (
            /* Cards Grid — mobile/tablet: stacked single column, position/size editing is desktop-only */
            <div className="grid grid-cols-1 gap-5 pb-24 lg:pb-36">
              {cards.map(card => {
                const item = layout.find(l => l.i === card.id);
                const heightPx = item ? item.h * ROW_HEIGHT + (item.h - 1) * GRID_MARGIN[1] : undefined;
                return renderCard(card, { interactive: false, heightPx });
              })}
              {/* Bottom breathing room spacer */}
              <div className="h-12 lg:h-16 w-full" aria-hidden="true" />
            </div>
          )}

      {/* Add Chart Modal with Groups & Catalog */}
      <AddChartModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onAddCharts={handleAddChartsFromCatalog}
        existingChartIds={existingChartIds}
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
