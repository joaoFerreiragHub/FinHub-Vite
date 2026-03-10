import { expect, test, type Page, type Route } from 'playwright/test'

const NOW = new Date().toISOString()

const buildVisitorAuthStorage = () =>
  JSON.stringify({
    state: {
      user: {
        id: 'e2e-visitor-1',
        name: 'E2E Visitor',
        email: 'visitor@finhub.test',
        username: 'e2e_visitor',
        role: 'visitor',
        accountStatus: 'active',
        isEmailVerified: true,
        cookieConsent: {
          essential: true,
          analytics: true,
          marketing: true,
          preferences: true,
          consentedAt: NOW,
          version: 'v1',
        },
        createdAt: NOW,
        updatedAt: NOW,
      },
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,
    },
    version: 0,
  })

const buildCookieConsentStorage = () =>
  JSON.stringify({
    essential: true,
    analytics: true,
    marketing: true,
    preferences: true,
    consentedAt: NOW,
    version: 'v1',
  })

const installVisitorContext = async (page: Page) => {
  const authStorage = buildVisitorAuthStorage()
  const cookieConsentStorage = buildCookieConsentStorage()

  await page.addInitScript(
    ({ authValue, consentValue }: { authValue: string; consentValue: string }) => {
      window.localStorage.setItem('auth-storage', authValue)
      window.localStorage.setItem('finhub-cookie-consent', consentValue)
    },
    { authValue: authStorage, consentValue: cookieConsentStorage },
  )
}

const fulfillJson = async (route: Route, payload: unknown, status = 200) => {
  await route.fulfill({
    status,
    contentType: 'application/json',
    body: JSON.stringify(payload),
  })
}

const acceptCookieBannerIfVisible = async (page: Page) => {
  const acceptAllButton = page.getByRole('button', { name: 'Aceitar tudo' })
  const isVisible = await acceptAllButton
    .waitFor({ state: 'visible', timeout: 5_000 })
    .then(() => true)
    .catch(() => false)

  if (isVisible) {
    await acceptAllButton.click()
    await expect(acceptAllButton).toBeHidden({ timeout: 5_000 })
  }
}

const buildQuickAnalysisPayload = () => ({
  symbol: 'AAPL',
  name: 'Apple Inc.',
  image: '',
  sector: 'Technology',
  industry: 'Consumer Electronics',
  exchange: 'NASDAQ',
  pais: 'US',
  price: 190.25,
  marketCap: '2950000000000',
  enterpriseValue: '3000000000000',
  companyName: 'Apple Inc.',
  valuationGrade: 'B',
  qualityScore: 8,
  growthScore: 7,
  riskScore: 4,
  eps: '6.21',
  pe: '30.6',
  pegRatio: '2.1',
  dcf: '185.4',
  leveredDCF: '181.0',
  freeCashFlow: '100B',
  ebitda: '125B',
  lucroLiquido: '95B',
  margemEbitda: '34%',
  margemBruta: '44%',
  margemLiquida: '25%',
  netProfitMargin: '25%',
  roe: '32%',
  roic: '21%',
  cagrEps: '12%',
  epsGrowth5Y: '10%',
  ebitdaGrowth5Y: '11%',
  dividendYield: '0.5%',
  dividend_pershare: '1.0',
  payoutRatio: '16%',
  debtToEquity: '1.5',
  currentRatio: '1.0',
  cash: '60B',
  interestCoverage: '30x',
  netDebt: '50B',
  totalDebt: '100B',
  interestExpense: '3B',
  cashRatio: '0.8',
  debtToEBITDA: '0.8',
  netDebtToEBITDA: '0.4',
  riskFreeRate: '3.5%',
  marketRiskPremium: '5.5%',
  beta: '1.1',
  costOfEquity: '9%',
  costOfDebt: '4%',
  effectiveTaxRate: '15%',
  wacc: '8%',
  receita: '390B',
  receitaPorAcao: '24',
  receitaCagr3y: '8%',
  receitaGrowth5y: '9%',
  lucro: '95B',
  lucroPorAcao: '6.2',
  lucroCagr3y: '10%',
  lucroGrowth5y: '11%',
  ceo: 'Tim Cook',
  fundacao: '1976',
  employees: '161000',
  description: 'Sample payload for quick analysis smoke.',
  website: 'https://www.apple.com',
  ipoDate: '1980-12-12',
  address: 'Cupertino, CA',
  indicadores: {
    'Crescimento Receita': '8%',
    ROE: '32%',
    'Margem EBITDA': '34%',
  },
  radarData: [
    { metric: 'Valuation (barato)', value: 68 },
    { metric: 'Rentabilidade', value: 76 },
    { metric: 'Crescimento', value: 71 },
    { metric: 'Solidez', value: 69 },
    { metric: 'Seguranca', value: 64 },
    { metric: 'Dividendos', value: 40 },
  ],
  radarPeers: [],
  alerts: [],
  peers: [],
  peersQuotes: [],
  benchmarkComparisons: {},
  benchmarkMetadata: {},
  benchmarkContext: {
    asOf: NOW,
    sector: 'Technology',
    industry: 'Consumer Electronics',
    peerCount: 0,
    googleAttempted: false,
    googleAvailable: false,
    fallbackMetrics: 0,
    primarySource: 'fallback',
  },
  quickMetricContractVersion: 'p3.0',
  quickMetricCatalog: [],
  quickMetricStates: {
    roe: {
      status: 'ok',
      value: '32%',
      source: 'fmp-ratios-ttm',
      dataPeriod: 'TTM',
      asOf: NOW,
      sectorPriority: 'core',
      requiredForSector: true,
    },
    roic: {
      status: 'calculated',
      value: '21%',
      source: 'formula',
      dataPeriod: 'TTM',
      asOf: NOW,
      reason: 'derived from available statements',
      sectorPriority: 'core',
      requiredForSector: true,
    },
    peg: {
      status: 'sem_dado_atual',
      value: null,
      source: null,
      dataPeriod: null,
      asOf: NOW,
      reason: 'source data missing',
      sectorPriority: 'optional',
      requiredForSector: false,
    },
    debt_to_equity: {
      status: 'nao_aplicavel',
      value: null,
      source: null,
      dataPeriod: null,
      asOf: NOW,
      reason: 'not applicable for current context',
      sectorPriority: 'optional',
      requiredForSector: false,
    },
    margem_ebitda: {
      status: 'erro_fonte',
      value: null,
      source: 'fmp-ratios-ttm',
      dataPeriod: 'TTM',
      asOf: NOW,
      reason: 'provider timeout',
      sectorPriority: 'core',
      requiredForSector: true,
    },
  },
  quickMetricIngestion: {
    currentDataPeriodRaw: 'TTM',
    currentDataPeriodNormalized: 'TTM',
    benchmarkAsOf: NOW,
    sourcesObserved: {
      'fmp-ratios-ttm': 3,
      formula: 1,
    },
    resolvedSector: 'Technology',
  },
  quickMetricSummary: {
    total: 5,
    ok: 1,
    calculated: 1,
    nao_aplicavel: 1,
    sem_dado_atual: 1,
    erro_fonte: 1,
    coreTotal: 3,
    coreReady: 2,
    coreMissing: 1,
    optionalTotal: 2,
    optionalReady: 0,
    optionalMissing: 2,
  },
  sectorContextScore: {
    score: 74,
    label: 'Forte',
    sector: 'Technology',
    confidence: 84,
    coreCoverage: 67,
    benchmarkComparableCore: 3,
    favorableVsBenchmarkCore: 2,
  },
  dataQualityScore: {
    score: 72,
    label: 'Boa',
    coreCoverage: 67,
    directRate: 40,
    calculatedRate: 20,
    missingRate: 40,
  },
  finHubScore: 78,
  finHubLabel: 'Forte',
  finHubCoverage: 4,
  dataPeriod: 'TTM',
})

test.describe('Stocks Quick Analysis Smoke E2E', () => {
  test('mostra analise rapida com estados de metricas', async ({ page }) => {
    await installVisitorContext(page)

    const payload = buildQuickAnalysisPayload()

    await page.route('**/api/**', async (route) => {
      const url = new URL(route.request().url())
      const method = route.request().method().toUpperCase()

      if (!url.pathname.startsWith('/api/')) {
        await route.fallback()
        return
      }

      if (method === 'GET' && url.pathname === '/api/stocks/quick-analysis/AAPL') {
        await fulfillJson(route, payload)
        return
      }

      await fulfillJson(route, {})
    })

    await page.goto('/stocks')
    await acceptCookieBannerIfVisible(page)

    const quickAnalysisResponse = page.waitForResponse(
      (response) =>
        response.request().method() === 'GET' &&
        response.url().includes('/api/stocks/quick-analysis/AAPL'),
    )

    await page.getByPlaceholder('Ticker (ex: AAPL, O, MSFT)').fill('AAPL')
    await page.getByRole('button', { name: 'Pesquisar' }).click()
    await quickAnalysisResponse

    await expect(page.getByText('Apple Inc.').first()).toBeVisible()
    await expect(page.getByText('FinHub Score')).toBeVisible()
    await expect(page.getByText('Core', { exact: true }).first()).toBeVisible()
    await expect(page.getByText('Direto', { exact: true }).first()).toBeVisible()
    await expect(page.getByText('Calculado', { exact: true }).first()).toBeVisible()
    await expect(page.getByText('Sem dado', { exact: true }).first()).toBeVisible()
    await expect(page.getByText('Erro fonte', { exact: true }).first()).toBeVisible()
  })

  test('mostra erro amigavel quando ticker nao existe', async ({ page }) => {
    await installVisitorContext(page)

    await page.route('**/api/**', async (route) => {
      const url = new URL(route.request().url())
      const method = route.request().method().toUpperCase()

      if (!url.pathname.startsWith('/api/')) {
        await route.fallback()
        return
      }

      if (method === 'GET' && url.pathname === '/api/stocks/quick-analysis/ZZZZ') {
        await fulfillJson(route, { error: 'Ticker not found' }, 404)
        return
      }

      await fulfillJson(route, {})
    })

    await page.goto('/stocks')
    await acceptCookieBannerIfVisible(page)

    const quickAnalysisResponse = page.waitForResponse(
      (response) =>
        response.request().method() === 'GET' &&
        response.url().includes('/api/stocks/quick-analysis/ZZZZ'),
    )

    await page.getByPlaceholder('Ticker (ex: AAPL, O, MSFT)').fill('ZZZZ')
    await page.getByRole('button', { name: 'Pesquisar' }).click()
    await quickAnalysisResponse

    await expect(page.getByText('Ticker "ZZZZ" nao encontrado.')).toBeVisible()
  })
})
