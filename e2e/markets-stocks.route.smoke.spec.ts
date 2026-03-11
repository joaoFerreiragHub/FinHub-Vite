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
  symbol: 'MSFT',
  name: 'Microsoft Corp.',
  image: '',
  sector: 'Technology',
  industry: 'Software',
  exchange: 'NASDAQ',
  pais: 'US',
  price: 420.5,
  marketCap: '3120000000000',
  enterpriseValue: '3180000000000',
  companyName: 'Microsoft Corp.',
  valuationGrade: 'A-',
  qualityScore: 9,
  growthScore: 8,
  riskScore: 3,
  eps: '12.45',
  pe: '33.8',
  pegRatio: '2.2',
  dcf: '402.3',
  leveredDCF: '396.8',
  freeCashFlow: '85B',
  ebitda: '138B',
  lucroLiquido: '97B',
  margemEbitda: '43%',
  margemBruta: '69%',
  margemLiquida: '30%',
  netProfitMargin: '30%',
  roe: '35%',
  roic: '24%',
  cagrEps: '14%',
  epsGrowth5Y: '13%',
  ebitdaGrowth5Y: '12%',
  dividendYield: '0.7%',
  dividend_pershare: '3.0',
  payoutRatio: '24%',
  debtToEquity: '0.5',
  currentRatio: '1.9',
  cash: '80B',
  interestCoverage: '35x',
  netDebt: '20B',
  totalDebt: '65B',
  interestExpense: '2B',
  cashRatio: '1.1',
  debtToEBITDA: '0.5',
  netDebtToEBITDA: '0.1',
  riskFreeRate: '3.5%',
  marketRiskPremium: '5.5%',
  beta: '0.95',
  costOfEquity: '8.7%',
  costOfDebt: '3.9%',
  effectiveTaxRate: '16%',
  wacc: '7.6%',
  receita: '245B',
  receitaPorAcao: '32',
  receitaCagr3y: '10%',
  receitaGrowth5y: '11%',
  lucro: '97B',
  lucroPorAcao: '12.4',
  lucroCagr3y: '14%',
  lucroGrowth5y: '15%',
  ceo: 'Satya Nadella',
  fundacao: '1975',
  employees: '220000',
  description: 'Sample payload for /mercados/acoes route smoke.',
  website: 'https://www.microsoft.com',
  ipoDate: '1986-03-13',
  address: 'Redmond, WA',
  indicadores: {
    'Crescimento Receita': '10%',
    ROE: '35%',
    'Margem EBITDA': '43%',
  },
  radarData: [
    { metric: 'Valuation (barato)', value: 58 },
    { metric: 'Rentabilidade', value: 86 },
    { metric: 'Crescimento', value: 79 },
    { metric: 'Solidez', value: 82 },
    { metric: 'Seguranca', value: 77 },
    { metric: 'Dividendos', value: 48 },
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
    industry: 'Software',
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
      value: '35%',
      source: 'fmp-ratios-ttm',
      dataPeriod: 'TTM',
      asOf: NOW,
    },
  },
  quickMetricIngestion: {
    currentDataPeriodRaw: 'TTM',
    currentDataPeriodNormalized: 'TTM',
    benchmarkAsOf: NOW,
    sourcesObserved: {
      'fmp-ratios-ttm': 1,
    },
    resolvedSector: 'Technology',
  },
  quickMetricSummary: {
    total: 1,
    ok: 1,
    calculated: 0,
    nao_aplicavel: 0,
    sem_dado_atual: 0,
    erro_fonte: 0,
    coreTotal: 1,
    coreReady: 1,
    coreMissing: 0,
    optionalTotal: 0,
    optionalReady: 0,
    optionalMissing: 0,
  },
  sectorContextScore: {
    score: 81,
    label: 'Muito forte',
    sector: 'Technology',
    confidence: 88,
    coreCoverage: 100,
    benchmarkComparableCore: 1,
    favorableVsBenchmarkCore: 1,
  },
  dataQualityScore: {
    score: 90,
    label: 'Robusta',
    coreCoverage: 100,
    directRate: 100,
    calculatedRate: 0,
    missingRate: 0,
  },
  finHubScore: 84,
  finHubLabel: 'Forte',
  finHubCoverage: 4,
  dataPeriod: 'TTM',
})

test.describe('Markets Stocks Route Smoke E2E', () => {
  test('pesquisa em /mercados/acoes e adiciona ticker na watchlist local', async ({ page }) => {
    await installVisitorContext(page)
    const payload = buildQuickAnalysisPayload()

    await page.route('**/api/**', async (route) => {
      const url = new URL(route.request().url())
      const method = route.request().method().toUpperCase()

      if (!url.pathname.startsWith('/api/')) {
        await route.fallback()
        return
      }

      if (method === 'GET' && url.pathname === '/api/stocks/quick-analysis/MSFT') {
        await fulfillJson(route, payload)
        return
      }

      await fulfillJson(route, {})
    })

    const quickAnalysisResponse = page.waitForResponse(
      (response) =>
        response.request().method() === 'GET' &&
        response.url().includes('/api/stocks/quick-analysis/MSFT'),
    )

    await page.goto('/mercados/acoes')
    await expect(page.getByRole('heading', { name: 'Analise de Acoes' })).toBeVisible()
    await acceptCookieBannerIfVisible(page)

    await expect(page.getByText('Watchlist rapida')).toBeVisible()
    await expect(page.getByText('AAPL')).toBeVisible()
    await expect(page.getByText('GOOGL')).toBeVisible()

    await page.getByPlaceholder('Ticker (ex: AAPL, O, MSFT)').fill('MSFT')
    await page.getByRole('button', { name: 'Pesquisar' }).click()
    await quickAnalysisResponse

    await expect(page.getByText('Microsoft Corp.').first()).toBeVisible()

    await page.getByRole('button', { name: 'Alternar Watchlist' }).click()

    await expect
      .poll(async () => {
        return page.evaluate(() => {
          const rawValue = window.localStorage.getItem('markets-watchlist')
          if (!rawValue) return ''
          try {
            const parsed = JSON.parse(rawValue) as { state?: { watchlist?: string[] } }
            const list = Array.isArray(parsed.state?.watchlist) ? parsed.state.watchlist : []
            return list.join(',')
          } catch {
            return 'invalid'
          }
        })
      })
      .toContain('MSFT')
  })

  test('mostra erro amigavel em /mercados/acoes para ticker inexistente', async ({ page }) => {
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

    const quickAnalysisResponse = page.waitForResponse(
      (response) =>
        response.request().method() === 'GET' &&
        response.url().includes('/api/stocks/quick-analysis/ZZZZ'),
    )

    await page.goto('/mercados/acoes')
    await expect(page.getByRole('heading', { name: 'Analise de Acoes' })).toBeVisible()
    await acceptCookieBannerIfVisible(page)

    await page.getByPlaceholder('Ticker (ex: AAPL, O, MSFT)').fill('ZZZZ')
    await page.getByRole('button', { name: 'Pesquisar' }).click()
    await quickAnalysisResponse

    await expect(page.getByText('Ticker "ZZZZ" nao encontrado.')).toBeVisible()
  })
})
