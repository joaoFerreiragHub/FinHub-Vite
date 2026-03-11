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

const buildCryptoPayload = () => [
  {
    id: 'bitcoin',
    symbol: 'btc',
    name: 'Bitcoin',
    image: 'https://example.com/btc.png',
    price: 82_450.2,
    marketCap: 1_620_000_000_000,
  },
  {
    id: 'ethereum',
    symbol: 'eth',
    name: 'Ethereum',
    image: 'https://example.com/eth.png',
    price: 4_120.85,
    marketCap: 490_000_000_000,
  },
  {
    id: 'solana',
    symbol: 'sol',
    name: 'Solana',
    image: 'https://example.com/sol.png',
    price: 210.14,
    marketCap: 98_000_000_000,
  },
]

test.describe('Crypto List Smoke E2E', () => {
  test('carrega /mercados/cripto e filtra resultados por pesquisa', async ({ page }) => {
    await installVisitorContext(page)
    const payload = buildCryptoPayload()

    await page.route('**/api/**', async (route) => {
      const request = route.request()
      const url = new URL(request.url())
      const method = request.method().toUpperCase()

      if (!url.pathname.startsWith('/api/')) {
        await route.fallback()
        return
      }

      if (method === 'GET' && url.pathname === '/api/crypto') {
        await fulfillJson(route, payload)
        return
      }

      await fulfillJson(route, {})
    })

    const cryptoResponse = page.waitForResponse(
      (response) => response.request().method() === 'GET' && response.url().includes('/api/crypto'),
    )
    await page.goto('/mercados/cripto')
    await expect(page.getByRole('heading', { name: 'Lista de Cripto' })).toBeVisible()
    await acceptCookieBannerIfVisible(page)
    await cryptoResponse

    await expect(page.getByText('Bitcoin')).toBeVisible()
    await expect(page.getByText('Ethereum')).toBeVisible()

    const searchInput = page.getByPlaceholder('Pesquisar por nome ou simbolo (ex: BTC, ETH)')
    await searchInput.fill('btc')
    await expect(page.getByText('Bitcoin')).toBeVisible()

    await searchInput.fill('xpto')
    await expect(page.getByText('Nenhuma criptomoeda encontrada para esta pesquisa.')).toBeVisible()
  })

  test('mostra erro amigavel quando endpoint /api/crypto falha', async ({ page }) => {
    await installVisitorContext(page)

    await page.route('**/api/**', async (route) => {
      const request = route.request()
      const url = new URL(request.url())
      const method = request.method().toUpperCase()

      if (!url.pathname.startsWith('/api/')) {
        await route.fallback()
        return
      }

      if (method === 'GET' && url.pathname === '/api/crypto') {
        await fulfillJson(route, { error: 'upstream unavailable' }, 500)
        return
      }

      await fulfillJson(route, {})
    })

    const failedCryptoResponse = page.waitForResponse(
      (response) => response.request().method() === 'GET' && response.url().includes('/api/crypto'),
    )
    await page.goto('/mercados/cripto')
    await expect(page.getByRole('heading', { name: 'Lista de Cripto' })).toBeVisible()
    await acceptCookieBannerIfVisible(page)
    await failedCryptoResponse

    await expect(page.getByText('Nao estamos a conseguir carregar as criptomoedas.')).toBeVisible()
    await expect(page.getByRole('button', { name: 'Tentar novamente' })).toBeVisible()
  })
})
