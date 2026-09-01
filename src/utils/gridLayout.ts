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

// Default size for a newly added card: half width, roughly matching the original fixed card height.
export const DEFAULT_W = 6;
export const DEFAULT_H = 8;

const STORAGE_KEY = 'lector_dashboard_layout_v1';

export function loadStoredLayout(): LayoutItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
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

export function saveStoredLayout(layout: LayoutItem[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(layout));
  } catch {
    // Storage unavailable (private mode, quota) — layout simply won't persist across sessions.
  }
}

export function clearStoredLayout(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
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

/** Deterministic 2-column layout used for the initial/default card set. */
export function buildDefaultLayout(cardIds: string[]): LayoutItem[] {
  return cardIds.map((id, index) =>
    withLimits({
      i: id,
      x: (index % 2) * DEFAULT_W,
      y: Math.floor(index / 2) * DEFAULT_H,
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
  const added = missingIds.map((id, index) =>
    withLimits({
      i: id,
      x: (index % 2) * DEFAULT_W,
      y: bottomY + Math.floor(index / 2) * DEFAULT_H,
      w: DEFAULT_W,
      h: DEFAULT_H
    })
  );

  return [...kept, ...added];
}
