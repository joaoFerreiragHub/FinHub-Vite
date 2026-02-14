export function addVisitedTopics(topics: string[]) {
  if (typeof window === 'undefined') return

  const existing: string[] = JSON.parse(localStorage.getItem('visitedTopics') || '[]')

  const updated = Array.from(new Set([...existing, ...topics])) // evita duplicados

  localStorage.setItem('visitedTopics', JSON.stringify(updated))
}
