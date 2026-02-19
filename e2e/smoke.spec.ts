import { expect, test } from 'playwright/test'

const assertServerRenderedHtml = (html: string) => {
  const normalized = html.replace(/\s+/g, ' ')
  expect(normalized).toContain('<div id="app">')
  expect(normalized).not.toContain('<div id="app"></div>')
}

test.describe('Smoke E2E', () => {
  test('SSR entrega HTML com conteudo em rotas publicas', async ({ request }) => {
    const routes = [
      { path: '/', expectedText: 'Criadores Populares' },
      { path: '/noticias', expectedText: 'Noticias Financeiras' },
    ]

    for (const route of routes) {
      const response = await request.get(route.path)
      expect(response.ok()).toBeTruthy()
      const html = await response.text()

      assertServerRenderedHtml(html)
      expect(html).toContain(route.expectedText)
    }
  })

  test('navegacao publica principal funciona', async ({ page }) => {
    await page.goto('/')
    await expect(page.getByText('Criadores Populares')).toBeVisible()

    await page.locator('a[href="/creators"]').first().click()
    await expect(page).toHaveURL(/\/creators$/)
    await expect(page.getByText('Criadores em destaque')).toBeVisible()
  })

  test('pagina de noticias mostra fallback quando API falha', async ({ page }) => {
    await page.route('**/api/**', (route) => route.abort())
    await page.goto('/noticias')

    await expect(page.getByText('Noticias Financeiras')).toBeVisible()

    await Promise.race([
      page.getByText('Nao estamos a conseguir carregar as noticias').waitFor({ state: 'visible' }),
      page.getByText('Sem noticias para mostrar').waitFor({ state: 'visible' }),
      page.getByText('noticias filtradas').waitFor({ state: 'visible' }),
    ])
  })
})
