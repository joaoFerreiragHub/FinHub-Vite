import { hydrateRoot } from 'react-dom/client'
import type { PageContext } from '../types/pageContext'
import { PageShell } from '../renderer/PageShell'
import '../index.css'
// Lista de propriedades que devem ser passadas do servidor para o cliente
export const passToClient = ['routeParams','pageProps','user',]

export const render = (pageContext: PageContext) => {
  console.log('Client-side PageContext:', pageContext) // Debug log
  if (!pageContext) {
    console.error('PageContext is undefined on the client')
    return
  }

  const { Page, pageProps } = pageContext
  console.log('Hidratando no cliente')

  setTimeout(() => {
    const appElement = document.getElementById('app')
    if (appElement) {
      console.log('Elemento app encontrado, hidratando', pageProps)
      try {
        hydrateRoot(
          appElement,
          <PageShell pageContext={pageContext}>
            <Page {...(pageProps || {})} />
          </PageShell>,
        )
        console.log('Hidratação bem-sucedida')
      } catch (e) {
        console.error('Erro durante hidratação:', e)
      }
    } else {
      console.error('Elemento app não encontrado')
    }
  }, 0)
}
