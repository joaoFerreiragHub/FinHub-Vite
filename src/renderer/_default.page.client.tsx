// src/renderer/_default.page.client.tsx
import { createRoot } from 'react-dom/client'
type PageContext = {
  Page: React.FC
  pageProps?: Record<string, unknown>
}

export { render }

async function render(pageContext: PageContext) {
  const { Page } = pageContext
  const root = createRoot(document.getElementById('app')!)
  root.render(<Page />)
}
