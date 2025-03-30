// src/lib/lazy.tsx
import { Suspense, lazy } from 'react'
import Loading from '../components/ui/loading'

export function LazyImport(path: string) {
  const Component = lazy(() => import(path))
  return (
    <Suspense fallback={<Loading />}>
      <Component />
    </Suspense>
  )
}
