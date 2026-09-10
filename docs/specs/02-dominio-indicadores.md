# 02 — Domínio: Indicadores de T&D

> Fonte da verdade para nomes, definições e fórmulas. Mudou uma fórmula no código? Atualize aqui no mesmo commit.
> Itens marcados **SIMULAÇÃO** existem só para gerar números plausíveis e **não** são regra de negócio. Precisam de definição oficial do cliente antes de ligar dados reais.

## 1. Glossário

| Termo | Definição usada no produto | No código |
|---|---|---|
| **T&D** | Treinamento e Desenvolvimento | — |
| **Treinamento Institucional** | Treinamento planejado pela instituição, acompanhado por previsto, agendado e realizado por mês | view `'Treinamentos Institucionais'` |
| **Institucional – Assistencial** | Subtipo institucional voltado à assistência ao paciente (abreviado "Inst. - Assistencial") | `tipo` |
| **Treinamento Interno** | Evento presencial interno; medido por participação, colaboradores treinados e horas | view `'Treinamentos Internos'` |
| **Tipo de treinamento** | Institucional, Institucional – Assistencial, Comportamental, Técnico / Operacional, Obrigatório (NR) | `TrainingTypeData.nome` |
| **NR** | Norma Regulamentadora (ex.: NR32 Biossegurança, NR23 Incêndio): treinamento obrigatório | — |
| **Turma** | Uma oferta de um treinamento, com data, instrutor e inscritos | — |
| **Previsto** | Turmas planejadas no mês/tipo | `previsto` |
| **Agendado** | Previsto com data marcada, ainda não executado | `agendado` |
| **Realizado** | Turma executada | `realizado` |
| **Não Realizado** | Previsto que não foi executado (cancelado ou pendente) | `naoRealizado` |
| **Colaborador ativo** | Colaborador na base do período | `ativos` |
| **Afastado** | Colaborador com status bloqueado. A flag *afastados* define se entra na base de ativos (hoje fixa em `true` = incluídos) | `afastados` |
| **Colaborador treinado** | Colaborador **distinto** que participou de ao menos um treinamento | `colabTreinados`, `treinados` |
| **Participante / participação** | Cada presença conta, então uma pessoa em 3 treinamentos = 3 | `totalParticipantes`, `participantes` |
| **Horas treinadas** | Soma da carga horária aplicada, exibida como `h:mm:ss` | `horasTreinadas`, `horasFormatted` |
| **Centro de custo** | Área/setor da organização (ex.: UTI Adulto, Faturamento) | `area` |
| **Gestor / Supervisor** | Responsáveis hierárquicos pela área | `gestor`, `supervisor` |
| **Instrutor** | Quem ministra a turma | `instrutor` |
| **Inscritos / Realizaram** | Inscritos numa turma e os que efetivamente concluíram | `inscritos`, `realizaram` |
| **Adesão** | Proporção de quem realizou sobre a base esperada (ver fórmulas) | — |
| **Turmas planejadas / excedentes / executadas** | Planejadas no período / abertas além do plano / total executado | `turmasPlanejadas`, `turmasExcedentes`, `turmasExecutadas` |
| **Esforço extra** | Quanto se executou além do planejado | — |
| **Educação Permanente** | Relatório por setor: elegíveis x treinados, adesão x meta, turmas, esforço extra | `EducacaoPermanenteRecord` |
| **Elegíveis** | Colaboradores que deveriam fazer o treinamento | `colaboradoresElegiveis` |
| **Meta de adesão** | Percentual-alvo de adesão (89% em todos os registros atuais) | `adesaoMetaPct` |
| **MêsAno** | Rótulo de mês no formato `Mmm/AA` (ex.: `Ago/26`) | `mesAno` |

## 2. Fórmulas

Arredondamento de exibição: percentuais com **1 casa decimal e vírgula** (`90,6%`), exceto onde indicado.

| Indicador | Fórmula | Onde aparece | Status |
|---|---|---|---|
| **% Realização** | `realizado ÷ previsto × 100` | KPI Institucionais, `InstitucionaisPercentualBlock`, `TurmasExecucaoDonutBlock`, relatórios | A validar com o cliente |
| **Agendado** (KPI) | `max(1, round((previsto − realizado) × 0,45))` | KPI Institucionais | **SIMULAÇÃO** |
| **Não Realizado** (KPI) | `previsto − realizado − agendado` | KPI Institucionais | Derivado da simulação |
| **Adesão** (centro de custo) | `realizaram ÷ inscritos` | Tabela CC, relatório CC | A validar |
| **Adesão mensal média** (KPI CC) | `Σ realizaram ÷ Σ inscritos` (**ponderada**, não é média simples das linhas) | KPI Centro de Custo | A validar |
| **Adesão** (Ativos x Treinados) | `colabTreinados ÷ ativos`, últimos 6 meses | `AtivosTreinadosBlock`, InternosView | A validar |
| **Rank Adesão** (cargo) | ordena por `treinados ÷ ativos`, decrescente | `RankingCargoBlock` | A validar |
| **Rank Geral** (cargo) | ordena por `participantes`, decrescente | `RankingCargoBlock` | Vigente |
| **Esforço extra** (CC / Turmas) | `turmasExcedentes ÷ turmasPlanejadas` | Tabela CC, `TurmasPlanejadasCard`, KPI CC | A validar |
| **Esforço extra** (Educação Permanente) | `(turmasExecutadas − turmasPlanejadas) ÷ turmasPlanejadas` (ex.: 5 exec / 4 plan = 25%) | `EducacaoPermanenteBlock` (valor já vem pronto no dado) | Equivale ao anterior se excedentes = executadas − planejadas |
| **Qtd. Colab. Treinados** (KPI Internos) | `Σ treinados por cargo × 1,6` | KPI Internos | **SIMULAÇÃO** |
| **Qtd. Total Participantes** (KPI) | `Σ totalParticipantes` (12 meses) | KPI Internos | Vigente |
| **Horas Treinadas** (KPI) | `Σ horasTreinadas` (12 meses), exibido `N:00 h` | KPI Internos | Vigente |
| **Qtd. Treinamentos Internos** (KPI) | `Σ qtdTreinamentos` (12 meses) | KPI Internos | Vigente |
| **Turmas planejadas / excedentes** (card) | `Σ turmasPlanejadas × 18` / `Σ turmasExcedentes × 3` (fallback 142 / 18) | `TurmasPlanejadasCard` | **SIMULAÇÃO** |
| **Usuários inscritos / que realizaram** (KPI CC) | base 1284 (com afastados) ou 1221 × multiplicadores; realizaram = 75% | KPI CC | **SIMULAÇÃO** |
| **Centros de custo** (KPI) | 1 se filtrado; senão `round(38 × multiplicador da unidade)` | KPI CC | **SIMULAÇÃO** |

Ordenações padrão:

- Tabela CC, aba **Adesão**: menor adesão primeiro (evidencia problemas).
- Tabela CC, aba **Esforço extra**: maior primeiro.

## 3. Janela temporal

- Série mensal = **12 meses móveis terminando no mês selecionado** (`getSimulatedData`). Exemplo: Ago/2026 → Set/25 … Ago/26.
- Ativos x Treinados usa os **últimos 6** meses da série.
- `DateFilterValue.mode = 'periodo'` (data inicial e final) existe na UI, mas o simulador só usa `year`, `month` e `mode` na seed; não recorta por intervalo.
- Os widgets do Dashboard usam `mockData.monthlyBaseData` fixo (Set/25 → Ago/26).

## 4. Filtros

| Filtro | Opções | Exposto na UI | Efeito no simulador |
|---|---|---|---|
| Período | Mensal (ano 2023–2027 + mês) ou Período (início/fim) | Sim (`DateFilterPicker`) | Seed + fim da janela de 12 meses |
| Unidades | Todas as unidades · Hospital Unimed · Pronto Atendimento · Unidade Retiro · Sede Administrativa | Sim | Multiplicador 1 · 0,58 · 0,22 · 0,12 · 0,08 |
| Tipo de Treinamento | Todos os tipos · Institucional · Institucional - Assistencial · Comportamental · Técnico / Operacional · Obrigatório (NR) | Sim | ×0,45 e filtra tipos e agenda |
| Gerente, Supervisor, Cargo, Centro de custo, Gestor | valor livre | **Não** | Multiplicadores 0,35 · 0,25 · 0,18 · 0,15 · 0,2 e filtros de linha |
| Afastados | incluir / excluir | **Não** (fixo `true`) | Ativos × 1 ou × 0,95 |

> ⚠️ O card genérico usa outra lista de categorias (`DEFAULT_TRAINING_CATEGORIES`: "Cursos Obrigatórios (NRs)", "Trilhas de Aprendizagem"…) que não bate com as opções acima.

## 5. Status

| Status | Texto | Fundo | Uso |
|---|---|---|---|
| REALIZADO / ATIVO | `#0f6b3f` | `#e6f4ec` | Agenda, relatórios |
| AGENDADO | `#8a5a00` | `#fdf3e0` | Agenda, relatórios (`#d99a24` no donut) |
| NÃO REALIZADO / INATIVO | `#a32020` | `#fbeaea` | Agenda, relatórios |

## 6. Modelo de dados

`src/types.ts`:

```ts
type ViewType = 'Treinamentos Institucionais' | 'Treinamentos Internos' | 'Por Centro de Custo';

interface MonthData        { mesAno; previsto; realizado; ativos; colabTreinados; totalParticipantes; horasTreinadas; qtdTreinamentos }
interface TrainingTypeData { nome; previsto; realizado }
interface AgendaItem       { mesAno; nome; tipo; status: 'REALIZADO' | 'AGENDADO' | 'NÃO REALIZADO' }
interface InternalTraining { nome; horasVal: number; horasFormatted: string /* 'h:mm:ss' */ }
interface JobPositionData  { cargo; participantes; ativos; treinados }
interface CostCenterRow    { area; gestor; supervisor; treinamento; aula; instrutor; inscritos; realizaram; turmasPlanejadas; turmasExcedentes }
interface KPIItem          { label; value: string /* já formatado */; unit; delta /* texto de apoio */; barColor }
interface FilterItem       { label; value; options: string[] }
```

Outros registros:

| Tipo | Arquivo | Campos |
|---|---|---|
| `TrainingCatalogRow` | `data/trainingCatalogData.ts` | treinamento, autor, turma, cargaHoraria, situacao, inicioInscricoes, fimInscricoes |
| `TurmasExecucaoRecord` | `data/turmasExecucaoData.ts` | mesAno, previsto, realizado, agendado, naoRealizado |
| `EducacaoPermanenteRecord` | `data/educacaoPermanenteData.ts` | setor, supervisores, periodo, categoria, tema, instrutores, colaboradoresElegiveis, colaboradoresTreinados, adesaoMensalPct, adesaoMetaPct, turmasPlanejadas, turmasExecutadas, esforcoExtraPct |
| `CatalogChartDef` / `DashboardCardItem` | `data/dashboardCatalog.ts` | ver `04-dashboard.md` |
| `ReportDefinition` | `data/reportDefinitions.ts` | ver `06-relatorios-exportacao.md` |

## 7. Fronteira para dados reais (proposta)

Quando houver API, **`getSimulatedData` é a costura**: troque-a por um `fetchIndicadores(view, dateFilter, filters, afastados)` assíncrono que devolva **o mesmo formato** (`monthlyData`, `trainingTypesData`, …, `kpis`). Com isso as Views não mudam. Pré-requisitos:

1. Unificar os widgets do Dashboard nessa mesma fonte (feature 001).
2. `kpis` deve vir como números, e a formatação sai do simulador para a UI.
3. Validar com o cliente cada linha "A validar" e substituir cada "SIMULAÇÃO" da tabela da seção 2.
