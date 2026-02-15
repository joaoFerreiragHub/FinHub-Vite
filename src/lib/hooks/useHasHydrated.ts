// ✅ 1. Cria este hook: src/hooks/useHasHydrated.ts
import { useEffect, useState } from 'react'
import { useAuthStore } from '@/features/auth/stores/useAuthStore'

export function useHasHydrated() {
  const [hasHydrated, setHasHydrated] = useState(false)

  useEffect(() => {
    const unsub = useAuthStore.persist.onFinishHydration(() => {
      setHasHydrated(true)
    })
    return unsub
  }, [])

  return hasHydrated
}
