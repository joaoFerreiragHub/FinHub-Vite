# Pendencias Priorizadas

Data da consolidacao: 2026-02-18 (revisto apos fecho dos 7 pontos tecnicos pre-P1).

## Prioridade 0 - Fechada (2026-02-18)
1. P0.1 contratos social frontend x backend fechados.
2. P0.2 limpeza de endpoints legados fechada.
3. P0.3 homepage e blocos principais sem mocks.
4. P0.4 arranque standard corrigido e buildavel.
5. Hardening tecnico pre-P1 (7/7) fechado:
- start em runtime compilado (`node dist/server.js`) + `typecheck`.
- contrato formal OpenAPI em `openapi/openapi.json` + validacao automatica.
- pipeline de eventos social ligado em follow/favorites/ratings/comments/publicacao.
- idempotencia em follow/favorites com contadores protegidos.
- observabilidade com `request-id`, logs estruturados e endpoints `healthz/readyz/metrics`.
- CI inicial em `.github/workflows/ci.yml`.
- limpeza de tipagem nas hooks de modelos de conteudo e no `comment.service`.

## Prioridade 1 - Critico (paridade de negocio)
1. Sistema de ratings/reviews completo.
- backend P1.1 entregue (2026-02-18):
  - reviews com likes/dislikes idempotentes por review.
  - ordenacao `helpful` em listagem de ratings.
  - stats enriquecidos de reviews (com texto, likes/dislikes agregados).
  - eventos/notificacoes para feedback em reviews (reaction em review).
  - contrato OpenAPI atualizado para reactions em reviews.
- frontend P1.1 integrado (2026-02-18):
  - `RatingsSection` reutilizavel ligado nas paginas detalhe (article/book/course/video/live/podcast).
  - submissao real de rating/review (`POST /api/ratings`) sem placeholders `console.log`.
  - listagem real de reviews com ordenacao (`recent/helpful/rating`).
  - reactions em review (like/dislike/remove) ligadas aos endpoints reais.
  - stats reais de reviews (media, distribuicao e feedback agregado likes/dislikes).
  - testes unitarios do `ratingService` adicionados e suite frontend verde.
- validacao integrada executada (2026-02-18):
  - backend `test:pre-p1` -> PASS.
  - smoke P1.1 ratings/reviews (reactions/helpful/stats) -> PASS.
  - frontend `test -- --runInBand` -> PASS.
  - frontend `typecheck:p1` + `build` -> PASS.
  - revalidacao no mesmo dia repetida com os mesmos comandos -> PASS.
  - frontend `test:e2e` (Playwright smoke) -> PASS.
- estado do item: FECHADO.

2. Sistema de notificacoes completo.
- notificacoes in-app.
- preferencias.
- marcar como lida.
- eventos por acao.
- subscriptions por criador.

3. Homepage completa (paridade + UX).
- secoes principais com dados reais.
- cards reutilizaveis.
- blocos de criadores e recursos dedicados.

## Prioridade 2 - Importante
1. Livros completos (replies, filtros, destaques, categorias).
2. Ferramentas financeiras legadas (fundo emergencia, juros compostos, ETF analyzer, REIT valuation, debt snowball).
3. Blocos de brokers/websites.
4. Admin dashboard completo.

## Prioridade 3 - Medio
1. Eventos end-to-end (criacao, aprovacao, status e tracking).
2. Glossario financeiro.
3. Paginas dinamicas por topico.
4. Regular user dashboard e about completo.

## Pendencias tecnicas observadas em checklists
1. Sem bloqueadores tecnicos pre-P1 ativos neste momento.
2. Validacao operacional final de `npm run start` deve ser repetida no ambiente alvo com Mongo disponivel (o comando e long-running).
3. Qualidade opcional recomendada:
- expandir E2E (Playwright) para cobertura full business flows (alem do smoke atual).
- Storybook.
- performance monitoring.
- error tracking.
4. Build frontend fechado para o gate de P1.1:
- `npm run build` verde com `typecheck:p1` + `vite build`.
5. Gate E2E smoke frontend fechado:
- `npm run test:e2e` verde (3 cenarios: SSR, navegacao publica e fallback de noticias).
6. Divida tecnica fora do escopo imediato de P1.1:
- limpeza de tipagem global em modulos legados (`creators/tools/mock`) para eventualmente reintroduzir gate full `tsc -b` sem escopo.

## Sequencia pragmatica sugerida
1. Entrar em Prioridade 1 (ratings/reviews, notificacoes e homepage full).
2. Avancar para Prioridade 2 (livros, ferramentas, brokers/websites, admin).
3. Fechar Prioridade 3 e polimento final.
