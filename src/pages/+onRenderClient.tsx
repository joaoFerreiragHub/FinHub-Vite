import { hydrateRoot, createRoot } from 'react-dom/client'
import type { Root } from 'react-dom/client'
import type { PageContext } from '../lib/types/pageContext'
import { PageShell } from '../renderer/PageShell'
import { resolvePageComponent } from '../renderer/resolvePageComponent'
import '../index.css'

// Module-level root — must be reused across navigations.
// React does not allow creating a second root on the same container.
let root: Root | null = null

declare global {
  interface Window {
    _disableAutomaticLinkInterception?: boolean
  }
}

function onRenderClient(pageContext: PageContext) {
  if (!pageContext) {
    return
  }

  // React Router navigations are bridged to vike navigate() in PageShell.
  // Disable Vike automatic click interception to avoid duplicate navigations.
  window._disableAutomaticLinkInterception = true

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

  if (!root) {
    // First render: hydrate if server HTML exists, otherwise CSR
    const hasServerHtml = appElement.innerHTML.trim().length > 0
    if (hasServerHtml) {
      try {
        root = hydrateRoot(appElement, app, {
          onRecoverableError(error) {
            console.warn('[Vike] Hydration recoverable error:', error)
          },
        })
      } catch (err) {
        console.error('[Vike] Hydration failed, falling back to client render:', err)
        appElement.innerHTML = ''
        root = createRoot(appElement)
        root.render(app)
      }
    } else {
      root = createRoot(appElement)
      root.render(app)
    }
  } else {
    // Subsequent navigations: update the existing root instead of recreating it
    root.render(app)
  }
}

export default onRenderClient
