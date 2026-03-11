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

test.describe('Public Content Details Smoke E2E', () => {
  test('renderiza detalhe publico em /videos/:slug', async ({ page }) => {
    await installVisitorContext(page)
    const videoId = 'video-e2e-1'
    const videoSlug = 'video-teste-e2e'

    await page.route('**/api/**', async (route) => {
      const request = route.request()
      const url = new URL(request.url())
      const method = request.method().toUpperCase()

      if (!url.pathname.startsWith('/api/')) {
        await route.fallback()
        return
      }

      if (method === 'GET' && url.pathname === `/api/videos/${videoSlug}`) {
        await fulfillJson(route, {
          id: videoId,
          slug: videoSlug,
          title: 'Video Publico E2E',
          description: 'Descricao de video para smoke E2E.',
          creator: { id: 'creator-1', name: 'Creator Video', username: 'creator_video' },
          creatorId: 'creator-1',
          quality: '1080p',
          duration: 720,
          viewCount: 1520,
          averageRating: 4.4,
          ratingCount: 18,
          isPremium: false,
          commentsEnabled: true,
          videoUrl: null,
          thumbnail: null,
          coverImage: null,
          publishedAt: NOW,
          createdAt: NOW,
          updatedAt: NOW,
        })
        return
      }

      if (method === 'POST' && url.pathname === `/api/videos/${videoId}/view`) {
        await fulfillJson(route, { ok: true })
        return
      }

      await fulfillJson(route, {})
    })

    await page.goto(`/videos/${videoSlug}`)
    await expect(page.getByRole('heading', { name: 'Video Publico E2E' })).toBeVisible()
    await expect(page.getByText('Descricao de video para smoke E2E.')).toBeVisible()
    await expect(page.getByText('Video').first()).toBeVisible()
  })

  test('renderiza detalhe publico em /cursos/:slug', async ({ page }) => {
    await installVisitorContext(page)
    const courseId = 'course-e2e-1'
    const courseSlug = 'curso-teste-e2e'

    await page.route('**/api/**', async (route) => {
      const request = route.request()
      const url = new URL(request.url())
      const method = request.method().toUpperCase()

      if (!url.pathname.startsWith('/api/')) {
        await route.fallback()
        return
      }

      if (method === 'GET' && url.pathname === `/api/courses/${courseSlug}`) {
        await fulfillJson(route, {
          id: courseId,
          slug: courseSlug,
          title: 'Curso Publico E2E',
          description: 'Descricao de curso para smoke E2E.',
          creator: { id: 'creator-2', name: 'Creator Course', username: 'creator_course' },
          creatorId: 'creator-2',
          level: 'beginner',
          totalDuration: 180,
          enrolledCount: 350,
          viewCount: 2800,
          averageRating: 4.7,
          ratingCount: 41,
          isPremium: false,
          commentsEnabled: true,
          learningOutcomes: ['Fundamentos', 'Gestao de risco'],
          totalModules: 1,
          totalLessons: 2,
          modules: [
            {
              id: 'module-1',
              title: 'Modulo 1',
              description: 'Introducao',
              duration: 180,
              lessons: [{ id: 'lesson-1' }, { id: 'lesson-2' }],
            },
          ],
          coverImage: null,
          publishedAt: NOW,
          createdAt: NOW,
          updatedAt: NOW,
        })
        return
      }

      if (method === 'POST' && url.pathname === `/api/courses/${courseId}/view`) {
        await fulfillJson(route, { ok: true })
        return
      }

      await fulfillJson(route, {})
    })

    await page.goto(`/cursos/${courseSlug}`)
    await expect(page.getByRole('heading', { name: 'Curso Publico E2E' })).toBeVisible()
    await expect(page.getByText('Descricao de curso para smoke E2E.')).toBeVisible()
    await expect(page.getByText('O que vais aprender')).toBeVisible()
    await expect(page.getByText('Modulo 1')).toBeVisible()
  })
})
