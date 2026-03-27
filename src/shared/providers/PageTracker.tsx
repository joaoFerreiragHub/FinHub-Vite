import { useEffect, useRef } from 'react'
import { useLocation } from '@/lib/reactRouterDomCompat'
import { trackContentView, trackPageView } from '../../lib/analytics'

export function PageTracker() {
  const location = useLocation()
  const lastContentTrackedPathnameRef = useRef<string | null>(null)

  useEffect(() => {
    trackPageView(`${location.pathname}${location.search}`)

    if (lastContentTrackedPathnameRef.current !== location.pathname) {
      trackContentView(location.pathname)
      lastContentTrackedPathnameRef.current = location.pathname
    }
  }, [location.pathname, location.search])

  return null
}
