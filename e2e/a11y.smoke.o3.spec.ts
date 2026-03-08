import { expect, test, type Page, type Route } from 'playwright/test'

const NOW = new Date().toISOString()

const fulfillJson = async (route: Route, data: unknown, status = 200) => {
  await route.fulfill({
    status,
    contentType: 'application/json',
    body: JSON.stringify(data),
  })
}

const installArticleDetailMocks = async (page: Page) => {
  await page.route('**/api/articles/release-e2e-a11y', async (route) => {
    await fulfillJson(route, {
      id: 'article-a11y-id',
      title: 'Artigo A11Y E2E',
      slug: 'release-e2e-a11y',
      description: 'Smoke de acessibilidade O3-08.',
      content: '<p>Conteudo de validacao a11y.</p>',
      creator: { name: 'FinHub Creator' },
      status: 'published',
      viewCount: 10,
      averageRating: 4.2,
      ratingCount: 3,
      commentCount: 0,
      isPremium: false,
      createdAt: NOW,
      updatedAt: NOW,
      publishedAt: NOW,
    })
  })

  await page.route('**/api/articles/article-a11y-id/view', async (route) => {
    await fulfillJson(route, { incremented: true }, 201)
  })
}

const assertMainAndHeading = async (page: Page) => {
  await expect(page.locator('main').first()).toBeVisible()
  await expect(page.locator('h1').first()).toBeVisible()
}

test.describe('O3-08 A11Y Smoke', () => {
  test('rotas criticas expõem landmark main e heading principal', async ({ page }) => {
    await installArticleDetailMocks(page)

    const routes = ['/', '/login', '/registar', '/artigos/release-e2e-a11y']
    for (const route of routes) {
      await page.goto(route)
      await assertMainAndHeading(page)
    }
  })

  test('navegacao por teclado chega ao primeiro elemento focavel', async ({ page }) => {
    await page.goto('/login')
    await page.keyboard.press('Tab')

    const activeTagName = await page.evaluate(
      () => document.activeElement?.tagName?.toLowerCase() ?? ''
    )

    expect(activeTagName).not.toBe('')
    expect(activeTagName).not.toBe('body')
  })
})
