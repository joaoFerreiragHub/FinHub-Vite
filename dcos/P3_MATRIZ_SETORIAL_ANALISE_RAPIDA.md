# P3 - Matriz Setorial da Analise Rapida

Data: 2026-02-21  
Escopo: apenas Analise Rapida (P3).  
Fonte de verdade tecnica: `API_finhub/src/utils/quickAnalysisMetrics.ts`.

## Objetivo
Definir, de forma explicita e auditavel, quais metricas sao:
- `core` (obrigatorias para o setor);
- `optional` (desejaveis, mas nao bloqueantes);
- `nao_aplicavel` (sem erro funcional para o setor).

Esta matriz e devolvida pelo backend no contrato `quickMetric*` via:
- `quickMetricCatalog[].sectorPolicy`
- `quickMetricCatalog[].sectorPriority`
- `quickMetricStates[].sectorPriority`
- `quickMetricStates[].requiredForSector`
- `quickMetricIngestion.resolvedSector`
- `quickMetricSummary.core*` e `quickMetricSummary.optional*`

## Metricas nucleares
1. `Crescimento Receita`
2. `CAGR EPS`
3. `EPS`
4. `Margem Bruta`
5. `Margem EBITDA`
6. `Margem Liquida`
7. `Margem Operacional`
8. `ROIC`
9. `ROE`
10. `P/L`
11. `P/S`
12. `PEG`
13. `Divida/EBITDA`
14. `Liquidez Corrente`
15. `Divida / Capitais Proprios`
16. `Cash Ratio`
17. `Beta`

## Matriz por setor

### Technology
- Core: todas as 17 metricas.
- Optional: nenhuma.
- Nao aplicavel: nenhuma.

### Communication Services
- Core: todas as 17 metricas.
- Optional: nenhuma.
- Nao aplicavel: nenhuma.

### Healthcare
- Core: todas as 17 metricas.
- Optional: nenhuma.
- Nao aplicavel: nenhuma.

### Financial Services
- Core:
  - `Crescimento Receita`, `EPS`, `Margem Liquida`, `Margem Operacional`,
  - `ROE`, `P/L`, `P/S`, `Divida / Capitais Proprios`, `Beta`.
- Optional:
  - `CAGR EPS`, `Margem Bruta`, `Margem EBITDA`, `PEG`, `Liquidez Corrente`, `Cash Ratio`.
- Nao aplicavel:
  - `ROIC`, `Divida/EBITDA`.

### Real Estate
- Core:
  - `Crescimento Receita`, `CAGR EPS`, `EPS`, `Margem EBITDA`, `Margem Liquida`,
  - `Margem Operacional`, `ROE`, `P/L`, `P/S`, `Divida/EBITDA`,
  - `Liquidez Corrente`, `Divida / Capitais Proprios`, `Cash Ratio`, `Beta`.
- Optional:
  - `Margem Bruta`, `ROIC`, `PEG`.
- Nao aplicavel: nenhuma.

### Industrials
- Core: todas as 17 metricas.
- Optional: nenhuma.
- Nao aplicavel: nenhuma.

### Energy
- Core: todas as metricas exceto `PEG`.
- Optional: `PEG`.
- Nao aplicavel: nenhuma.

### Consumer Defensive
- Core: todas as 17 metricas.
- Optional: nenhuma.
- Nao aplicavel: nenhuma.

### Consumer Cyclical
- Core: todas as 17 metricas.
- Optional: nenhuma.
- Nao aplicavel: nenhuma.

### Basic Materials
- Core: todas as 17 metricas.
- Optional: nenhuma.
- Nao aplicavel: nenhuma.

### Utilities
- Core: todas as metricas exceto `Margem Bruta` e `PEG`.
- Optional: `Margem Bruta`, `PEG`.
- Nao aplicavel: nenhuma.

## Normalizacao setorial (sector resolver)
Para evitar classificacao errada por texto bruto da fonte, o backend resolve `analysis sector`
com base em `sector + industry`, incluindo aliases/keywords.

Exemplos validados:
- `GOOGL`: `sectorRaw=Technology` -> `sector=Communication Services`.
- `XOM`: `sectorRaw=Energy` -> `sector=Energy`.
- `NFE`: `sectorRaw=Utilities` -> `sector=Utilities`.

## Validacao operacional cross-setor
Script de validacao (backend):
- `API_finhub/scripts/quick-metrics-sector-coverage.js`
- comando: `npm run quick-metrics:coverage -- --out=..\\FinHub-Vite\\dcos\\P3_COBERTURA_SETORIAL_QUICK_ANALYSIS.md`

Resultado mais recente (2026-02-21):
- tabela gerada em `dcos/P3_COBERTURA_SETORIAL_QUICK_ANALYSIS.md`
- 11 setores validados com 1 ticker por setor.
- cobertura core `17/17` na maioria dos setores.
- excecoes esperadas:
  - Financial Services: `ROIC` e `Divida/EBITDA` em `nao_aplicavel`.
  - Utilities: `14/15 core` + `1/2 optional`, com `2` metricas em `sem_dado_atual`.

## Nota sobre REITs
REITs continuam com toolkit dedicado.  
Na Analise Rapida, o setor `Real Estate` segue esta matriz como fallback geral.
