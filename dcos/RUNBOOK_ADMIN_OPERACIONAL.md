# Runbook Operacional Admin (P2.6)

Data: 2026-02-20  
Escopo: operacao administrativa critica (users, moderacao de conteudo, acesso assistido)

## 1) Objetivo
- Reduzir tempo de detecao e resposta para eventos admin de risco.
- Uniformizar triagem entre backend (`API_finhub`) e frontend (`FinHub-Vite`).
- Garantir rastreabilidade para compliance via auditoria.

## 2) Fontes de verdade operacionais
- Dashboard admin (`/admin`) -> bloco "Alertas internos".
- API de alertas internos:
  - `GET /api/admin/alerts/internal`
  - escopo requerido: `admin.audit.read`
- Auditoria admin:
  - `GET /api/admin/audit-logs`
- Historicos especializados:
  - users: `GET /api/admin/users/:userId/history`
  - conteudo: `GET /api/admin/content/:contentType/:contentId/history`
  - suporte: `GET /api/admin/support/sessions/:sessionId/history`

## 3) Tipos de alerta e severidade
- `ban_applied` (critical)
  - origem: acao `admin.users.ban` com `outcome=success`.
  - impacto: conta alvo removida de operacao normal.
- `content_hide_spike` (high/critical)
  - origem: acao `admin.content.hide` em volume acima do threshold.
  - threshold atual: `>= 5` ocultacoes em `30` minutos por actor.
  - sobe para `critical` quando >= `10` ocultacoes na mesma janela.
- `delegated_access_started` (high)
  - origem: acao `admin.support.sessions.start` com `outcome=success`.
  - impacto: inicio de sessao assistida delegada.

## 4) SLA interno de resposta
- `critical`: triagem em ate 15 minutos.
- `high`: triagem em ate 30 minutos.
- `medium`: triagem em ate 4 horas.

## 5) Fluxo de triagem (primeiros 15 min)
1. Confirmar alerta no dashboard (`/admin`) e capturar timestamp.
2. Abrir log de auditoria correspondente (`/api/admin/audit-logs`) por `action` + `requestId`.
3. Correlacionar actor, target e motivo (`reason`) na acao original.
4. Classificar: legitimo, suspeito ou incidente.
5. Aplicar acao imediata:
   - legitimo: registar observacao e monitorizar.
   - suspeito/incidente: conter acesso (read-only/suspensao) e escalar.

## 6) Playbooks por alerta
### 6.1 Banimento aplicado (`ban_applied`)
1. Verificar motivo e historico do user alvo.
2. Validar se o actor tinha escopo `admin.users.write`.
3. Se acao indevida:
   - reverter com `POST /api/admin/users/:userId/unban` (motivo obrigatorio).
   - adicionar nota interna (`/notes`) com contexto do incidente.

### 6.2 Spike de ocultacao (`content_hide_spike`)
1. Inspecionar lote afetado no modulo `/admin/conteudo`.
2. Validar padrao (mesmo actor, janela curta, targets correlacionados).
3. Se indevido:
   - reativar itens validos com `unhide`.
   - degradar actor para `read-only` ou suspender temporariamente.
4. Registar causa raiz e acoes preventivas.

### 6.3 Sessao delegada iniciada (`delegated_access_started`)
1. Confirmar consentimento valido e TTL curto.
2. Confirmar target user correto.
3. Se suspeito:
   - revogar imediatamente `POST /api/admin/support/sessions/:sessionId/revoke`.
   - forcar renovacao de sessao admin e registar incidente.

## 7) Escalacao
- Nivel 1: operador admin em turno.
- Nivel 2: responsavel de operacao/plataforma (quando `critical` ou repeticao).
- Nivel 3: responsavel de produto/compliance (impacto em contas reais).

## 8) Evidencias minimas para encerramento
- ID do alerta e timestamp.
- `requestId` + actor + target.
- Decisao tomada e motivo.
- Acao de mitigacao aplicada.
- Estado final (resolvido, falso positivo, incidente aberto).

## 9) Validacao tecnica do runbook
- Backend:
  - `npm run typecheck`
  - `npm run build`
  - `npm run contract:openapi`
- Frontend:
  - `yarn lint`
  - `yarn test --runInBand`
  - `yarn build`
  - `yarn test:e2e`

