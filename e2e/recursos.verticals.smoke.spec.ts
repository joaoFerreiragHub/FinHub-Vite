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

const buildBrokerListResponse = (items: Array<Record<string, unknown>>) => ({
  items,
  filters: {
    verticalType: 'broker',
    country: null,
    verificationStatus: null,
    search: null,
    featured: null,
    tags: [],
    sort: 'featured',
  },
  pagination: {
    page: 1,
    limit: 12,
    total: items.length,
    pages: 1,
  },
})

const brokerItems = [
  {
    id: 'broker-1',
    name: 'Broker Prime',
    slug: 'broker-prime',
    verticalType: 'broker',
    shortDescription: 'Corretora com foco em ETF e custos baixos.',
    description: null,
    logo: null,
    website: 'https://broker-prime.example',
    country: 'PT',
    verificationStatus: 'verified',
    isFeatured: true,
    isSponsoredPlacement: false,
    views: 840,
    averageRating: 4.7,
    ratingsCount: 22,
    commentsCount: 7,
  },
  {
    id: 'broker-2',
    name: 'Broker Basic',
    slug: 'broker-basic',
    verticalType: 'broker',
    shortDescription: 'Corretora generalista para carteira inicial.',
    description: null,
    logo: null,
    website: null,
    country: 'ES',
    verificationStatus: 'pending',
    isFeatured: false,
    isSponsoredPlacement: false,
    views: 320,
    averageRating: 3.9,
    ratingsCount: 9,
    commentsCount: 2,
  },
]

test.describe('Recursos Verticais Smoke E2E', () => {
  test('carrega /recursos/corretoras e aplica filtro featured', async ({ page }) => {
    await installVisitorContext(page)

    await page.route('**/api/**', async (route) => {
      const request = route.request()
      const method = request.method().toUpperCase()
      const url = new URL(request.url())

      if (!url.pathname.startsWith('/api/')) {
        await route.fallback()
        return
      }

      if (method === 'GET' && url.pathname === '/api/directories') {
        const verticalType = url.searchParams.get('verticalType')
        const featuredOnly = url.searchParams.get('featured') === 'true'

        if (verticalType === 'broker' && featuredOnly) {
          await fulfillJson(route, buildBrokerListResponse([brokerItems[0]]))
          return
        }

        if (verticalType === 'broker') {
          await fulfillJson(route, buildBrokerListResponse(brokerItems))
          return
        }
      }

      await fulfillJson(route, {})
    })

    const initialResponse = page.waitForResponse(
      (response) =>
        response.request().method() === 'GET' &&
        response.url().includes('/api/directories') &&
        response.url().includes('verticalType=broker'),
    )

    await page.goto('/recursos/corretoras')
    await expect(page.getByRole('heading', { name: 'Corretoras' })).toBeVisible()
    await acceptCookieBannerIfVisible(page)
    await initialResponse

    await expect(page.getByText('2 resultados')).toBeVisible()
    await expect(page.getByText('Broker Prime')).toBeVisible()
    await expect(page.getByText('Broker Basic')).toBeVisible()

    const featuredResponse = page.waitForResponse(
      (response) =>
        response.request().method() === 'GET' &&
        response.url().includes('/api/directories') &&
        response.url().includes('verticalType=broker') &&
        response.url().includes('featured=true'),
    )

    await page.getByRole('button', { name: 'Apenas featured' }).click()
    await featuredResponse

    await expect(page.getByRole('button', { name: 'Apenas featured (ativo)' })).toBeVisible()
    await expect(page.getByText('1 resultados')).toBeVisible()
    await expect(page.getByText('Broker Prime')).toBeVisible()
    await expect(page.getByText('Broker Basic')).toBeHidden()
  })

  test('mostra erro amigavel em /recursos/exchanges quando listagem falha', async ({ page }) => {
    await installVisitorContext(page)

    await page.route('**/api/**', async (route) => {
      const request = route.request()
      const method = request.method().toUpperCase()
      const url = new URL(request.url())

      if (!url.pathname.startsWith('/api/')) {
        await route.fallback()
        return
      }

      if (
        method === 'GET' &&
        url.pathname === '/api/directories' &&
        url.searchParams.get('verticalType') === 'exchange'
      ) {
        await fulfillJson(route, { error: 'upstream unavailable' }, 500)
        return
      }

      await fulfillJson(route, {})
    })

    const listResponse = page.waitForResponse(
      (response) =>
        response.request().method() === 'GET' &&
        response.url().includes('/api/directories') &&
        response.url().includes('verticalType=exchange'),
    )

    await page.goto('/recursos/exchanges')
    await expect(page.getByRole('heading', { name: 'Exchanges' })).toBeVisible()
    await acceptCookieBannerIfVisible(page)
    await listResponse

    await expect(
      page.getByText('Nao foi possivel carregar os recursos desta vertical.'),
    ).toBeVisible()
  })
})
