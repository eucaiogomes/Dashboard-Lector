# 06 — Relatórios, exportação e impressão

> Arquivos: `components/ReportDetailOverlay.tsx`, `components/DetailedIndicadoresModal.tsx`, `data/reportDefinitions.ts`, `utils/exportUtils.ts`, `src/index.css` (`@media print`).

## 1. Pontos de saída

| Origem | Ação | Implementação | Arquivo gerado |
|---|---|---|---|
| Tela de indicadores (painel-modelo) | **Exportar Excel** | `exportToExcel(view, kpis, filters, …)`: pasta de trabalho HTML com várias planilhas | `indicadores-td-<view>-2026-08.xls` (⚠️ data fixa) |
| Tela de indicadores | **Gerar PDF** | mensagem "Montando relatório…", depois de 300ms `window.print()` | PDF do navegador |
| Widget → **Ver Detalhes** | CSV | `exportTableToCsv(title, columns, sortedRows)` | `<slug-do-titulo>.csv` |
| Widget → Ver Detalhes | Excel | `exportTableToXls(title, subtitle, columns, sortedRows)` | `<slug-do-titulo>.xls` |
| Widget → Ver Detalhes | Imprimir | `window.print()` | PDF do navegador |
| Card genérico → Ver Detalhes | Gráfico + relatório + exportação | `DetailedIndicadoresModal` (sem uso hoje) | — |

## 2. Relatório "Ver Detalhes" (`ReportDetailOverlay`)

Toda a tela é dirigida por um `ReportDefinition`:

```ts
interface ReportColumn { key: string; label: string; align?: 'left'|'right'|'center'; type?: 'text'|'number'|'status' }
interface ReportDefinition { title: string; subtitle: string; columns: ReportColumn[]; rows: Record<string, string|number>[] }
// REPORT_DEFINITIONS: Record<catalogId, ReportDefinition>
```

| ID | Regra |
|---|---|
| RN-R-01 | Existe um relatório por widget especial, montado **do mesmo dataset** que o widget mostra, só que em nível de registro. |
| RN-R-02 | A busca procura o termo em **todas** as colunas, sem diferenciar maiúsculas. Mudar a busca volta para a página 1. |
| RN-R-03 | Clique no cabeçalho ordena; outro clique inverte. Números são comparados numericamente e texto com `localeCompare('pt-BR')`. |
| RN-R-04 | Paginação de 10 linhas por página. |
| RN-R-05 | Exportação usa as linhas **filtradas e ordenadas** (`sortedRows`), não só a página atual. |
| RN-R-06 | Colunas `type: 'status'` viram badge: REALIZADO/ATIVO verde, AGENDADO âmbar, NÃO REALIZADO/INATIVO vermelho. |
| RN-R-07 | Trocar de relatório zera busca, ordenação e página. |
| RN-R-08 | Percentuais nas linhas são números com 1 casa (`pct()` = `round(n/d*1000)/10`). |

## 3. Excel da tela (`exportToExcel`)

- Cada planilha tem faixa laranja, título, subtítulo (filtros aplicados), a linha "Lector Live · Unimed Volta Redonda — emitido em 31/08/2026 07h12" (⚠️ **fixa**), o cabeçalho `#004e4c` e linhas zebradas. Algumas planilhas têm linha de totais.
- A primeira planilha, "Painel", traz os KPIs com uma barra de `█` proporcional ao valor.
- Faixas de leitura: ≥ 80 ok (verde), ≥ 60 atenção (âmbar), abaixo disso ruim (vermelho).
- Técnica: HTML com `xmlns:x="urn:schemas-microsoft-com:office:excel"`, BOM `﻿`, MIME `application/vnd.ms-excel`. Ao abrir, o Excel **mostra um aviso** de que formato e extensão não coincidem. Isso é esperado (decisão D6).

## 4. CSV

- Separador `;` (Excel pt-BR), BOM UTF-8, quebra de linha CRLF. Aspas quando o valor contém `"`, `;` ou `\n`.
- ⚠️ **Bug provável:** números decimais saem com ponto (`String(90.6)` = `"90.6"`), e o Excel pt-BR lê isso como texto ou número errado. O certo é formatar com vírgula (débito T-09).

## 5. Impressão / PDF

CSS em `src/index.css`:

| Classe / seletor | Efeito na impressão |
|---|---|
| `@page` | A4 **paisagem**, margens 10mm × 12mm |
| `.no-print` | Some (shell, sidebar, filtros, botões, chrome do Dashboard) |
| `.print-only` | Aparece como `flex`; na tela fica escondido |
| `.print-block` | Aparece e força quebra de página antes |
| `.page-break-inside-avoid` | Evita quebrar o bloco no meio |
| `.report-detail-backdrop`, `#report-detail-print-root`, `.report-detail-table-scroll` | O overlay do Ver Detalhes vira conteúdo estático, sem backdrop nem scroll |
| `*` | `print-color-adjust: exact` (mantém as cores) |

Estrutura do PDF da tela de indicadores (`IndicadoresFullPageView`):

1. Cabeçalho `print-only`: logo Lector + "UNIMED VOLTA REDONDA", título "Indicadores T&D — {view}", filtros ("Período: … · Unidades: … · Tipo: …"), linha de afastados e data de emissão (data real, `new Date()`).
2. KPIs, card de turmas e corpo da view.
3. Rodapé `print-only`: "Lector Live · Indicadores T&D — Unimed Volta Redonda", afastados e data de emissão.

| ID | Regra |
|---|---|
| RN-R-09 | Um componente imprimível **não pode** estar dentro de um wrapper `.no-print`. No Dashboard, `IndicadoresFullPageView` e `ReportDetailOverlay` ficam fora dos wrappers `no-print` justamente por isso (commit `0f14348`). |
| RN-R-10 | Todo controle interativo dentro de área imprimível leva `no-print`. |
| RN-R-11 | Todo relatório impresso mostra filtros aplicados e data de emissão. |

### Checklist ao criar uma área imprimível

- [ ] Cabeçalho `print-only` com logo, título, filtros e data.
- [ ] Botões, abas e seletores com `no-print`.
- [ ] Nenhum ancestral com `no-print`.
- [ ] Tabelas longas sem `overflow` cortando (neutralize o scroll no `@media print`).
- [ ] Testado em Chrome → Imprimir → Salvar como PDF, A4 paisagem.
