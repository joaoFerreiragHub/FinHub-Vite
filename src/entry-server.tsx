import { renderToString } from 'react-dom/server'
import { HelmetProvider, HelmetServerState } from 'react-helmet-async'
import { StaticRouter } from 'react-router-dom/server'
import App from './App'
import type { PageContextBuiltIn } from 'vite-plugin-ssr/types'

export async function render(pageContext: PageContextBuiltIn) {
  const helmetContext: { helmet?: HelmetServerState } = {}

  const app = (
    <HelmetProvider context={helmetContext}>
      <StaticRouter location={pageContext.urlOriginal}>
        <App />
      </StaticRouter>
    </HelmetProvider>
  )

  const appHtml = renderToString(app)

  return {
    documentHtml: `<!DOCTYPE html>
<html lang="pt">
  <head>
    ${helmetContext.helmet?.title?.toString() ?? ''}
    ${helmetContext.helmet?.meta?.toString() ?? ''}
  </head>
  <body>
    <div id="root">${appHtml}</div>
  </body>
</html>`,
  }
}
