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

const buildWatchlistStorage = () =>
  JSON.stringify({
    state: {
      watchlist: [],
    },
    version: 0,
  })

const installVisitorContext = async (page: Page) => {
  const authStorage = buildVisitorAuthStorage()
  const cookieConsentStorage = buildCookieConsentStorage()
  const watchlistStorage = buildWatchlistStorage()

  await page.addInitScript(
    ({
      authValue,
      consentValue,
      watchlistValue,
    }: {
      authValue: string
      consentValue: string
      watchlistValue: string
    }) => {
      window.localStorage.setItem('auth-storage', authValue)
      window.localStorage.setItem('finhub-cookie-consent', consentValue)
      if (window.localStorage.getItem('markets-watchlist') === null) {
        window.localStorage.setItem('markets-watchlist', watchlistValue)
      }
      window.localStorage.setItem('auth-dev-role', 'visitor')
    },
    {
      authValue: authStorage,
      consentValue: cookieConsentStorage,
      watchlistValue: watchlistStorage,
    },
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
  description: 'Sample payload for watchlist end-to-end smoke.',
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
    score: 74,
    label: 'Forte',
    sector: 'Technology',
    confidence: 84,
    coreCoverage: 100,
    benchmarkComparableCore: 1,
    favorableVsBenchmarkCore: 1,
  },
  dataQualityScore: {
    score: 88,
    label: 'Robusta',
    coreCoverage: 100,
    directRate: 100,
    calculatedRate: 0,
    missingRate: 0,
  },
  finHubScore: 78,
  finHubLabel: 'Forte',
  finHubCoverage: 4,
  dataPeriod: 'TTM',
})

test.describe('Watchlist End-to-End Smoke', () => {
  test('adiciona em /stocks, valida em /mercados/watchlist e remove', async ({ page }) => {
    await installVisitorContext(page)
    const payload = buildQuickAnalysisPayload()

    await page.route('**/api/**', async (route) => {
      const request = route.request()
      const url = new URL(request.url())
      const method = request.method().toUpperCase()
      const { pathname } = url

      if (!pathname.startsWith('/api/')) {
        await route.fallback()
        return
      }

      if (method === 'GET' && pathname === '/api/stocks/quick-analysis/AAPL') {
        await fulfillJson(route, payload)
        return
      }

      if (method === 'GET' && pathname === '/api/stocks/batch-snapshot') {
        const symbols = (url.searchParams.get('symbols') ?? '')
          .split(',')
          .map((item) => item.trim().toUpperCase())
          .filter((item) => item.length > 0)

        const items = symbols
          .filter((symbol) => symbol === 'AAPL')
          .map(() => ({
            symbol: 'AAPL',
            name: 'Apple Inc.',
            price: 190.25,
            marketCap: 2_950_000_000_000,
            sector: 'Technology',
          }))

        await fulfillJson(route, { items })
        return
      }

      await fulfillJson(route, {})
    })

    await page.goto('/stocks')
    await expect(page.getByRole('heading', { name: 'Analise de Acoes' })).toBeVisible()
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

    const toggleWatchlistButton = page.getByRole('button', { name: 'Alternar Watchlist' })
    for (let attempt = 0; attempt < 2; attempt += 1) {
      await toggleWatchlistButton.click()
      const containsAapl = await page.evaluate(() => {
        const rawValue = window.localStorage.getItem('markets-watchlist')
        if (!rawValue) return false

        try {
          const parsed = JSON.parse(rawValue) as { state?: { watchlist?: string[] } }
          const list = Array.isArray(parsed.state?.watchlist) ? parsed.state.watchlist : []
          return list.some((symbol) => String(symbol).toUpperCase() === 'AAPL')
        } catch {
          return false
        }
      })
      if (containsAapl) break
    }

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
      .toContain('AAPL')

    await page.locator('a[href="/mercados/watchlist"]').first().click()
    await expect(page).toHaveURL(/\/mercados\/watchlist$/)
    await expect(page.getByRole('heading', { name: 'Watchlist' })).toBeVisible()
    await expect(page.getByText('AAPL')).toBeVisible()
    await expect(page.getByText('Apple Inc.')).toBeVisible()

    await page.getByRole('button', { name: 'Remover AAPL' }).click()
    await expect(page.getByText('Watchlist vazia')).toBeVisible()
  })
})
