import { Outlet } from '@/lib/reactRouterDomCompat'

/**
 * Layout minimalista sem header/footer
 * Usado para páginas especiais, embeds, etc.
 */
export default function MinimalLayout() {
  return (
    <div className="min-h-screen bg-white">
      <Outlet />
    </div>
  )
}
