# F1 - REIT Subtype Detector

Data: 2026-03-12
Estado: **IMPLEMENTADO E CONCLUIDO**
Commits: backend `e441e17` (API_finhub/main) + frontend `9569b16` (FinHub-Vite/master)

## Desvios e descobertas pos-implementacao (dados FMP reais)

- VICI industry = "REIT - Diversified" (spec assumia "REIT - Specialty") — coberto por `gamingNetLease` name-check ✓
- O e NNN tem EBITDA real no FMP (nao sentinel zero) — `netLeaseNames` desacoplado de `ebitdaIsSentinel` ✓
- VICI `totalDebt = 0` e sentinel estrutural (FMP nao suporta lessor ASC 842 em nenhum plano, incluindo as-reported) ✓
- `interestCoverage = EBITDA / interestExpense` adicionado como proxy quando `totalDebt` e sentinel:
  VICI 4.45x, NNN 4.25x, GLPI 4.04x — confirmados via FMP.
- Scoring usa coverage quando `debtToEbitda = null`; thresholds: >6x→90, >4x→75, >2x→50, >1.5x→25.
- Frontend adapta label ("Cob. de Juros"), cor (verde >4x) e tooltip automaticamente.

---

## Contexto e motivacao

O scoring do REIT Toolkit usa as mesmas 4 metricas (P/FFO, Payout, Div./EBITDA, vs. ECO NAV)
para todos os equity REITs. Isto produz resultados distorcidos porque:

- **Net-lease REITs** (O, VICI, NNN, GLPI): o EBITDA nao e reportado diretamente pelo FMP
  (sentinel zero); a metrica relevante e Debt/FFO ou Net Debt / EBITDAre reportado pela empresa.
- **Specialty-tech REITs** (EQIX, DLR, AMT, CCI): D&A inclui equipamentos e infraestrutura
  nao-imobiliaria, o que faz o FFO simplificado sobrestimar o FFO real; P/AFFO seria mais correto.
- **Healthcare REITs** (VTR, WELL, PEAK): estrutura mista de net-lease + operating properties;
  a cobertura de renda dos tenants e mais informativa do que Div./EBITDA.
- **mREITs** (AGNC, NLY, STWD): FFO nao se aplica; o score inteiro nao faz sentido.
- **Standard REITs** (PLD, EQR, SPG, KIM): estrutura convencional; metricas atuais funcionam bem.

O objetivo e devolver um campo `reitSubtype` no endpoint `/reits/calculateFFO` e usar esse campo
no frontend para ajustar pesos, labels e visibilidade de metricas — sem alterar o comportamento
para os casos standard.

---

## 1. Contrato de resposta (backend)

### Novo campo em `calculateFFO`

```typescript
reitSubtype: ReitSubtype        // sempre presente na resposta
reitSubtypeConfidence: 'high' | 'medium' | 'low'  // fiabilidade da deteção
reitSubtypeReasons: string[]    // trace para debug / UI tooltip
```

### Tipo

```typescript
type ReitSubtype =
  | 'net-lease'       // O, VICI, NNN, GLPI, EPRT, ADC
  | 'mortgage'        // AGNC, NLY, STWD, BXMT
  | 'specialty-tech'  // EQIX, DLR, AMT, CCI, SBAC
  | 'healthcare'      // VTR, WELL, PEAK, OHI
  | 'hotel'           // HST, RHP, PK
  | 'standard'        // PLD, EQR, SPG, KIM, O (fallback)
```

---

## 2. Algoritmo de deteção (backend — `detectReitSubtype`)

Ficheiro: `API_finhub/src/controllers/reit.controller.ts`
Inserir antes do bloco `// Classificacao do tipo de REIT` na funcao `calculateFFO` (linha ~390).

```typescript
type ReitSubtype = 'net-lease' | 'mortgage' | 'specialty-tech' | 'healthcare' | 'hotel' | 'standard'

function detectReitSubtype(
  industry: string,
  companyName: string,
  ebitdaRaw: number | null,       // valor original antes do plausibleOrNull
  debtToEbitda: number | null,    // calculado (pode ser via fallback)
  ffoSource: FfoSource,
): { subtype: ReitSubtype; confidence: 'high' | 'medium' | 'low'; reasons: string[] } {
  const reasons: string[] = []
  const ind = industry.toLowerCase()
  const name = companyName.toLowerCase()

  // 1. Mortgage REIT — alta confiança (ffoSource já o indica)
  if (ffoSource === 'not-applicable' || /mortgage/i.test(industry)) {
    return { subtype: 'mortgage', confidence: 'high', reasons: ['ffoSource: not-applicable ou industry contém mortgage'] }
  }

  // 2. Specialty-tech — torres de telecomunicação e data centers
  // FMP: industry = "REIT - Specialty" para EQIX, DLR, AMT, CCI, SBAC
  // Diferencia de net-lease gaming (VICI) que tambem é "REIT - Specialty"
  if (/specialty/i.test(industry)) {
    const isGaming = /vici|gaming|casino|entertainment/i.test(name)
    if (!isGaming) {
      reasons.push(`industry = "${industry}" sem indicadores gaming`)
      return { subtype: 'specialty-tech', confidence: 'high', reasons }
    }
    // VICI e similares caem em net-lease abaixo
    reasons.push(`industry = "${industry}" com indicadores gaming → net-lease`)
  }

  // 3. Healthcare
  if (/healthcare/i.test(industry)) {
    reasons.push(`industry = "${industry}"`)
    return { subtype: 'healthcare', confidence: 'high', reasons }
  }

  // 4. Hotel
  if (/hotel|motel/i.test(industry)) {
    reasons.push(`industry = "${industry}"`)
    return { subtype: 'hotel', confidence: 'high', reasons }
  }

  // 5. Net-lease
  // Sinal primario: EBITDA e sentinel (0) no FMP — tipico de net-lease e gaming net-lease
  // REITs standard (SPG, PLD) reportam EBITDA normalmente; net-lease nao o fazem
  // Sinal secundario: nome da empresa ou industry = Retail sem EBITDA
  const ebitdaIsSentinel = ebitdaRaw === 0  // antes do plausibleOrNull
  const netLeaseNames = /realty income|national retail|store capital|agree|essential|broadstone|gaming & leisure/i.test(name)
  const retailNoEbitda = /retail/i.test(industry) && ebitdaIsSentinel
  const gamingNetLease = /gaming|casino|vici/i.test(name)

  if (ebitdaIsSentinel && (netLeaseNames || retailNoEbitda || gamingNetLease || reasons.length > 0)) {
    if (ebitdaIsSentinel) reasons.push('EBITDA = 0 (sentinel FMP — net-lease nao reporta EBITDA direto)')
    if (netLeaseNames) reasons.push('nome da empresa indica net-lease')
    if (gamingNetLease) reasons.push('gaming net-lease REIT')
    const confidence = (netLeaseNames || gamingNetLease) ? 'high' : 'medium'
    return { subtype: 'net-lease', confidence, reasons }
  }

  // 6. Standard — fallback
  reasons.push('nenhum sinal especifico detetado')
  return { subtype: 'standard', confidence: 'medium', reasons }
}
```

### Onde chamar (em `calculateFFO`)

Chamar **depois** de calcular `debtToEbitda` e **antes** do bloco `res.json(...)`:

```typescript
// Apos calcular debtToEbitda (~linha 453)
const ebitdaRawForSubtype = income.ebitda ?? 0  // valor original antes do plausibleOrNull
const subtypeResult = detectReitSubtype(
  industry,
  profile.companyName ?? '',
  ebitdaRawForSubtype,
  debtToEbitda,
  ffoSource,
)
```

### Adicionar ao `res.json()`

```typescript
reitSubtype: subtypeResult.subtype,
reitSubtypeConfidence: subtypeResult.confidence,
reitSubtypeReasons: subtypeResult.reasons,
```

---

## 3. Tipo TypeScript frontend

Ficheiro: `FinHub-Vite/src/features/markets/services/marketToolsApi.ts`

Adicionar ao tipo `ReitFfoResponse`:

```typescript
reitSubtype?: 'net-lease' | 'mortgage' | 'specialty-tech' | 'healthcare' | 'hotel' | 'standard'
reitSubtypeConfidence?: 'high' | 'medium' | 'low'
reitSubtypeReasons?: string[]
```

---

## 4. Uso no frontend (ReitsToolkitPage.tsx)

### 4a. Pesos por subtipo

Substituir / expandir `WEIGHT_PROFILES` para cobrir subtipos:

```typescript
const SUBTYPE_WEIGHTS: Record<
  'net-lease' | 'mortgage' | 'specialty-tech' | 'healthcare' | 'hotel' | 'standard',
  { pFFO: number; payout: number; debt: number; nav: number }
> = {
  'net-lease':      { pFFO: 0.25, payout: 0.30, debt: 0.10, nav: 0.35 },
  // debt baixo: Div./EBITDA pouco fiavel; payout alto: distribuicao e a metrica core
  // nav alto: ECO NAV e o melhor indicador de desconto/premio para net-lease

  'mortgage':       { pFFO: 0.00, payout: 0.00, debt: 0.00, nav: 0.00 },
  // score nao calculado para mREITs (pFFO sera null → computeValuationScore retorna null)

  'specialty-tech': { pFFO: 0.40, payout: 0.15, debt: 0.30, nav: 0.15 },
  // pFFO alto: P/FFO e a metrica mais usada mesmo com FFO sobrestimado
  // debt alto: alavancagem critica para data centers (CAPEX intensivo)
  // nav baixo: ECO NAV menos fiavel (D&A de equipamentos distorce NOI proxy)

  'healthcare':     { pFFO: 0.30, payout: 0.25, debt: 0.20, nav: 0.25 },
  // equilibrado; cobertura de renda nao disponivel no FMP, usa Div./EBITDA como proxy

  'hotel':          { pFFO: 0.35, payout: 0.15, debt: 0.30, nav: 0.20 },
  // debt alto: alavancagem critica para hotelaria (ciclo economico)
  // payout baixo: hoteis cortam dividendo em ciclos negativos — menos informativo

  'standard':       { pFFO: 0.35, payout: 0.20, debt: 0.25, nav: 0.20 },
  // pesos atuais mantidos para industrial, residencial, escritorio, retalho standard
}
```

### 4b. Resolucao de pesos

```typescript
// Prioridade: subtipo (quando confidence >= medium) > perfil (income/growth/mixed) > mixed default
const reitSubtype = data?.ffo?.reitSubtype
const subtypeConfidence = data?.ffo?.reitSubtypeConfidence

const weights: { pFFO: number; payout: number; debt: number; nav: number } =
  reitSubtype && subtypeConfidence !== 'low'
    ? SUBTYPE_WEIGHTS[reitSubtype]
    : ENABLE_DYNAMIC_WEIGHTS && data?.ddm?.profileConfidence === 'high'
      ? WEIGHT_PROFILES[activeProfile]
      : WEIGHT_PROFILES.mixed
```

### 4c. Label e nota na UI

Mostrar o subtipo detetado junto ao badge de perfil (Growth/Income/Mixed):

```typescript
// Junto ao perfil (linha ~520 do componente):
{reitSubtype && reitSubtype !== 'standard' && (
  <span className="rounded border border-border/40 bg-muted/30 px-1.5 py-0.5 text-[10px] text-muted-foreground/70">
    {SUBTYPE_LABELS[reitSubtype]}
  </span>
)}

const SUBTYPE_LABELS: Record<string, string> = {
  'net-lease':      'Net-lease',
  'mortgage':       'mREIT',
  'specialty-tech': 'Tech/Torres',
  'healthcare':     'Saude',
  'hotel':          'Hotelaria',
  'standard':       '',
}
```

### 4d. Div./EBITDA para net-lease

Quando `reitSubtype === 'net-lease'`:
- Se `debtToEbitda` e null: mostrar `Debt/FFO` como metrica alternativa (se pFFO disponivel: `totalDebt / FFO` — nao disponivel diretamente, mostrar aviso)
- Se `debtToEbitda` nao e null (calculado via fallback operatingIncome + D&A): mostrar com nota "(proxy)"

```typescript
// No MetricRow de Divida/EBITDA:
const debtEbitdaLabel =
  reitSubtype === 'net-lease' && data?.ffo?.debtToEbitda !== null
    ? 'Div./EBITDA (proxy)'
    : 'Divida/EBITDA'

const debtEbitdaInfo =
  reitSubtype === 'net-lease'
    ? 'Para net-lease REITs, o EBITDA e estimado via Operating Income + D&A (o FMP nao reporta EBITDA direto). Use Net Debt/EBITDAre reportado pela empresa para analise precisa.'
    : INFO.debtEbitda
```

---

## 5. Matriz de QA

| Ticker | Industry FMP | Subtipo esperado | Confianca esperada | Nota |
|--------|-------------|------------------|--------------------|------|
| VICI   | REIT - Specialty | net-lease   | high               | gaming net-lease; EBITDA sentinel |
| O      | REIT - Retail    | net-lease   | medium             | EBITDA sentinel; nome "Realty Income" |
| NNN    | REIT - Retail    | net-lease   | medium             | EBITDA sentinel |
| GLPI   | REIT - Specialty | net-lease   | high               | gaming; nome "Gaming & Leisure" |
| EQIX   | REIT - Specialty | specialty-tech | high            | nao tem gaming no nome |
| DLR    | REIT - Specialty | specialty-tech | high            | |
| AMT    | REIT - Specialty | specialty-tech | high            | torres |
| VTR    | REIT - Healthcare | healthcare | high              | |
| WELL   | REIT - Healthcare | healthcare | high              | |
| HST    | REIT - Hotel & Motel | hotel  | high              | |
| AGNC   | REIT - Mortgage  | mortgage    | high               | ffoSource: not-applicable |
| NLY    | REIT - Mortgage  | mortgage    | high               | |
| PLD    | REIT - Industrial | standard   | medium             | industrial nao tem sinal especifico |
| SPG    | REIT - Retail    | standard    | medium             | mall REIT; EBITDA disponivel → nao net-lease |
| EQR    | REIT - Residential | standard  | medium             | |

**Caso critico — SPG vs O:**
- SPG (mall REIT): `income.ebitda` e um numero real no FMP (nao sentinel) → `ebitdaRaw != 0` → cai em `standard` ✓
- O (net-lease): `income.ebitda = 0` (sentinel) → `ebitdaRaw === 0` → detetado como `net-lease` ✓

Este e o sinal discriminante principal entre net-lease e retail standard.

---

## 6. Notas de implementacao

### Ordem de implementacao recomendada

1. **Backend**: adicionar funcao `detectReitSubtype` + campos na resposta (30 min)
2. **Tipo TS frontend**: adicionar campos a `ReitFfoResponse` (5 min)
3. **Frontend weights**: substituir logica de pesos para usar `SUBTYPE_WEIGHTS` (20 min)
4. **Frontend UI**: label subtipo + nota Div./EBITDA proxy para net-lease (20 min)
5. **QA**: testar todos os tickers da matriz acima (30 min)

### Pontos de atencao

- O campo `ebitdaRawForSubtype` deve ser lido **antes** de `plausibleOrNull` — e o valor bruto do FMP
  que distingue "nao reportado (0)" de "realmente zero".
- Para SPG e outros retail nao-net-lease, o FMP devolve um EBITDA real > 0 → o detetor nao os
  classifica como net-lease, o que e correto.
- A funcao `detectReitSubtype` deve ser pure (sem side effects) para facilitar testes unitarios.
- `reitSubtypeReasons` e util para debug no `_decisionTrace` — incluir la tambem.

### Nao implementar nesta fase

- Debt/FFO como metrica separada no score (requer expor `totalDebt` e `ffo` total no frontend — e
  possivel mas aumenta a complexidade; adiar para fase seguinte)
- Cobertura de renda para healthcare (requer endpoint adicional ou proxy com gross margin por
  propriedade — nao disponivel no FMP Starter)
- Ajuste automatico dos thresholds de scoring por subtipo (ex: Div./EBITDA < 7x para net-lease
  vs < 6x para standard) — implementar apos confirmar os pesos com dados reais
