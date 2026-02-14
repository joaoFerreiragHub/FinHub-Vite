// ✅ 1. Cria este hook: src/hooks/useHasHydrated.ts
import { useEffect, useState } from 'react'
import { useUserStore } from '../stores/useUserStore'

export function useHasHydrated() {
  const [hasHydrated, setHasHydrated] = useState(false)

  useEffect(() => {
    const unsub = useUserStore.persist.onFinishHydration(() => {
      setHasHydrated(true)
    })
    return unsub
  }, [])

  return hasHydrated
}
