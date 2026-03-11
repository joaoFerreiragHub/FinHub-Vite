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

const buildCategoriesPayload = () => ({
  summary: {
    total: 24,
    totalFeatured: 5,
    totalVerified: 14,
    verticalsWithEntries: 3,
  },
  filters: {
    country: null,
    verificationStatus: null,
    search: null,
    featured: null,
    tags: [],
  },
  items: [
    {
      verticalType: 'broker',
      count: 11,
      featuredCount: 2,
      verifiedCount: 8,
    },
    {
      verticalType: 'exchange',
      count: 9,
      featuredCount: 2,
      verifiedCount: 4,
    },
    {
      verticalType: 'fintech',
      count: 4,
      featuredCount: 1,
      verifiedCount: 2,
    },
  ],
})

const buildFeaturedPayload = () => ({
  limit: 6,
  total: 2,
  items: [
    {
      id: 'dir-featured-1',
      name: 'Broker Prime',
      slug: 'broker-prime',
      verticalType: 'broker',
      shortDescription: 'Corretora global com foco em ETF.',
      description: 'Descricao longa opcional.',
      logo: null,
      website: 'https://broker-prime.example',
      country: 'PT',
      verificationStatus: 'verified',
      isFeatured: true,
      isSponsoredPlacement: false,
      views: 1200,
      averageRating: 4.6,
      ratingsCount: 31,
      commentsCount: 11,
    },
    {
      id: 'dir-featured-2',
      name: 'Exchange Atlas',
      slug: 'exchange-atlas',
      verticalType: 'exchange',
      shortDescription: 'Exchange com foco em seguranca e liquidez.',
      description: null,
      logo: null,
      website: null,
      country: 'US',
      verificationStatus: 'pending',
      isFeatured: true,
      isSponsoredPlacement: true,
      views: 980,
      averageRating: 4.2,
      ratingsCount: 19,
      commentsCount: 6,
    },
  ],
})

const buildSearchPayload = (query: string) => ({
  query,
  items: [
    {
      id: 'dir-search-1',
      name: 'Bit Broker',
      slug: 'bit-broker',
      verticalType: 'broker',
      shortDescription: 'Broker com foco em crypto e ETF.',
      description: 'Entrada de pesquisa para smoke test.',
      logo: null,
      website: 'https://bit-broker.example',
      country: 'PT',
      verificationStatus: 'verified',
      isFeatured: false,
      isSponsoredPlacement: false,
      views: 420,
      averageRating: 4.1,
      ratingsCount: 12,
      commentsCount: 3,
    },
  ],
  filters: {
    verticalType: null,
    country: null,
    verificationStatus: null,
    search: query,
    featured: null,
    tags: [],
    sort: 'featured',
  },
  pagination: {
    page: 1,
    limit: 8,
    total: 1,
    pages: 1,
  },
})

test.describe('Recursos Index Smoke E2E', () => {
  test('carrega /recursos com categorias, featured e pesquisa global', async ({ page }) => {
    await installVisitorContext(page)
    const categoriesPayload = buildCategoriesPayload()
    const featuredPayload = buildFeaturedPayload()

    await page.route('**/api/**', async (route) => {
      const request = route.request()
      const method = request.method().toUpperCase()
      const url = new URL(request.url())

      if (!url.pathname.startsWith('/api/')) {
        await route.fallback()
        return
      }

      if (method === 'GET' && url.pathname === '/api/directories/categories') {
        await fulfillJson(route, categoriesPayload)
        return
      }

      if (method === 'GET' && url.pathname === '/api/directories/featured') {
        await fulfillJson(route, featuredPayload)
        return
      }

      if (method === 'GET' && url.pathname === '/api/directories/search') {
        const query = (url.searchParams.get('q') ?? '').trim()
        await fulfillJson(route, buildSearchPayload(query))
        return
      }

      await fulfillJson(route, {})
    })

    const categoriesResponse = page.waitForResponse(
      (response) =>
        response.request().method() === 'GET' &&
        response.url().includes('/api/directories/categories'),
    )
    const featuredResponse = page.waitForResponse(
      (response) =>
        response.request().method() === 'GET' &&
        response.url().includes('/api/directories/featured'),
    )

    await page.goto('/recursos')
    await expect(
      page.getByRole('heading', { name: 'Recursos financeiros para comparar com contexto' }),
    ).toBeVisible()
    await acceptCookieBannerIfVisible(page)

    await categoriesResponse
    await featuredResponse

    await expect(page.getByText('24 recursos publicados')).toBeVisible()
    await expect(page.getByText('Corretoras').first()).toBeVisible()
    await expect(page.getByText('Exchanges').first()).toBeVisible()
    await expect(page.getByText('Broker Prime')).toBeVisible()
    await expect(page.getByText('Exchange Atlas')).toBeVisible()

    const searchResponse = page.waitForResponse(
      (response) =>
        response.request().method() === 'GET' &&
        response.url().includes('/api/directories/search') &&
        response.url().includes('q=bit'),
    )

    await page.getByRole('textbox', { name: 'Pesquisar recursos' }).fill('bit')
    await page.getByRole('button', { name: 'Pesquisar' }).click()
    await searchResponse

    await expect(page.getByText('Resultados para "bit"')).toBeVisible()
    await expect(page.getByText('Bit Broker')).toBeVisible()
    await expect(page.getByText('Resultado de pesquisa')).toBeVisible()
  })

  test('mostra fallback de erro quando categorias/featured falham', async ({ page }) => {
    await installVisitorContext(page)

    await page.route('**/api/**', async (route) => {
      const request = route.request()
      const method = request.method().toUpperCase()
      const url = new URL(request.url())

      if (!url.pathname.startsWith('/api/')) {
        await route.fallback()
        return
      }

      if (method === 'GET' && url.pathname === '/api/directories/categories') {
        await fulfillJson(route, { error: 'upstream unavailable' }, 500)
        return
      }

      if (method === 'GET' && url.pathname === '/api/directories/featured') {
        await fulfillJson(route, { error: 'upstream unavailable' }, 500)
        return
      }

      await fulfillJson(route, {})
    })

    const categoriesResponse = page.waitForResponse(
      (response) =>
        response.request().method() === 'GET' &&
        response.url().includes('/api/directories/categories'),
    )
    const featuredResponse = page.waitForResponse(
      (response) =>
        response.request().method() === 'GET' &&
        response.url().includes('/api/directories/featured'),
    )

    await page.goto('/recursos')
    await expect(
      page.getByRole('heading', { name: 'Recursos financeiros para comparar com contexto' }),
    ).toBeVisible()
    await acceptCookieBannerIfVisible(page)

    await categoriesResponse
    await featuredResponse

    await expect(
      page.getByText('Nao foi possivel carregar as categorias do diretorio.'),
    ).toBeVisible()
    await expect(page.getByText('Nao foi possivel carregar os recursos em destaque.')).toBeVisible()
  })
})
