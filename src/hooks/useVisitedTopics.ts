// src/hooks/useVisitedTopics.ts
import { useEffect, useState } from 'react'

export function useVisitedTopics() {
  const [visitedTopics, setVisitedTopics] = useState<string[]>([])

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('visitedTopics')
      if (stored) setVisitedTopics(JSON.parse(stored))
    }
  }, [])

  return visitedTopics
}
