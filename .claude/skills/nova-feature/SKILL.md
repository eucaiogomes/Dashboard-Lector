---
name: nova-feature
description: Cria a spec de uma nova feature em docs/features/ a partir do template, lendo as specs e o código do projeto e fazendo poucas perguntas objetivas. Use quando o usuário quiser planejar, especificar ou "escrever a spec" de uma feature, tela, widget, correção grande ou refatoração ANTES de codar.
---

# Nova feature (spec-driven)

Objetivo: produzir `docs/features/NNN-slug.md` pronta para o humano aprovar. **Não escreva código de produção nesta skill.**

## Passos

1. **Contexto.** Leia `docs/features/_TEMPLATE.md` e as specs de `docs/specs/` ligadas ao pedido (use o índice em `docs/README.md`). Consulte `07-backlog-e-debito-tecnico.md` para ver se o item já está listado; se estiver, cite o ID (ex.: T-02, R-03).
2. **Número.** O próximo `NNN` é o maior número em `docs/features/` + 1, com 3 dígitos. O slug fica em kebab-case, em português, sem acento.
3. **Explorar o código.** Localize os arquivos que vão mudar e confirme nomes reais de componentes, ids do catálogo e funções. A tabela "Arquivos a tocar" só leva caminhos que existem (ou que serão criados, marcados como novos).
4. **Perguntar pouco.** Se faltar algo que **muda a spec** (regra de negócio, escopo), faça no máximo 3 perguntas objetivas, com opções e uma recomendada. O que der para decidir com bom senso vai para "Questões em aberto" com a sua recomendação.
5. **Escrever a spec** seguindo o template:
   - Regras numeradas (RN-01…), cada uma testável.
   - Critérios de aceite **verificáveis clicando** no app, sempre incluindo lint e build e a atualização das specs.
   - "Fora de escopo" explícito, para evitar que a implementação cresça.
   - Se passar de ~7 arquivos, proponha dividir (001a/001b).
   - Status: `Rascunho`.
6. **Encerrar** com um resumo de 3 a 5 linhas, a lista das questões em aberto e o próximo passo: "revise, responda as questões, mude o Status para Aprovada e rode `/implementar-feature NNN`".
