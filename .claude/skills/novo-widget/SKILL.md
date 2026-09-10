---
name: novo-widget
description: Adiciona um novo widget ("bloco completo") ao catálogo do Dashboard ou promove um item "Em breve" a widget real, cobrindo os 4 pontos de registro (SPECIAL_WIDGET_IDS, CHART_CATALOG, SPECIAL_WIDGETS, REPORT_DEFINITIONS). Use sempre que for criar, promover ou registrar um gráfico ou widget do Dashboard.
---

# Novo widget do Dashboard

Um widget só funciona por completo quando está registrado em **todos** os pontos abaixo. Esquecer um deles gera widget que não aparece, cai no card genérico ou fica sem "Ver Detalhes".

## Checklist

1. **Id e catálogo:** `src/data/dashboardCatalog.ts`
   - Adicione a chave em `SPECIAL_WIDGET_IDS` (valor em snake_case, ex.: `indice_adesao`).
   - Adicione a entrada em `CHART_CATALOG` no grupo certo (`ted_indicadores`, `matriculas`, `indices_desempenho`, `engajamento_consumo`), com `title`, `subtitle`, `description`, `icon` (classe `icon-*`), `defaultType`, `allowedTypes` e `generateData: specialWidgetStub`.
   - **Se estiver promovendo um item "Em breve"**, reutilize o `id` existente, remova `comingSoon: true` e troque o `subtitle: 'Em breve'`.
2. **Dados:** crie ou estenda um arquivo em `src/data/` com um tipo `interface` exportado. Documente as fórmulas novas em `docs/specs/02-dominio-indicadores.md`.
3. **Componente:** crie `src/components/<Nome>Block.tsx` a partir do esqueleto abaixo.
4. **Registro de renderização:** em `src/components/DashboardView.tsx`, importe o componente e adicione a entrada em `SPECIAL_WIDGETS`.
5. **Relatório:** em `src/data/reportDefinitions.ts`, adicione `[SPECIAL_WIDGET_IDS.x]: { title, subtitle, columns, rows }`, construído **do mesmo dataset** do widget.
6. **(Opcional) Painel padrão:** acrescente o widget em `DEFAULT_LAYOUT_SPEC`, dentro do `DashboardView.tsx`, com `x,y,w,h` em uma grade de 12 colunas. Usuários com layout salvo recebem o card novo ao final, via `reconcileLayout`.
7. **Specs:** atualize a tabela §5 de `docs/specs/04-dashboard.md` e, se era item do roadmap, a §1 de `07-backlog-e-debito-tecnico.md`.

## Esqueleto

```tsx
import React from 'react';
import { VerDetalhesButton } from './VerDetalhesButton';

interface NomeBlockProps {
  onVerDetalhes?: () => void;
}

/** <O que o widget mostra e de onde vêm os dados.> */
export const NomeBlock: React.FC<NomeBlockProps> = ({ onVerDetalhes }) => {
  return (
    <div className="h-full bg-white border border-[#e4e8ee] rounded-[6px] shadow-2xs overflow-hidden flex flex-col">
      <div className="px-5 pt-4 pb-3 border-b border-[#f0f3f7]">
        <h2 className="text-[15.5px] font-bold text-[#004e4c] tracking-tight">Título</h2>
        <p className="text-[12.5px] text-[#6b7684] mt-0.5 font-medium">Subtítulo / leitura</p>
      </div>

      <div className="flex-1 min-h-0 px-5 py-3">{/* conteúdo */}</div>

      {onVerDetalhes && (
        <div className="py-2.5 px-5 flex items-center justify-end border-t border-[#f1f3f6]">
          <VerDetalhesButton onClick={onVerDetalhes} className="mt-0" />
        </div>
      )}
    </div>
  );
};
```

Controles internos (abas, `select`) já ficam fora do arraste, porque o grid cancela o drag em `select` e `button`. Para outros elementos interativos, adicione a classe `no-drag`.

## Verificação

- [ ] `npm run lint` e `npm run build` passam.
- [ ] O widget aparece no catálogo, pode ser adicionado e fica marcado e desabilitado depois de adicionado.
- [ ] Arrastar, redimensionar (inclusive no tamanho mínimo 3×5) e remover funcionam.
- [ ] "Ver Detalhes" abre o relatório com busca, ordenação, CSV e Excel funcionando.
- [ ] "Restaurar Padrão" se comporta como esperado (volta ou não, conforme o passo 6).
- [ ] Com janela < 1024px, o widget aparece empilhado e legível.
