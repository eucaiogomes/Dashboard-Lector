---
name: implementar-feature
description: Implementa uma spec de docs/features/ (por número ou caminho), verifica com lint, build e navegador, marca os critérios de aceite e atualiza as specs vivas em docs/specs/. Use quando o usuário pedir para implementar, executar ou "fazer" uma spec/feature numerada (ex.: "implementa a 001").
---

# Implementar feature

## Passos

1. **Localizar.** Encontre `docs/features/<NNN>-*.md`. Se o status não for `Aprovada`, mostre as questões em aberto e confirme com o usuário antes de seguir.
2. **Carregar contexto.** Leia a spec inteira, o `CLAUDE.md` (principalmente "Armadilhas") e as specs de `docs/specs/` citadas em "Specs afetadas".
3. **Planejar.** Liste os passos (arquivos na ordem). Se o plano divergir da spec (arquivo a mais, regra impossível), **pare e avise** em vez de improvisar.
4. **Marcar** `Status: Em implementação` na spec.
5. **Implementar** em passos pequenos, seguindo o código ao redor:
   - Só cores e tamanhos de `03-design-system.md`.
   - Widget novo: siga a skill `/novo-widget`.
   - Mudança no formato do localStorage: suba a versão da chave.
   - Não mexa no que está em "Fora de escopo".
6. **Verificar** (obrigatório):
   - `npm run lint` e `npm run build` sem erros.
   - Suba o app (`npm run dev`, porta 3000) e execute o "Plano de verificação" no navegador. Use a skill `run` ou o Chrome, se disponível.
   - Se a área é imprimível, confira a pré-visualização de impressão.
   - Rode o checklist de regressão de `04-dashboard.md` §8 se tocou no `DashboardView`.
7. **Fechar a spec.**
   - Marque `[x]` **apenas** nos critérios realmente verificados. O que não deu para verificar fica desmarcado, com o motivo.
   - Preencha "Registro de implementação": o que mudou, desvios e o motivo de cada um.
   - Atualize as specs vivas afetadas (tabela de widgets, regras RN, fórmulas, decisões) e remova de `07-backlog-e-debito-tecnico.md` o que foi resolvido.
   - Status: `Concluída`.
8. **Commit.** Proponha a mensagem (Conventional Commits em pt-BR, ex.: `feat: período global no Dashboard (spec 001)`). **Só faça o commit se o usuário pedir.**
