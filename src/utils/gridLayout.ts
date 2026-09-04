import type { LayoutItem } from 'react-grid-layout';

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

// Default size for a newly added card: a third of the row (3 charts per line) rather than
// half — half-width defaults meant every new chart landed in a fixed 2-per-row arrangement,
// leaving the rest of the row empty until someone manually resized/repositioned it.
export const DEFAULT_COLS_PER_ROW = 3;
export const DEFAULT_W = GRID_COLS / DEFAULT_COLS_PER_ROW;
export const DEFAULT_H = 8;

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

const PANELS_KEY = 'lector_dashboard_panels_v1';
const ACTIVE_PANEL_KEY = 'lector_dashboard_active_panel_v1';

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

const withLimits = (item: LayoutItem): LayoutItem => ({
  ...item,
  minW: MIN_W,
  minH: MIN_H,
  maxW: MAX_W,
  maxH: MAX_H
});

/** Deterministic 3-per-row layout used for the initial/default card set. */
export function buildDefaultLayout(cardIds: string[]): LayoutItem[] {
  return cardIds.map((id, index) =>
    withLimits({
      i: id,
      x: (index % DEFAULT_COLS_PER_ROW) * DEFAULT_W,
      y: Math.floor(index / DEFAULT_COLS_PER_ROW) * DEFAULT_H,
      w: DEFAULT_W,
      h: DEFAULT_H
    })
  );
}

/**
 * Keeps a layout in sync with the current set of cards: drops entries for removed
 * cards and appends a default-sized slot (placed below existing content) for new ones.
 * Existing positions/sizes for cards that are still present are left untouched.
 */
export function reconcileLayout(currentLayout: LayoutItem[], cardIds: string[]): LayoutItem[] {
  const cardIdSet = new Set(cardIds);
  const kept = currentLayout.filter(item => cardIdSet.has(item.i));
  const knownIds = new Set(kept.map(item => item.i));
  const missingIds = cardIds.filter(id => !knownIds.has(id));

  if (missingIds.length === 0) return kept;

  const bottomY = kept.reduce((max, item) => Math.max(max, item.y + item.h), 0);

  // Charts are added one at a time (the catalog modal calls this once per selection), so a
  // naive "index within this call" always resets to 0 — every card would start its own row
  // instead of filling the current one. Instead, look at whatever auto-placed row is already
  // trailing at the bottom and keep filling it until it reaches DEFAULT_COLS_PER_ROW.
  const trailingRowY = bottomY - DEFAULT_H;
  const trailingRowSlots = kept.filter(
    item => item.y === trailingRowY && item.w === DEFAULT_W && item.h === DEFAULT_H
  ).length;
  const startSlot = trailingRowSlots > 0 && trailingRowSlots < DEFAULT_COLS_PER_ROW ? trailingRowSlots : 0;
  const startY = startSlot > 0 ? trailingRowY : bottomY;

  const added = missingIds.map((id, i) => {
    const slot = startSlot + i;
    return withLimits({
      i: id,
      x: (slot % DEFAULT_COLS_PER_ROW) * DEFAULT_W,
      y: startY + Math.floor(slot / DEFAULT_COLS_PER_ROW) * DEFAULT_H,
      w: DEFAULT_W,
      h: DEFAULT_H
    });
  });

  return [...kept, ...added];
}
