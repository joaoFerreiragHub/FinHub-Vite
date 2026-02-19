# Estado Implementado

Data de referencia: 2026-02-19 (atualizado apos fecho de P1.2 frontend).

## 1) Foundation e arquitetura
- Estrutura feature-based e separacao por modulos.
- Sistema de autenticacao com guards/roles.
- API client com fluxos de token.

## 2) Conteudos HUB e social
- Tipos de conteudo implementados: articles, courses, videos, lives, podcasts, books e news.
- Modulos sociais ativos: follow, favorites, notifications, ratings, comments, notification preferences e creator subscriptions.

## 3) Validacao real da API
- API confirmada ativa em `http://localhost:5000/api`.
- Endpoints principais validados anteriormente com respostas reais (`200`/`401` conforme autenticacao).
- Contradicao documental resolvida: API existe e esta operacional.

## 4) P0.1 concluido - contratos social frontend x backend
- Follow alinhado (`POST/DELETE /follow/:userId`, `GET /follow/check/:userId`, listas).
- Favorites alinhado (`POST/DELETE /favorites`, `GET /favorites/check`, `GET /favorites/stats`).
- Notifications alinhado (`PATCH /notifications/read-all`, `DELETE /notifications/read`, listas/count/stats).

## 5) P0.2 concluido - limpeza de endpoints legados
- Fluxos legados removidos/substituidos no frontend.
- Comentarios de livros migrados para API universal de comments/replies.
- Uploads servidos via backend (`/uploads`).

## 6) P0.3 concluido - homepage sem mocks
- Homepage ligada a dados reais (`articles`, `courses`, `books`).
- Blocos mantidos com loading/empty states.

## 7) P0.4 concluido - arranque standard
- Script de runtime ajustado para artefacto compilado:
  - `package.json` -> `"start": "node dist/server.js"`.
- Script de verificacao estrita adicionado:
  - `"typecheck": "npx tsc --noEmit --pretty false"`.
- `npm run typecheck` e `npm run build` validados sem erros.

## 8) Hardening tecnico pre-P1 (7 pontos) - concluido
1. Contrato formal OpenAPI.
- Novo ficheiro: `API_finhub/openapi/openapi.json`.
- Servido pela app em `/openapi`.
- Validacao automatica: `npm run contract:openapi`.

2. Pipeline de eventos social integrado.
- Eventos emitidos em:
  - follow (`social.follow.created`).
  - favorites, ratings, comments/replies/likes (`social.content.interaction`).
  - publicacao de artigo/livro/curso/live/podcast/video (`social.content.published`).
- Handlers registados no arranque para notificacoes e sinais de preferencia.

3. Idempotencia e consistencia social.
- Follow e favorites com create/remove idempotente.
- Contadores protegidos contra valores negativos no decremento.
- Controllers ajustados para responder `201` apenas quando cria e `200` quando estado ja existia.

4. Observabilidade e operacao.
- Request context com `x-request-id`.
- Logging estruturado por request.
- Endpoints operacionais:
  - `GET /healthz`
  - `GET /readyz`
  - `GET /metrics`
  - `GET /metrics.json`

5. CI minimo no repositorio.
- Novo workflow: `API_finhub/.github/workflows/ci.yml`.
- Gates: `npm ci`, `npm run typecheck`, `npm run build`, `npm run contract:openapi`.

6. Tipagem reforcada.
- Remocao de `this: any` das hooks de modelos:
  - `Article`, `Book`, `Course`, `LiveEvent`, `Podcast`, `Video`.
- `comment.service.ts` refatorado com tipos explicitos para arvore de replies e target models.

7. Alinhamento de contratos de runtime.
- `liveevent.service` ajustado para `contentType: 'live'` (consistente com modelo e metadata resolver).

## 9) Resultado pre-P1
- Base tecnica consistente e escalavel para evoluir P1.
- Sem bloqueador tecnico aberto em P0/hardening neste momento.

## 10) Suite automatizada de validacao pre-P1
- Script completo criado em `API_finhub/scripts/pre-p1-smoke.ps1`.
- Comando de execucao adicionado:
  - `npm run test:pre-p1`.
- Cobertura da suite:
  - health/readiness/metrics/openapi.
  - auth e guards de role.
  - follow/favorites idempotentes.
  - ratings/comments/replies/likes com efeitos em notificacoes.
  - ciclo de notificacoes (`read`, `read-all`, `delete`, `delete read`).
  - evento `content_published` para seguidores.
  - confirmacao de rota legada removida (`/api/users/:id/visibility` -> `404`).

## 11) Validacao final pre-P1 (2026-02-18) - PASS
- Suite de 12 passos executada no ambiente alvo com sucesso (`PRE-P1 PASS`).
- Correcoes aplicadas durante a execucao da suite:
  1. Compatibilidade PowerShell 5.1 no parser JSON (remocao de `-Depth` em `ConvertFrom-Json` no script).
  2. Envio de body JSON robusto no `curl` do PowerShell (uso de ficheiro temporario para `-d @file`).
  3. Geracao de `slug` antecipada em `pre('validate')` nos 6 modelos de conteudo para cumprir `required`.
  4. Ordem de rotas em notifications ajustada para priorizar rotas estaticas antes de `/:id`.
- Conclusao operacional: projeto validado para avancar para P1.

## 12) P1.1 Ratings/Reviews - backend (2026-02-18)
- Reactions em reviews implementadas (like/dislike/remove) com idempotencia por utilizador.
- Novos endpoints de ratings:
  - `POST /api/ratings/:id/reaction`
  - `GET /api/ratings/:id/reaction/my`
- Listagem de ratings com ordenacao `helpful`:
  - `GET /api/ratings/:targetType/:targetId?sort=helpful`
- Stats de ratings enriquecidos com feedback de reviews:
  - total de reviews com texto
  - total de likes/dislikes em reviews
- Pipeline social ligado ao feedback de reviews:
  - reaction em review publica evento social e pode gerar notificacao ao autor da review.
- Resolver de metadata social atualizado para target `rating`.
- Contrato OpenAPI e validador atualizados para os novos contratos de ratings/reviews.
- Gates tecnicos apos implementacao:
  - `npm run typecheck` -> OK
  - `npm run build` -> OK
  - `npm run contract:openapi` -> OK

## 13) P1.1 Ratings/Reviews - frontend (2026-02-18)
- Integracao real de ratings/reviews no frontend concluida:
  - novo service universal `src/features/hub/services/ratingService.ts`.
  - suporte completo a contratos reais de ratings:
    - `POST /api/ratings`
    - `GET /api/ratings/my/:targetType/:targetId`
    - `GET /api/ratings/:targetType/:targetId?sort=...`
    - `GET /api/ratings/:targetType/:targetId/stats`
    - `POST /api/ratings/:id/reaction`
    - `GET /api/ratings/:id/reaction/my`
- Novo componente reutilizavel `RatingsSection`:
  - ligado nas paginas detalhe de `article`, `book`, `course`, `video`, `live`, `podcast`.
  - remove placeholders de submit de rating (`console.log`) nessas paginas.
  - usa dados reais para media/distribuicao/listagem/reactions.
- Evolucao do sistema UI de reviews:
  - `RatingCard` com like/dislike por review (inclui estado atual do utilizador e toggle para `none`).
  - `RatingList` com suporte a props dinamicas por review (necessario para reactions por item).
  - `RatingForm` com re-hidratacao de estado inicial para editar rating existente.
- Tipagem de ratings atualizada para contratos reais:
  - `RatingTargetType`, `RatingReaction`, `ReviewReactionInput`, `RatingReactionResult`.
  - campos de engagement de review (`likes`, `dislikes`, `myReaction`) e compatibilidade com `helpfulCount`.
- Validacao automatizada no frontend:
  - `npm run test -- --runInBand` -> OK (10 suites, 104 testes).
  - novo teste `src/__tests__/features/hub/ratingService.test.ts` -> OK.
- Gate tecnico frontend atualizado e fechado:
  - removido artefacto invalido `src/pages/home/+config.d.ts` (stale de compilacao) que quebrava build SSR.
  - adicionadas declarations de ambiente Vite (`src/vite-env.d.ts`) para `ImportMeta.env` e imports CSS.
  - alinhamentos de tipagem no escopo HUB/social (ratings targetType, status enums e adapters).
  - novo gate dedicado P1 adicionado:
    - `package.json` -> `typecheck:p1` com `tsconfig.p1.json`.
    - `package.json` -> `build` atualizado para `npm run typecheck:p1 && vite build`.

## 14) Fecho global P1.1 (2026-02-18) - PASS
- Backend validado no ambiente alvo:
  - `API_finhub` -> `npm run test:pre-p1` -> PASS (12 passos).
  - smoke especifico P1.1 ratings/reviews -> PASS:
    - `POST /api/ratings/:id/reaction` (like/dislike/none + idempotencia)
    - `GET /api/ratings/:id/reaction/my`
    - `GET /api/ratings/:targetType/:targetId?sort=helpful`
    - `GET /api/ratings/:targetType/:targetId/stats` (`reviews.withText/totalLikes/totalDislikes`)
- Frontend validado no ambiente alvo:
  - `FinHub-Vite` -> `npm run test -- --runInBand` -> PASS (10 suites, 104 testes).
  - `FinHub-Vite` -> `npm run typecheck:p1` -> PASS.
  - `FinHub-Vite` -> `npm run build` -> PASS.
- Conclusao operacional:
  - P1.1 fechado no plano (backend + frontend + validacao integrada).
  - existem apenas avisos nao-bloqueantes de build (warnings de deprecacao de plugin e chaves duplicadas em mocks legados).
  - revalidacao adicional executada no mesmo dia com nova rodada dos gates (mantido PASS).

## 15) E2E Playwright smoke - frontend (2026-02-18) - PASS
- Infra de E2E adicionada no frontend:
  - `playwright.config.ts`
  - `e2e/smoke.spec.ts`
  - scripts em `package.json`:
    - `test:e2e`
    - `test:e2e:headed`
    - `test:e2e:install`
- Cobertura smoke implementada:
  - SSR server-rendered em rotas publicas (`/` e `/noticias`) com HTML nao-vazio.
  - navegacao publica principal (`/` -> `/creators`).
  - resiliencia da pagina de noticias quando a API falha.
- Validacao executada:
  - `npm run test:e2e:install` -> PASS (Chromium instalado).
  - `npm run test:e2e` -> PASS (3/3 testes).
  - `npm run build` -> PASS apos validacao E2E.

## 16) P1.2 Notificacoes/Subscriptions - frontend (2026-02-19) - PASS
- Integracao completa dos contratos de notificacoes de P1.2 no frontend:
  - preferencias de notificacao por utilizador (get/update).
  - subscriptions por criador (list/check/subscribe/unsubscribe).
- Pagina de notificacoes em producao:
  - `src/features/user/pages/NotificationsPage.tsx` deixa de usar placeholder e passa a renderizar `src/features/social/pages/NotificationsPage.tsx`.
  - card de preferencias com toggles reais (`likes`, `comments`, `follows`, `newContent`, `mentions`, `system`).
  - card de subscriptions por criador com toggle por item e estado pendente durante mutation.
- Camada de dominio social expandida para manter escalabilidade:
  - novos tipos em `src/features/social/types/index.ts`:
    - `NotificationPreferences`
    - `NotificationPreferencesPatchInput`
    - `CreatorSubscription`
    - `CreatorSubscriptionListResponse`
  - novos metodos em `src/features/social/services/socialService.ts`:
    - `getNotificationPreferences`
    - `updateNotificationPreferences`
    - `getCreatorSubscriptions`
    - `getCreatorSubscriptionStatus`
    - `subscribeToCreator`
    - `unsubscribeFromCreator`
  - novos hooks em `src/features/social/hooks/useSocial.ts`:
    - `useNotificationPreferences`
    - `useUpdateNotificationPreferences`
    - `useCreatorSubscriptions`
    - `useCreatorSubscriptionStatus`
    - `useUpdateCreatorSubscription`
- Validacao automatizada apos integracao:
  - `npm run test -- --runInBand` -> PASS (11 suites, 108 testes).
  - `npm run typecheck:p1` -> PASS.
  - `npm run build` -> PASS.
  - `npm run test:e2e` -> PASS (3/3 smoke, incluindo SSR).
- Nota de qualidade:
  - warnings de build existentes (deprecacoes Vite/Vike e chaves duplicadas em mocks) mantem-se nao-bloqueantes.
