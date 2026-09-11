import type { LayoutItem } from 'react-grid-layout';
import { SPECIAL_WIDGET_IDS } from '../data/dashboardCatalog';

// Grid metrics: 12 columns, 40px row unit, 20px gutter (matches the card grid's previous gap-5 spacing)
export const GRID_COLS = 12;
export const ROW_HEIGHT = 40;
export const GRID_MARGIN: [number, number] = [20, 20];

// Card size limits in grid units — keeps every chart legible while still allowing
// dense arrangements (e.g. 4 small cards per row at MIN_W, or a single full-width card at MAX_W).
export const MIN_W = 3;
export const MIN_H = 5;
export const MAX_W = GRID_COLS;
export const MAX_H = 20;

// Um único gráfico selecionado nasce largura total + altura mínima — o usuário aumenta
// manualmente se quiser um card maior. Quando VÁRIOS são selecionados de uma vez, em vez
// disso eles nascem lado a lado, 3 por linha (comportamento antigo), senão a tela vira uma
// coluna única enorme.
export const BATCH_COLS_PER_ROW = 3;
export const BATCH_DEFAULT_W = GRID_COLS / BATCH_COLS_PER_ROW;
export const BATCH_DEFAULT_H = 8;

// Alturas de nascimento por widget — reaproveita os mesmos valores já calibrados nos
// painéis-modelo (TEMPLATE_LAYOUT_SPECS, em DashboardView.tsx): uma altura mínima genérica
// não faz sentido pra widgets ricos (abas, tabela, agenda), que precisam de mais espaço.
const CUSTOM_DEFAULT_HEIGHT: Record<string, number> = {
  [SPECIAL_WIDGET_IDS.institucionaisKpis]: 6,
  [SPECIAL_WIDGET_IDS.internosKpis]: 6,
  [SPECIAL_WIDGET_IDS.institucionaisTabs]: 12,
  [SPECIAL_WIDGET_IDS.institucionaisPercentual]: 6,
  [SPECIAL_WIDGET_IDS.institucionaisAgenda]: 6,
  [SPECIAL_WIDGET_IDS.internosEvolucao]: 12,
  [SPECIAL_WIDGET_IDS.internosAtivosTreinados]: 6,
  [SPECIAL_WIDGET_IDS.internosTreinamentosHoras]: 6,
  [SPECIAL_WIDGET_IDS.internosRankingCargo]: 12,
  [SPECIAL_WIDGET_IDS.centroCustoTabela]: 9,
  [SPECIAL_WIDGET_IDS.turmasExecucao]: 8,
  [SPECIAL_WIDGET_IDS.educacaoPermanente]: 9,
  [SPECIAL_WIDGET_IDS.turmasPlanejadasExcedentes]: 2
};

// Estes sempre nascem em largura total, mesmo dentro de uma seleção em lote — divididos
// em 3-por-linha eles ficam estreitos demais para o conteúdo (faixa de KPI, tabela).
const ALWAYS_FULL_WIDTH = new Set<string>([
  SPECIAL_WIDGET_IDS.institucionaisKpis,
  SPECIAL_WIDGET_IDS.internosKpis,
  SPECIAL_WIDGET_IDS.centroCustoTabela,
  SPECIAL_WIDGET_IDS.turmasPlanejadasExcedentes
]);

// Piso de redimensionamento das faixas de KPI — mais frouxo que o tamanho de nascimento
// acima, só o suficiente para não voltar a ficar estreito/truncado como antes.
const CUSTOM_MIN_SIZE: Record<string, { w: number; h: number }> = {
  [SPECIAL_WIDGET_IDS.institucionaisKpis]: { w: 6, h: 5 },
  [SPECIAL_WIDGET_IDS.internosKpis]: { w: 6, h: 5 },
  [SPECIAL_WIDGET_IDS.turmasPlanejadasExcedentes]: { w: 6, h: 2 }
};

// Card ids are `card_${catalogId}_${timestamp}_${idx}` (from "Adicionar Gráfico") or
// `card_${catalogId}` (painéis-modelo) — nunca o catalogId puro — então a busca precisa
// casar por prefixo, não por chave direta. Também serve para o catalogId puro (usado pelos
// painéis-modelo), já que ele bate na primeira condição.
const matchCatalogId = (cardId: string, catalogId: string): boolean =>
  cardId === catalogId || cardId.startsWith(`card_${catalogId}_`) || cardId === `card_${catalogId}`;

const findByCatalogId = <T,>(cardId: string, map: Record<string, T>): T | undefined => {
  for (const catalogId of Object.keys(map)) {
    if (matchCatalogId(cardId, catalogId)) return map[catalogId];
  }
  return undefined;
};

export const customHeightForCardId = (cardId: string): number | undefined =>
  findByCatalogId(cardId, CUSTOM_DEFAULT_HEIGHT);

export const isAlwaysFullWidthCardId = (cardId: string): boolean => {
  for (const catalogId of ALWAYS_FULL_WIDTH) {
    if (matchCatalogId(cardId, catalogId)) return true;
  }
  return false;
};

export const customMinSizeForCardId = (cardId: string): { w: number; h: number } | undefined => {
  return findByCatalogId(cardId, CUSTOM_MIN_SIZE);
};

const STORAGE_KEY = 'lector_dashboard_layout_v1';

// The original ("default") dashboard tab keeps the original, unsuffixed key so existing
// users don't lose their saved layout when panels/tabs were introduced. Every other panel
// gets its own key derived from its id.
const layoutStorageKey = (panelId: string): string =>
  panelId === 'default' ? STORAGE_KEY : `${STORAGE_KEY}_${panelId}`;

export function loadStoredLayout(panelId: string = 'default'): LayoutItem[] {
  try {
    const raw = localStorage.getItem(layoutStorageKey(panelId));
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (item): item is LayoutItem =>
        item && typeof item.i === 'string' && [item.x, item.y, item.w, item.h].every(n => typeof n === 'number')
    );
  } catch {
    return [];
  }
}

export function saveStoredLayout(layout: LayoutItem[], panelId: string = 'default'): void {
  try {
    localStorage.setItem(layoutStorageKey(panelId), JSON.stringify(layout));
  } catch {
    // Storage unavailable (private mode, quota) — layout simply won't persist across sessions.
  }
}

export function clearStoredLayout(panelId: string = 'default'): void {
  try {
    localStorage.removeItem(layoutStorageKey(panelId));
  } catch {
    // ignore
  }
}

// --- Dashboard panels/tabs -------------------------------------------------------------
// Only lightweight metadata (id, name, order) is persisted — each panel's own layout is
// stored separately via loadStoredLayout/saveStoredLayout above, keyed by panel id.

export interface StoredPanelMeta {
  id: string;
  name: string;
  templateId?: string;
}

// v5: o layout-modelo (tamanho/posição dos cards) dos dois painéis padrão ainda está sendo
// ajustado nesta mesma sessão — cada ajuste exige subir a versão de novo, senão quem já
// gerou os painéis-modelo fica com o layout salvo antigo e nunca vê o novo, já que o genesis
// só roda quando esta chave está vazia.
const PANELS_KEY = 'lector_dashboard_panels_v5';
const ACTIVE_PANEL_KEY = 'lector_dashboard_active_panel_v5';

export function loadStoredPanels(): StoredPanelMeta[] {
  try {
    const raw = localStorage.getItem(PANELS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (item): item is StoredPanelMeta =>
        item && typeof item.id === 'string' && typeof item.name === 'string'
    );
  } catch {
    return [];
  }
}

export function saveStoredPanels(panels: StoredPanelMeta[]): void {
  try {
    localStorage.setItem(PANELS_KEY, JSON.stringify(panels));
  } catch {
    // ignore
  }
}

export function loadActivePanelId(): string | null {
  try {
    return localStorage.getItem(ACTIVE_PANEL_KEY);
  } catch {
    return null;
  }
}

export function saveActivePanelId(panelId: string): void {
  try {
    localStorage.setItem(ACTIVE_PANEL_KEY, panelId);
  } catch {
    // ignore
  }
}

// --- Panel cards -----------------------------------------------------------------------
// Every panel starts blank and is filled by the user via "Adicionar Gráfico", so each
// panel's cards persist too — only what's needed to rebuild a card (which catalog chart,
// its chosen type and category); the chart data itself is regenerated from the catalog.

export interface StoredCardMeta {
  id: string;
  catalogId: string;
  chartType: string;
  selectedCategory: string;
}

const CARDS_KEY = 'lector_dashboard_cards_v1';

const cardsStorageKey = (panelId: string): string => `${CARDS_KEY}_${panelId}`;

export function loadStoredCards(panelId: string): StoredCardMeta[] {
  try {
    const raw = localStorage.getItem(cardsStorageKey(panelId));
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (item): item is StoredCardMeta =>
        item && typeof item.id === 'string' && typeof item.catalogId === 'string'
    );
  } catch {
    return [];
  }
}

export function saveStoredCards(cards: StoredCardMeta[], panelId: string): void {
  try {
    localStorage.setItem(cardsStorageKey(panelId), JSON.stringify(cards));
  } catch {
    // ignore
  }
}

export function clearStoredCards(panelId: string): void {
  try {
    localStorage.removeItem(cardsStorageKey(panelId));
  } catch {
    // ignore
  }
}

const withLimits = (item: LayoutItem): LayoutItem => {
  const customMin = customMinSizeForCardId(item.i);
  return {
    ...item,
    minW: customMin ? customMin.w : MIN_W,
    minH: customMin ? customMin.h : MIN_H,
    maxW: MAX_W,
    maxH: MAX_H
  };
};

/** Deterministic 3-per-row layout used for the initial/default card set. */
export function buildDefaultLayout(cardIds: string[]): LayoutItem[] {
  return cardIds.map((id, index) =>
    withLimits({
      i: id,
      x: (index % BATCH_COLS_PER_ROW) * BATCH_DEFAULT_W,
      y: Math.floor(index / BATCH_COLS_PER_ROW) * BATCH_DEFAULT_H,
      w: BATCH_DEFAULT_W,
      h: customHeightForCardId(id) ?? BATCH_DEFAULT_H
    })
  );
}

/**
 * Keeps a layout in sync with the current set of cards: drops entries for removed
 * cards and appends a default-sized slot (placed below existing content) for new ones.
 * Existing positions/sizes for cards that are still present are left untouched.
 *
 * Selecionar um único gráfico no catálogo nasce em largura total + altura mínima (ou a
 * altura própria do widget, se ele tiver uma — ver CUSTOM_DEFAULT_HEIGHT). Selecionar
 * VÁRIOS de uma vez nasce lado a lado, 3 por linha, como antes — largura total pra cada um
 * empilharia a tela inteira numa coluna só.
 */
export function reconcileLayout(currentLayout: LayoutItem[], cardIds: string[]): LayoutItem[] {
  const cardIdSet = new Set(cardIds);
  const kept = currentLayout.filter(item => cardIdSet.has(item.i));
  const knownIds = new Set(kept.map(item => item.i));
  const missingIds = cardIds.filter(id => !knownIds.has(id));

  if (missingIds.length === 0) return kept;

  const isBatch = missingIds.length > 1;
  const rowW = isBatch ? BATCH_DEFAULT_W : GRID_COLS;
  const rowH = isBatch ? BATCH_DEFAULT_H : MIN_H;
  const colsPerRow = isBatch ? BATCH_COLS_PER_ROW : 1;

  const bottomY = kept.reduce((max, item) => Math.max(max, item.y + item.h), 0);

  // A continuidade de linha parcial (completar uma linha de 3 já existente) só faz sentido
  // no modo "lote" — no modo solo cada card já fecha sua própria linha (largura total).
  const trailingRowY = bottomY - BATCH_DEFAULT_H;
  const trailingRowSlots = kept.filter(
    item => item.y === trailingRowY && item.w === BATCH_DEFAULT_W && item.h === BATCH_DEFAULT_H
  ).length;
  let slot = isBatch && trailingRowSlots > 0 && trailingRowSlots < BATCH_COLS_PER_ROW ? trailingRowSlots : 0;
  let startY = slot > 0 ? trailingRowY : bottomY;

  const added: LayoutItem[] = [];

  missingIds.forEach(id => {
    const customH = customHeightForCardId(id);
    const forceFullWidth = isAlwaysFullWidthCardId(id);

    if (forceFullWidth) {
      // Faixas de KPI/tabela sempre começam sua própria linha, largura total — nunca
      // dividem a linha com o layout de 3-por-linha do lote.
      const y = slot > 0 ? startY + BATCH_DEFAULT_H : startY;
      const h = customH ?? BATCH_DEFAULT_H;
      added.push(withLimits({ i: id, x: 0, y, w: GRID_COLS, h }));
      startY = y + h;
      slot = 0;
      return;
    }

    added.push(withLimits({
      i: id,
      x: (slot % colsPerRow) * rowW,
      y: startY + Math.floor(slot / colsPerRow) * rowH,
      w: rowW,
      h: customH ?? rowH
    }));
    slot += 1;
  });

  return [...kept, ...added];
}

const rectsOverlap = (a: LayoutItem, b: LayoutItem): boolean =>
  a.x < b.x + b.w && b.x < a.x + a.w && a.y < b.y + b.h && b.y < a.y + a.h;

/**
 * Corrige sobreposições genuínas entre cards — duas posições que ocupam o mesmo espaço no
 * grid — sem mexer em quem já está corretamente posicionado. Diferente do compactor vertical
 * (que só fecha buracos verticais assumindo que não há sobreposição de entrada), isto detecta
 * colisão de retângulos de verdade: útil para curar layouts salvos de sessões anteriores a
 * uma correção no algoritmo de posicionamento, sem descartar o arranjo manual do usuário.
 * Processa por ordem de leitura (y, depois x) e empurra o item mais abaixo/à direita para
 * baixo de quem colidiu primeiro, uma vez por item.
 */
export function resolveOverlaps(layout: LayoutItem[]): LayoutItem[] {
  const sorted = [...layout].sort((a, b) => a.y - b.y || a.x - b.x);
  const placed: LayoutItem[] = [];

  sorted.forEach(item => {
    let candidate = item;
    let guard = 0;
    // Reavalia contra todo mundo já posicionado até não colidir com nada — cada rodada só
    // pode empurrar para baixo, então converge em no máximo `placed.length` iterações.
    while (guard++ <= placed.length) {
      const collision = placed.find(other => rectsOverlap(candidate, other));
      if (!collision) break;
      candidate = { ...candidate, y: collision.y + collision.h };
    }
    placed.push(candidate);
  });

  return placed;
}
