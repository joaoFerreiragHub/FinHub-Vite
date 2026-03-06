# P4 Moderation Control Plane - Frontend

Data de consolidacao: 2026-03-03
Escopo: superficie admin/frontend que consome o control plane de moderacao do backend

## Fonte de verdade

O documento tecnico principal desta funcionalidade vive no backend:

- `API_finhub/dcos/P4_MODERATION_CONTROL_PLANE.md`

Este ficheiro existe para dar contexto rapido a quem entra pelo frontend e para resumir o que ja esta surfacado na UI admin.

## Estado atual do frontend

O painel admin ja consome o Moderation Control Plane de forma operacional.

Superficies principais:

- `/admin`
- `/admin/conteudo`
- `/admin/users`
- `/admin/creators`
- `/admin/stats`

## O que ja esta surfacado

### Moderacao de conteudo

- queue com filtros, historico e acoes `hide`, `restrict`, `unhide`;
- `fast hide` e rollback assistido;
- sinais de reports, policy e deteccao automatica por item;
- jobs assincronos de moderacao em lote e lista de jobs recentes;
- bulk selection na queue com guardrails e confirmacao.

## Creators e risco

- risk board dedicado em `/admin/creators`;
- trust profile por creator;
- badges e score de risco nas listas admin;
- creator controls: cooldown, block creation, block publishing, suspend ops;
- deep-links da queue para o trust profile e controlos do creator.

## Dashboard e observabilidade

- KPIs de moderacao e risco no dashboard admin;
- drill-down operacional por creator, alvo, superficie e jobs;
- surface controls / kill switches operacionais;
- stats page com distribuicao de trust score, false positives e backlog de jobs.

## Bloco A fechado

O Bloco A ficou fechado nesta iteracao.

Entregue no frontend:

- gating publico para `creator_page` em listagens e perfis de creators;
- gating publico para `search` na pagina de pesquisa e no atalho global `Ctrl+K`;
- gating publico para `derived_feeds` nos feeds agregados e vistas de atividade dependentes;
- nova camada comum `features/platform` para consumir `/platform/surfaces`;
- leitura do novo alerta `surface_disabled` no dashboard admin.

Notas operacionais:

- `search` e `derived_feeds` aparecem desligados por defeito ate o backend publico dessas superficies ficar pronto ponta-a-ponta;
- o frontend usa `publicMessage` quando existe e faz fallback para copy neutra.

Validacao desta iteracao:

- `npm run typecheck:p1`
- `npx jest --no-cache src/__tests__/features/admin/adminOperationalAlertsService.test.ts src/__tests__/features/platform/publicSurfaceControlsService.test.ts`

## Bloco B fechado

O Bloco B tambem ficou fechado nesta iteracao.

Entregue no frontend:

- `ContentModerationPage` passa a ler `/admin/content/jobs/worker-status`;
- o admin ve estado do worker dedicado, backlog, retries, jobs stale e falhas recentes;
- jobs recentes mostram tentativa atual, `workerId`, heartbeat e lease quando estao `running`;
- os tipos/contracts de jobs passaram a incluir `attemptCount`, `maxAttempts`, `workerId`, `leaseExpiresAt` e `lastHeartbeatAt`.

Notas operacionais:

- o frontend ja nao assume que jobs `running` implicam worker saudavel;
- `stale` passou a ser um estado explicito de leitura, em vez de inferencia manual por timestamps;
- a criacao de job invalida tambem o query cache de `worker-status`.

Validacao desta iteracao:

- `npm run typecheck:p1`
- `npx jest --no-cache src/__tests__/features/admin/adminContentService.test.ts`

## Bloco C fechado

O Bloco C ficou fechado nesta iteracao.

Entregue no frontend:

- `adminUsersService` e `adminContentService` passam a mapear compensacao de falso positivo por categoria/regra;
- trust dialogs em `/admin/users` e `/admin/creators` passam a mostrar compensacao FP 30d, categoria dominante e regra automatica dominante;
- `ContentModerationPage` passa a mostrar o profile de policy aplicado e o threshold de hide/high por target;
- os contratos de `trustSignals` e `policySignals` passam a incluir breakdowns de falso positivo e profile/thresholds da policy.

Notas operacionais:

- o frontend continua backward-compatible: quando o backend nao enviar os campos novos, o mapping faz fallback para `0` ou `null`;
- a leitura de profile de policy ficou deliberadamente passiva, sem criar novo controlo manual na UI.

Validacao desta iteracao:

- `npm run typecheck:p1`
- `npx jest --no-cache src/__tests__/features/admin/adminUsersService.test.ts`
- `npx jest --no-cache src/__tests__/features/admin/adminContentService.test.ts`

## Bloco D fechado

O Bloco D ficou fechado nesta iteracao.

Entregue no frontend:

- `adminContentService`, `types/adminContent` e `useAdminContent` passam a suportar `approval` em jobs `bulk_rollback`, `awaitingApproval` em `worker-status` e mutacoes de `request-review`/`approve`;
- `ContentModerationPage` passa a mostrar badges `draft/review/approved`, risco agregado, estado de amostra revista e validacao de false positive nos jobs de rollback;
- dialogs novos permitem submeter o lote para revisao e aprovar com checklist de amostra, confirmacao forte e validacao manual de false positive.

Notas operacionais:

- a criacao do job de rollback continua API-first, porque cada item precisa de `eventId`; esta iteracao fecha a fase de revisao/aprovacao e observabilidade do backlog;
- a UI so mostra acoes de revisao/aprovacao para jobs `bulk_rollback` em `queued` com `approval.required=true`;
- a leitura continua backward-compatible com jobs antigos que nao tragam envelope `approval`.

Validacao desta iteracao:

- `npm run typecheck:p1`
- `npx jest --no-cache src/__tests__/features/admin/adminContentService.test.ts`

## Follow-up operacional fechado

Entregue nesta iteracao:

- E2E dedicado `e2e/admin.rollback-jobs.p4.spec.ts` para o fluxo `draft -> review -> running` nos jobs `bulk_rollback`;
- E2E dedicado `e2e/admin.worker-status.p4.spec.ts` para `worker-status`, `retrying`, `staleRunning`, `maxAttemptsReached` e leitura de `lastError`;
- cobertura do caminho `request-review -> approve -> worker-status`, incluindo amostra obrigatoria, confirmacao forte e validacao de false positive;
- `playwright.config.ts` passa a arrancar um `vite.e2e.config.js` dedicado, isolando cache de E2E e desacoplando os specs do `vite.config.js` local;
- runbook admin estendido em `dcos/RUNBOOK_ADMIN_OPERACIONAL.md` com passos de triagem para rollback em lote e leitura do worker.

Validacao desta iteracao:

- `npm run test:e2e -- e2e/admin.rollback-jobs.p4.spec.ts`
- `npm run test:e2e -- e2e/admin.worker-status.p4.spec.ts`

## UX publica ligada ao control plane

- centro de notificacoes passa a suportar `content_moderated`;
- preferencia publica `contentModerated` alinhada com `notificationPreferences.content_moderated`;
- a notificacao aparece no separador `Sistema` com copy neutra e sem expor notas internas do admin.

## Contratos frontend alinhados

Camadas principais atualizadas:

- `src/features/admin/types/adminContent.ts`
- `src/features/admin/types/adminUsers.ts`
- `src/features/admin/types/adminMetrics.ts`
- `src/features/admin/services/adminContentService.ts`
- `src/features/admin/services/adminUsersService.ts`
- `src/features/admin/services/adminMetricsService.ts`
- `src/features/admin/hooks/useAdminContent.ts`
- `src/features/admin/hooks/useAdminMetrics.ts`

## Guardrails UX ativos

- dialogs para acoes destrutivas em moderacao;
- motivo obrigatorio nos kill switches;
- confirmacao dupla em fluxos criticos como archive e certas acoes admin;
- gating por `adminReadOnly` e por escopos nas paginas operacionais principais.

### P4.2-05 fechado - guards de rota por scope (2026-03-05)

Entregue nesta iteracao:

- `requireAdmin` em `src/lib/auth/guards.ts` passa a validar o `pathname` admin contra escopos reais, nao apenas `role=admin`.
- mapeamento central de acesso por path em `src/features/admin/lib/access.ts`:
  - `getAdminModuleForPath`
  - `canAccessAdminPath`
  - `getDefaultAdminPath`
- wrappers SSR de `/pages/admin/**` passam a declarar `requiredAdminModule` no `ProtectedRoute`.
- registry de rotas admin atualizado com `/admin/auditoria`.

Cobertura adicionada:

- `src/__tests__/features/admin/adminAccess.test.ts`
- `src/__tests__/lib/authGuards.adminScope.test.ts`

### P4.2-14 fechado - validacao em tempo real de formularios admin (2026-03-05)

Entregue nesta iteracao:

- helper comum `src/features/admin/lib/formValidation.ts` para regras de `required`, `double-confirm` e `inteiro positivo`.
- `UsersManagementPage` passou a validar em tempo real os dialogs de:
  - acao admin (`reason`, `note` quando obrigatoria e `double confirm`);
  - creator controls (`reason` e `cooldownHours`);
  - permissoes admin (`reason` e minimo de scopes selecionados).
- `ContentModerationPage` passou a validar em tempo real os dialogs de:
  - acao individual (`reason` + `double confirm`);
  - rollback assistido (`reason` + `double confirm`);
  - job em lote (`reason` + `double confirm`).
- feedback inline em campo (`border-destructive` + mensagem) e submit bloqueado enquanto houver erro de validacao.

Cobertura adicionada:

- `src/__tests__/features/admin/adminFormValidation.test.ts`

### P4.2-13 fechado - modo card mobile para tabelas admin (2026-03-05)

Entregue nesta iteracao:

- `UsersManagementPage` passou a renderizar lista em cards no mobile (`md:hidden`) e manter tabela densa no desktop (`md:block`).
- `ContentModerationPage` passou a renderizar queue em cards no mobile com:
  - selecao por item;
  - estado/risco essencial;
  - acoes operacionais (hide/restrict/unhide, historico e links para creator).
- `AdminAuditLogsPage` passou a renderizar eventos em cards no mobile e tabela completa no desktop.
- padrao de responsividade aplicado:
  - mobile: cards verticais com contexto e acoes;
  - desktop: tabela completa com maior densidade de dados.

Cobertura adicionada:

- `src/__tests__/features/admin/AdminAuditLogsPage.test.tsx`

### Hotfix admin route - ModuleCard icon map (2026-03-06)

Correcao aplicada em `/admin` para evitar crash em runtime/hydration:

- `AdminDashboardPage` tinha modulo `creators` disponivel em `ADMIN_MODULES`, mas sem entrada correspondente em `MODULE_ICONS`, o que produzia `Icon=undefined` no `ModuleCard`.
- foi adicionada a chave `creators` ao mapa de icones e fallback defensivo em `ModuleCard` (`MODULE_ICONS[key] ?? Shield`) para evitar regressao semelhante no futuro.

Validacao:

- `npm run typecheck:p1`
- `npm run build` (SSR + client)

## Fecho operacional do P4

Com a iteracao final de fecho admin, o P4 fica operacionalmente fechado no frontend:

1. deep-links adicionais entre dashboard, stats, queue, trust profile e jobs;
2. cobertura frontend fora do happy path para:
   - `services` em erro;
   - `hooks` criticos de invalidacao;
   - dialogs de confirmacao do rollback em lote;
3. regressao validada para os E2E criticos do control plane:
   - `admin.rollback-jobs.p4.spec.ts`;
   - `admin.worker-status.p4.spec.ts`;
4. harness E2E afinado para reduzir ruido de `Browserslist` via `BROWSERSLIST_IGNORE_OLD_DATA=1`.

Feito nesta fase:

- `AdminDashboardPage` e `StatsPage` passaram a levar o operador diretamente para trust profile, queue e jobs.
- `ContentModerationPage` passou a aceitar contexto inicial por query string (`creatorId`, `contentType`, `flaggedOnly`, `minReportPriority`, `panel`, `jobId`) sem quebrar SSR.
- `CreatorsRiskBoardPage` passou a devolver ao contexto de moderacao quando o foco nasceu da queue.
- foram adicionados testes dedicados para:
  - `adminContentService` em erro;
  - `useAdminContent` nas invalidacoes criticas;
  - guardrails do dialog de aprovacao em `ContentModerationPage`.

## Pre-release obrigatorio

Antes de producao, manter alinhado com o backend:

1. limpar bypass TLS de ambiente (`NODE_TLS_REJECT_UNAUTHORIZED=0` ou equivalente);
2. rever migracao futura de `vite-plugin-ssr` para stack suportada sem warnings legados;
3. reduzir warnings residuais deprecados de Vite/Vike (`glob as -> query`) e os future flags do React Router nos testes.
