import { hydrateRoot } from 'react-dom/client'
import type { PageContext } from '../types/pageContext'
import { PageShell } from '../renderer/PageShell'
import '../index.css'
// Lista de propriedades que devem ser passadas do servidor para o cliente
export const passToClient = ['pageProps', 'Page', 'user']

export const render = (pageContext: PageContext) => {
  const { Page, pageProps } = pageContext
  console.log('Hidratando no cliente')

  // Forçar um pequeno atraso antes da hidratação pode ajudar em alguns casos
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
