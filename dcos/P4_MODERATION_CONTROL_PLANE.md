# P4 Moderation Control Plane - Frontend

Data de consolidacao: 2026-03-01
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

## O que ainda falta antes de fechar o P4

1. E2E dedicados aos fluxos novos do Moderation Control Plane.
2. Mais testes frontend fora do happy path:
   - services em erro;
   - hooks criticos;
   - dialogs de confirmacao.
3. Deep-links adicionais entre dashboard, queue, trust profile e jobs.
4. Expansao dos kill switches para superficies adicionais (`creator page`, `search`, `feeds`).

## Pre-release obrigatorio

Antes de producao, manter alinhado com o backend:

1. limpar bypass TLS de ambiente (`NODE_TLS_REJECT_UNAUTHORIZED=0` ou equivalente);
2. fechar runbook operacional para alertas novos;
3. garantir cobertura minima de E2E para os fluxos criticos do control plane.
