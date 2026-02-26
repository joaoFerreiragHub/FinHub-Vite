# Pendencias Priorizadas

Data da consolidacao: 2026-02-21 (revisto apos fecho oficial de P2 Admin-first e replaneamento de roadmap).

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

## Prioridade 2 - Fechada (Admin-first MVP)
0. P2.0 Fundacao de seguranca e governanca (bloqueante).
- RBAC granular (`admin.super`, `admin.ops`, `admin.support`) no backend e frontend.
- Audit log imutavel para todas as acoes admin (quem, quando, alvo, antes/depois, motivo).
- Controlo de risco: rate limit admin, confirmacao forte para acoes criticas e motivo obrigatorio.
- Gate de aceite: nenhuma acao critica executa sem permissao explicita e sem rasto de auditoria.
- Estado atual: FECHADO (baseline de governanca concluido e consolidado no fecho global de P2 em 2026-02-21).
  - RBAC granular ativo no backend/frontend.
  - auditoria admin estruturada e consultavel em producao (`GET /api/admin/audit-logs`).
  - guardrails de motivo/confirmacao aplicados nas acoes destrutivas dos modulos admin.

1. P2.1 Gestao de utilizadores.
- Listar/pesquisar users com filtros por role, estado e atividade.
- Suspender, banir, desbanir e forcar logout global.
- Historico de sancoes e anotacoes internas por utilizador.
- Gate de aceite: ciclo completo "encontrar user -> agir -> auditar" funcional.
- Estado atual: FECHADO (backend + frontend + validacao + confirmacao de Actions em 2026-02-20).
  - API backend entregue:
    - `GET /api/admin/users` (filtros por `search`, `role`, `accountStatus`, `adminReadOnly`, `activeSinceDays`).
    - `POST /api/admin/users/:userId/suspend`
    - `POST /api/admin/users/:userId/ban`
    - `POST /api/admin/users/:userId/unban`
    - `POST /api/admin/users/:userId/force-logout`
    - `POST /api/admin/users/:userId/notes`
    - `GET /api/admin/users/:userId/history`
  - Governanca de sessao reforcada no auth backend:
    - `tokenVersion` obrigatorio em access/refresh token.
    - bloqueio de login/refresh/autenticacao para contas `suspended` e `banned`.
    - invalidacao global de sessao via incremento de `tokenVersion`.
  - Validacao tecnica apos entrega backend:
    - `API_finhub` -> `npm run test:pre-p1` -> PASS (13 passos).
    - `API_finhub` -> `npm run typecheck` -> PASS.
    - `API_finhub` -> `npm run build` -> PASS.
  - Frontend operacional entregue:
    - pagina real `src/features/admin/pages/UsersManagementPage.tsx` (sem placeholder).
    - filtros, paginacao e listagem admin.
    - dialogos de acao com motivo obrigatorio e nota opcional.
    - historico por utilizador com consulta dedicada.
    - service/hooks/tipos novos para dominio admin users.
    - teste unitario de service admin users adicionado.
    - validacao apos entrega frontend:
      - `yarn lint` -> PASS (warnings nao bloqueantes existentes).
      - `yarn test --runInBand` -> PASS (12 suites, 112 testes).
      - `yarn build` -> PASS.
      - `yarn test:e2e` -> PASS (3/3 smoke).
  - Confirmacao remota de fecho (GitHub Actions):
    - commit `99a03f9` validado com `build` remoto `success`.
    - run `22204921602`, check run `64226562508`.

2. P2.2 Moderacao de conteudo.
- Fila de moderacao unificada (artigos, cursos, videos, lives, podcasts, books, comentarios e reviews).
- Acoes de ocultar/desocultar/restringir com motivo padronizado.
- Estados em producao: `visible`, `hidden`, `restricted` com historico.
- Gate de aceite: conteudo problematico pode ser removido da visibilidade em minutos, com rasto completo.
- Estado atual: FECHADO (backend + frontend + validacao em 2026-02-20).
  - Backend entregue:
    - estados `visible|hidden|restricted` no modelo base de conteudo, comments e reviews.
    - fila admin unificada `GET /api/admin/content/queue`.
    - acoes admin com motivo obrigatorio:
      - `POST /api/admin/content/:contentType/:contentId/hide`
      - `POST /api/admin/content/:contentType/:contentId/unhide`
      - `POST /api/admin/content/:contentType/:contentId/restrict`
    - historico por item:
      - `GET /api/admin/content/:contentType/:contentId/history`
    - trilha dedicada `ContentModerationEvent` + auditoria admin por middleware.
    - enforcement publico aplicado (itens `hidden/restricted` fora de listagens/slug e fora de comments/reviews publicos).
  - Frontend entregue:
    - `/admin/conteudo` operacional com filtros, fila, dialogos de acao e historico para conteudos, comentarios e reviews.
    - camada dedicada (`types/service/hooks`) para admin content moderation.
    - teste unitario novo para `adminContentService`.
  - Validacao do ciclo:
    - backend `typecheck + build + contract:openapi` -> PASS.
    - frontend `lint + test + build + test:e2e` -> PASS.

3. P2.3 Acesso assistido a conta com consentimento explicito.
- Sessao delegada temporaria (nao "impersonation" livre) com escopo minimo.
- Consentimento explicito do user, expiracao curta, revogacao imediata e notificacao ao utilizador.
- Banner permanente durante sessao assistida e log detalhado de todas as acoes.
- Gate de aceite: sem consentimento valido nao existe acesso assistido.
- Estado atual: FECHADO (backend + frontend + validacao em 2026-02-20).
  - Backend entregue:
    - modelos: `AssistedSession` + `AssistedSessionAuditLog`.
    - endpoints admin: `/api/admin/support/sessions` (+ `request`, `start`, `revoke`, `history`).
    - endpoints auth: `/api/auth/assisted-sessions` (+ `pending`, `active`, `consent`, `revoke`).
    - JWT com claim `assistedSession`, expiracao curta e enforce de escopo `read_only`.
    - auditoria detalhada por request em sessao assistida.
  - Frontend entregue:
    - modulo admin em `/admin/suporte`.
    - centro de consentimento/revogacao em `/conta`.
    - banner permanente durante sessao assistida.
    - teste unitario novo para `adminAssistedSessionsService`.
  - Validacao do ciclo:
    - backend `typecheck + build + contract:openapi` -> PASS.
    - frontend `lint + test + build + test:e2e` -> PASS.

4. P2.4 Metricas e observabilidade admin.
- Dashboard de utilizacao (DAU/WAU/MAU, engagement, retencao, funnel, conteudo e social).
- KPIs de moderacao (tempo medio de resolucao, volume por tipo, reincidencia).
- KPIs operacionais (erros, latencia, disponibilidade dos servicos principais).
- Gate de aceite: equipa responde perguntas de negocio e operacao sem consulta manual a BD.
- Estado atual: FECHADO (backend + frontend + validacao em 2026-02-20).
  - Backend entregue:
    - endpoint consolidado `GET /api/admin/metrics/overview` com enforcement de `admin.metrics.read` e auditoria.
    - KPIs de utilizacao (DAU/WAU/MAU, novos users, retencao 30d->7d, distribuicao por role e funnel).
    - KPIs de engagement (interacoes social 24h/7d/30d e conteudo publicado por tipo).
    - KPIs de moderacao (queue total/hidden/restricted, volume por tipo, tempo medio/mediano de resolucao e reincidencia).
    - KPIs operacionais (error rate, disponibilidade, latencia media, top rotas lentas/erro e auditoria admin 24h).
  - Frontend entregue:
    - `/admin/stats` operacional (sem placeholder) com cards, tabelas e refresh manual.
    - nova camada `types/service/hooks` (`adminMetrics`) e teste unitario `adminMetricsService`.
    - sidebar/dashboard admin atualizados para `Estatisticas` como modulo operacional.
  - Validacao do ciclo:
    - backend `typecheck + build + contract:openapi` -> PASS.
    - frontend `lint + test + build + test:e2e` -> PASS (lint com warnings nao bloqueantes conhecidos).

5. P2.5 Painel admin unificado (UI final do MVP Admin).
- Integrar users, moderacao, suporte assistido e metricas num painel unico.
- Navegacao por permissoes (mostrar/esconder modulos conforme role admin).
- Guardrails de UX para acoes destrutivas (confirmacao dupla, resumo do impacto).
- Gate de aceite: admin consegue operar o fluxo diario completo num unico painel.
- Estado atual: FECHADO (frontend + validacao em 2026-02-20).
  - Entregue:
    - `/admin` convertido em painel unificado com tabs operacionais (visao, users, conteudo, suporte, metricas e recursos quando permitido).
    - `AdminSidebar` com navegacao por escopos reais (`adminScopes`) e indicacao de read-only.
    - camada unificada de acesso em `src/features/admin/lib/access.ts`.
    - wrappers de pagina admin alinhados ao painel (inclui `/admin/suporte` em Vike).
  - Guardrails UX aplicados em acoes destrutivas:
    - users: `suspend`, `ban`, `force-logout`.
    - conteudo: `hide`, `restrict`.
    - suporte: `revoke`.
    - em todos os casos: resumo de impacto + confirmacao dupla (`CONFIRMAR`).
  - Validacao do ciclo:
    - backend `typecheck + build + contract:openapi` -> PASS.
    - frontend `lint + test + build + test:e2e` -> PASS (lint com warnings nao bloqueantes conhecidos).

6. P2.6 Hardening operacional admin.
- Suite E2E admin (positivo/negativo) para permissao, moderacao, sancao e sessao assistida.
- Alertas internos para acoes criticas (ban, hide massivo, delegated access).
- Runbook de incidentes admin + documentacao operacional.
- Gate de aceite: CI cobre os fluxos criticos admin e runbook esta validado.
- Estado atual: FECHADO (backend + frontend + validacao em 2026-02-20).
  - Entregas do fecho:
    - backend com endpoint `GET /api/admin/alerts/internal` (RBAC `admin.audit.read`) e deteccao de `ban_applied`, `content_hide_spike` e `delegated_access_started`.
    - frontend `/admin` com bloco operacional de alertas internos (resumo por severidade + lista de eventos).
    - suite `e2e/admin.p2.6.spec.ts` expandida para moderacao e suporte (start/revoke), total `8/8` testes E2E.
    - runbook operacional versionado em `dcos/RUNBOOK_ADMIN_OPERACIONAL.md`.
  - Validacao tecnica do fecho:
    - backend `typecheck + build + contract:openapi` -> PASS.
    - frontend `lint + test + build + test:e2e` -> PASS (lint com warnings nao bloqueantes conhecidos).

## Itens extra incorporados no MVP Admin
1. Tickets internos de suporte/moderacao com ligacao a user e conteudo.
2. Feature flags para rollout seguro de funcionalidades admin.
3. Regras de compliance e retencao para logs/auditoria/consentimentos.
4. Notificacoes internas para eventos criticos de risco operacional.
5. Modo `read-only` para perfis admin junior (sem acoes destrutivas).
6. Bulk actions protegidas (limites por operacao, confirmacao dupla, auditoria reforcada).

## Prioridade 3 - Critico (Analise Rapida de stocks)
Escopo oficial do P3: **apenas Analise Rapida**. A Analise Detalhada fica fora deste ciclo e passa para P4.

0. P3.0 Contrato de metricas e governacao de dados (bloqueante).
- Definir catalogo oficial de metricas por categoria (crescimento, rentabilidade, retorno sobre capital, multiplos, estrutura de capital, risco e metricas setoriais).
- Para cada metrica, documentar:
  - fonte primaria
  - fallback por ordem
  - formula de calculo quando nao vier pronta da API
  - unidade e periodicidade (`TTM`, `FY`, `Q`)
  - aplicabilidade por setor
- Introduzir semantica explicita de disponibilidade:
  - `ok`
  - `calculated`
  - `nao_aplicavel`
  - `sem_dado_atual`
  - `erro_fonte`
- Gate de aceite: contrato backend e tipos frontend alinhados para todas as metricas da Analise Rapida.

1. P3.1 Ingestao multi-fonte e normalizacao temporal.
- Harmonizar disponibilidade entre fontes (FMP `ratios-ttm`/`key-metrics-ttm`/`growth` + snapshots + fallback Yahoo).
- Resolver aliases PT/EN e variacoes de nomenclatura por setor.
- Normalizar periodo e timestamp por metrica (`asOf`, `dataPeriod`) para evitar mistura de `TTM`, `FY` e `Q`.
- Gate de aceite: endpoint da quick analysis devolve valor + periodo + fonte + estado para cada metrica alvo.
- Estado atual: ARRANQUE TECNICO CONCLUIDO.
  - contrato `quickMetric*` ativo no payload da quick analysis (`contractVersion`, `catalog`, `states`, `ingestion`, `summary`).
  - `states` ja devolvem `source`, `dataPeriod`, `benchmarkSource` e `benchmarkDataPeriod` por metrica.
  - proximo subpasso: ampliar cobertura de fontes por metrica para reduzir lacunas de valor atual.

2. P3.2 Motor de calculo para metricas atuais ausentes.
- Calcular automaticamente metricas quando os componentes estiverem disponiveis:
  - ROE
  - ROIC
  - PEG
  - Margem EBITDA
  - Divida / Capitais Proprios
  - e outras do nucleo da quick analysis.
- Regras robustas para denominadores nulos/negativos e qualidade minima de input.
- Gate de aceite: eliminar `-` nos cards quando o valor for calculavel com confianca.
- Estado atual: FECHADO.
  - motor derivado ativo com cadeia de fallback por fontes (`ratios`, `key-metrics`, historico de `ratios` e `key-metrics`) + formulas (`income`, `balance`, `cashflow`, `growth`).
  - metricas com cobertura confirmada no ciclo: ROE, ROIC, PEG, Margem EBITDA, Divida / Capitais Proprios e Payout Ratio.
  - `quickMetricStates` marca preenchimentos como `calculated` com `source` e `formula`.
  - validacao cross-setor executada com smoke de referencia (GOOGL/XOM/NFE/JPM/etc.).

3. P3.3 Regras setoriais e categorias dinamicas.
- Definir matriz setor -> categorias e metricas obrigatorias/opcionais.
- Exibir metricas setoriais relevantes e tratar `nao_aplicavel` de forma explicita (sem falso erro).
- Gate de aceite: para cada setor principal, os blocos da quick analysis mostram metricas coerentes com o negocio.
- Estado atual: VALIDACAO OPERACIONAL CONCLUIDA (amostra 11/11 setores).
  - matriz formal versionada em `dcos/P3_MATRIZ_SETORIAL_ANALISE_RAPIDA.md`.
  - tabela operacional versionada em `dcos/P3_COBERTURA_SETORIAL_QUICK_ANALYSIS.md` (1 ticker por setor).
  - contrato `quickMetric*` expandido com prioridade setorial:
    - `sectorPolicy` por metrica
    - `sectorPriority` e `requiredForSector` por estado
    - `resolvedSector` em `quickMetricIngestion`
    - cobertura `core/optional` em `quickMetricSummary`
  - normalizacao de setor por `sector + industry` implementada para evitar classificacao errada (ex.: GOOGL -> Communication Services).

4. P3.4 UX da Analise Rapida (valor atual vs benchmark).
- Clarificar visualmente origem do valor:
  - direto da fonte
  - calculado
  - benchmark/fallback
- Diferenciar no UI:
  - valor indisponivel no periodo
  - metrica nao aplicavel
  - falha tecnica da fonte
- Gate de aceite: utilizador consegue distinguir ausencia real de dado vs nao aplicabilidade.
- Estado atual: ARRANQUE TECNICO CONCLUIDO.
  - resumo de cobertura/states no bloco de quick analysis (setor resolvido + contagens por estado).
  - cards de indicadores com badge de estado por metrica (`Direto`, `Calculado`, `Nao aplicavel`, `Sem dado atual`, `Erro fonte`).
  - cards com estado `nao_aplicavel|sem_dado_atual|erro_fonte` deixam de apresentar valor ambiguo.

5. P3.5 Qualidade, validacao cruzada e fecho.
- Matriz de validacao por setores com tickers de referencia (tech, financials, energy, industrials, healthcare, utilities, consumer e real estate).
- Gatilhos de qualidade:
  - `lint`
  - `test`
  - `build`
  - `e2e`
  - smoke funcional dos endpoints de quick analysis
- Meta operacional: cobertura alta de metricas atuais nos cards nucleares sem regressao cross-setor.
- Gate de aceite: P3 fechado com documentacao de fonte/fallback/formula por metrica.

Estado atual do P3: EM CURSO (arranque tecnico ja iniciado; falta fechar cobertura e consistencia cross-setor).

## Prioridade 4 - Medio (P4 em curso)
1. Admin Editorial CMS (novo bloco formal de produto apos P2).
- objetivo: permitir seed/curadoria de conteudo e diretorios pelo admin enquanto a base de creators cresce.
- documento tecnico de referencia:
  - `dcos/P4_ADMIN_EDITORIAL_CMS.md`
- escopo resumido:
  - CRUD editorial admin para conteudos (artigos/cursos/videos/lives/podcasts/books).
  - curadoria de homepage por secoes (ordem, pin, janela temporal, show/hide).
  - diretorios verticais (corretoras, exchanges, apps, sites) com landing/show-all.
  - workflow de claim e transferencia de ownership `admin_seeded -> creator_owned`.
  - RBAC dedicado (`admin.home.curate`, `admin.directory.manage`, `admin.claim.review`, etc.) + auditoria.
- estado atual: EM CURSO (Fases A, B e C entregues; Fase D em curso com entregas frontend em 2026-02-26).
  - entregue em backend:
    - novos scopes RBAC editorial/claim/publish/archive.
    - modelos: `EditorialSection`, `EditorialSectionItem`, `DirectoryEntry`, `ClaimRequest`, `OwnershipTransferLog`.
    - extensao de `BaseContent` com `ownerType`, `sourceType`, `claimable`, `editorialVisibility`.
    - endpoints admin de secoes, diretorios, claims e ownership transfer.
    - endpoints publicos `/api/editorial/home`, `/api/editorial/:vertical`, `/api/editorial/:vertical/show-all`.
    - validacao tecnica verde: `typecheck`, `build`, `contract:openapi`.
  - entregue em frontend (Fase B):
    - novo modulo `/admin/editorial` integrado aos endpoints reais de secoes/itens (`admin/editorial/sections*`).
    - guardrails operacionais no CMS (read-only por escopo, confirmacao dupla para remocao e controlo de limite por secao).
    - preview da home curada ligado a `GET /api/editorial/home`.
    - modulo integrado ao painel admin unificado (sidebar + rota + tab embebido em `/admin`).
  - entregue em frontend (Fase C1):
    - modulo `/admin/recursos` operacional com filtros, paginacao e listagem por vertical.
    - operacoes create/update/publish/archive ligadas aos endpoints reais de diretorios.
    - guardrails para arquivamento (motivo obrigatorio + confirmacao dupla `CONFIRMAR`).
    - modulo `Recursos` marcado como operacional na camada de acesso (`admin.directory.manage` + compatibilidade legacy).
    - novo teste unitario `src/__tests__/features/admin/adminDirectoriesService.test.ts`.
  - entregue em frontend (Fase C2):
    - landing/show-all publico por vertical consolidado em:
      - `/mercados/recursos/:vertical`
      - `/mercados/recursos/:vertical/show-all`
    - integracao via `editorialPublicApi` + hooks `useEditorialPublic`.
    - teste unitario dedicado `src/__tests__/features/markets/editorialPublicApi.test.ts`.
  - entregue em frontend (Fase D1/D2):
    - creator claims em `/conta` com criar/listar/cancelar (`/api/editorial/claims*`).
    - admin claims review em `/admin/editorial` com filtros + aprovar/rejeitar (`/api/admin/claims*`).
    - transfer ownership manual em `/admin/editorial` integrado a `/api/admin/ownership/transfer`.
    - alinhamento de scopes frontend para `admin.claim.review` e `admin.claim.transfer`.
  - validacao tecnica do ciclo:
    - frontend `typecheck:p1 + lint + test --runInBand + build + test:e2e` -> PASS.
    - backend `typecheck + build + contract:openapi` -> PASS.
  - proximo foco imediato (Fase D3/E):
    - historico consultavel de ownership transfer (endpoint + UI de consulta).
    - E2E editorial completo (claim creator -> review admin -> transfer).

2. Analise detalhada de stocks (novo escopo adiado do P3).
3. Livros completos (replies, filtros, destaques, categorias) no frontend ativo.
4. Ferramentas financeiras legadas expostas no router principal (fundo emergencia, juros compostos, ETF analyzer, REIT valuation, debt snowball).
 - estado parcial (2026-02-20): REIT valuation/toolkit ja recebeu hardening tecnico (DDM com confidence gating, FFO multi-fonte com toggle NAREIT/estimativa/CF Op e score de valorizacao).
 - pendente neste item: consolidar as restantes ferramentas legadas no router principal com o mesmo nivel de rigor operacional.
5. Blocos e paginas completas de brokers/websites.
6. Eventos end-to-end (criacao, aprovacao, status e tracking).
7. Glossario financeiro.
8. Paginas dinamicas por topico.
9. Regular user dashboard e about completo.

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

## Estado de CI remoto (GitHub Actions)
1. `API_finhub` em `main`: verde.
2. `FinHub-Vite` em `master`: verde.

## Sequencia pragmatica sugerida
1. Fechar primeiro o novo P3 (hardening de analise de stocks e cobertura de metricas atuais).
2. Continuar P4 com Fase B (frontend admin de curadoria home) sobre a Fase A backend ja entregue.
3. Avancar para Fase C2 + D (landing/show-all publico + claims/ownership) no mesmo ciclo de qualidade.
4. Fechar Fase E (E2E/hardening operacional) antes de mover para os restantes itens de P4.

