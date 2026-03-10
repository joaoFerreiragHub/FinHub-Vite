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
      watchlist: ['AAPL', 'GOOGL'],
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

test.describe('Watchlist Smoke E2E', () => {
  test('carrega /mercados/watchlist sem crash e com snapshots', async ({ page }) => {
    await installVisitorContext(page)

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
            {
              symbol: 'AAPL',
              name: 'Apple Inc.',
              price: 190.25,
              marketCap: 2_950_000_000_000,
              sector: 'Technology',
            },
            {
              symbol: 'GOOGL',
              name: 'Alphabet Inc.',
              price: 145.4,
              marketCap: 1_850_000_000_000,
              sector: 'Communication Services',
            },
          ],
        })
        return
      }

      await fulfillJson(route, {})
    })

    await page.goto('/mercados/watchlist')
    await expect(page.getByRole('heading', { name: 'Watchlist' })).toBeVisible()
    await expect(page.getByText('AAPL')).toBeVisible()
    await expect(page.getByText('GOOGL')).toBeVisible()
    await expect(page.getByText('Apple Inc.')).toBeVisible()
    await expect(page.getByText('Alphabet Inc.')).toBeVisible()
  })

  test('mostra fallback de erro quando batch snapshot falha', async ({ page }) => {
    await installVisitorContext(page)

    await page.route('**/api/**', async (route) => {
      const request = route.request()
      const url = new URL(request.url())
      const method = request.method().toUpperCase()

      if (!url.pathname.startsWith('/api/')) {
        await route.fallback()
        return
      }

      if (method === 'GET' && url.pathname === '/api/stocks/batch-snapshot') {
        await fulfillJson(route, { error: 'batch unavailable' }, 500)
        return
      }

      await fulfillJson(route, {})
    })

    await page.goto('/mercados/watchlist')
    await expect(page.getByRole('heading', { name: 'Watchlist' })).toBeVisible()
    await expect(
      page.getByText('Nao foi possivel atualizar os dados da watchlist em batch.'),
    ).toBeVisible()
    await expect(page.getByText('Nao foi possivel carregar este ticker.').first()).toBeVisible()
  })
})
