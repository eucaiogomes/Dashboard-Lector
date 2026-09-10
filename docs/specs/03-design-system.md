# 03 — Design system

> Base: `Manual de marca ajustado 2026.pdf` (raiz do repo; Marketing Unimed **Divinópolis**) + o que o código já usa.
> Regra para IA: **não introduza cor hex fora deste documento.** Se precisar de uma nova, adicione aqui primeiro, com justificativa.

## 1. Marca Unimed (do manual)

### Paleta primária

| Nome | HEX | Uso segundo o manual | Uso no app |
|---|---|---|---|
| **Verde Unimed** | `#00995d` | Cor principal, identifica a marca | Botões primários (CTA), valores positivos |
| **Verde cítrico** | `#b1d34b` | Uso pontual, em destaques; energia e vitalidade | *não usado ainda* |
| **Verde escuro** | `#004e4c` | **No lugar do preto**, para textos e suporte | Títulos, texto forte, aba ativa, cabeçalho de tabela |
| **Laranja** | `#f47920` | Uso pontual, em destaques | Indicador de aba ativa, ícone de destaque, check, faixa do Excel |

### Cores de apoio ("comunicam cuidado com a saúde e a vida")

| HEX | Nome sugerido | Uso no app |
|---|---|---|
| `#d2a494` | terracota | — |
| `#f1cdcd` | rosa | — |
| `#ece3d9` | areia | — |
| `#ffe596` | amarelo | — |
| `#cde3bb` | verde-claro | Aparece em 16 usos (fundos suaves) |
| `#a4d8de` | azul-claro | — |

Cores básicas: escala de cinzas até o preto (estrutura).

### Regras do manual

- **Não alterar cor nem formato do logotipo.** Versões permitidas: verde (oficial, primeira opção), branca sobre fundo escuro e preta. O uso de preto/branco deve ser comunicado ao Marketing.
- Versão com box: **box + logo** sempre juntos, sem alteração.
- Recomendado: logomarca **com pinheiro** em todos os casos da cooperativa.
- Lema atual: **"Aqui tem gente. Aqui tem vida. Aqui tem Unimed."** É **proibido** usar "Cuidar de você, esse é o plano."
- O manual não define tipografia nas páginas atuais. A fonte Barlow é escolha do projeto.

> ⚠️ O manual é da Unimed **Divinópolis**, mas o app se apresenta como Unimed **Volta Redonda**. Ver questões em aberto em `00-visao-produto.md`.

## 2. Tokens em uso no código

### Texto

| Papel | HEX | Tailwind usado |
|---|---|---|
| Título / texto forte | `#004e4c` | `text-[#004e4c]` (308 usos) |
| Corpo | `#1f2733` | `text-[#1f2733]` |
| Secundário | `#6b7684` | `text-[#6b7684]` |
| Terciário | `#4a5462` | `text-[#4a5462]` |
| Apagado / legendas | `#8a93a0` | ⚠️ contraste 3,1:1, só para texto ≥ 18px ou decorativo |
| Separador de breadcrumb | `#b6bdc7` | — |
| Texto sobre verde escuro | `#eef7f4` | — |

### Superfícies e bordas

| Papel | HEX |
|---|---|
| Fundo da aplicação | `#f4f6f9` (body `#eef0f3`) |
| Card | `#ffffff` |
| Fundo sutil (cabeçalho de tabela, input) | `#f8fafc`, `#f6f8fa`, `#fcfdfe` |
| Header e Footer do shell | `#013330` (verde mais escuro que o `#004e4c`; **fora do manual**) |
| Borda de card | `#e0e5eb`, `#e4e8ee`, `#dfe4ea` (três quase iguais, consolidar) |
| Borda de input / botão secundário | `#cfd6e0` |
| Divisor interno | `#f0f3f7`, `#f1f3f6` |

### Ações e estados

| Papel | Base | Hover |
|---|---|---|
| Botão primário (Adicionar, Gerar PDF) | `#00995d` | `#00824f` |
| Botão escuro / aba de painel ativa | `#004e4c` | `#00706c` |
| Botão secundário | fundo branco, borda `#cfd6e0`, texto `#004e4c` | borda `#004e4c` |
| Destaque de aba / seleção | borda inferior `#f47920` | — |
| Status | ver `02-dominio-indicadores.md` §5 (`#0f6b3f`, `#8a5a00`/`#d99a24`, `#a32020`) | — |

Inconsistências conhecidas: `#64748b` e `#334155` (slate do Tailwind) aparecem em alguns lugares e deveriam virar `#6b7684` e `#1f2733`.

## 3. Tipografia

**Barlow** 400/500/600/700 (Google Fonts), com fallback do sistema.

| Papel | Tamanho / peso |
|---|---|
| Título de tela (h1) | `text-[26px] font-bold tracking-tight` `#004e4c` |
| Título de modal | `text-[19px] font-bold` |
| Número de KPI | `text-[22px]`–`text-[24px] font-bold` |
| Título de card | `text-[15px]`–`text-[15.5px] font-bold` `#004e4c` |
| Corpo, botões, abas | `text-[13px]`–`text-[13.5px] font-semibold` |
| Linhas de tabela | `text-[12px]`–`text-[12.5px]` |
| Cabeçalho de tabela / rótulos | `text-[11px] uppercase tracking-wider font-bold` `#6b7684` |
| Badges | `text-[10px]`–`text-[11px] font-bold` |

Hoje existem 15+ tamanhos arbitrários. Ao criar algo novo, **escolha um desta tabela**.

## 4. Forma e espaçamento

- Raio: cards `rounded-[6px]`; botões e inputs `rounded-[4px]` a `rounded-[6px]`; modais `rounded-2xl`; botões de modal `rounded-full`.
- Sombra: `shadow-2xs` em cards e botões; `shadow-lg` em dropdowns; `shadow-2xl` em modais.
- Padding de tela: `px-7` nas telas de indicadores, `p-6` no Dashboard. Card: `p-5` ou `px-5 pt-4`.
- Espaço entre cards: `gap-3.5` nas telas e margem de 20px no grid do Dashboard.
- Desktop-first: `min-w-[1024px]` no shell.

## 5. Padrões de componente (copie estes)

```tsx
{/* Card */}
<div className="bg-white border border-[#e4e8ee] rounded-[6px] shadow-2xs overflow-hidden">
  <div className="px-5 pt-4 text-[15px] font-bold text-[#004e4c]">Título</div>
  …
</div>

{/* Botão primário */}
<button className="h-[34px] px-3.5 rounded-[6px] bg-[#00995d] hover:bg-[#00824f] text-[#eef7f4] text-[12.5px] font-bold flex items-center gap-2 transition-all cursor-pointer shadow-2xs active:scale-95">

{/* Botão secundário */}
<button className="h-[34px] px-3.5 rounded-[6px] bg-white hover:bg-[#f0f4f8] text-[#004e4c] border border-[#cfd6e0] hover:border-[#004e4c] text-[12.5px] font-bold …">

{/* Sub-abas dentro de card (borda laranja na ativa) */}
<button className={`h-[42px] px-4.5 text-[13px] font-semibold border-b-2 ${ativa
  ? 'bg-white text-[#004e4c] border-[#f47920]'
  : 'bg-[#f6f8fa] text-[#6b7684] border-transparent hover:text-[#004e4c]'}`}>

{/* Alternador em pílula (ex.: Adesão | Esforço extra) */}
<button className={`h-[30px] px-3.5 text-[12.5px] font-semibold rounded-[4px] border ${ativo
  ? 'bg-[#004e4c] text-[#eef7f4] border-[#004e4c]'
  : 'bg-white text-[#4a5462] border-[#dfe4ea] hover:border-[#004e4c]'}`}>

{/* Cabeçalho de tabela */}
<div className="text-[11px] uppercase tracking-wider text-[#6b7684] font-bold">

{/* Badge de status */}
<span className="inline-block px-2 py-0.5 rounded-[3px] text-[11px] font-bold tracking-wide text-[#0f6b3f] bg-[#e6f4ec]">REALIZADO</span>
```

Modais seguem `AddChartModal.tsx`: backdrop `fixed inset-0 z-50 bg-black/50`, caixa `bg-white rounded-2xl shadow-2xl max-w-[460px] max-h-[85vh]`, rodapé com botões `rounded-full h-11`.

## 6. Ícones

- **Padrão:** fonte `lector-icons` → `<i className="icon-performance text-[14px]" />`. Classes disponíveis em `public/lector-icons.css`. As mais usadas: `icon-performance`, `icon-plus`, `icon-close-mini`, `icon-calendar`, `icon-pointer-{up,down,left,right}`, `icon-courses`, `icon-participants`, `icon-medal`, `icon-manage`, `icon-certificate`, `icon-excel`, `icon-pdf`, `icon-printer`.
- **lucide-react** só em `FilterBar`, `DateFilterPicker` e `ViewHeader`. Não espalhe.

## 7. Acessibilidade (mínimo para novas telas)

- Laranja `#f47920` sobre branco tem contraste de **2,8:1**. Use como borda, ícone ou fundo, **nunca para texto pequeno**. Hoje isso é violado no breadcrumb e no botão "Tipo de gráfico".
- `#8a93a0` sobre branco = 3,1:1, abaixo do AA para texto normal. Para texto de apoio legível, use `#6b7684` (4,6:1).
- Botões só com ícone precisam de `title` **e** `aria-label`.
- Status nunca só por cor: sempre com texto (o padrão atual já faz isso).

## 8. Proposta: tokens Tailwind v4 (não aplicada)

Para trocar hex espalhados por nomes, adicionar ao `src/index.css` e migrar aos poucos (débito T-06):

```css
@theme {
  --color-unimed: #00995d;
  --color-unimed-hover: #00824f;
  --color-citrico: #b1d34b;
  --color-escuro: #004e4c;
  --color-escuro-hover: #00706c;
  --color-laranja: #f47920;
  --color-shell: #013330;
  --color-texto: #1f2733;
  --color-texto-2: #6b7684;
  --color-texto-3: #4a5462;
  --color-borda: #e4e8ee;
  --color-borda-input: #cfd6e0;
  --color-fundo: #f4f6f9;
  --color-ok: #0f6b3f;   --color-ok-bg: #e6f4ec;
  --color-warn: #8a5a00; --color-warn-bg: #fdf3e0;
  --color-bad: #a32020;  --color-bad-bg: #fbeaea;
}
```

Isso gera classes como `bg-unimed`, `text-escuro` e `border-borda`.
