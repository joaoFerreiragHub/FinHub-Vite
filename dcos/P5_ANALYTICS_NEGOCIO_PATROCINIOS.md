# P5 - Analytics de Negocio, Patrocinios e Sustentabilidade

Data: 2026-03-08
Status: PLANEADO (execution-ready v1)
Release gate: nao bloqueante para o fecho imediato de P4 funcional

## 1) Objetivo de negocio

Construir uma camada de dados e intelligence para:

1. tomar decisoes de produto com evidencia;
2. provar tracao e qualidade para patrocinadores/investidores;
3. suportar sustentabilidade economica da plataforma.

Sem este bloco, a plataforma funciona para utilizadores, mas fica fraca para:

1. negociar sponsorships com credibilidade;
2. otimizar CAC/LTV e eficiencia operacional;
3. defender prioridades de roadmap com dados auditaveis.

## 2) Limites legais e de posicionamento

1. O produto mantem foco educativo/contextual e simulacoes hipoteticas.
2. Nao fornece recomendacao financeira personalizada.
3. Analytics de AI respeita minimizacao de dados, consentimento e rastreabilidade.

## 3) KPI Tree v1 (oficial)

Legenda:

- Baseline inicial: `TBD` ate fechar 14 dias de coleta limpa.
- Meta 90d: alvo apos baseline congelado.

| Nivel | KPI | Formula canonica | Owner | Fonte principal | Cadencia | Meta 90d |
|---|---|---|---|---|---|---|
| North Star | WAEU (Weekly Active Engaged Users) | usuarios unicos/semana com >=1 acao de valor (`item_completed`, `simulation_run`, `goal_created`) | Product Lead | event model curado | semanal | +30% vs baseline |
| Growth | Onboarding Completion Rate | `onboarding_completed / onboarding_started` | Growth Lead | eventos onboarding | diario/semanal | >=55% |
| Growth | Activation D1 | novos users com >=1 acao de valor em 24h / novos users | Growth Lead | eventos + auth | diario/semanal | >=35% |
| Retencao | D7 Retention | users do dia D que regressam no dia D+7 / users do dia D | Product Analytics | cohort model | semanal | >=22% |
| Retencao | D30 Retention | users do dia D que regressam no dia D+30 / users do dia D | Product Analytics | cohort model | semanal/mensal | >=12% |
| Conteudo | Completion Rate Conteudo | `item_completed / item_opened` por tipo de conteudo | Content Lead | eventos content | semanal | >=40% media |
| Conteudo | Follow-after-Consume Rate | users com `follow_created` ate 24h apos `item_completed` / users com `item_completed` | Creator Ops | eventos social + content | semanal | >=8% |
| Sponsorship | Sponsorable Fill Rate | impressoes patrocinaveis entregues / impressoes patrocinaveis disponiveis | Revenue Lead | sponsorship events | semanal | >=70% |
| Sponsorship | Brand Safe Impression Rate | impressoes patrocinadas em contexto brand-safe / total impressoes patrocinadas | Trust & Safety | sponsorship + moderation | diario/semanal | >=98% |
| Monetizacao | Revenue per Active User | receita total periodo / ativos no periodo | Revenue Lead | faturacao + ativos | mensal | +25% vs baseline |
| Unit Economics | CAC Payback (meses) | `CAC medio por cohort / margem mensal media por user pago` | Finance Ops | spend + receita + custos | mensal | <=9 meses |
| Operacao | Moderation SLA P95 | P95(tempo entre report e resolucao) em horas | Trust & Safety | moderation events | diario/semanal | <=24h |

## 4) Contrato de eventos P5.0 v1

### 4.1 Naming canonico

Padrao obrigatorio:

`<domain>.<module>.<action>.v1`

Exemplos:

1. `auth.onboarding.started.v1`
2. `content.article.completed.v1`
3. `social.follow.created.v1`
4. `sponsorship.slot.impression.v1`

### 4.2 Envelope obrigatorio

Campos minimos por evento:

1. `eventId` (uuid)
2. `eventName` (string)
3. `eventVersion` (integer)
4. `occurredAt` (ISO datetime UTC)
5. `userId` (nullable quando anonimo)
6. `sessionId` (string)
7. `requestId` (string)
8. `platform` (`web`, `mobile`, `api`, `worker`)
9. `surface` (pagina/modulo)
10. `targetType` (nullable)
11. `targetId` (nullable)
12. `context` (objeto: `campaign`, `locale`, `segment`, `referrer`)
13. `properties` (objeto tipado por evento)

### 4.3 Catalogo minimo de eventos (v1)

| Dominio | Evento | Objetivo |
|---|---|---|
| auth | `auth.signup.completed.v1` | medir aquisicao efetiva |
| auth | `auth.login.success.v1` | medir retorno/entrada |
| onboarding | `auth.onboarding.started.v1` | inicio de funil |
| onboarding | `auth.onboarding.step_completed.v1` | drop-off por passo |
| onboarding | `auth.onboarding.completed.v1` | conclusao de funil |
| content | `content.feed.impression.v1` | exposicao de inventario |
| content | `content.item.opened.v1` | interesse inicial |
| content | `content.item.completed.v1` | consumo de valor |
| social | `social.follow.created.v1` | qualidade creator economy |
| social | `social.favorite.added.v1` | intencao de retorno |
| social | `social.comment.created.v1` | engagement profundo |
| tools | `tools.simulation.run.v1` | valor pratico da plataforma |
| dashboard | `dashboard.widget.viewed.v1` | uso de painel pessoal |
| dashboard | `dashboard.goal.created.v1` | compromisso do user |
| markets | `markets.search.executed.v1` | descoberta de ativos |
| markets | `markets.watchlist.added.v1` | intencao recorrente |
| admin | `admin.moderation.action_applied.v1` | operacao de risco |
| admin | `admin.moderation.case_resolved.v1` | SLA operacional |
| sponsorship | `sponsorship.slot.impression.v1` | inventario entregue |
| sponsorship | `sponsorship.slot.click.v1` | qualidade de atencao |
| sponsorship | `sponsorship.lead.submitted.v1` | outcome comercial |

### 4.4 Data quality gates (obrigatorios)

1. Cobertura de schema valido >= 99.5%.
2. Taxa de duplicados <= 0.5%.
3. Latencia P95 ingestao <= 5 minutos.
4. Eventos sem `eventId` ou `occurredAt` = 0.
5. Jobs diarios de reconciliacao com alerta automatico.

## 5) Scorecard de Sponsorship v1

### 5.1 Estrutura de score

| Pilar | Peso | KPI principal | Regra de score |
|---|---|---|---|
| Alcance | 25% | impressoes qualificadas e audiencia unica | escala por volume e consistencia |
| Qualidade | 25% | tempo ativo, completion, CTR contextual | penaliza trafego superficial |
| Brand Safety | 25% | brand safe impression rate + incidentes | corte automatico se <95% |
| Outcome | 15% | leads/acoes apos exposicao | score por conversao assistida |
| Confianca Operacional | 10% | SLA reporte + auditabilidade | score maximo so com logs completos |

### 5.2 Pacote mensal para patrocinador

Entregaveis obrigatorios:

1. Audience snapshot (alcance, frequencia, segmentos anonimizados).
2. Quality snapshot (tempo medio, completion, engagement util).
3. Brand safety report (incidentes, exposicao afetada, mitigacao).
4. Outcome report (cliques, leads, conversoes assistidas).
5. Appendix tecnico (metodologia, definicoes KPI, janela temporal).

## 6) Plano de execucao 12 semanas

### Onda A (Semanas 1-4): Fundacao P5.0 + KPI tree ativa

1. Fechar contrato de eventos e publicar dicionario de dados.
2. Instrumentar eventos minimos em onboarding, conteudo, social, dashboard, admin.
3. Ativar pipeline de validacao e reconciliacao.
4. Congelar definicoes dos 12 KPIs oficiais.

Gate de saida:

1. cobertura de eventos minimos >= 90% nas superficies alvo;
2. data quality gates ativos em CI/cron;
3. dashboard executivo v0 em producao interna.

### Onda B (Semanas 5-8): Product analytics + sponsorship readiness v1

1. Cohorts D1/D7/D30 com segmentacao basica.
2. Funis completos: onboarding e consume -> engage -> follow.
3. Scorecard sponsorship v1 e primeiro pack mensal interno.

Gate de saida:

1. 12 KPIs com baseline validado;
2. sponsorship scorecard gerado de forma automatica;
3. alertas de queda para 4 KPIs criticos.

### Onda C (Semanas 9-12): Unit economics + BI operacional

1. CAC payback, receita por ativo e margem por linha.
2. Dashboards por area (produto, growth, revenue, trust).
3. Ritual semanal formal com decisao baseada em scorecard.

Gate de saida:

1. pacote executivo mensal completo;
2. backlog de produto priorizado com base em dados;
3. processo de sponsorship pronto para negociacao externa.

## 7) Modelo de ownership e governanca

### 7.1 Owners minimos

1. Product Lead: North Star + retencao.
2. Growth Lead: aquisicao, onboarding, ativacao.
3. Content/Creator Lead: economia de conteudo e creators.
4. Revenue Lead: sponsorship + monetizacao.
5. Trust & Safety: brand safety e SLA operacionais.
6. Data/Analytics Lead: taxonomia, qualidade e semantic layer.

### 7.2 Rituais

1. Weekly business review (60 min): variacao de KPI, alertas e decisoes.
2. Monthly sponsorship review: scorecard e readiness comercial.
3. Quarterly KPI reset: revisao de metas, pesos e trade-offs.

## 8) Criterios de aceite (Definition of Done P5)

1. KPI tree oficial com formula unica e owner definido.
2. Contrato de eventos v1 aplicado nas superficies nucleares.
3. Data quality gates monitorizados com alerta automatico.
4. Scorecard sponsorship v1 gerado mensalmente.
5. Decisoes de roadmap com rasto explicito de KPI impactado.
6. Compliance validado para coleta, retencao e uso de dados.

## 9) Riscos e mitigacao

1. Risco: excesso de dados sem foco.
   Mitigacao: limitar a 12 KPIs oficiais e backlog por impacto.
2. Risco: vanity metrics a dominar decisoes.
   Mitigacao: priorizar KPI ligados a retencao, receita e custo.
3. Risco: complexidade tecnica prematura.
   Mitigacao: evolucao por ondas com gates de saida claros.
4. Risco: risco legal/privacidade.
   Mitigacao: minimizacao de dados, consentimento e auditoria por defeito.

## 10) Primeiros 30 dias (tarefas concretas)

1. Publicar `event_dictionary_v1` com schema por evento.
2. Instrumentar 21 eventos minimos listados na secao 4.3.
3. Criar tabela curada `kpi_daily_snapshot`.
4. Subir dashboard executivo v0 com os 12 KPIs.
5. Validar primeira baseline de 14 dias.
6. Emitir primeiro `sponsorship_pack_internal_v1`.
