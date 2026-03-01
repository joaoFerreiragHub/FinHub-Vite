# Runbook Operacional Admin (P2.6)

Data: 2026-03-01  
Escopo: operacao administrativa critica (users, moderacao de conteudo, control plane, acesso assistido)

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
- `critical_report_target` (high/critical)
  - origem: alvo com pressao de reports e prioridade agregada critica.
  - impacto: risco de conteudo perigoso ainda visivel.
- `policy_auto_hide_triggered` (high)
  - origem: policy engine disparou `hide-fast` tecnico preventivo.
  - impacto: conteudo foi retirado da superficie publica antes de revisao humana final.
- `policy_auto_hide_failed` (critical)
  - origem: policy recomendou auto-hide, mas a execucao falhou.
  - impacto: possivel conteudo de alto risco ainda exposto.
- `creator_control_applied` (high)
  - origem: aplicacao de cooldown, block creation, block publishing ou suspend ops a creator.
  - impacto: restricao operacional de creator com potencial impacto em publicacao.
- `automated_detection_high_risk` (high/critical)
  - origem: deteccao automatica de `spam`, `suspicious_link`, `flood` ou `mass_creation` com severidade alta.
  - impacto: conteudo ou creator sob forte suspeita antes da revisao final.
- `automated_detection_auto_hide_triggered` (high)
  - origem: a automacao tecnica ocultou preventivamente um alvo sinalizado.
  - impacto: resposta automatica executada com sucesso.
- `automated_detection_auto_hide_failed` (critical)
  - origem: auto-hide tecnico falhou apos deteccao automatica de alto risco.
  - impacto: incidente potencialmente exposto e requer triagem imediata.

## 4) SLA interno de resposta
- `critical`: triagem em ate 15 minutos.
- `high`: triagem em ate 30 minutos.
- `medium`: triagem em ate 4 horas.
- `policy_auto_hide_failed` e `automated_detection_auto_hide_failed`: tratar sempre com SLA efetivo de `critical`, mesmo quando o contexto pareca localizado.

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

### 6.4 Alvo critico por reports (`critical_report_target`)
1. Abrir `/admin/conteudo` com filtro por reports/priority.
2. Validar `reportSignals`, `policySignals` e `creatorTrustSignals`.
3. Se o alvo continuar publico e o risco for real:
   - aplicar `hide-fast` ou `restrict`;
   - rever historico e reports relacionados.
4. Se for falso positivo:
   - registar nota de revisao;
   - evitar acao destrutiva sem evidencias adicionais.

### 6.5 Auto-hide da policy disparado (`policy_auto_hide_triggered`)
1. Confirmar que o alvo ficou `hidden` e que existe evento tecnico auditado.
2. Rever motivo dominante, reporters unicos e contexto do creator.
3. Validar se a acao automatica foi apropriada:
   - manter `hidden` e seguir revisao;
   - ou executar rollback assistido se a policy exagerou.
4. Se houver padrao de falso positivo, registar no backlog de tuning da policy.

### 6.6 Falha no auto-hide da policy (`policy_auto_hide_failed`)
1. Tratar como incidente `critical`.
2. Abrir imediatamente o alvo na queue admin e validar se continua publico.
3. Executar contencao manual (`hide-fast`, `restrict` ou kill switch da superficie) se o risco se confirmar.
4. Recolher:
   - requestId;
   - actor tecnico;
   - motivo de falha;
   - alvo afetado.
5. Escalar para responsavel tecnico da plataforma no mesmo turno.

### 6.7 Creator control aplicado (`creator_control_applied`)
1. Confirmar o tipo de controlo aplicado e a razao operacional.
2. Verificar se o creator tem trust score degradado, reports ou deteccao automatica recente.
3. Se a acao foi excessiva:
   - aliviar o controlo adequado;
   - registar justificacao e follow-up.
4. Se a acao foi correta:
   - manter monitorizacao do creator;
   - rever necessidade de escalar para sancao de conta.

### 6.8 Deteccao automatica de alto risco (`automated_detection_high_risk`)
1. Abrir o alvo na queue admin.
2. Rever regras disparadas, severidade e superficie afetada.
3. Confirmar se houve impacto publico:
   - se sim, conter com `hide-fast`, `restrict` ou kill switch;
   - se nao, manter observacao e validar reincidencia do creator.
4. Se a regra estiver a gerar ruido, registar para tuning de thresholds.

### 6.9 Auto-hide tecnico bem-sucedido (`automated_detection_auto_hide_triggered`)
1. Confirmar que o alvo foi ocultado e ficou em fila de revisao humana.
2. Rever `triggeredRules`, severidade e creator trust.
3. Decidir manter ocultado, restringir mais ou reverter com rollback assistido.

### 6.10 Falha no auto-hide tecnico (`automated_detection_auto_hide_failed`)
1. Tratar como incidente `critical`.
2. Avaliar se o alvo continua publico.
3. Se o risco for real, conter manualmente no momento.
4. Registar causa raiz tecnica e abrir item de follow-up para fiabilidade da automacao.

### 6.11 Kill switches por superficie
1. Confirmar que a superficie correta foi desligada:
   - `editorial_home`
   - `editorial_verticals`
   - `comments_read`
   - `comments_write`
   - `reviews_read`
   - `reviews_write`
2. Validar o impacto esperado no frontend publico.
3. Preencher sempre:
   - motivo;
   - nota interna;
   - mensagem publica.
4. Reativar apenas quando:
   - incidente contido;
   - backlog triado;
   - owner operacional alinhado.

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
  - `yarn test:e2e` ou specs admin direcionados quando a suite full nao for necessaria
