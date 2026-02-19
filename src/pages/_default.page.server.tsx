import ReactDOMServer from 'react-dom/server'
import { escapeInject, dangerouslySkipEscape } from 'vite-plugin-ssr/server'
import type { PageContext } from '../lib/types/pageContext'
import { PageShell } from '../renderer/PageShell'

export const passToClient = ['routeParams', 'pageProps', 'user']

type RenderResult = {
  documentHtml: ReturnType<typeof escapeInject>
}

export const render = async (pageContext: PageContext): Promise<RenderResult> => {
  // console.log('Server-side PageContext:', pageContext)
  const { Page, pageProps } = pageContext

  // Pass pageContext both to PageShell and Page component
  const pageHtml = ReactDOMServer.renderToString(
    <PageShell pageContext={pageContext}>
      <Page {...(pageProps || {})} pageContext={pageContext} />
    </PageShell>,
  )

  // Rest of your HTML template remains the same
  const documentHtml = escapeInject`<!DOCTYPE html>
<html lang="pt">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Minha App SSR</title>
    <script>
      (function() {
        try {
          const theme = localStorage.getItem('theme');
          if (theme) {
            document.documentElement.classList.remove('light', 'dark');
            document.documentElement.classList.add(theme);
            console.log('Tema inicial aplicado:', theme);
          } else {
            // Se não houver tema salvo, use light por padrão
            document.documentElement.classList.add('light');
            console.log('Tema padrão (light) aplicado');
          }
        } catch(e) {
          console.error('Erro ao aplicar tema inicial:', e);
          document.documentElement.classList.add('light');
        }
      })();
    </script>
  </head>
  <body>
    <div id="app">${dangerouslySkipEscape(pageHtml)}</div>
  </body>
</html>`

  return { documentHtml }
}
