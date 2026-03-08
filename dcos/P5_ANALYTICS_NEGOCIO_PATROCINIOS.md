# P5 - Analytics de Negocio, Patrocinios e Sustentabilidade

Data: 2026-03-08
Status: PLANEADO (nao bloqueante para o fecho imediato de P4 funcional)

## 1) Objetivo de negocio

Construir uma camada de dados e intelligence que permita:

1. tomar decisoes de produto com evidencia;
2. provar tracao e qualidade para patrocinadores/investidores;
3. manter sustentabilidade economica da plataforma no longo prazo.

Sem este bloco, a plataforma pode funcionar para utilizadores, mas fica fraca para:

- negociar sponsorships com credibilidade;
- otimizar CAC/LTV e eficiencia operacional;
- justificar roadmap com dados reais de impacto.

## 2) Limite legal e de posicionamento

1. O produto mantem foco educativo/contextual e simulacoes hipoteticas.
2. Nao entra em recomendacao financeira personalizada.
3. Qualquer analytics de AI deve respeitar minimizacao de dados e consentimento.

## 3) Facetas criticas que faltam para competitividade

| Faceta | Porque importa | Dados/KPIs que faltam | Prioridade |
|---|---|---|---|
| Aqusicao e ativacao | sem isto nao ha escala previsivel | source/medium/campaign, onboarding funnel, activation rate D1 | Alta |
| Retencao e engagement | define produto com "stickiness" real | DAU/WAU/MAU, retention D1/D7/D30, cohort por segmento | Alta |
| Economia de conteudo | mostra valor do ecossistema creator | tempo de leitura/watch, completion rate, follow-after-consume | Alta |
| Qualidade do catalogo | evita inflacao de conteudo sem impacto | CTR por modulo, save rate, revisit rate, bounce por pagina | Media |
| Operacao admin/moderacao | reduz risco e custo operacional | SLA de moderacao, false positive cost, reincidencia por creator | Alta |
| Receita e patrocinio | transforma tracao em monetizacao | inventario patrocinavel, fill rate, eCPM/eCPC, revenue per active user | Alta |
| Saude financeira da plataforma | garante sobrevivencia | CAC, payback, margem por linha de produto, burn multiple | Alta |
| Confianca/compliance | protege marca e deals B2B | incidentes, tempo de resposta, audit completeness, consent coverage | Alta |
| Segmentacao e personalizacao | melhora conversao sem dark patterns | segmentos comportamentais, propensao por acao, uplift por experiencia | Media |
| BI executivo para decisao | acelera gestao semanal/mensal | scorecards por area, metas vs real, alertas de desvio | Alta |

## 4) Modelo de dados alvo (alto nivel)

### 4.1 Taxonomia unica de eventos
1. naming canonico por dominio (`auth`, `content`, `social`, `admin`, `markets`, `tools`, `billing`).
2. envelope comum:
- `eventId`, `userId`, `sessionId`, `timestamp`
- `surface`, `module`, `action`
- `targetType`, `targetId`
- `context` (campanha, segmento, plataforma, locale)

### 4.2 Camadas de armazenamento
1. eventos brutos (append-only).
2. modelo curado para analytics de produto/negocio.
3. semantic layer com definicoes unicas de KPI (evita metricas contraditorias).

### 4.3 Governanca
1. dicionario de dados com owner por KPI.
2. qualidade de dados com monitorizacao de frescura, completude e duplicados.
3. politica de retencao por tipo de dado e risco.

## 5) Blocos de execucao P5

### P5.0 Fundacao de instrumentacao (bloqueante interno)
1. taxonomia de eventos e versionamento.
2. tracking unificado frontend + backend + jobs admin.
3. validacao automatica de schema de evento.

### P5.1 Product analytics core
1. funil de aquisicao e onboarding.
2. ativacao inicial por caso de uso (conteudo, tools, dashboard).
3. retencao por cohort (D1/D7/D30).

### P5.2 Conteudo, creators e social economics
1. funil consume -> engage -> follow -> return.
2. qualidade por tipo de conteudo e por creator.
3. indicadores de rede social util (nao vanity).

### P5.3 Sponsorship readiness
1. inventario de superficies patrocinaveis.
2. perfis de audiencia anonimizados por segmento.
3. relatorio de brand safety e qualidade de contexto.

### P5.4 Monetizacao e unit economics
1. CAC/LTV por canal e por segmento.
2. receita por utilizador ativo e por modulo.
3. margens e custos operacionais por area.

### P5.5 BI executivo e operacao
1. scorecards semanais e mensais.
2. alertas de anomalia (queda de retencao, subida de churn, aumento de custo).
3. dashboards dedicados para produto, growth, operacao e direcao.

## 6) Entregaveis minimos por fase

Fase A (4-6 semanas):

1. taxonomia de eventos e tracking base em producao.
2. funil onboarding + retention cohorts.
3. dashboard executivo minimo (10 KPIs nucleares).

Fase B (6-8 semanas):

1. metricas de conteudo/creator completas.
2. pacote sponsorship readiness v1.
3. alertas operacionais e de negocio.

Fase C (continuo):

1. modelo preditivo de risco de churn e propensity de engagement.
2. experimentacao controlada (A/B) para crescimento sustentavel.
3. otimzacao de inventario patrocinado e revenue quality.

## 7) Criterios de aceite (Definition of Done)

1. KPIs oficiais com formula unica e owner definido.
2. dados com qualidade auditavel (sem discrepancias criticas entre fontes).
3. dashboards usados em ritual semanal de decisao.
4. sponsorship pack exportavel com metricas de audiencia e brand safety.
5. gate de privacidade/compliance validado para coleta e uso de dados.

## 8) Riscos e mitigacao

1. Risco: recolher dados demais e aumentar superficie legal.
- mitigacao: minimizacao por design + retention policy.
2. Risco: vanity metrics sem impacto de negocio.
- mitigacao: KPI tree ligada a receita, retencao e custo.
3. Risco: stack de dados complexa cedo demais.
- mitigacao: comecar lean e evoluir por fases com ROI claro.

## 9) Proximo passo recomendado

1. fechar o contrato de eventos P5.0.
2. escolher os 10 KPIs executivos obrigatorios.
3. implementar tracking nos fluxos de maior impacto (onboarding, dashboard, conteudo, social, admin).
