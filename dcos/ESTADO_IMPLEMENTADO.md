# Estado Implementado

Data de referencia: 2026-03-01 (atualizado apos consolidacao do P4 Editorial CMS e Moderation Control Plane).

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

## 17) P1.3 Homepage completa (paridade + UX) - frontend (2026-02-19) - PASS
- Homepage consolidada com paridade funcional e sem dependencias mock para os fluxos principais:
  - secoes de conteudo real mantidas (`articles`, `courses`, `books`) com loading/empty states.
  - bloco de criadores dedicado mantido com deduplicacao por username e ordenacao por relevancia.
  - bloco de recursos dedicado adicionado com dados reais de brands:
    - fonte principal: `GET /api/brands?sort=featured&limit=12`.
    - fallback: `GET /api/brands/featured?limit=12`.
- Reutilizacao de UI para escalabilidade:
  - novo card reutilizavel `src/components/home/cards/ResourceCard.tsx`.
  - exportado em `src/components/home/cards/index.ts` e integrado em `src/pages/index.page.tsx`.
- UX/navigation alinhada:
  - links de recursos da hero e footer ajustados para rota valida `/mercados/recursos`.
- Fluxo de autenticacao na homepage alinhado ao backend real:
  - removido mock login no layout (`setUser(..., 'mock-token', 'mock-refresh')`).
  - `HomepageLayout` passa a usar `useAuthStore.login` e `useAuthStore.register`.
  - `RegisterDialog` atualizado para incluir `username`, compativel com contrato real de `POST /api/auth/register`.
- Validacao apos implementacao:
  - `npm run typecheck:p1` -> PASS.
  - `npm run test -- --runInBand` -> PASS (11 suites, 108 testes).
  - `npm run build` -> PASS.
  - `npm run test:e2e` -> PASS (3/3 smoke, incluindo SSR).

## 18) Replaneamento oficial do backlog para P2 (2026-02-19)
- Decisao de produto registada: P2 passa a ser Admin-first para garantir operacao, suporte e governanca da plataforma antes de novas frentes de conteudo.
- Estrutura oficial de P2 definida em fases:
  - P2.0 seguranca/governanca (bloqueante)
  - P2.1 gestao de utilizadores
  - P2.2 moderacao de conteudo
  - P2.3 acesso assistido com consentimento explicito
  - P2.4 metricas admin e observabilidade
  - P2.5 painel admin unificado
  - P2.6 hardening operacional admin
- Itens extra adicionados ao MVP Admin:
  - tickets internos
  - feature flags
  - compliance/retencao de auditoria
  - alertas internos de eventos criticos
  - modo read-only para admin junior
  - bulk actions protegidas
- Reclassificacao de escopo:
  - livros completos, ferramentas financeiras legadas e blocos de brokers/websites passam para Prioridade 3 (apos fecho do MVP Admin).

## 19) P2.0 arranque tecnico - backend (2026-02-19)
- Primeira entrega concreta de P2.0 (seguranca/governanca) implementada no backend:
  - escopos admin granulares introduzidos em `src/admin/permissions.ts`.
  - middleware de permissao por escopo adicionado em `src/middlewares/roleGuard.ts` (`requireAdminScope`).
  - extensoes de perfil admin no utilizador:
    - `adminScopes?: string[]`
    - `adminReadOnly: boolean`
  - auditoria administrativa estruturada:
    - modelo `src/models/AdminAuditLog.ts`
    - service `src/services/adminAudit.service.ts`
    - middleware `src/middlewares/adminAudit.ts`
    - controller/rota `GET /api/admin/audit-logs` em:
      - `src/controllers/adminAudit.controller.ts`
      - `src/routes/admin.routes.ts`
  - integracao inicial da auditoria/permissoes em rotas admin existentes:
    - `src/routes/brand.routes.ts`
    - `src/routes/upload.routes.ts`
    - `src/routes/index.ts` (montagem de `/api/admin`)
- Validacao tecnica da entrega:
  - `API_finhub` -> `npm run typecheck` -> PASS.

## 20) P2.1 gestao de utilizadores - backend (2026-02-19)
- Modulo admin users entregue no backend para sancoes, sessao e historico:
  - novo modelo de historico de moderacao: `src/models/UserModerationEvent.ts`.
  - novo service de dominio admin users: `src/services/adminUser.service.ts`.
  - novo controller admin users: `src/controllers/adminUser.controller.ts`.
  - rotas admin users integradas em `src/routes/admin.routes.ts`.
- Endpoints admin users disponiveis:
  - `GET /api/admin/users`
  - `GET /api/admin/users/:userId/history`
  - `POST /api/admin/users/:userId/notes`
  - `POST /api/admin/users/:userId/suspend`
  - `POST /api/admin/users/:userId/ban`
  - `POST /api/admin/users/:userId/unban`
  - `POST /api/admin/users/:userId/force-logout`
- Seguranca e governanca reforcadas no auth:
  - JWT com `tokenVersion` em access/refresh token (`src/utils/jwt.ts`).
  - `authenticate` e `optionalAuth` validam `tokenVersion` e `accountStatus` (`src/middlewares/auth.ts`).
  - login/refresh bloqueiam contas `suspended` e `banned`; refresh recusa tokens com versao desatualizada (`src/controllers/auth.controller.ts`).
  - modelo `User` expandido com:
    - `accountStatus`, `statusReason`, `statusChangedAt`, `statusChangedBy`
    - `tokenVersion`, `lastForcedLogoutAt`
    - `lastLoginAt`, `lastActiveAt`
- Validacao tecnica apos implementacao:
  - `API_finhub` -> `npm run test:pre-p1` -> PASS (13 passos).
  - `API_finhub` -> `npm run typecheck` -> PASS.
  - `API_finhub` -> `npm run build` -> PASS.

## 21) P2.1 gestao de utilizadores - frontend (2026-02-19)
- Pagina admin users deixou de ser placeholder e passou a fluxo operacional real:
  - ficheiro: `src/features/admin/pages/UsersManagementPage.tsx`.
  - listagem de utilizadores com filtros por pesquisa, role, accountStatus, adminReadOnly e atividade recente.
  - pagina com paginacao, resumo de estado e refresh manual.
- Integracao com contratos backend de admin users:
  - `GET /api/admin/users`
  - `GET /api/admin/users/:userId/history`
  - `POST /api/admin/users/:userId/notes`
  - `POST /api/admin/users/:userId/suspend`
  - `POST /api/admin/users/:userId/ban`
  - `POST /api/admin/users/:userId/unban`
  - `POST /api/admin/users/:userId/force-logout`
- Camada de dominio frontend adicionada para escalabilidade:
  - tipos: `src/features/admin/types/adminUsers.ts`
  - service: `src/features/admin/services/adminUsersService.ts`
  - hooks React Query: `src/features/admin/hooks/useAdminUsers.ts`
- Navegacao por role admin reativada no registry de rotas:
  - `src/routes/admin.ts` deixou de estar vazio e volta a expor o menu admin.
- Qualidade automatizada:
  - teste unitario novo: `src/__tests__/features/admin/adminUsersService.test.ts`.
  - validacao frontend apos entrega:
    - `yarn lint` -> PASS (warnings nao bloqueantes ja existentes).
    - `yarn test --runInBand` -> PASS (12 suites, 112 testes).
    - `yarn build` -> PASS.
    - `yarn test:e2e` -> PASS (3/3 smoke).

## 22) Fecho oficial de P2.1 users (2026-02-20)
- Confirmacao do commit de fecho frontend P2.1:
  - SHA curto: `99a03f9`
  - SHA completo: `99a03f985595ff0a5d320807eba982554dbdff43`
  - mensagem: `feat(p2.1): deliver admin users frontend ops and ci docs update`
- Confirmacao de GitHub Actions para esse commit:
  - check run `build` id `64226562508`
  - workflow run `22204921602`
  - estado final: `completed` com conclusao `success`
  - janela de execucao: `2026-02-19T23:44:04Z` ate `2026-02-19T23:45:53Z`

## 23) P2.2 moderacao de conteudo - backend + frontend (2026-02-20)
- Backend (`API_finhub`) entregue para moderacao administrativa de conteudo:
  - extensao do modelo base de conteudo com estados/metadados de moderacao em `src/models/BaseContent.ts`:
    - `moderationStatus: visible|hidden|restricted`
    - `moderationReason`, `moderationNote`, `moderatedBy`, `moderatedAt`
  - novo historico dedicado de moderacao de conteudo:
    - `src/models/ContentModerationEvent.ts`
  - novo dominio admin content:
    - service `src/services/adminContent.service.ts`
    - controller `src/controllers/adminContent.controller.ts`
    - rotas integradas em `src/routes/admin.routes.ts`
  - endpoints admin content disponiveis:
    - `GET /api/admin/content/queue`
    - `GET /api/admin/content/:contentType/:contentId/history`
    - `POST /api/admin/content/:contentType/:contentId/hide`
    - `POST /api/admin/content/:contentType/:contentId/unhide`
    - `POST /api/admin/content/:contentType/:contentId/restrict`
  - enforcement publico aplicado nos services de conteudo (`article/book/course/live/podcast/video`):
    - conteudos `hidden` e `restricted` deixam de aparecer nas listagens publicas e no acesso por slug.
- Frontend (`FinHub-Vite`) integrado com os novos contratos:
  - pagina `/admin/conteudo` deixou de ser placeholder:
    - `src/features/admin/pages/ContentModerationPage.tsx`
  - camada de dominio dedicada:
    - tipos `src/features/admin/types/adminContent.ts`
    - service `src/features/admin/services/adminContentService.ts`
    - hooks React Query `src/features/admin/hooks/useAdminContent.ts`
  - teste unitario novo:
    - `src/__tests__/features/admin/adminContentService.test.ts`
  - melhoria de erro API global para payloads `error/message/details`:
    - `src/lib/api/client.ts`
- Validacao tecnica do ciclo P2.2:
  - backend:
    - `npm run typecheck` -> PASS
    - `npm run build` -> PASS
    - `npm run contract:openapi` -> PASS
  - frontend:
    - `yarn lint` -> PASS (warnings nao bloqueantes existentes)
    - `yarn test --runInBand` -> PASS (13 suites, 116 testes)
    - `yarn build` -> PASS
    - `yarn test:e2e` -> PASS (3/3 smoke)

## 24) CI remoto (GitHub Actions) validado para os 2 repositorios (2026-02-20)
- `API_finhub` com workflow CI verde em `main`.
- `FinHub-Vite` com workflow CI verde em `master`.

## 25) Admin Dashboard operacional + sidebar melhorada (2026-02-20)
- Dashboard `/admin` deixou de ser placeholder e passou a ecra operacional real.
- Ficheiros alterados:
  - `src/features/admin/pages/AdminDashboardPage.tsx` (reescrito de raiz)
  - `src/features/admin/components/AdminSidebar.tsx` (melhorado visualmente)
- Funcionalidades do dashboard:
  - secao de utilizadores com 4 metricas reais via API:
    - Total de utilizadores (`GET /api/admin/users?limit=1`)
    - Activos (total - suspensos - banidos)
    - Suspensos (`accountStatus: suspended`)
    - Banidos (`accountStatus: banned`)
  - secao de moderacao com 3 metricas reais via API:
    - Fila total (`GET /api/admin/content/queue?limit=1`)
    - Ocultos (`moderationStatus: hidden`)
    - Restritos (`moderationStatus: restricted`)
  - cards de navigacao para os 4 modulos admin com:
    - estado operacional/em desenvolvimento por modulo
    - contador de alertas activos (suspensos+banidos, ocultos+restritos)
    - hover com seta de accao
  - secao roadmap P2 com fases pendentes
  - loading states com skeleton animado em todos os valores
  - highlight visual condicional (amber para warn, red para danger) em metricas de risco
- Melhorias no AdminSidebar:
  - branding "FinHub Admin" com icone shield no topo
  - label "Painel de controlo" como subtitulo
  - secao "Navegacao" com etiqueta discreta
  - badge "Em breve" nas rotas nao operacionais (Recursos, Estatisticas)
  - activacao por prefixo de rota (startsWith) em vez de igualdade exacta
- Correcao critica de SSR: pagina Vike `src/pages/admin/index.page.tsx` reescrita:
  - causa do erro original: `PlaceholderPage` e `AdminDashboardPage` usavam `Link` de `react-router-dom` sem contexto de Router no SSR do Vike -> `ReactDOMServer.renderToString` lancava `useHref() may be used only in the context of a Router` -> Vike renderizava `_error.page.tsx` ("Ocorreu um erro").
  - solucao: pagina Vike agora auto-contem o dashboard com `<a href>` em vez de `Link`; hooks React Query e Zustand funcionam durante SSR (retornam estado inicial sem fetch)
- Validacao tecnica:
  - `npm run typecheck:p1` -> PASS
  - `yarn build` -> PASS
  - `yarn test --runInBand` -> PASS
  - `yarn test:e2e` -> PASS (3/3 smoke)

## 26) Acesso admin estabilizado (2026-02-20)
- Rotas admin ativas e validadas via paginas Vike:
  - `/admin`
  - `/admin/users`
  - `/admin/conteudo`
  - `/admin/recursos`
  - `/admin/stats`
- Correcao de navegacao aplicada no header:
  - para utilizador com role `admin`, avatar/perfil aponta para `/admin` (e nao para `/perfil`).
- Nota operacional para evitar falso negativo de acesso:
  - apos promover um user para admin no backend, fazer logout/login para renovar token e claims de role/scopes no frontend.
- Revalidacao frontend apos estes ajustes:
  - `yarn lint` -> PASS (warnings nao bloqueantes existentes)
  - `yarn test --runInBand` -> PASS (13 suites, 116 testes)
  - `yarn build` -> PASS
  - `yarn test:e2e` -> PASS (3/3 smoke)

## 27) P2.2 remanescente fechado - comentarios/reviews (2026-02-20)
- Backend (`API_finhub`) expandido para moderacao de comentarios e reviews:
  - `ContentModerationEvent` passa a aceitar `comment` e `review`.
  - `Comment` e `Rating` passam a ter metadados de moderacao:
    - `moderationStatus`, `moderationReason`, `moderationNote`, `moderatedBy`, `moderatedAt`.
  - fila/admin actions existentes passam a operar tambem sobre:
    - `contentType=comment`
    - `contentType=review`
  - enforcement publico aplicado:
    - comments e reviews deixam de aparecer nas listagens/stats publicas quando `hidden` ou `restricted`.
- Frontend (`FinHub-Vite`) alinhado ao novo escopo:
  - tipos/admin service atualizados para suportar `comment` e `review`.
  - pagina `/admin/conteudo` com filtros e labels para comentarios/reviews.
  - teste unitario de `adminContentService` expandido para validar mapeamento desses tipos.
- Validacao do ciclo apos fecho do remanescente:
  - backend:
    - `npm run typecheck` -> PASS
    - `npm run build` -> PASS
    - `npm run contract:openapi` -> PASS
  - frontend:
    - `yarn lint` -> PASS (warnings nao bloqueantes existentes)
    - `yarn test --runInBand` -> PASS (13 suites, 116 testes)
    - `yarn build` -> PASS
    - `yarn test:e2e` -> PASS (3/3 smoke)

## 28) P2.3 fechado - acesso assistido com consentimento (2026-02-20)
- Backend (`API_finhub`) entregue com fluxo completo de sessao assistida:
  - novo dominio/modelos:
    - `src/models/AssistedSession.ts`
    - `src/models/AssistedSessionAuditLog.ts`
    - `src/services/assistedSession.service.ts`
    - `src/services/assistedSessionAudit.service.ts`
  - endpoints admin suporte:
    - `GET /api/admin/support/sessions`
    - `POST /api/admin/support/sessions/request`
    - `POST /api/admin/support/sessions/:sessionId/start`
    - `POST /api/admin/support/sessions/:sessionId/revoke`
    - `GET /api/admin/support/sessions/:sessionId/history`
  - endpoints de consentimento do utilizador:
    - `GET /api/auth/assisted-sessions/pending`
    - `GET /api/auth/assisted-sessions/active`
    - `POST /api/auth/assisted-sessions/:sessionId/consent`
    - `POST /api/auth/assisted-sessions/:sessionId/revoke`
  - seguranca/governanca aplicada:
    - claim de sessao assistida no JWT (`assistedSession`).
    - validacao de claim + expiracao em `authenticate`/`refresh`.
    - escopo minimo enforce (`read_only`: bloqueio de writes durante sessao assistida).
    - auditoria detalhada por request em modo assistido.
    - notificacao ao utilizador/admin em request/consentimento/start/revogacao.
- Frontend (`FinHub-Vite`) integrado com os novos contratos:
  - modulo admin suporte:
    - pagina `/admin/suporte` (`src/features/admin/pages/AssistedSessionsPage.tsx`)
    - services/hooks/tipos dedicados:
      - `src/features/admin/services/adminAssistedSessionsService.ts`
      - `src/features/admin/hooks/useAdminAssistedSessions.ts`
      - `src/features/admin/types/assistedSessions.ts`
    - runtime de backup/restauro da sessao admin:
      - `src/features/admin/services/assistedSessionRuntime.ts`
  - consentimento do utilizador:
    - `src/features/user/pages/UserSettingsPage.tsx` deixou de placeholder e passou a centro de consentimento/revogacao.
    - `src/features/auth/services/assistedSessionService.ts`.
  - banner permanente durante sessao assistida:
    - `src/features/admin/components/AssistedSessionBanner.tsx`
    - integrado em `MainLayout`, `AdminLayout` e `DashboardLayout`.
  - navegacao admin atualizada:
    - nova rota `'/admin/suporte'` em `router.tsx`, `routes/admin.ts` e sidebar admin.
  - novo teste unitario:
    - `src/__tests__/features/admin/adminAssistedSessionsService.test.ts`.
- Validacao tecnica do ciclo P2.3:
  - backend:
    - `npm run typecheck` -> PASS
    - `npm run build` -> PASS
    - `npm run contract:openapi` -> PASS
  - frontend:
    - `yarn lint` -> PASS (warnings nao bloqueantes existentes)
    - `yarn test --runInBand` -> PASS (14 suites, 119 testes)
    - `yarn build` -> PASS
    - `yarn test:e2e` -> PASS (3/3 smoke)

## 29) P2.4 fechado - metricas admin e observabilidade (2026-02-20)
- Backend (`API_finhub`) com novo dominio de metricas admin:
  - service: `src/services/adminMetrics.service.ts`.
  - controller: `src/controllers/adminMetrics.controller.ts`.
  - rota nova em `src/routes/admin.routes.ts`:
    - `GET /api/admin/metrics/overview`
    - governance aplicada: `requireAdminScope('admin.metrics.read')` + `auditAdminAction`.
  - cobertura de KPIs no payload consolidado:
    - utilizacao: DAU/WAU/MAU, novos utilizadores, retencao 30d->7d, distribuicao por role e funnel.
    - engagement: interacoes (follows/favorites/comments/reviews) em 24h/7d/30d e conteudo publicado por tipo.
    - moderacao: queue total/hidden/restricted, volume por tipo, tempo medio/mediano de resolucao e reincidencia.
    - operacao: error rate, disponibilidade, latencia media, top rotas lentas/erro, estado Mongo e auditoria admin 24h.
- Frontend (`FinHub-Vite`) com modulo real em `/admin/stats`:
  - placeholder removido em `src/features/admin/pages/StatsPage.tsx`.
  - nova camada de integracao:
    - `src/features/admin/types/adminMetrics.ts`
    - `src/features/admin/services/adminMetricsService.ts`
    - `src/features/admin/hooks/useAdminMetrics.ts`
  - navegacao/admin dashboard alinhados:
    - `src/features/admin/components/AdminSidebar.tsx`
    - `src/features/admin/pages/AdminDashboardPage.tsx`
    - `src/pages/admin/index.page.tsx`
  - novo teste unitario:
    - `src/__tests__/features/admin/adminMetricsService.test.ts`.
- Validacao tecnica do ciclo P2.4:
  - backend:
    - `npm run typecheck` -> PASS
    - `npm run build` -> PASS
    - `npm run contract:openapi` -> PASS
  - frontend:
    - `yarn lint` -> PASS (warnings nao bloqueantes existentes)
    - `yarn test --runInBand` -> PASS (15 suites, 120 testes)
    - `yarn build` -> PASS
    - `yarn test:e2e` -> PASS (3/3 smoke)

## 30) REIT toolkit hardening (2026-02-20)
- Backend (`API_finhub`) refinado para maior fidelidade dos calculos:
  - DDM com detecao automatica de frequencia de pagamentos, `currentDividend`, `forwardAnnualDividend`, `forwardDividendYield` e gating de confianca (`ddmConfidence`, `ddmConfidenceNote`).
  - FFO com estrategia multi-fonte:
    - prioridade a `ffoPerShare` de `key-metrics` (proxy NAREIT) quando disponivel.
    - fallback para estimativa simplificada (NI + D&A total), com tratamento especifico para specialty REITs e mREITs.
    - `operatingCashFlow` com guarda de plausibilidade para zeros espurios e flag `operatingCFPerShareApprox` quando shares sao estimadas.
  - `reportPeriod` adicionado nas respostas de FFO e NAV para contexto temporal explicito.
- Frontend (`FinHub-Vite`) evoluido no modulo de REITs:
  - toggle de visualizacao do bloco FFO: `NAREIT` | `Estimativa` | `CF Operacional`.
  - DDM com aviso de baixa confianca e supressao do badge de valuation quando aplicavel.
  - metricas adicionais de dividendo (atual, TTM com N pagamentos, forward).
  - tratamento explicito para cenarios de NAV economico negativo.
  - novo card `Score de Valorizacao` (0-100) com ponderacao de P/FFO, payout, divida/EBITDA e desvio vs NAV.
  - contratos frontend atualizados em `marketToolsApi` para os novos campos.
- Validacao do ciclo apos os refinamentos:
  - backend:
    - `npm run typecheck` -> PASS
    - `npm run build` -> PASS
    - `npm run contract:openapi` -> PASS
  - frontend:
    - `yarn lint` -> PASS (warnings nao bloqueantes existentes)
    - `yarn test --runInBand` -> PASS (15 suites, 120 testes)
    - `yarn test:e2e` -> PASS (3/3 smoke)
    - `yarn build` -> PASS (execucao sequencial, sem erro `ENOTEMPTY`)

## 31) P2.5 fechado - painel admin unificado (2026-02-20)
- Frontend (`FinHub-Vite`) consolidado para operacao diaria num unico entrypoint (`/admin`):
  - dashboard admin reestruturado como painel unificado com tabs por modulo:
    - visao geral
    - utilizadores
    - moderacao de conteudo
    - suporte assistido
    - metricas
    - recursos (quando permitido)
  - cada tab renderiza o modulo operacional em modo embebido (sem duplicar logica de dominio).
  - wrappers Vike alinhados ao mesmo fluxo, incluindo nova pagina `src/pages/admin/suporte/index.page.tsx`.
- Navegacao por permissoes entregue:
  - nova camada de acesso por escopos em `src/features/admin/lib/access.ts`.
  - `AdminSidebar` passa a mostrar/esconder modulos conforme `adminScopes`.
  - modulo em read-only passa a aparecer com indicacao visual e sem escrita.
  - compatibilidade mantida: admin sem lista explicita de escopos continua com acesso total.
- Guardrails de UX para acoes destrutivas entregue:
  - gestao de utilizadores:
    - dialogos com `Resumo de impacto` contextual.
    - confirmacao dupla obrigatoria (`CONFIRMAR`) para `suspend`, `ban` e `force-logout`.
  - moderacao de conteudo:
    - dialogos com `Resumo de impacto` contextual.
    - confirmacao dupla obrigatoria (`CONFIRMAR`) para `hide` e `restrict`.
  - suporte assistido:
    - revogacao com resumo de impacto e confirmacao dupla (`CONFIRMAR`).
- Qualidade de implementacao:
  - hooks admin atualizados com suporte a `enabled` para evitar chamadas nao autorizadas em modulos sem escopo.
  - dashboard usa esses flags para ativar queries apenas nos modulos permitidos.
- Validacao do ciclo P2.5:
  - backend:
    - `npm run typecheck` -> PASS
    - `npm run build` -> PASS
    - `npm run contract:openapi` -> PASS
  - frontend:
    - `yarn lint` -> PASS (warnings nao bloqueantes existentes)
    - `yarn test --runInBand` -> PASS (15 suites, 120 testes)
    - `yarn build` -> PASS
    - `yarn test:e2e` -> PASS (3/3 smoke)

## 32) P2.6 arranque - suite E2E admin (2026-02-20)
- Frontend (`FinHub-Vite`) com cobertura E2E admin expandida para cenarios positivos/negativos:
  - novo ficheiro `e2e/admin.p2.6.spec.ts`.
  - cenarios cobertos:
    - admin com escopo `admin.users.write` executa sancao (`suspend`) com guardrail de confirmacao dupla (`CONFIRMAR`).
    - admin em `read-only` nao executa acoes destrutivas e apenas ve modulos permitidos pelos seus escopos.
  - testes usam sessao admin injetada em `localStorage` + mocks de endpoints `/api/admin/**` para validar comportamento de permissao e guardrails sem dependencia externa.
- Resultado da suite E2E apos arranque P2.6:
  - `yarn test:e2e` -> PASS (5/5; 3 smoke + 2 admin).

## 33) P2.6 fechado - hardening operacional admin (2026-02-20)
- Backend (`API_finhub`) com mecanismo operacional de alertas internos:
  - novo endpoint `GET /api/admin/alerts/internal` (RBAC `admin.audit.read`).
  - sinais criticos suportados:
    - `ban_applied` (acao `admin.users.ban`, severidade `critical`).
    - `content_hide_spike` (acao `admin.content.hide` por actor, threshold `>=5` em 30min).
    - `delegated_access_started` (acao `admin.support.sessions.start`, severidade `high`).
  - payload de resposta inclui `summary`, `thresholds` e lista ordenada de alertas para triagem.
- Frontend (`FinHub-Vite`) integrado com os novos contratos:
  - novo hook/servico/tipos para `admin/alerts/internal`.
  - dashboard `/admin` com bloco "Alertas internos" (critico/high/medio + detalhe por evento).
  - hardening adicional no modulo de suporte: removida dependencia de `useNavigate` fora de Router para evitar crash do tab embebido.
- Cobertura E2E admin expandida para os cenarios remanescentes de P2.6:
  - moderacao: hide com confirmacao dupla.
  - suporte: start de sessao assistida e revoke com guardrail de confirmacao.
  - suite final: `yarn test:e2e` -> PASS (8/8; 3 smoke + 5 admin).
- Runbook operacional validado e versionado:
  - novo ficheiro `dcos/RUNBOOK_ADMIN_OPERACIONAL.md`.
- Validacao tecnica do fecho P2.6:
  - backend:
    - `npm run typecheck` -> PASS
    - `npm run build` -> PASS
    - `npm run contract:openapi` -> PASS
  - frontend:
    - `yarn lint` -> PASS (warnings nao bloqueantes existentes)
    - `yarn test --runInBand` -> PASS (15 suites, 120 testes)
    - `yarn build` -> PASS
    - `yarn test:e2e` -> PASS (8/8; 3 smoke + 5 admin)

## 34) Fecho oficial de P2 e transicao para novo P3 (2026-02-21)
- Decisao de produto registada:
  - P2 e considerado FECHADO como ciclo Admin-first (P2.0 a P2.6).
  - o trabalho de melhoria da analise de stocks deixa de competir com backlog admin e passa para o novo P3.
  - o P3 anterior (livros/ferramentas legadas/brokers-websites) foi adiado para P4.
- Contexto tecnico que motivou a mudanca:
  - na analise rapida de stocks existem casos com comparativo (`vs.`/`Y-1`) disponivel e valor atual em `-`.
  - este comportamento ocorre em multiplos setores e nao apenas no caso da Google (`GOOGL`), sobretudo em metricas como `ROIC`, `ROE`, `PEG`, `Margem EBITDA` e `Divida / Capitais Proprios`.
  - causa principal: cobertura assimetrica de fontes/periodos (TTM/FY/Q), nomenclatura heterogenea por endpoint e lacunas de reporte por setor.
- Direcao do novo P3:
  - hardening de pipeline de metricas atuais com fallback multi-fonte e normalizacao temporal explicita.
  - semantica de dados ausentes diferenciada (`sem_dado_atual`, `nao_aplicavel`, `erro_fonte`) para evitar `-` ambiguo.
  - validacao funcional cross-setor com matriz de tickers de referencia e gate tecnico completo (lint/test/build/e2e).

## 35) P3.1 arranque tecnico - ingestao e normalizacao (2026-02-21)
- Backend (`API_finhub`) com primeiro contrato formal de governanca para a Analise Rapida:
  - novo util `src/utils/quickAnalysisMetrics.ts`.
  - payload da quick analysis enriquecido com:
    - `quickMetricContractVersion`
    - `quickMetricCatalog`
    - `quickMetricStates`
    - `quickMetricIngestion`
    - `quickMetricSummary`
- Regras iniciais implementadas:
  - catalogo de metricas nucleares por categoria com fonte primaria/fallback e unidade.
  - estados por metrica (`ok`, `calculated`, `nao_aplicavel`, `sem_dado_atual`, `erro_fonte`).
  - normalizacao temporal explicita (`TTM`, `FY`, `Q`, `MIXED`) e mapeamento de periodo de benchmark por source.
  - contexto de ingestao com `currentDataPeriodRaw`, `currentDataPeriodNormalized`, `benchmarkAsOf` e distribuicao de fontes observadas.
- Frontend (`FinHub-Vite`) alinhado ao novo contrato:
  - tipos extendidos em `src/features/tools/stocks/types/stocks.ts`.
  - merge de payload atualizado em `src/features/tools/stocks/utils/mergeStockData.ts`.
- Validacao tecnica apos arranque P3.1:
  - backend: `npm run typecheck` -> PASS.
  - frontend: `npm run typecheck:p1` -> PASS.

## 36) P3.2 arranque tecnico - motor derivado de atuais (2026-02-21)
- Backend (`API_finhub`) com preenchimento derivado de metricas atuais ausentes na Analise Rapida:
  - novo util `src/utils/quickAnalysisDerivedMetrics.ts`.
  - calculos/fallbacks iniciais aplicados para:
    - `ROE`
    - `ROIC`
    - `PEG`
    - `Margem EBITDA`
    - `Divida / Capitais Proprios`
  - estrategia:
    - priorizar campos diretos de `ratios` quando disponiveis.
    - usar formulas derivadas quando necessario (ex.: `PEG = (P/L) / abs(CAGR_EPS_percent)`).
    - preservar `-` apenas quando nao houver base de calculo confiavel.
- Integracao no fluxo da quick analysis:
  - `src/controllers/stock.controller.ts` passa a enriquecer `indicadores` antes de construir o contrato `quickMetric*`.
  - `quickMetricStates` agora classifica valores preenchidos por este motor como `calculated` com `source`/`reason` de formula.
- Validacao tecnica apos arranque P3.2:
  - backend: `npm run typecheck` -> PASS.
  - frontend: `npm run typecheck:p1` -> PASS.

## 37) P3.2 fechado + P3.3 arranque tecnico concluido (2026-02-21)
- Fecho oficial de P3.2 (motor de calculo de atuais ausentes):
  - fallback expandido para fontes adicionais do ecossistema FMP (`ratios`, `key-metrics`, historico de `ratios` e `key-metrics`).
  - fallback por formula quando o valor atual nao vem pronto na fonte:
    - ROE = netIncome / avgShareholderEquity
    - ROIC = NOPAT / investedCapital
    - Divida / Capitais Proprios = totalDebt / totalShareholderEquity
    - Margem EBITDA = EBITDA / revenue
    - Payout Ratio = abs(dividendsPaid) / abs(netIncome)
    - PEG = (P/L) / abs(growth_percent)
  - estados `quickMetricStates` refletem estes preenchimentos com `status=calculated`, `source` e `formula`.
- Arranque tecnico de P3.3 concluido (matriz setorial + categorias dinamicas):
  - resolucao de setor de analise por `sector + industry` para evitar classificacao errada da fonte (`sectorRaw` vs setor canonico de analise).
  - contrato `quickMetric*` expandido com semantica setorial:
    - `sectorPolicy` no catalogo
    - `sectorPriority` e `requiredForSector` nos estados
    - `resolvedSector` em ingestao
    - resumo de cobertura `core*` e `optional*`
- Matriz formal publicada:
  - `dcos/P3_MATRIZ_SETORIAL_ANALISE_RAPIDA.md`
- Validacao tecnica apos fecho:
  - backend: `npm run typecheck` -> PASS.
  - frontend: `npm run typecheck:p1` -> PASS.
- Smoke funcional setorial (amostra):
  - GOOGL classificado em Communication Services (com `sectorRaw=Technology`).
  - XOM classificado em Energy.
  - NFE classificado em Utilities.
  - JPM com ROIC e Divida/EBITDA em `nao_aplicavel` (comportamento esperado para Financial Services).

## 38) P3.3 validacao operacional + P3.4 arranque tecnico (2026-02-21)
- Validacao operacional cross-setor (1 ticker por setor) automatizada:
  - novo script backend: `API_finhub/scripts/quick-metrics-sector-coverage.js`.
  - novo comando backend: `npm run quick-metrics:coverage`.
  - robustez adicionada ao script com retries + intervalo entre requests para reduzir erros transientes de fonte.
  - artefacto de validacao gerado em:
    - `FinHub-Vite/dcos/P3_COBERTURA_SETORIAL_QUICK_ANALYSIS.md`.
- Resultado da tabela operacional:
  - 11/11 setores com setor resolvido esperado na amostra executada.
  - cobertura core total em 9 setores (`17/17` ou equivalente setorial).
  - excecoes coerentes com politica setorial:
    - Financial Services: `ROIC` e `Divida/EBITDA` em `nao_aplicavel`.
    - Utilities: `2` metricas em `sem_dado_atual` (core `14/15`, optional `1/2`).
- P3.4 arranque tecnico entregue no frontend (Analise Rapida):
  - novo resumo de governanca de metricas na pagina (setor resolvido + contagens por estado).
  - estados por metrica visiveis diretamente nos cards:
    - `Direto`
    - `Calculado`
    - `Nao aplicavel`
    - `Sem dado atual`
    - `Erro fonte`
  - valor apresentado no card deixa de ser ambiguo para estados sem valor atual/nao aplicavel/erro de fonte.
  - contexto de governanca partilhado entre quick analysis e componentes setoriais:
    - `QuickMetricGovernanceContext`
    - `QuickMetricCoverageSummary`
- Validacao tecnica deste ciclo:
  - backend: `npm run typecheck` -> PASS.
  - frontend: `npm run typecheck:p1` -> PASS.

## 39) Planeamento formal do P4 Admin CMS (2026-02-22)
- Escopo editorial admin formalizado para o ciclo pos-P3:
  - seed de conteudo por admin (multi-tipo)
  - curadoria de homepage por secoes
  - diretorios verticais (corretoras/exchanges/apps/sites)
  - workflow de claim e migracao de ownership para creators
- Documento tecnico dedicado criado:
  - `dcos/P4_ADMIN_EDITORIAL_CMS.md`
- Alinhamento de roadmap/documentacao efetuado:
  - `dcos/PENDENCIAS_PRIORIZADAS.md` atualizado com o bloco "Admin Editorial CMS" em Prioridade 4.
  - `dcos/RESUMO_EXECUTIVO.md` atualizado com referencia explicita ao novo plano.

## 40) P4 Fase B fechada - curadoria home frontend integrada (2026-02-22)
- Frontend (`FinHub-Vite`) com modulo editorial admin operacional:
  - nova pagina `src/features/admin/pages/EditorialCmsPage.tsx` ligada aos endpoints reais:
    - `GET/POST/PATCH /api/admin/editorial/sections`
    - `POST /api/admin/editorial/sections/:sectionId/items`
    - `PATCH /api/admin/editorial/sections/:sectionId/items/reorder`
    - `DELETE /api/admin/editorial/sections/:sectionId/items/:itemId`
  - preview operacional da home curada ligado a:
    - `GET /api/editorial/home`
  - guardrails de operacao aplicados:
    - bloqueio de escrita em `adminReadOnly`
    - enforcement por escopo `admin.home.curate`
    - confirmacao dupla para remocao de item
    - bloqueio de add quando secao atinge `maxItems`
- Integracao no painel admin unificado:
  - rota adicionada: `/admin/editorial`
  - navegação atualizada em:
    - `src/features/admin/lib/access.ts`
    - `src/features/admin/components/AdminSidebar.tsx`
    - `src/routes/admin.ts`
    - `src/router.tsx`
    - `src/features/admin/pages/AdminDashboardPage.tsx` (tab embebido)
- Camada de dominio frontend adicionada:
  - tipos: `src/features/admin/types/adminEditorialCms.ts`
  - service: `src/features/admin/services/adminEditorialCmsService.ts`
  - hooks: `src/features/admin/hooks/useAdminEditorialCms.ts`
  - teste unitario: `src/__tests__/features/admin/adminEditorialCmsService.test.ts`
- Validacao tecnica do ciclo:
  - frontend:
    - `npm run typecheck:p1` -> PASS
    - `npm run lint` -> PASS (warnings nao bloqueantes ja existentes)
    - `npm run test -- --runInBand` -> PASS (16 suites, 124 testes)
    - `npm run build` -> PASS
    - `npm run test:e2e` -> PASS (8/8)
  - backend:
    - `npm run typecheck` -> PASS
    - `npm run build` -> PASS
    - `npm run contract:openapi` -> PASS

## 41) P4 Fase C1 fechada - diretorios admin frontend integrados (2026-02-23)
- Frontend (`FinHub-Vite`) com modulo de diretorios admin operacional em `/admin/recursos`:
  - pagina `src/features/admin/pages/BrandsManagementPage.tsx` deixou de placeholder.
  - listagem por vertical (`broker`, `exchange`, `site`, `app`, `podcast`, `event`, `other`) com filtros e paginacao.
  - operacoes ligadas aos endpoints reais:
    - `POST /api/admin/directories/:vertical`
    - `PATCH /api/admin/directories/:vertical/:entryId`
    - `POST /api/admin/directories/:vertical/:entryId/publish`
    - `POST /api/admin/directories/:vertical/:entryId/archive`
  - guardrails de operacao:
    - motivo obrigatorio para `archive`;
    - confirmacao dupla (`CONFIRMAR`) para `archive`.
- Camada tecnica frontend consolidada:
  - tipos: `src/features/admin/types/adminDirectories.ts`
  - service: `src/features/admin/services/adminDirectoriesService.ts`
  - hooks: `src/features/admin/hooks/useAdminDirectories.ts`
  - teste unitario novo: `src/__tests__/features/admin/adminDirectoriesService.test.ts`
- Integracao de acesso no painel admin:
  - modulo `Recursos` marcado como operacional em `src/features/admin/lib/access.ts`.
  - escopo principal `admin.directory.manage` com compatibilidade legacy (`admin.brands.read/write`).
- Validacao tecnica do ciclo (frontend):
  - `npm run typecheck:p1` -> PASS
  - `npm run lint` -> PASS (warnings nao bloqueantes existentes)
  - `npm run test -- --runInBand` -> PASS (17 suites, 127 testes)
  - `npm run build` -> PASS
  - `npm run test:e2e` -> PASS (8/8)

## 42) P4 Fase C2 fechada - landing/show-all publico por vertical (2026-02-26)
- Frontend (`FinHub-Vite`) consolidado para consumo publico dos endpoints editoriais por vertical:
  - `GET /api/editorial/:vertical`
  - `GET /api/editorial/:vertical/show-all`
- Entregue:
  - service dedicado `src/features/markets/services/editorialPublicApi.ts`
  - hooks dedicados `src/features/markets/hooks/useEditorialPublic.ts`
  - paginas:
    - `src/pages/mercados/recursos/@vertical.page.tsx`
    - `src/pages/mercados/recursos/@vertical/show-all.page.tsx`
    - `src/pages/mercados/recursos/_components/EditorialDirectoryPage.tsx`
  - teste unitario: `src/__tests__/features/markets/editorialPublicApi.test.ts`
- Validacao tecnica do ciclo:
  - `npm run typecheck:p1` -> PASS
  - `npm run lint` -> PASS (warnings nao bloqueantes existentes)
  - `npm run test -- --runInBand` -> PASS
  - `npm run build` -> PASS
  - `npm run test:e2e` -> PASS (8/8)

## 43) P4 Fase D arranque frontend - claims e ownership operacional (2026-02-26)
- Frontend (`FinHub-Vite`) com fluxo de claim/ownership ligado aos endpoints reais:
  - creator em `/conta`:
    - criar claim: `POST /api/editorial/claims`
    - listar meus claims: `GET /api/editorial/claims/my`
    - cancelar claim pendente: `POST /api/editorial/claims/:claimId/cancel`
  - admin em `/admin/editorial`:
    - listar/rever claims: `GET /api/admin/claims`
    - aprovar/rejeitar: `POST /api/admin/claims/:claimId/approve|reject`
    - transfer manual: `POST /api/admin/ownership/transfer`
- Camada tecnica entregue:
  - creator:
    - service: `src/features/user/services/editorialClaimsService.ts`
    - hooks: `src/features/user/hooks/useEditorialClaims.ts`
    - pagina: `src/features/user/pages/UserSettingsPage.tsx`
    - teste unitario: `src/__tests__/features/user/editorialClaimsService.test.ts`
  - admin:
    - tipos/service/hooks atualizados:
      - `src/features/admin/types/adminEditorialCms.ts`
      - `src/features/admin/services/adminEditorialCmsService.ts`
      - `src/features/admin/hooks/useAdminEditorialCms.ts`
    - pagina admin atualizada: `src/features/admin/pages/EditorialCmsPage.tsx`
    - scopes admin alinhados: `src/features/admin/lib/access.ts`
    - teste unitario atualizado: `src/__tests__/features/admin/adminEditorialCmsService.test.ts`
- Validacao tecnica do ciclo:
  - `npm run typecheck:p1` -> PASS
  - `npm run lint` -> PASS (warnings nao bloqueantes existentes)
  - `npm run test -- --runInBand` -> PASS (19 suites, 135 testes)
  - `npm run build` -> PASS
  - `npm run test:e2e` -> PASS (8/8)

## 44) P4 Fase D3 fechada - historico consultavel de ownership transfer (2026-02-27)
- Backend (`API_finhub`) com endpoint administrativo de historico:
  - `GET /api/admin/ownership/transfers`
  - controller/route/service/OpenAPI atualizados para filtros + paginacao.
- Frontend (`FinHub-Vite`) com consulta dedicada em `/admin/editorial`:
  - filtros de target/owner origem/owner destino + pesquisa e targetId.
  - lista paginada, refresh manual e contexto operacional (de/para/por/quando).
  - invalidacao de cache do historico apos aprovar claim e apos transfer manual.
- Camada tecnica frontend atualizada:
  - tipos/service/hooks:
    - `src/features/admin/types/adminEditorialCms.ts`
    - `src/features/admin/services/adminEditorialCmsService.ts`
    - `src/features/admin/hooks/useAdminEditorialCms.ts`
  - pagina admin:
    - `src/features/admin/pages/EditorialCmsPage.tsx`
  - teste unitario atualizado:
    - `src/__tests__/features/admin/adminEditorialCmsService.test.ts`
- Validacao tecnica do ciclo:
  - `npm run lint` -> PASS (warnings nao bloqueantes existentes)
  - `npm run test -- --runInBand` -> PASS (19 suites, 136 testes)
  - `npm run typecheck:p1` -> PASS
  - `npm run build` -> PASS

## 45) P4 Moderation Control Plane consolidado no backend (2026-03-01)
- Backend (`API_finhub`) com segunda camada operacional de P4 ja implementada alem do Editorial CMS.
- Modelos introduzidos/expandidos:
  - `ContentReport`
  - `AutomatedModerationSignal`
  - `ContentFalsePositiveFeedback`
  - `PlatformSurfaceControl`
  - `AdminContentJob`
  - `User.creatorControls`
- Services principais introduzidos:
  - `moderationPolicy.service.ts`
  - `contentReport.service.ts`
  - `automatedModeration.service.ts`
  - `surfaceControl.service.ts`
  - `creatorTrust.service.ts`
  - `adminContentJob.service.ts`
- Entregas funcionais consolidadas:
  - `fast hide`
  - bulk moderation com guardrails
  - reports de users a alimentar a queue admin
  - policy engine com auto-hide opcional por env
  - creator controls
  - trust scoring com compensacao de false positives
  - deteccao automatica (`spam`, `suspicious_link`, `flood`, `mass_creation`)
  - rollback assistido
  - kill switches por superficie
  - jobs assincronos de moderacao/rollback
  - drill-down operacional por creator, alvo, superficie e jobs
- Endpoints principais expostos:
  - `POST /api/admin/content/:contentType/:contentId/hide-fast`
  - `POST /api/admin/content/bulk-moderate`
  - `POST /api/admin/content/bulk-rollback`
  - `POST /api/admin/content/bulk-moderate/jobs`
  - `POST /api/admin/content/bulk-rollback/jobs`
  - `GET /api/admin/content/jobs`
  - `GET /api/admin/content/jobs/:jobId`
  - `POST /api/reports/content`
  - `GET /api/admin/metrics/drilldown`
  - `POST /api/admin/users/:userId/creator-controls`
  - `GET /api/admin/users/:userId/trust-profile`
  - `GET /api/admin/surfaces`
  - `PATCH /api/admin/surfaces/:key`
- Configuracao/env relevante:
  - `MODERATION_POLICY_AUTO_HIDE_*`
  - `AUTOMATED_MODERATION_*`
- Validacao tecnica do ciclo:
  - `npm run typecheck` -> PASS
  - `npm run build` -> PASS
  - `npm run contract:openapi` -> PASS
- Documento tecnico principal:
  - `API_finhub/dcos/P4_MODERATION_CONTROL_PLANE.md`

## 46) P4 Moderation Control Plane surfacado no frontend admin (2026-03-01)
- Frontend (`FinHub-Vite`) com UX admin alinhada ao control plane backend.
- Superficies operacionais consolidadas:
  - `/admin`
  - `/admin/conteudo`
  - `/admin/users`
  - `/admin/creators`
  - `/admin/stats`
- Entregas funcionais na UI:
  - queue de moderacao com `reportSignals`, `policySignals`, `automatedSignals` e `creatorTrustSignals`;
  - rollback assistido com `mark false positive`;
  - jobs recentes e criacao de jobs assincronos em lote;
  - creator risk board dedicado;
  - trust profile e creator controls;
  - dashboard/stats com drill-down, false positives, jobs e surface controls;
  - kill switches e estados de superficie com motivo e mensagem publica.
- Camadas frontend principais atualizadas:
  - `src/features/admin/types/adminContent.ts`
  - `src/features/admin/types/adminUsers.ts`
  - `src/features/admin/types/adminMetrics.ts`
  - `src/features/admin/services/adminContentService.ts`
  - `src/features/admin/services/adminUsersService.ts`
  - `src/features/admin/services/adminMetricsService.ts`
  - `src/features/admin/hooks/useAdminContent.ts`
  - `src/features/admin/hooks/useAdminMetrics.ts`
- Guardrails UX ativos:
  - dialogs de acao destrutiva;
  - motivo obrigatorio nos kill switches;
  - confirmacao dupla onde o fluxo e critico;
  - gating por `adminReadOnly` e escopos nas paginas principais.
- Validacao tecnica do ciclo:
  - `yarn lint` -> PASS (warnings nao bloqueantes existentes)
  - `yarn test --runInBand` -> PASS (21 suites, 143 testes)
  - `yarn build` -> PASS
  - `npm run test:e2e -- e2e/admin.p2.6.spec.ts` -> PASS
  - `npm run test:e2e -- e2e/admin.creator-risk.p4.spec.ts` -> PASS
- Documento tecnico de entrada no frontend:
  - `dcos/P4_MODERATION_CONTROL_PLANE.md`
