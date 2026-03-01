# Plano de Melhorias Admin - Revisao Consolidada

Data: 2026-03-01
Estado: REVISTO E ALINHADO COM O CODIGO
Escopo: backend `API_finhub` + frontend `FinHub-Vite`

## Contexto

O sistema admin esta mais avancado do que os docs antigos do frontend sugeriam.

Hoje existem dois blocos P4 ativos:

1. `Admin Editorial CMS`
2. `Moderation Control Plane`

O objetivo deste documento deixa de ser "descobrir o que falta" e passa a ser:

1. separar o que ja esta entregue do que ainda e gap real;
2. priorizar hardening tecnico e operacional;
3. evitar roadmap baseado em informacao desatualizada.

## Fonte de verdade

- backend: `API_finhub/dcos/P4_MODERATION_CONTROL_PLANE.md`
- frontend: `FinHub-Vite/dcos/P4_MODERATION_CONTROL_PLANE.md`
- resumo global: `FinHub-Vite/dcos/RESUMO_EXECUTIVO.md`
- backlog priorizado: `FinHub-Vite/dcos/PENDENCIAS_PRIORIZADAS.md`
- estado implementado: `FinHub-Vite/dcos/ESTADO_IMPLEMENTADO.md`
- runbook: `FinHub-Vite/dcos/RUNBOOK_ADMIN_OPERACIONAL.md`

## Estado real resumido

### Ja entregue

- `fast hide`
- bulk moderation com guardrails
- reports de users na queue admin
- policy engine com auto-hide opcional
- creator controls
- trust scoring com false positive compensation
- deteccao automatica
- rollback assistido
- kill switches por superficie
- jobs assincronos
- drill-down operacional
- risk board / trust profile / dashboard / stats no frontend admin

### Principal problema anterior

O maior desfasamento estava na documentacao do frontend, nao no codigo.

## Classificacao final dos pontos

### Aceites

- atualizar docs principais do frontend
- criar referencia frontend ao Moderation Control Plane
- atualizar runbook com alertas e playbooks novos
- graceful shutdown do worker de jobs
- `eventId` obrigatorio para false positive com `source='rollback'`
- rate limiter em memoria como limitacao pre-release
- TTL/retencao para `AdminContentJob`
- cursor pagination na queue admin
- rate limit/cache minimo no drill-down
- indice para deteccao de jobs stale
- notificacao ao creator em hide/restrict
- E2E do Moderation Control Plane
- testes frontend fora do happy path
- thresholds de alertas mais configuraveis
- documentar precedencia `moderationStatus > editorialVisibility`

### Ajustados

- cache do trust score:
  - util, mas nao sobe acima de TTL/index/rate limit sem medir carga real
- fecho formal do P3:
  - importante para higiene de roadmap, mas nao bloqueia o hardening tecnico do P4

### Ja resolvidos no codigo

- guardrails destrutivos para kill switches e `archive`:
  - kill switches ja usam dialogo com motivo obrigatorio;
  - `archive` ja usa motivo + confirmacao dupla
- scopes nas paginas admin revistas:
  - `ContentModerationPage`
  - `CreatorsRiskBoardPage`
  - `BrandsManagementPage`

## Gaps ativos por prioridade

## Bloco 0 - Documentacao e alinhamento

### 0.1 Docs principais do frontend

Atualizar e manter coerentes:

- `RESUMO_EXECUTIVO.md`
- `PENDENCIAS_PRIORIZADAS.md`
- `ESTADO_IMPLEMENTADO.md`

Estado:

- resolvido nesta iteracao

### 0.2 Referencia frontend ao Moderation Control Plane

Evitar que o frontend dependa de descobrir o estado real no repo backend.

Estado:

- resolvido nesta iteracao com `dcos/P4_MODERATION_CONTROL_PLANE.md`

### 0.3 Runbook operacional

Cobrir alertas novos, kill switches e falhas de auto-hide.

Estado:

- resolvido nesta iteracao

## Bloco 1 - Riscos de producao

### 1.1 Graceful shutdown do worker de jobs

Problema:

- `startWorker()` arranca no processo web;
- sem `SIGTERM`/`SIGINT`, um deploy pode deixar jobs em `running` ate ficarem stale.

Accao:

1. adicionar `stopWorker()`
2. requeue imediato do job interrompido
3. ligar handlers em `server.ts`

### 1.2 Invariant de false positive rollback

Problema:

- `ContentFalsePositiveFeedback.eventId` pode ficar vazio mesmo quando `source='rollback'`

Accao:

1. validar no service
2. rejeitar com `400` quando faltar `eventId`

### 1.3 Rate limiter em memoria

Problema:

- reseta em restart;
- nao escala bem com multiplas instancias.

Accao:

1. migrar para store partilhada (`Redis`) antes de producao
2. manter documentado no pre-release enquanto nao for migrado

## Bloco 2 - Robustez tecnica

### 2.1 TTL e retencao para `AdminContentJob`

Accao:

1. adicionar `expiresAt`
2. TTL index por estado final do job

### 2.2 Indice para stale jobs

Problema:

- query de `running + startedAt < threshold` nao esta coberta por indice especifico

Accao:

1. adicionar indice `{ status: 1, startedAt: 1 }`

### 2.3 Cursor pagination na queue

Problema:

- offset pagination numa queue mutavel pode saltar ou duplicar items

Accao:

1. aceitar `cursor` no backend
2. manter compatibilidade com `page/limit`
3. migrar frontend depois

### 2.4 Rate limit e cache no drill-down

Problema:

- agregacoes caras sem limitador proprio

Accao:

1. rate limit dedicado
2. cache curta no resultado

### 2.5 Notificacao ao creator em hide/restrict

Problema:

- conteudo desaparece silenciosamente para o criador

Accao:

1. notificacao `content_moderated`
2. motivo sanitizado
3. preferencia `moderation`

### 2.6 Cache do trust score

Estado:

- opcional nesta fase

Accao:

1. medir primeiro custo real
2. so depois introduzir cache com invalidacao explicita

## Bloco 3 - Processo e cobertura

### 3.1 E2E do Moderation Control Plane

Cobrir pelo menos:

1. kill switch toggle -> superficie desativada -> reativacao
2. bulk moderation job -> progresso -> conclusao
3. rollback com false positive
4. automated signal -> review admin

### 3.2 Testes frontend alem do happy path

Cobrir:

1. services em erro
2. hooks criticos
3. dialogs de confirmacao destrutiva

### 3.3 Thresholds operacionais configuraveis

Accao:

1. mover thresholds de alertas para env/config minima
2. documentar no runbook e `.env.example`

### 3.4 Precedencia moderacao > editorial

Accao:

1. validar endpoints publicos
2. documentar a regra de governanca

### 3.5 Fecho formal do P3

Accao:

1. executar o gate final do P3 numa sessao dedicada
2. fechar nos docs quando esse gate estiver verde

## Bloco 4 - Futuro / P5

1. push notifications para a queue de moderacao
2. worker dedicado para jobs (`BullMQ` ou equivalente)
3. gestao de conflito concorrente entre admins
4. export CSV de listagens admin

## Sequencia recomendada

1. fechar docs e runbook
2. corrigir riscos reais de producao:
   - graceful shutdown
   - invariant de rollback false positive
   - TTL/index/rate limit
3. fechar cobertura:
   - E2E MCP
   - testes frontend criticos
4. documentar precedencia moderacao/editorial
5. so depois voltar ao backlog mais largo

## O que nao deve mudar

- RBAC granular
- auditoria dupla
- guardrails de bulk
- policy engine com auto-hide desligado por defeito
- creator controls graduados
- rollback assistido com verificacoes antes da reativacao
- kill switches por superficie com comportamento seguro para o cliente

## Criterio para continuar desenvolvimento

Podemos continuar desenvolvimento normal desde que:

1. o roadmap passe a olhar para os docs atualizados;
2. os gaps acima sejam tratados como hardening do P4, nao como "falta de base";
3. cada incremento continue a fechar backend, frontend, testes e documentacao no mesmo ciclo.
