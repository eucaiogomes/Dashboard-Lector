/**
 * Cores padrão para gráficos de Coluna do Dashboard — preenchimento sólido, sem
 * gradiente, aprovadas em docs/specs/03-design-system.md.
 */
export const COLUNA_PRIMARY_GREEN = '#004e4c';
// Tom de hover já documentado para o verde escuro (03-design-system.md) — mais sutil
// que saltar para o verde Unimed vibrante.
export const COLUNA_PRIMARY_GREEN_HOVER = '#00706c';
export const COLUNA_SECONDARY_GREEN = '#cde3bb';

/** Paleta de categorias para gráficos de Pizza/Rosca sem cor própria por item —
 *  compartilhada por todos os consumers para que nenhum caia num fallback monocromático. */
export const CHART_CATEGORY_PALETTE = [
  '#004e4c',
  '#f47920',
  '#00995d',
  '#1f8f78',
  '#2a7b9b',
  '#e65100',
  '#5c6bc0',
  '#7e57c2',
  '#26a69a',
  '#ab47bc',
  '#d4e157',
  '#ff7043'
];
