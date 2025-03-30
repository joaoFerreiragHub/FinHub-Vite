// src/pages/_default.page.server.tsx
import ReactDOMServer from 'react-dom/server'
import { escapeInject, dangerouslySkipEscape, type InjectFilterEntry } from 'vite-plugin-ssr/server'

type PageContext = {
  Page: React.FC
  pageProps?: Record<string, unknown>
}

export { render }

async function render(pageContext: PageContext): Promise<{ documentHtml: InjectFilterEntry }> {
  const { Page } = pageContext

  const pageHtml = ReactDOMServer.renderToString(<Page />)

  const documentHtml = escapeInject`<!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Minha App SSR</title>
      </head>
      <body>
        <div id="app">${dangerouslySkipEscape(pageHtml)}</div>
      </body>
    </html>`

  return {
    documentHtml,
  }
}
