import { expect, test, type Page, type Route } from 'playwright/test'

type CommentTargetType = 'article' | 'directory_entry'

interface MockCommentUser {
  _id: string
  name: string
  username: string
  avatar?: string
}

interface MockComment {
  _id: string
  targetType: CommentTargetType
  targetId: string
  content: string
  user: MockCommentUser
  likes: number
  likedBy: string[]
  depth: number
  replies: MockComment[]
  repliesCount: number
  createdAt: string
  updatedAt: string
}

const NOW = new Date().toISOString()

const buildAuthStorage = () =>
  JSON.stringify({
    state: {
      user: {
        id: 'e2e-free-user-1',
        name: 'E2E Free',
        email: 'free@finhub.test',
        username: 'e2e_free',
        role: 'free',
        accountStatus: 'active',
        isEmailVerified: true,
        createdAt: NOW,
        updatedAt: NOW,
      },
      accessToken: 'e2e-free-access-token.jwt.mock',
      refreshToken: 'e2e-free-refresh-token.jwt.mock',
      isAuthenticated: true,
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

const installAuthSession = async (page: Page) => {
  const authStorage = buildAuthStorage()
  const cookieConsentStorage = buildCookieConsentStorage()
  await page.addInitScript(
    ({ authValue, consentValue }: { authValue: string; consentValue: string }) => {
      window.localStorage.setItem('auth-storage', authValue)
      window.localStorage.setItem('finhub-cookie-consent', consentValue)
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

const submitComment = async (page: Page, content: string) => {
  const commentForm = page
    .locator('form')
    .filter({ has: page.locator('textarea[placeholder*="Partilhe"]') })
    .first()

  await commentForm.locator('textarea').fill(content)
  await commentForm.getByRole('button', { name: 'Comentar' }).click()
}

test.describe('Comments Smoke E2E', () => {
  test('fluxo de comentarios funciona em /artigos/:slug', async ({ page }) => {
    await installAuthSession(page)
    const articleId = 'article-e2e-1'
    const articleSlug = 'mercados-em-alta-e2e'
    const comments: MockComment[] = [
      {
        _id: 'article-comment-1',
        targetType: 'article',
        targetId: articleId,
        content: 'Comentario inicial artigo E2E',
        user: {
          _id: 'seed-user-1',
          name: 'Seed User',
          username: 'seed_user',
        },
        likes: 0,
        likedBy: [],
        depth: 0,
        replies: [],
        repliesCount: 0,
        createdAt: NOW,
        updatedAt: NOW,
      },
    ]

    await page.route('**/api/**', async (route) => {
      const request = route.request()
      const url = new URL(request.url())
      const method = request.method().toUpperCase()
      const { pathname } = url

      if (!pathname.startsWith('/api/')) {
        await route.fallback()
        return
      }

      if (method === 'GET' && pathname === `/api/articles/${articleSlug}`) {
        await fulfillJson(route, {
          id: articleId,
          type: 'article',
          slug: articleSlug,
          title: 'Mercados em Alta E2E',
          description: 'Detalhe publico para validar comentarios',
          content: '<p>Conteudo de teste E2E para artigo.</p>',
          creator: { id: 'creator-1', name: 'Creator E2E', username: 'creator_e2e' },
          creatorId: 'creator-1',
          category: 'news',
          tags: ['mercados'],
          viewCount: 42,
          likeCount: 3,
          favoriteCount: 1,
          shareCount: 0,
          averageRating: 4.2,
          ratingCount: 5,
          reviewCount: 2,
          commentCount: comments.length,
          commentsEnabled: true,
          requiredRole: 'free',
          isPremium: false,
          isFeatured: false,
          status: 'published',
          isPublished: true,
          publishedAt: NOW,
          createdAt: NOW,
          updatedAt: NOW,
        })
        return
      }

      if (method === 'POST' && pathname === `/api/articles/${articleId}/view`) {
        await fulfillJson(route, { ok: true })
        return
      }

      if (method === 'GET' && pathname === `/api/comments/article/${articleId}/tree`) {
        await fulfillJson(route, {
          comments,
          pagination: {
            page: 1,
            limit: 10,
            total: comments.length,
            pages: 1,
          },
        })
        return
      }

      if (method === 'POST' && pathname === '/api/comments') {
        const body = request.postDataJSON() as {
          targetType?: string
          targetId?: string
          content?: string
        }

        if (body.targetType === 'article' && body.targetId === articleId && body.content) {
          comments.push({
            _id: `article-comment-${comments.length + 1}`,
            targetType: 'article',
            targetId: articleId,
            content: body.content,
            user: {
              _id: 'e2e-free-user-1',
              name: 'E2E Free',
              username: 'e2e_free',
            },
            likes: 0,
            likedBy: [],
            depth: 0,
            replies: [],
            repliesCount: 0,
            createdAt: NOW,
            updatedAt: NOW,
          })
        }

        await fulfillJson(route, { ok: true }, 201)
        return
      }

      await fulfillJson(route, {})
    })

    await page.goto(`/artigos/${articleSlug}`)
    await expect(page.getByRole('heading', { name: 'Mercados em Alta E2E' })).toBeVisible()
    await expect(page.getByText(/Coment/i).first()).toBeVisible()
    await expect(page.getByText('Comentario inicial artigo E2E')).toBeVisible()

    await submitComment(page, 'Novo comentario artigo E2E')

    await expect(page.getByText('Novo comentario artigo E2E')).toBeVisible()
  })

  test('fluxo de comentarios funciona em /recursos/:slug', async ({ page }) => {
    await installAuthSession(page)
    const directoryId = 'directory-e2e-1'
    const directorySlug = 'exchange-pro-e2e'
    const comments: MockComment[] = [
      {
        _id: 'directory-comment-1',
        targetType: 'directory_entry',
        targetId: directoryId,
        content: 'Comentario inicial recurso E2E',
        user: {
          _id: 'seed-user-2',
          name: 'Seed Resource',
          username: 'seed_resource',
        },
        likes: 0,
        likedBy: [],
        depth: 0,
        replies: [],
        repliesCount: 0,
        createdAt: NOW,
        updatedAt: NOW,
      },
    ]

    await page.route('**/api/**', async (route) => {
      const request = route.request()
      const url = new URL(request.url())
      const method = request.method().toUpperCase()
      const { pathname, searchParams } = url

      if (!pathname.startsWith('/api/')) {
        await route.fallback()
        return
      }

      if (method === 'GET' && pathname === '/api/directories/search') {
        const query = searchParams.get('q')
        if (query === directorySlug) {
          await fulfillJson(route, {
            query,
            items: [
              {
                id: directoryId,
                name: 'Exchange Pro E2E',
                slug: directorySlug,
                verticalType: 'exchange',
                shortDescription: 'Descricao curta E2E',
                verificationStatus: 'verified',
                isFeatured: true,
                isSponsoredPlacement: false,
                views: 120,
                averageRating: 4.6,
                ratingsCount: 9,
                commentsCount: comments.length,
              },
            ],
            filters: {
              verticalType: null,
              country: null,
              verificationStatus: null,
              search: query,
              featured: null,
              tags: [],
              sort: 'name',
            },
            pagination: {
              page: 1,
              limit: 25,
              total: 1,
              pages: 1,
            },
          })
          return
        }
      }

      if (method === 'GET' && pathname === `/api/directories/exchange/${directorySlug}`) {
        await fulfillJson(route, {
          entry: {
            id: directoryId,
            name: 'Exchange Pro E2E',
            slug: directorySlug,
            verticalType: 'exchange',
            shortDescription: 'Descricao curta E2E',
            description: 'Descricao longa de recurso para E2E.',
            verificationStatus: 'verified',
            isFeatured: true,
            isSponsoredPlacement: false,
            views: 120,
            averageRating: 4.6,
            ratingsCount: 9,
            commentsCount: comments.length,
            coverImage: null,
            canonicalUrl: null,
            country: 'PT',
            region: 'EU',
            regulatedBy: [],
            licenses: [],
            pros: [],
            cons: [],
            keyFeatures: [],
            pricing: null,
            categories: [],
            tags: [],
            socialLinks: null,
            sponsoredPlacement: null,
            publishedAt: NOW,
            updatedAt: NOW,
          },
        })
        return
      }

      if (
        method === 'GET' &&
        pathname === `/api/directories/exchange/${directorySlug}/related-content`
      ) {
        await fulfillJson(route, {
          directory: {
            id: directoryId,
            name: 'Exchange Pro E2E',
            slug: directorySlug,
            verticalType: 'exchange',
          },
          items: [],
          total: 0,
          limit: 9,
        })
        return
      }

      if (method === 'GET' && pathname === `/api/comments/directory_entry/${directoryId}/tree`) {
        await fulfillJson(route, {
          comments,
          pagination: {
            page: 1,
            limit: 10,
            total: comments.length,
            pages: 1,
          },
        })
        return
      }

      if (method === 'POST' && pathname === '/api/comments') {
        const body = request.postDataJSON() as {
          targetType?: string
          targetId?: string
          content?: string
        }

        if (
          body.targetType === 'directory_entry' &&
          body.targetId === directoryId &&
          body.content
        ) {
          comments.push({
            _id: `directory-comment-${comments.length + 1}`,
            targetType: 'directory_entry',
            targetId: directoryId,
            content: body.content,
            user: {
              _id: 'e2e-free-user-1',
              name: 'E2E Free',
              username: 'e2e_free',
            },
            likes: 0,
            likedBy: [],
            depth: 0,
            replies: [],
            repliesCount: 0,
            createdAt: NOW,
            updatedAt: NOW,
          })
        }

        await fulfillJson(route, { ok: true }, 201)
        return
      }

      if (method === 'GET' && pathname === `/api/ratings/directory_entry/${directoryId}/stats`) {
        await fulfillJson(route, {
          average: 0,
          total: 0,
          distribution: { '1': 0, '2': 0, '3': 0, '4': 0, '5': 0 },
          reviews: { withText: 0, totalLikes: 0, totalDislikes: 0 },
        })
        return
      }

      if (method === 'GET' && pathname === `/api/ratings/directory_entry/${directoryId}`) {
        await fulfillJson(route, {
          ratings: [],
          pagination: {
            page: 1,
            limit: 10,
            total: 0,
            pages: 1,
          },
        })
        return
      }

      if (method === 'GET' && pathname === `/api/ratings/my/directory_entry/${directoryId}`) {
        await fulfillJson(route, { message: 'Not found' }, 404)
        return
      }

      await fulfillJson(route, {})
    })

    await page.goto(`/recursos/${directorySlug}`)
    await expect(page.getByText('Exchange Pro E2E').first()).toBeVisible()
    await expect(page.getByText(/Coment/i).first()).toBeVisible()
    await expect(page.getByText('Comentario inicial recurso E2E')).toBeVisible()

    await submitComment(page, 'Novo comentario recurso E2E')

    await expect(page.getByText('Novo comentario recurso E2E')).toBeVisible()
  })
})
