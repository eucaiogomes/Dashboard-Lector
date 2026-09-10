# 001 — Período global do Dashboard aplicado aos widgets

| Campo | Valor |
|---|---|
| **Status** | Rascunho (exemplo de spec; aguardando aprovação) |
| **Autor / data** | Claude (análise inicial) · 2026-09-10 |
| **Specs afetadas** | `04-dashboard.md`, `01-arquitetura.md` §3, `02-dominio-indicadores.md` §3, `06-relatorios-exportacao.md` |
| **Tamanho estimado** | G (≈ 12 arquivos): pode ser dividida em 001a (period picker + persistência) e 001b (widgets e relatórios) |

## 1. Problema

A pílula "Agosto - 2026" do Dashboard parece um filtro, mas é estática (`selectedPeriod` em `DashboardView.tsx` nunca muda). Os 10 widgets importam dados fixos de `mockData.ts` e outros arquivos, então nada no Dashboard reage a período. Já as telas de indicadores (painéis-modelo) têm um `DateFilterPicker` funcional sobre `getSimulatedData()`. Na prática o mesmo indicador mostra números diferentes no widget e no painel-modelo (ver `01-arquitetura.md` §3).

## 2. Resultado esperado

Depois disso, o gestor escolhe um período no Dashboard e todos os widgets do painel, e seus relatórios "Ver Detalhes", passam a mostrar dados daquele período, consistentes com o painel-modelo equivalente.

## 3. Histórias de usuário

- Como **gestor de T&D**, quero trocar o mês do Dashboard e ver todos os widgets atualizados, para comparar meses sem abrir cada tela.
- Como **gestor**, quero que o número de um widget bata com o da tela completa, para confiar no painel.

## 4. Regras de negócio

| ID | Regra |
|---|---|
| RN-01 | A pílula de período vira o `DateFilterPicker`, o mesmo componente das telas. |
| RN-02 | O período é **global ao Dashboard** (vale para todos os painéis de grid) e persiste em `localStorage` (`lector_dashboard_period_v1`). Padrão: Agosto/2026. |
| RN-03 | Cada widget recebe seus dados por **props**, derivados de `getSimulatedData(viewDoWidget, periodo, {}, true)`. Os Blocks deixam de importar `mockData`. |
| RN-04 | `REPORT_DEFINITIONS` vira uma função `getReportDefinition(catalogId, periodo)` que usa o mesmo dataset do widget. |
| RN-05 | Com os mesmos filtros, o widget e o painel-modelo mostram **os mesmos números**. |
| RN-06 | Painéis-modelo mantêm o seu próprio filtro de período (não herdam). Ver questão Q1. |

## 5. Comportamento de UI

- Normal: a pílula abre o seletor Mensal/Período. Ao aplicar, todos os widgets re-renderizam, e as animações de entrada não devem repetir a cada troca.
- Vazio: não se aplica (o simulador sempre devolve dados).
- < 1024px: o seletor continua acessível na barra de ações.
- Impressão: o relatório "Ver Detalhes" mostra o período no subtítulo.

## 6. Dados

- Origem: `getSimulatedData` para os widgets 2 a 9. `TurmasExecucao` e `EducacaoPermanente` mantêm os datasets próprios nesta fase (ver Fora de escopo).
- Tipos: `SpecialWidgetProps` ganha `period: DateFilterValue` (ou o dataset já calculado; decidir no plano).
- Persistência: nova chave `lector_dashboard_period_v1` em `gridLayout.ts`, com `try/catch` como as demais.

## 7. Arquivos a tocar (previsão)

| Arquivo | Mudança |
|---|---|
| `src/components/DashboardView.tsx` | Estado do período (`DateFilterValue`), picker na barra, repassar para os widgets e para `getReportDefinition` |
| `src/utils/gridLayout.ts` | `loadStoredPeriod` e `saveStoredPeriod` |
| `src/data/reportDefinitions.ts` | Objeto estático vira função por período |
| `src/components/InstitucionaisTabsBlock.tsx`, `InstitucionaisPercentualBlock.tsx`, `AgendaBlock.tsx`, `InternosEvolucaoBlock.tsx`, `AtivosTreinadosBlock.tsx`, `TreinamentosRankingBlock.tsx`, `RankingCargoBlock.tsx`, `CentroCustoTableBlock.tsx` | Receber dados por props |
| `docs/specs/04-dashboard.md`, `01-arquitetura.md` | Atualizar a tabela de widgets e o fluxo de dados |

## 8. Fora de escopo

- Filtros de Unidade e Tipo no Dashboard.
- Unificar Blocks e Views num único componente (débito T-02; pode vir na sequência).
- `TurmasExecucaoDonutBlock` e `EducacaoPermanenteBlock` (datasets próprios, sem equivalente no simulador).

## 9. Critérios de aceite

- [ ] `npm run lint` e `npm run build` passam.
- [ ] Clicar na pílula de período abre o seletor; escolher "Março/2026" muda os valores dos widgets 2 a 9.
- [ ] Com o mesmo período, "Percentual de Realização" no Dashboard e na tela Institucionais mostram os mesmos valores mês a mês.
- [ ] "Ver Detalhes" de qualquer widget reflete o período escolhido, e o CSV exportado também.
- [ ] Recarregar a página mantém o período escolhido.
- [ ] Nenhum `import … from '../data/mockData'` resta nos Blocks 2 a 9.
- [ ] `04-dashboard.md` e `01-arquitetura.md` atualizados.

## 10. Plano de verificação

1. `npm run dev`, abrir http://localhost:3000 e limpar o localStorage.
2. Anotar os valores de Ago/26 no widget "Percentual de Realização".
3. Trocar para Mar/2026: os valores mudam e o eixo termina em Mar/26.
4. Adicionar o painel "Treinamentos Institucionais" com Mar/2026 no filtro próprio e comparar com o widget.
5. Recarregar: o período continua Mar/2026.
6. Ver Detalhes → Exportar CSV → conferir as linhas.

## 11. Questões em aberto

- [ ] **Q1.** Os painéis-modelo devem herdar o período do Dashboard como valor inicial? *Recomendação:* sim como valor inicial, depois cada um segue independente.
- [ ] **Q2.** O período é global ou por painel? *Recomendação:* global. É mais simples, e é o que um gestor espera de um "filtro do topo".
- [ ] **Q3.** O `TurmasExecucaoDonutBlock` deve sincronizar o próprio seletor de mês com o período global? *Recomendação:* fica para uma feature separada.

## 12. Registro de implementação

*A preencher.*
