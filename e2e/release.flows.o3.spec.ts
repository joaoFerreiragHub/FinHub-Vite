import { expect, test, type Page, type Route } from 'playwright/test'

type SessionRole = 'visitor' | 'free' | 'creator' | 'brand_manager' | 'admin'

const NOW = new Date().toISOString()

const buildAuthStorage = (role: SessionRole) => {
  const authenticated = role !== 'visitor'

  return JSON.stringify({
    state: {
      user: {
        id: `e2e-${role}-1`,
        name: `E2E ${role}`,
        email: `${role}@finhub.test`,
        username: `e2e_${role}`,
        role,
        accountStatus: 'active',
        isEmailVerified: true,
        emailVerified: true,
        createdAt: NOW,
        updatedAt: NOW,
      },
      accessToken: authenticated ? 'e2e-access-token.jwt.mock' : null,
      refreshToken: authenticated ? 'e2e-refresh-token.jwt.mock' : null,
      isAuthenticated: authenticated,
    },
    version: 0,
  })
}

const installSession = async (page: Page, role: SessionRole) => {
  const authStorage = buildAuthStorage(role)
  const cookieConsentStorage = JSON.stringify({
    essential: true,
    analytics: true,
    marketing: true,
    preferences: true,
    consentedAt: NOW,
    version: 'v1',
  })

  await page.addInitScript(
    ({ authValue, consentValue }: { authValue: string; consentValue: string }) => {
      window.localStorage.setItem('auth-storage', authValue)
      window.localStorage.setItem('finhub-cookie-consent', consentValue)
    },
    { authValue: authStorage, consentValue: cookieConsentStorage },
  )
}

const fulfillJson = async (route: Route, data: unknown, status = 200) => {
  await route.fulfill({
    status,
    contentType: 'application/json',
    body: JSON.stringify(data),
  })
}

const installBrandPortalMocks = async (page: Page) => {
  await page.route('**/api/brand-portal/**', async (route) => {
    await fulfillJson(route, {})
  })
}

const buildAuthResponseUser = (role: Exclude<SessionRole, 'visitor'>) => ({
  id: `auth-${role}-1`,
  name: `Auth ${role}`,
  email: `${role}@finhub.test`,
  username: `auth_${role}`,
  role,
  accountStatus: 'active',
  isEmailVerified: true,
  emailVerified: true,
  createdAt: NOW,
  updatedAt: NOW,
})

test.describe('O3-07 Release Flows', () => {
  test('registo autentica creator no fluxo publico', async ({ page }) => {
    await installSession(page, 'visitor')

    await page.route('**/api/auth/register', async (route) => {
      await fulfillJson(
        route,
        {
          user: buildAuthResponseUser('creator'),
          tokens: {
            accessToken: 'register-access-token.jwt.mock',
            refreshToken: 'register-refresh-token.jwt.mock',
          },
        },
        201,
      )
    })

    await page.goto('/')
    await page.waitForLoadState('networkidle')
    await page.getByRole('button', { name: 'Registar' }).first().dispatchEvent('click')
    await expect(page.getByRole('heading', { name: 'Criar Conta' })).toBeVisible()
    await page.fill('#name', 'Release')
    await page.fill('#register-email', 'release.register@finhub.test')
    await page.fill('#register-username', 'release_register')
    await page.fill('#register-password', 'Release123')
    await page.fill('#confirm-password', 'Release123')
    await page.getByLabel('Aceito os Termos de Servico').check()
    await page.getByLabel('Aceito a Politica de Privacidade').check()
    await page.getByLabel('Li e aceito o Aviso Legal Financeiro').check()
    await page.getByRole('button', { name: 'Criar Conta' }).click()

    await expect(page.getByRole('button', { name: 'Sair' })).toBeVisible()
  })

  test('login autentica creator no fluxo publico', async ({ page }) => {
    await installSession(page, 'visitor')

    await page.route('**/api/auth/login', async (route) => {
      await fulfillJson(route, {
        user: buildAuthResponseUser('creator'),
        tokens: {
          accessToken: 'login-access-token.jwt.mock',
          refreshToken: 'login-refresh-token.jwt.mock',
        },
      })
    })

    await page.goto('/')
    await page.waitForLoadState('networkidle')
    await page.getByRole('button', { name: 'Login' }).first().dispatchEvent('click')
    await expect(page.getByRole('heading', { name: /Iniciar Sess/ })).toBeVisible()
    await page.fill('#email', 'release.login@finhub.test')
    await page.fill('#password', 'Release123')
    await page.getByRole('button', { name: 'Entrar' }).click()

    await expect(page.getByRole('button', { name: 'Sair' })).toBeVisible()
  })

  test('creator publica artigo draft no dashboard', async ({ page }) => {
    await installSession(page, 'creator')

    let isPublished = false

    await page.route('**/api/articles/me**', async (route) => {
      await fulfillJson(route, {
        items: [
          {
            id: 'article-draft-1',
            title: 'Artigo release draft',
            slug: 'artigo-release-draft',
            description: 'Draft para validar publish no fluxo O3-07.',
            status: isPublished ? 'published' : 'draft',
            viewCount: 12,
            likeCount: 2,
            averageRating: 4.6,
            ratingCount: 5,
            commentCount: 1,
            updatedAt: NOW,
          },
        ],
        total: 1,
        limit: 20,
        offset: 0,
        hasMore: false,
      })
    })

    await page.route('**/api/articles/article-draft-1/publish', async (route) => {
      isPublished = true
      await fulfillJson(route, {
        id: 'article-draft-1',
        title: 'Artigo release draft',
        slug: 'artigo-release-draft',
        description: 'Draft para validar publish no fluxo O3-07.',
        status: 'published',
      })
    })

    await page.goto('/creators/dashboard/articles')
    await expect(page.getByRole('heading', { name: 'Gerir Artigos' })).toBeVisible()
    await expect(page.getByText('Rascunho', { exact: true })).toBeVisible()

    await page.getByRole('button', { name: 'Publicar' }).first().click()
    await expect(page.getByText('Publicado', { exact: true })).toBeVisible()
  })

  test('consumidor consegue navegar para noticias publicas', async ({ page }) => {
    await installSession(page, 'visitor')

    await page.route('**/api/news**', async (route) => {
      await fulfillJson(route, {
        items: [],
        total: 0,
        hasMore: false,
      })
    })

    await page.goto('/noticias')
    await expect(page.getByText('Noticias Financeiras')).toBeVisible()
  })

  test('free nao ve atalho do portal de marca no header', async ({ page }) => {
    await installSession(page, 'free')

    await page.goto('/')
    await page.waitForLoadState('networkidle')
    await expect(page.getByRole('link', { name: 'Portal de Marca' })).toHaveCount(0)
  })

  test('brand_manager navega para /marcas/portal no gate critico', async ({ page }) => {
    await installSession(page, 'brand_manager')
    await installBrandPortalMocks(page)

    await page.goto('/')
    await page.waitForLoadState('networkidle')

    const portalLink = page.getByRole('link', { name: 'Portal de Marca' })
    await expect(portalLink).toBeVisible()
    await expect(portalLink).toHaveAttribute('href', '/marcas/portal')

    await page.goto('/marcas/portal')
    await expect(page).toHaveURL(/\/marcas\/portal$/)
    await expect(page.getByRole('heading', { name: 'Portal de Marca' })).toBeVisible()
  })
})
