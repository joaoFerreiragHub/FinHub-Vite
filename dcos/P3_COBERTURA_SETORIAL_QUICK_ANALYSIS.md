# P3 - Cobertura Setorial da Analise Rapida

Data: 2026-02-22

| Setor esperado | Ticker | Setor resolvido | Core | Optional | Calculado | Nao aplicavel | Sem dado atual | Erro fonte | Observacao |
|---|---|---|---:|---:|---:|---:|---:|---:|---|
| Technology | AAPL | Technology | 17/17 | 0/0 | 5 | 0 | 0 | 0 | ok |
| Communication Services | GOOGL | Communication Services | 17/17 | 0/0 | 5 | 0 | 0 | 0 | ok |
| Healthcare | JNJ | Healthcare | 17/17 | 0/0 | 5 | 0 | 0 | 0 | ok |
| Financial Services | JPM | Financial Services | 9/9 | 6/6 | 4 | 2 | 0 | 0 | ok |
| Real Estate | PLD | Real Estate | 14/14 | 3/3 | 5 | 0 | 0 | 0 | ok |
| Industrials | CAT | Industrials | 17/17 | 0/0 | 5 | 0 | 0 | 0 | ok |
| Energy | XOM | Energy | 16/16 | 1/1 | 5 | 0 | 0 | 0 | ok |
| Consumer Defensive | PG | Consumer Defensive | 17/17 | 0/0 | 5 | 0 | 0 | 0 | ok |
| Consumer Cyclical | AMZN | Consumer Cyclical | 17/17 | 0/0 | 5 | 0 | 0 | 0 | ok |
| Basic Materials | LIN | Basic Materials | 17/17 | 0/0 | 5 | 0 | 0 | 0 | ok |
| Utilities | NFE | Utilities | 14/15 | 1/2 | 4 | 0 | 2 | 0 | ok |

Legenda:
- Core/Optional: cobertura por prioridade setorial no `quickMetricSummary`.
- Calculado/Nao aplicavel/Sem dado atual/Erro fonte: contagem total por estado no payload.

## Atualizacao de governance (2026-02-22)

1. Score contextual por setor ativo no payload:
- `sectorContextScore.score` (0-100)
- `sectorContextScore.confidence` (0-100)
- `sectorContextScore.coreCoverage`
- `sectorContextScore.benchmarkComparableCore`
- `sectorContextScore.favorableVsBenchmarkCore`

2. Score de qualidade de dados ativo no payload:
- `dataQualityScore.score` (0-100)
- `dataQualityScore.directRate`
- `dataQualityScore.calculatedRate`
- `dataQualityScore.missingRate`

3. Politica de exibicao (anti-dado falso):
- fallback visual padrao para indisponivel: `—`
- `0` so e exibido quando vier do dado real (nao por default de mapping)
- estado de metrica governa a UI:
  - `nao_aplicavel` -> `N/A`
  - `sem_dado_atual` -> `-`
  - `erro_fonte` -> `-`

## Evidencia de smoke atual

- Ticker validado: `GOOGL` (Communication Services)
- Resultado observado no endpoint quick-analysis:
  - `ROE`: presente (`35.00%`, `calculated.from_fmp_endpoints`)
  - `ROIC`: presente (`26.21%`, `calculated.from_fmp_endpoints`)
  - `Dívida / Capitais Próprios`: presente (`0.17`, `calculated.from_balance_sheet`)
  - `Payout Ratio`: presente (`7.60%`)
  - `sectorContextScore` e `dataQualityScore`: presentes

## Cenario recomendado para avancar (todos os setores)

1. Tratar `quickMetricStates` como unica fonte de verdade da qualidade por metrica.
2. Bloquear defaults numericos artificiais no frontend setorial (somente `—`/`N/A` quando faltante).
3. Priorizar cobertura `core` por setor antes de expandir metricas opcionais.
4. Fechar P3 com gate tecnico unico: `typecheck + lint + test + build + e2e + smoke cross-setor`.
