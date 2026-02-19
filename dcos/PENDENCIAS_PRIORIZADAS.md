# Pendencias Priorizadas

Data da consolidacao: 2026-02-19 (revisto apos fecho de P1.3 frontend).

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
- backend P1.2 consumido por contratos reais:
  - preferencias de notificacao por utilizador.
  - subscriptions por criador (listar/check/subscribe/unsubscribe).
- frontend P1.2 integrado (2026-02-19):
  - pagina `/notificacoes` ligada ao modulo social real (removido placeholder da feature `user`).
  - preferencias com toggles (`likes`, `comments`, `follows`, `newContent`, `mentions`, `system`).
  - subscriptions por criador com toggle por item e estado pendente por mutation.
  - novos hooks de dados:
    - `useNotificationPreferences`
    - `useUpdateNotificationPreferences`
    - `useCreatorSubscriptions`
    - `useCreatorSubscriptionStatus`
    - `useUpdateCreatorSubscription`
  - servico social expandido com mapeadores tipados backend/frontend para preferencias e subscriptions.
  - testes unitarios dedicados:
    - `src/__tests__/features/social/socialService.notifications.test.ts`
- validacao integrada frontend (2026-02-19):
  - `npm run test -- --runInBand` -> PASS (11 suites, 108 testes).
  - `npm run typecheck:p1` -> PASS.
  - `npm run build` -> PASS.
  - `npm run test:e2e` -> PASS (3 cenarios smoke).
- estado do item: FECHADO (escopo frontend).

3. Homepage completa (paridade + UX).
- frontend P1.3 integrado (2026-02-19):
  - homepage com secoes principais ligadas a dados reais (`articles`, `courses`, `books`).
  - bloco dedicado de criadores mantido com deduplicacao por username e score de relevancia.
  - novo bloco dedicado de recursos com dados reais de brands (`GET /api/brands` com fallback `GET /api/brands/featured`).
  - novo card reutilizavel `ResourceCard` adicionado em `src/components/home/cards`.
  - CTA de recursos da hero e footer alinhados para rota valida (`/mercados/recursos`).
  - fluxo de auth na homepage alinhado ao backend real:
    - removido mock login (`setUser(..., 'mock-token', ...)`).
    - `LoginDialog` passa a usar `useAuthStore.login`.
    - `RegisterDialog` passa a recolher username e usar `useAuthStore.register`.
- validacao integrada frontend (2026-02-19):
  - `npm run test -- --runInBand` -> PASS (11 suites, 108 testes).
  - `npm run typecheck:p1` -> PASS.
  - `npm run build` -> PASS.
  - `npm run test:e2e` -> PASS (3 cenarios smoke).
- estado do item: FECHADO.

## Prioridade 2 - Critico (Admin-first MVP)
0. P2.0 Fundacao de seguranca e governanca (bloqueante).
- RBAC granular (`admin.super`, `admin.ops`, `admin.support`) no backend e frontend.
- Audit log imutavel para todas as acoes admin (quem, quando, alvo, antes/depois, motivo).
- Controlo de risco: rate limit admin, confirmacao forte para acoes criticas e motivo obrigatorio.
- Gate de aceite: nenhuma acao critica executa sem permissao explicita e sem rasto de auditoria.

1. P2.1 Gestao de utilizadores.
- Listar/pesquisar users com filtros por role, estado e atividade.
- Suspender, banir, desbanir e forcar logout global.
- Historico de sancoes e anotacoes internas por utilizador.
- Gate de aceite: ciclo completo "encontrar user -> agir -> auditar" funcional.

2. P2.2 Moderacao de conteudo.
- Fila de moderacao unificada (artigos, cursos, videos, lives, podcasts, books, comentarios/reviews).
- Acoes de ocultar/desocultar/restringir com motivo padronizado.
- Estados de moderacao (`pending`, `approved`, `rejected`, `hidden`) com historico.
- Gate de aceite: conteudo problematico pode ser removido da visibilidade em minutos, com rasto completo.

3. P2.3 Acesso assistido a conta com consentimento explicito.
- Sessao delegada temporaria (nao "impersonation" livre) com escopo minimo.
- Consentimento explicito do user, expiracao curta, revogacao imediata e notificacao ao utilizador.
- Banner permanente durante sessao assistida e log detalhado de todas as acoes.
- Gate de aceite: sem consentimento valido nao existe acesso assistido.

4. P2.4 Metricas e observabilidade admin.
- Dashboard de utilizacao (DAU/WAU/MAU, engagement, retencao, funnel, conteudo e social).
- KPIs de moderacao (tempo medio de resolucao, volume por tipo, reincidencia).
- KPIs operacionais (erros, latencia, disponibilidade dos servicos principais).
- Gate de aceite: equipa responde perguntas de negocio e operacao sem consulta manual a BD.

5. P2.5 Painel admin unificado (UI final do MVP Admin).
- Integrar users, moderacao, suporte assistido e metricas num painel unico.
- Navegacao por permissoes (mostrar/esconder modulos conforme role admin).
- Guardrails de UX para acoes destrutivas (confirmacao dupla, resumo do impacto).
- Gate de aceite: admin consegue operar o fluxo diario completo num unico painel.

6. P2.6 Hardening operacional admin.
- Suite E2E admin (positivo/negativo) para permissao, moderacao, sancao e sessao assistida.
- Alertas internos para acoes criticas (ban, hide massivo, delegated access).
- Runbook de incidentes admin + documentacao operacional.
- Gate de aceite: CI cobre os fluxos criticos admin e runbook esta validado.

## Itens extra incorporados no MVP Admin
1. Tickets internos de suporte/moderacao com ligacao a user e conteudo.
2. Feature flags para rollout seguro de funcionalidades admin.
3. Regras de compliance e retencao para logs/auditoria/consentimentos.
4. Notificacoes internas para eventos criticos de risco operacional.
5. Modo `read-only` para perfis admin junior (sem acoes destrutivas).
6. Bulk actions protegidas (limites por operacao, confirmacao dupla, auditoria reforcada).

## Prioridade 3 - Medio (apos MVP Admin)
1. Livros completos (replies, filtros, destaques, categorias) no frontend ativo.
2. Ferramentas financeiras legadas expostas no router principal (fundo emergencia, juros compostos, ETF analyzer, REIT valuation, debt snowball).
3. Blocos e paginas completas de brokers/websites.
4. Eventos end-to-end (criacao, aprovacao, status e tracking).
5. Glossario financeiro.
6. Paginas dinamicas por topico.
7. Regular user dashboard e about completo.

## Pendencias tecnicas observadas em checklists
1. Sem bloqueadores tecnicos pre-P1 ativos neste momento.
2. Validacao operacional final de `npm run start` deve ser repetida no ambiente alvo com Mongo disponivel (o comando e long-running).
3. Qualidade opcional recomendada:
- expandir E2E (Playwright) para cobertura full business flows (alem do smoke atual).
- Storybook.
- performance monitoring.
- error tracking.
4. Build frontend fechado para os gates de P1.1/P1.2/P1.3:
- `npm run build` verde com `typecheck:p1` + `vite build`.
5. Gate E2E smoke frontend fechado:
- `npm run test:e2e` verde (3 cenarios: SSR, navegacao publica e fallback de noticias).
6. Divida tecnica fora do escopo imediato de P1.1:
- limpeza de tipagem global em modulos legados (`creators/tools/mock`) para eventualmente reintroduzir gate full `tsc -b` sem escopo.

## Sequencia pragmatica sugerida
1. Iniciar P2.0 (fundacao de seguranca e governanca) como bloqueante.
2. Fechar P2.1 e P2.2 (users + moderacao), depois P2.3 (acesso assistido com consentimento).
3. Fechar P2.4 e P2.5 (metricas + painel unificado), seguido de P2.6 (hardening).
4. So depois entrar em Prioridade 3 (livros, ferramentas, brokers/websites e restantes frentes).
