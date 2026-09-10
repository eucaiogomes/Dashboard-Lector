# Lector Live · Indicadores T&D — Dashboard Unimed

Protótipo front-end (SPA) do painel de **Indicadores de Treinamento & Desenvolvimento** de uma cooperativa Unimed, dentro do LMS Lector Live. **Todos os dados são simulados** — não há backend, API nem autenticação.

## Comandos

| Comando | O que faz |
|---|---|
| `npm install` | Instala dependências |
| `npm run dev` | Dev server em http://localhost:3000 |
| `npm run lint` | Typecheck (`tsc --noEmit`). **Não há ESLint/Prettier.** |
| `npm run build` | Build de produção (Vite → `dist/`) |

Não há testes automatizados.

**Definição de pronto:** `npm run lint` e `npm run build` passam **e** a mudança foi vista funcionando no navegador (desktop ≥ 1280px) **e**, se a tela é imprimível, o "Gerar PDF" foi conferido.

## Stack

React 19 · TypeScript 5.8 · Vite 6 · Tailwind CSS v4 (via `@tailwindcss/vite`, sem `tailwind.config`) · react-grid-layout 2 · motion · lucide-react (só 3 arquivos) · fonte de ícones própria `lector-icons` (classes `icon-*`). Deploy na Vercel como SPA (`vercel.json`).

## Mapa do código

```
src/
  App.tsx                      shell: Header + Sidebar + (DashboardView | OtherViews) + Footer — navegação por useState, sem router
  types.ts                     tipos de domínio (MonthData, CostCenterRow, KPIItem…)
  components/
    DashboardView.tsx          ★ tela principal: abas (painéis), grid arrastável, catálogo, modais
    *Block.tsx                 widgets "bloco completo" do Dashboard (um por SPECIAL_WIDGET_IDS)
    IndicadoresFullPageView.tsx  tela de Indicadores T&D completa, usada nos painéis-modelo
    InstitucionaisView / InternosView / CentroCustoView   corpo das 3 telas de indicadores
    ReportDetailOverlay.tsx    relatório "Ver Detalhes" (busca, ordenação, CSV/XLS/imprimir)
  data/
    dashboardCatalog.ts        ★ catálogo de widgets, grupos e SPECIAL_WIDGET_IDS
    reportDefinitions.ts       relatório tabular de cada widget (Ver Detalhes)
    mockData.ts, *Data.ts      dados estáticos
  utils/
    filterSimulator.ts         getSimulatedData(): dados determinísticos a partir dos filtros
    gridLayout.ts              constantes do grid + persistência em localStorage
    exportUtils.ts             Excel (HTML → .xls) e CSV
docs/                          specs — leia a da área antes de mexer
```

## Specs — leia a relevante antes de codar

- `docs/specs/00-visao-produto.md` — o quê, para quem, mapa de telas, **questões em aberto**
- `docs/specs/01-arquitetura.md` — fluxo de dados, estado, persistência, **decisões já tomadas**
- `docs/specs/02-dominio-indicadores.md` — glossário e **fórmulas** de cada indicador
- `docs/specs/03-design-system.md` — paleta da marca, tipografia, padrões de componente
- `docs/specs/04-dashboard.md` · `05-telas-indicadores.md` · `06-relatorios-exportacao.md` — specs funcionais (regras RN-xx)
- `docs/specs/07-backlog-e-debito-tecnico.md` — o que falta e o que está torto
- `docs/features/` — specs de mudanças. Fluxo: `/nova-feature` → humano aprova → `/implementar-feature`

## Convenções

- UI, textos, docs e commits em **português (pt-BR)**. Campos de domínio em português (`colabTreinados`, `turmasPlanejadas`). Os comentários de código existentes estão em inglês: siga o idioma do arquivo que estiver editando.
- Commits: Conventional Commits em pt-BR (`feat:`, `fix:`, `chore:`, `docs:`, `refactor:`).
- Componentes: `export const Nome: React.FC<Props> = (...) => {}`, um por arquivo, props em `interface`.
- Estilo: Tailwind com valores arbitrários (`text-[12.5px]`, `bg-[#004e4c]`). **Use só cores de `03-design-system.md`.** Não invente hex novo.
- Ícones: prefira `<i className="icon-xxx" />` (lector-icons; catálogo em `public/lector-icons.css`). Evite adicionar lucide em arquivos novos.
- Números em pt-BR: `toLocaleString('pt-BR')`; percentual com vírgula (`toFixed(1).replace('.', ',')`).
- Impressão: o chrome interativo leva `no-print`; cabeçalho e rodapé do PDF levam `print-only`. Ver `06-relatorios-exportacao.md`.

## Armadilhas (leia!)

- **Um widget novo no Dashboard exige mexer em 4 lugares:** `SPECIAL_WIDGET_IDS` + `CHART_CATALOG` (`dashboardCatalog.ts`), mapa `SPECIAL_WIDGETS` (`DashboardView.tsx`) e `REPORT_DEFINITIONS` (`reportDefinitions.ts`). Opcionalmente, `DEFAULT_LAYOUT_SPEC`. Use `/novo-widget`.
- **Há duas fontes de dados.** Os `*Block.tsx` do Dashboard leem `mockData.ts`, que é estático e não reage a filtros. As telas de indicadores usam `getSimulatedData()`. Os Blocks são **cópias** da marcação das Views: quando mudar um, confira o gêmeo.
- **`cards` e `layout` mudam juntos, no mesmo handler** (`DashboardView`). Não crie um `useEffect` que reconcilia o layout depois, porque o react-grid-layout entra em loop.
- As chaves de localStorage são `lector_dashboard_*_v1`. Mudou o formato salvo, suba a versão ou escreva uma migração.
- O "hoje" está fixo em **Agosto/2026** em vários arquivos, inclusive o texto "emitido em 31/08/2026" no Excel.
- `App` usa `min-w-[1024px]`, e o layout é desktop-first.
- `@google/genai`, `express` e `dotenv` estão no `package.json` mas **não são usados**: sobraram do template do AI Studio.
- O manual de marca (PDF na raiz) é da Unimed **Divinópolis**, mas o app diz **Volta Redonda**. Não troque o nome sem confirmação.

## Como trabalhar aqui com IA

- Mudança em mais de 2 arquivos: planeje primeiro (modo plan) ou escreva a spec em `docs/features/`.
- Uma feature por sessão. A spec é a memória, não o chat.
- Ao terminar, atualize a spec de `docs/specs/` que mudou (regra, fórmula, widget, débito resolvido).
