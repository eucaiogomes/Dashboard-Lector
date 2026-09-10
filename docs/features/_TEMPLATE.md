# NNN — <Título curto da feature>

| Campo | Valor |
|---|---|
| **Status** | Rascunho · Aprovada · Em implementação · Concluída · Descartada |
| **Autor / data** | <nome> · AAAA-MM-DD |
| **Specs afetadas** | `docs/specs/0X-….md` |
| **Tamanho estimado** | P (1–2 arquivos) · M (3–6) · G (7+, dividir se possível) |

## 1. Problema

<O que está errado ou faltando hoje, e para quem. Cite o arquivo ou a regra atual (RN-xx), se houver.>

## 2. Resultado esperado

<Uma frase: "Depois disso, o usuário consegue …".>

## 3. Histórias de usuário

- Como **<papel>**, quero **<ação>** para **<benefício>**.

## 4. Regras de negócio

| ID | Regra |
|---|---|
| RN-01 | |

## 5. Comportamento de UI

<Descreva ou esboce em ASCII. Cubra os estados:>

- Normal:
- Vazio / sem dados:
- Largura < 1024px:
- Impressão (se aplicável):

## 6. Dados

- Origem (`mockData`, `getSimulatedData`, novo arquivo em `src/data/`…):
- Tipos novos ou alterados:
- Fórmulas novas ou alteradas (→ atualizar `02-dominio-indicadores.md`):
- Persistência (chave de localStorage? subir versão?):

## 7. Arquivos a tocar (previsão)

| Arquivo | Mudança |
|---|---|
| `src/…` | |

## 8. Fora de escopo

-

## 9. Critérios de aceite

- [ ] `npm run lint` e `npm run build` passam
- [ ] <verificável clicando: "Ao selecionar X, o widget Y mostra Z">
- [ ] Specs em `docs/specs/` atualizadas

## 10. Plano de verificação

1. `npm run dev` e abrir http://localhost:3000
2. <passo a passo manual>

## 11. Questões em aberto

- [ ] <pergunta> — *recomendação:* <o que a IA sugere>

## 12. Registro de implementação

*Preenchido ao concluir: o que foi feito, desvios da spec e por quê, commits.*
