import { hydrateRoot, createRoot } from 'react-dom/client'
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

  const app = (
    <PageShell pageContext={pageContext}>
      <ResolvedPage {...(pageProps || {})} />
    </PageShell>
  )

  // Server routing: every page load is a fresh hydration.
  // If hydration fails (e.g. server/client mismatch), fall back to a full
  // client render so the page stays interactive instead of being "dead".
  const hasServerHtml = appElement.innerHTML.trim().length > 0
  if (hasServerHtml) {
    try {
      hydrateRoot(appElement, app, {
        onRecoverableError(error) {
          console.warn('[Vike] Hydration recoverable error:', error)
        },
      })
    } catch (err) {
      console.error('[Vike] Hydration failed, falling back to client render:', err)
      appElement.innerHTML = ''
      createRoot(appElement).render(app)
    }
  } else {
    createRoot(appElement).render(app)
  }
}

export default onRenderClient
