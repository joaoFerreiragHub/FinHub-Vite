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

const buildWatchlistStorage = (watchlist: unknown) =>
  JSON.stringify({
    state: { watchlist },
    version: 0,
  })

const installVisitorContext = async (page: Page, watchlist: unknown) => {
  const authStorage = buildVisitorAuthStorage()
  const cookieConsentStorage = buildCookieConsentStorage()
  const watchlistStorage = buildWatchlistStorage(watchlist)

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
      window.localStorage.setItem('markets-watchlist', watchlistValue)
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

test.describe('Markets -> Watchlist Navigation Smoke E2E', () => {
  test('navega de /mercados para /mercados/watchlist sem erro', async ({ page }) => {
    await installVisitorContext(page, ['AAPL', 'GOOGL'])

    await page.route('**/api/**', async (route) => {
      const request = route.request()
      const url = new URL(request.url())
      const method = request.method().toUpperCase()

      if (!url.pathname.startsWith('/api/')) {
        await route.fallback()
        return
      }

      if (method === 'GET' && url.pathname === '/api/stocks/batch-snapshot') {
        await fulfillJson(route, {
          items: [
            { symbol: 'AAPL', name: 'Apple Inc.', price: 190.25, marketCap: 2_900_000_000_000 },
            { symbol: 'GOOGL', name: 'Alphabet Inc.', price: 145.4, marketCap: 1_800_000_000_000 },
          ],
        })
        return
      }

      await fulfillJson(route, {})
    })

    await page.goto('/mercados')
    await page.locator('a[href="/mercados/watchlist"]').first().click()

    await expect(page).toHaveURL(/\/mercados\/watchlist$/)
    await expect(page.getByRole('heading', { name: 'Watchlist' })).toBeVisible()
    await expect(page.getByText('AAPL')).toBeVisible()
  })

  test('abre /mercados/watchlist com storage corrompido sem crash', async ({ page }) => {
    await installVisitorContext(page, 'AAPL')

    await page.route('**/api/**', async (route) => {
      const request = route.request()
      const url = new URL(request.url())

      if (!url.pathname.startsWith('/api/')) {
        await route.fallback()
        return
      }

      // Mesmo que a API seja chamada por algum estado residual, mantemos resposta segura.
      if (
        request.method().toUpperCase() === 'GET' &&
        url.pathname === '/api/stocks/batch-snapshot'
      ) {
        await fulfillJson(route, { items: [] })
        return
      }

      await fulfillJson(route, {})
    })

    await page.goto('/mercados/watchlist')
    await expect(page.getByRole('heading', { name: 'Watchlist' })).toBeVisible()
    await expect(page.getByText('Watchlist vazia')).toBeVisible()
  })
})
