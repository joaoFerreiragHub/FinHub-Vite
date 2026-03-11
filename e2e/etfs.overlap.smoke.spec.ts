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

const buildEtfOverlapPayload = () => ({
  overlap: {
    overlappingHoldings: {
      'Microsoft Corp': 3.25,
      'Apple Inc.': 2.8,
      Nvidia: 2.1,
    },
  },
  sectors: {
    totalSectorOverlapWeight: 68.4,
    sectorOverlap: {
      Technology: {
        etf1Weight: 22.1,
        etf2Weight: 24.8,
      },
      Financials: {
        etf1Weight: 12.2,
        etf2Weight: 10.4,
      },
    },
  },
})

test.describe('ETF Overlap Smoke E2E', () => {
  test('compara ETFs em /mercados/etfs e renderiza resultados', async ({ page }) => {
    await installVisitorContext(page)
    const payload = buildEtfOverlapPayload()

    await page.route('**/api/**', async (route) => {
      const request = route.request()
      const url = new URL(request.url())
      const method = request.method().toUpperCase()

      if (!url.pathname.startsWith('/api/')) {
        await route.fallback()
        return
      }

      if (method === 'GET' && url.pathname === '/api/etfs/compare-yahoo') {
        await fulfillJson(route, payload)
        return
      }

      await fulfillJson(route, {})
    })

    await page.goto('/mercados/etfs')
    await expect(page.getByRole('heading', { name: 'Comparador de ETFs' })).toBeVisible()
    await acceptCookieBannerIfVisible(page)

    const compareResponse = page.waitForResponse(
      (response) =>
        response.request().method() === 'GET' && response.url().includes('/api/etfs/compare-yahoo'),
    )

    await page.locator('#etf-left').fill('VWCE.DE')
    await page.locator('#etf-right').fill('IWDA.AS')
    await page.getByRole('button', { name: 'Comparar' }).click()
    await compareResponse

    await expect(page.locator('p', { hasText: 'Sobreposicao setorial' }).first()).toBeVisible()
    await expect(page.getByText('68.40%')).toBeVisible()
    await expect(page.getByRole('heading', { name: 'Top holdings em comum' })).toBeVisible()
    await expect(page.getByText('Microsoft Corp')).toBeVisible()
    await expect(page.getByRole('heading', { name: 'Overlap por setor' })).toBeVisible()
    await expect(page.getByText('Technology')).toBeVisible()
  })

  test('mostra erro amigavel quando endpoint de overlap falha', async ({ page }) => {
    await installVisitorContext(page)

    await page.route('**/api/**', async (route) => {
      const request = route.request()
      const url = new URL(request.url())
      const method = request.method().toUpperCase()

      if (!url.pathname.startsWith('/api/')) {
        await route.fallback()
        return
      }

      if (method === 'GET' && url.pathname === '/api/etfs/compare-yahoo') {
        await fulfillJson(route, { error: 'upstream failed' }, 500)
        return
      }

      await fulfillJson(route, {})
    })

    await page.goto('/mercados/etfs')
    await expect(page.getByRole('heading', { name: 'Comparador de ETFs' })).toBeVisible()
    await acceptCookieBannerIfVisible(page)

    const compareResponse = page.waitForResponse(
      (response) =>
        response.request().method() === 'GET' && response.url().includes('/api/etfs/compare-yahoo'),
    )

    await page.getByRole('button', { name: 'Comparar' }).click()
    await compareResponse

    await expect(
      page.getByText(
        'Nao foi possivel comparar estes ETFs agora. Verifica se o endpoint /etfs/overlap esta ativo e tenta novamente.',
      ),
    ).toBeVisible()
  })
})
