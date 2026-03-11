import { hydrateRoot } from 'react-dom/client'
import type { PageContext } from '../lib/types/pageContext'
import { PageShell } from '../renderer/PageShell'
import '../index.css'

function onRenderClient(pageContext: PageContext) {
  if (!pageContext) {
    return
  }

  const { Page, pageProps } = pageContext
  const appElement = document.getElementById('app')
  if (!appElement) {
    return
  }

  hydrateRoot(
    appElement,
    <PageShell pageContext={pageContext}>
      <Page {...(pageProps || {})} />
    </PageShell>,
  )
}

export default onRenderClient
