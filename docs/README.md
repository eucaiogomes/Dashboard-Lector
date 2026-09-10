# Documentação — Lector Live · Indicadores T&D

## Organização

| Onde | O que tem | Quando atualizar |
|---|---|---|
| `CLAUDE.md` (raiz) | Resumo que a IA carrega automaticamente em toda sessão: comandos, mapa, convenções, armadilhas | Quando mudar comando, convenção ou surgir armadilha nova |
| `docs/specs/` | Specs **vivas** do sistema como ele é hoje | Toda mudança de comportamento atualiza a spec correspondente no mesmo commit |
| `docs/features/` | Uma spec por mudança planejada (`NNN-slug.md`), com status | Criada antes de codar e fechada ao terminar |
| `.claude/skills/` | Fluxos repetíveis para a IA | Quando um fluxo se repetir 3 ou mais vezes |
| `.claude/settings.json` | Permissões compartilhadas (lint/build sem pedir confirmação) | Raramente |

### Specs vivas

| Arquivo | Conteúdo |
|---|---|
| [00-visao-produto.md](specs/00-visao-produto.md) | O quê, para quem, mapa de telas, escopo, questões em aberto |
| [01-arquitetura.md](specs/01-arquitetura.md) | Stack, componentes, fluxo de dados, estado, persistência, decisões |
| [02-dominio-indicadores.md](specs/02-dominio-indicadores.md) | Glossário, fórmulas, filtros, modelo de dados |
| [03-design-system.md](specs/03-design-system.md) | Marca Unimed, tokens, tipografia, padrões de componente, acessibilidade |
| [04-dashboard.md](specs/04-dashboard.md) | Painéis, grid, catálogo, widgets (regras RN-D-xx) |
| [05-telas-indicadores.md](specs/05-telas-indicadores.md) | Institucionais, Internos, Centro de Custo (RN-I-xx) |
| [06-relatorios-exportacao.md](specs/06-relatorios-exportacao.md) | Ver Detalhes, Excel, CSV, PDF/impressão (RN-R-xx) |
| [07-backlog-e-debito-tecnico.md](specs/07-backlog-e-debito-tecnico.md) | Roadmap do catálogo e débito técnico priorizado |

## Fluxo de trabalho com IA (spec-driven)

```
 ideia ──► /nova-feature ──► docs/features/NNN-*.md (Rascunho)
                                   │  você revisa e responde as questões
                                   ▼
                              Status: Aprovada
                                   │
             /implementar-feature NNN
                                   ▼
        código + lint + build + verificação no navegador
        + critérios de aceite marcados + docs/specs atualizadas
                                   │
                  /code-review ──► commit
```

1. **Especificar:** rode `/nova-feature <descrição curta>`. A IA lê as specs e o código, faz até 3 perguntas e grava `docs/features/NNN-slug.md`. Nenhum código é escrito nessa etapa.
2. **Aprovar:** leia a spec, ajuste o que quiser, responda as questões em aberto e mude o status para `Aprovada`. **Essa é a etapa que mais economiza retrabalho.**
3. **Implementar:** rode `/implementar-feature NNN`. A IA implementa, roda `lint` e `build`, confere no navegador, marca os critérios de aceite, preenche o registro de implementação e atualiza `docs/specs/`.
4. **Revisar e commitar:** rode `/code-review` no diff e depois faça o commit (Conventional Commits em pt-BR).

Tarefas pequenas (um arquivo, uma correção óbvia) podem ir direto, sem spec. Basta pedir.

Para widget novo no Dashboard, use `/novo-widget`: ele cobre os 4 pontos de registro que costumam ser esquecidos.

## Boas práticas

- **Uma feature por sessão**, com `/clear` entre elas. O contexto fica na spec, não no histórico do chat.
- **Seja específico:** cite o arquivo, o id do widget (`inst_agenda`) ou a regra (`RN-D-07`). Os IDs de regra existem para isso.
- **Peça plano antes** (modo plan, `Shift+Tab`) para mudanças em mais de 2 arquivos.
- **Erro recorrente da IA:** registre em "Armadilhas" no `CLAUDE.md`. Uma linha ali evita o mesmo erro em todas as sessões futuras.
- **Fórmula mudou?** Atualize `02-dominio-indicadores.md` no mesmo commit.
- **Specs curtas e verificáveis** valem mais que specs longas: o critério de aceite tem de ser algo que dá para conferir clicando.
