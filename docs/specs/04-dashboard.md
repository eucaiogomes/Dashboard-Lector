# 04 — Dashboard

> Componente principal: `src/components/DashboardView.tsx`. Catálogo: `src/data/dashboardCatalog.ts`. Grid: `src/utils/gridLayout.ts`.

## 1. Objetivo

Tela inicial de "Minha Área" em que o gestor monta a própria visão dos indicadores de T&D: widgets arrastáveis e redimensionáveis, organizados em abas (painéis), com relatório detalhado por widget.

## 2. Anatomia

```
Minha Área / Dashboard                                     [⛶ tela cheia]
[ Dashboard ] [ Treinamentos Internos × ] …                  ← abas de painel
┌──────────────────────────────────────────────────────────────────────┐
│ [Agosto - 2026 📅] [+ Adicionar Gráfico] [+ Adicionar Painel]  Restaurar Padrão │
└──────────────────────────────────────────────────────────────────────┘
 conteúdo do painel ativo: grid de widgets  OU  tela de indicadores completa
```

A pílula de período é **só visual**: não abre seletor e `selectedPeriod` nunca muda (feature 001).

## 3. Tipos de painel

| Tipo | Como surge | Conteúdo | Persistido |
|---|---|---|---|
| **Padrão** (`id = 'default'`, nome "Dashboard") | Sempre existe na primeira carga | 10 widgets de `DEFAULT_LAYOUT_SPEC` | Nome, ordem e layout. Cards recriados do spec |
| **Modelo** (`templateId` ∈ `ViewType`) | "Adicionar Painel" ou CTA "Ver Indicadores" | `IndicadoresFullPageView` da view; widgets extras, se adicionados, aparecem abaixo | Nome, ordem, templateId, layout. **Widgets extras não** |
| **Em branco** | Só aparece ao recarregar um painel com `templateId` desconhecido | Grid vazio + estado vazio | Nome, ordem, layout. **Cards não** |

## 4. Regras

| ID | Regra |
|---|---|
| RN-D-01 | Sempre existe ≥ 1 painel. O × de remover só aparece com 2+ painéis, no hover da aba. |
| RN-D-02 | Clique na aba ativa o painel. **Duplo clique renomeia**: Enter confirma, Esc cancela, nome vazio é ignorado e o texto passa por trim. |
| RN-D-03 | "Adicionar Painel" abre um modal de **multi-seleção** entre os 3 modelos (Institucionais, Internos, Centro de Custo). Cria uma aba por modelo marcado e ativa a última. Duplicatas são permitidas. |
| RN-D-04 | Uma CTA externa (`App.goToIndicadoresPanel(view)`) muda a sidebar para Dashboard e **foca o painel-modelo existente** daquela view ou cria um. É idempotente por `token` (protege contra o duplo efeito do StrictMode). |
| RN-D-05 | "Adicionar Gráfico" abre o catálogo agrupado por `CHART_GROUPS`, com multi-seleção. Itens já no painel aparecem **marcados e desabilitados**; itens `comingSoon` aparecem desabilitados com o selo "Em breve". O botão "Adicionar selecionados" fica desabilitado sem seleção. |
| RN-D-06 | Widget novo entra com 4×8 e ocupa a última linha até formar 3 por linha, depois abre uma linha nova (`reconcileLayout`). |
| RN-D-07 | Tamanho entre 3–12 colunas e 5–20 linhas. Redimensiona por qualquer borda ou canto. Arrasta pelo card inteiro, exceto em `select`, `button` e `.no-drag`. |
| RN-D-08 | Com largura < 1024px: coluna única, sem arrastar nem redimensionar. A altura de cada card vem do layout salvo. |
| RN-D-09 | "Restaurar Padrão" no painel `default` recria os 10 widgets e o layout padrão. Em outro painel, esvazia os widgets (não afeta a tela de um painel-modelo). |
| RN-D-10 | Remover widget: botão × no canto superior direito, visível no hover (widgets especiais). |
| RN-D-11 | "Ver Detalhes" aparece no rodapé do widget quando existe `REPORT_DEFINITIONS[catalogId]` e abre o `ReportDetailOverlay`. |
| RN-D-12 | Tela cheia = container `fixed inset-0 z-50` (não usa a Fullscreen API). O botão alterna. |
| RN-D-13 | `cards` e `layout` são alterados **no mesmo handler**. Proibido reconciliar via efeito separado (ver `CLAUDE.md`). |
| RN-D-14 | Na impressão, o chrome do Dashboard some (`no-print`). Só a `IndicadoresFullPageView` de um painel-modelo ou o `ReportDetailOverlay` aberto são impressos. |

## 5. Catálogo — widgets ativos

Todos pertencem ao grupo `ted_indicadores` e têm relatório "Ver Detalhes".

| # | id (`SPECIAL_WIDGET_IDS`) | Título no catálogo | Componente | Padrão (x,y,w,h) | Dados | Controles internos |
|---|---|---|---|---|---|---|
| 1 | `turmas_execucao_periodo` | Execução das Turmas por Período (rosca) | `TurmasExecucaoDonutBlock` | 0,0,12,8 | `turmasExecucaoData` | Filtro Mês/Ano |
| 2 | `inst_painel_tabs` | Painel Institucional (Evolução / Previsto x Realizado / Tipo) | `InstitucionaisTabsBlock` | 0,8,6,16 | `mockData` | 3 abas |
| 3 | `inst_percentual_realizacao` | Evolução — Percentual de Realização | `InstitucionaisPercentualBlock` | 6,8,6,8 | `mockData` | — |
| 4 | `inst_agenda` | Agenda de Treinamentos | `AgendaBlock` | 6,16,6,8 | `mockData.agendaData` (7 itens; rodapé fixo "Exibindo 7 de 50") | — |
| 5 | `internos_evolucao_metrica` | Evolução por Métrica — Internos | `InternosEvolucaoBlock` | 0,24,4,16 | `mockData` | Seletor de 4 métricas |
| 6 | `internos_ativos_treinados` | Ativos x Treinados | `AtivosTreinadosBlock` | 4,24,4,8 | `mockData` (6 meses) | Abas Ativos x Treinados / Adesão |
| 7 | `internos_treinamentos_horas` | Treinamentos por Horas — Internos | `TreinamentosRankingBlock` | 4,32,4,8 | `mockData` | — |
| 8 | `internos_ranking_cargo` | Ranking por Cargo — Internos | `RankingCargoBlock` | 8,24,4,16 | `mockData` | Abas Rank Geral / Rank Adesão |
| 9 | `centro_custo_tabela` | Indicadores por Centro de Custo | `CentroCustoTableBlock` | 0,40,12,8 | `mockData` | Abas Adesão / Esforço extra + paginação |
| 10 | `educacao_permanente` | Relatório de Educação Permanente (por setor) | `EducacaoPermanenteBlock` | 0,48,6,10 | `educacaoPermanenteData` | Seletor de Setor |

Os widgets 2 a 9 são **cópias** de blocos de `InstitucionaisView`, `InternosView` e `CentroCustoView` (decisão D2).

Itens "Em breve" (roadmap): ver `07-backlog-e-debito-tecnico.md` §1.

## 6. Contratos

```ts
// dashboardCatalog.ts
interface CatalogChartDef {
  id: string; title: string; subtitle: string; group: string; description: string; icon: string;
  defaultType: SupportedChartType; allowedTypes: SupportedChartType[];   // 'Barra'|'Coluna'|'Pizza'|'Linha'|'Tabela'
  unit?: string; categories?: string[];
  comingSoon?: boolean;                                                  // desabilitado no catálogo
  generateData: (ctx?: { period?: string; category?: string }) =>
    { data: ChartDataPoint[]; maxScale: number; ticks: number[]; meta?: {...} };
}

// DashboardView.tsx: todo widget especial recebe só isto
interface SpecialWidgetProps { onVerDetalhes?: () => void }
```

Para adicionar um widget, siga a skill `/novo-widget` (4 pontos de registro).

## 7. Card genérico (dormente)

Usado quando um item do catálogo **não** está em `SPECIAL_WIDGETS`. Cabeçalho com título, selo do grupo, seletor de categoria (regera os dados via `generateData`) e ×. Corpo com `DashboardChartRenderer` (Barra, Coluna, Pizza, Linha, Tabela, animados com `motion`). Rodapé com "Tipo de gráfico" (entre os `allowedTypes`) e "Ver Detalhes", que abre o `DetailedIndicadoresModal` com o gráfico em destaque e o relatório completo abaixo. Sem uso hoje, mas é o destino natural dos itens "Em breve".

## 8. Checklist de regressão (manual)

- [ ] Primeira carga (localStorage limpo) mostra o painel "Dashboard" com os 10 widgets no layout padrão.
- [ ] Arrastar e redimensionar um widget e recarregar mantém a posição.
- [ ] Adicionar Painel → Internos + CC cria 2 abas e ativa a última; recarregar mantém as abas.
- [ ] Renomear aba (duplo clique, Enter) e recarregar mantém o nome; Esc cancela.
- [ ] Remover aba ativa ativa a primeira restante; não dá para remover a última.
- [ ] Remover widget e depois "Restaurar Padrão" traz o widget de volta.
- [ ] Catálogo: widget já presente aparece marcado e desabilitado; "Em breve" desabilitado.
- [ ] Ver Detalhes de cada widget abre o relatório certo.
- [ ] Janela < 1024px: cards empilhados, sem arrastar.
- [ ] Painel-modelo → Gerar PDF imprime só o relatório.
