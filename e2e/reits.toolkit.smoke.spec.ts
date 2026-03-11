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
      window.localStorage.setItem('auth-dev-role', 'visitor')
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

const buildDdmPayload = () => ({
  symbol: 'O',
  companyName: 'Realty Income',
  price: 55.2,
  annualDividend: 3.1,
  dividendYield: 5.62,
  dividendCagr: 4.1,
  requiredReturn: 8.9,
  intrinsicValue: 60.1,
  difference: -8.15,
  valuation: 'Subvalorizado',
  ddmConfidence: 'high',
  ddmDataPeriod: 'TTM',
  reitProfile: 'income',
})

const buildFfoPayload = () => ({
  symbol: 'O',
  companyName: 'Realty Income',
  reportPeriod: 'FY2025',
  price: 55.2,
  ffoSource: 'key-metrics',
  ffoNaraitPerShare: 4.1,
  ffoPayoutRatio: 75.1,
  debtToEbitda: 5.2,
  debtToEquity: 0.82,
  ffoConfidence: 'high',
})

const buildNavPayload = () => ({
  symbol: 'O',
  companyName: 'Realty Income',
  reportPeriod: 'FY2025',
  price: 55.2,
  marketCap: 50_000_000_000,
  nav: 42_000_000_000,
  navPerShare: 45.5,
  priceToNAV: 1.21,
  premiumPercent: 21.3,
  navConfidence: 'medium',
  impliedCapRate: 5.3,
  economicNAV: {
    noIProxy: 2_600_000_000,
    scenarios: {
      optimistic: {
        capRate: 5.0,
        navPerShare: 62.4,
        priceVsNav: -11.5,
      },
      base: {
        capRate: 5.5,
        navPerShare: 58.2,
        priceVsNav: -5.2,
      },
      conservative: {
        capRate: 6.25,
        navPerShare: 51.9,
        priceVsNav: 6.4,
      },
    },
  },
})

test.describe('REITs Toolkit Smoke E2E', () => {
  test('carrega analise de REIT em /mercados/reits com DDM, FFO e NAV', async ({ page }) => {
    await installVisitorContext(page)
    const ddmPayload = buildDdmPayload()
    const ffoPayload = buildFfoPayload()
    const navPayload = buildNavPayload()

    await page.route('**/api/**', async (route) => {
      const request = route.request()
      const url = new URL(request.url())
      const method = request.method().toUpperCase()

      if (!url.pathname.startsWith('/api/')) {
        await route.fallback()
        return
      }

      if (method === 'GET' && url.pathname === '/api/reits/calculateDDM') {
        await fulfillJson(route, ddmPayload)
        return
      }

      if (method === 'GET' && url.pathname === '/api/reits/calculateFFO') {
        await fulfillJson(route, ffoPayload)
        return
      }

      if (method === 'GET' && url.pathname === '/api/reits/calculateNAV') {
        await fulfillJson(route, navPayload)
        return
      }

      await fulfillJson(route, {})
    })

    await page.goto('/mercados/reits')
    await expect(page.getByRole('heading', { name: 'REITs Toolkit' })).toBeVisible()
    await acceptCookieBannerIfVisible(page)

    const ddmResponse = page.waitForResponse(
      (response) =>
        response.request().method() === 'GET' && response.url().includes('/api/reits/calculateDDM'),
    )

    await page.locator('#reit-symbol').fill('O')
    await page.getByRole('button', { name: 'Analisar' }).click()
    await ddmResponse

    await expect(page.getByText('Realty Income').first()).toBeVisible()
    await expect(page.getByText('Score de Valorizacao')).toBeVisible()
    await expect(page.getByText(/^DDM$/, { exact: true })).toBeVisible()
    await expect(page.getByText(/^FFO$/, { exact: true })).toBeVisible()
    await expect(page.getByText(/^NAV$/, { exact: true })).toBeVisible()
  })

  test('mostra erro amigavel quando endpoint de REIT falha', async ({ page }) => {
    await installVisitorContext(page)
    const ddmPayload = buildDdmPayload()
    const navPayload = buildNavPayload()

    await page.route('**/api/**', async (route) => {
      const request = route.request()
      const url = new URL(request.url())
      const method = request.method().toUpperCase()

      if (!url.pathname.startsWith('/api/')) {
        await route.fallback()
        return
      }

      if (method === 'GET' && url.pathname === '/api/reits/calculateDDM') {
        await fulfillJson(route, ddmPayload)
        return
      }

      if (method === 'GET' && url.pathname === '/api/reits/calculateFFO') {
        await fulfillJson(route, { error: 'upstream unavailable' }, 500)
        return
      }

      if (method === 'GET' && url.pathname === '/api/reits/calculateNAV') {
        await fulfillJson(route, navPayload)
        return
      }

      await fulfillJson(route, {})
    })

    await page.goto('/mercados/reits')
    await expect(page.getByRole('heading', { name: 'REITs Toolkit' })).toBeVisible()
    await acceptCookieBannerIfVisible(page)

    const failedReitResponse = page.waitForResponse(
      (response) =>
        response.request().method() === 'GET' && response.url().includes('/api/reits/calculateFFO'),
    )

    await page.getByRole('button', { name: 'Analisar' }).click()
    await failedReitResponse

    await expect(
      page.getByText(
        'Nao foi possivel carregar os dados de REIT. Verifica os endpoints /reits/* no backend.',
      ),
    ).toBeVisible()
  })
})
