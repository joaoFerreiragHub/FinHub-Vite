# Estado Implementado

Data de referencia: 2026-02-20 (atualizado apos fecho de P2.2 moderacao de conteudo).

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
    - `yarn test --runInBand` -> PASS (13 suites, 115 testes)
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
  - causa do erro original: `PlaceholderPage` e `AdminDashboardPage` usavam `Link` de `react-router-dom` sem contexto de Router no SSR do Vike → `ReactDOMServer.renderToString` lancava `useHref() may be used only in the context of a Router` → Vike renderizava `_error.page.tsx` ("Ocorreu um erro 😢")
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
  - `yarn test --runInBand` -> PASS (13 suites, 115 testes)
  - `yarn build` -> PASS
  - `yarn test:e2e` -> PASS (3/3 smoke)
