import { hydrateRoot } from 'react-dom/client'
import type { PageContext } from '../lib/types/pageContext'
import { PageShell } from '../renderer/PageShell'
import { resolvePageComponent } from '../renderer/resolvePageComponent'
import '../index.css'

function onRenderClient(pageContext: PageContext) {
  if (!pageContext) {
    return
  }

  const { Page, pageProps } = pageContext
  const ResolvedPage = resolvePageComponent(Page as unknown)
  const appElement = document.getElementById('app')
  if (!appElement) {
    return
  }

  hydrateRoot(
    appElement,
    <PageShell pageContext={pageContext}>
      <ResolvedPage {...(pageProps || {})} />
    </PageShell>,
  )
}

export default onRenderClient
