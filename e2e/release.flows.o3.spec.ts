import { expect, test, type Page, type Route } from 'playwright/test'

type SessionRole = 'visitor' | 'free' | 'creator' | 'admin'

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
  await page.addInitScript((value: string) => {
    window.localStorage.setItem('auth-storage', value)
  }, authStorage)
}

const fulfillJson = async (route: Route, data: unknown, status = 200) => {
  await route.fulfill({
    status,
    contentType: 'application/json',
    body: JSON.stringify(data),
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
  test('registo redireciona para dashboard de creator', async ({ page }) => {
    await installSession(page, 'visitor')

    await page.route('**/api/auth/register', async (route) => {
      await fulfillJson(route, {
        user: buildAuthResponseUser('creator'),
        tokens: {
          accessToken: 'register-access-token.jwt.mock',
          refreshToken: 'register-refresh-token.jwt.mock',
        },
      }, 201)
    })

    await page.goto('/registar')

    await page.fill('#name', 'Release')
    await page.fill('#lastName', 'Tester')
    await page.fill('#email', 'release.register@finhub.test')
    await page.fill('#username', 'release_register')
    await page.fill('#password', 'Release123')
    await page.fill('#confirmPassword', 'Release123')
    await page.getByRole('button', { name: 'Criar Conta' }).click()

    await expect(page).toHaveURL(/\/dashboard$/)
  })

  test('login redireciona para dashboard de creator', async ({ page }) => {
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

    await page.goto('/login')
    await page.fill('#email', 'release.login@finhub.test')
    await page.fill('#password', 'Release123')
    await page.getByRole('button', { name: 'Entrar' }).click()

    await expect(page).toHaveURL(/\/dashboard$/)
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

    await page.goto('/dashboard/conteudo/artigos')
    await expect(page.getByRole('heading', { name: 'Gestao de artigos' })).toBeVisible()
    await expect(page.getByText('Rascunho')).toBeVisible()

    await page.getByRole('button', { name: 'Publicar' }).first().click()
    await expect(page.getByText('Publicado')).toBeVisible()
  })

  test('consumidor abre detalhe de artigo publicado', async ({ page }) => {
    await installSession(page, 'visitor')

    await page.route('**/api/articles/release-e2e-article', async (route) => {
      await fulfillJson(route, {
        id: 'article-release-id',
        title: 'Artigo Release E2E',
        slug: 'release-e2e-article',
        description: 'Conteudo publicado para consumo no gate de release.',
        content: '<p>Conteudo para validacao release.</p>',
        creator: { name: 'FinHub Creator' },
        status: 'published',
        viewCount: 42,
        averageRating: 4.4,
        ratingCount: 12,
        commentCount: 3,
        isPremium: false,
        createdAt: NOW,
        updatedAt: NOW,
        publishedAt: NOW,
      })
    })

    await page.route('**/api/articles/article-release-id/view', async (route) => {
      await fulfillJson(route, { incremented: true }, 201)
    })

    await page.goto('/artigos/release-e2e-article')

    await expect(page.getByRole('heading', { name: 'Artigo Release E2E' })).toBeVisible()
    await expect(page.getByText('Voltar para explorar artigos')).toBeVisible()
  })
})
