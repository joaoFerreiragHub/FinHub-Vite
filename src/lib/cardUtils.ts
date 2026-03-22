/**
 * Shared utilities for card components.
 * Single source of truth — imported by ContentCard wrappers.
 */

export function clampRating(value?: number): number {
  if (!Number.isFinite(value)) return 0
  return Math.max(0, Math.min(5, Number(value)))
}

export function formatDuration(totalMinutes?: number): string {
  if (!totalMinutes || totalMinutes <= 0) return 'Duração n/a'
  if (totalMinutes < 60) return `${totalMinutes} min`
  const hours = Math.floor(totalMinutes / 60)
  const minutes = totalMinutes % 60
  if (minutes === 0) return `${hours}h`
  return `${hours}h ${minutes}m`
}

export function formatDate(value?: string): string {
  if (!value) return 'Sem data'
  const timestamp = Date.parse(value)
  if (Number.isNaN(timestamp)) return 'Sem data'
  return new Intl.DateTimeFormat('pt-PT', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(new Date(timestamp))
}

export function formatCount(value?: number): string {
  if (!value || value <= 0) return '0'
  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(1)}M`
  if (value >= 1_000) return `${(value / 1_000).toFixed(1)}k`
  return String(value)
}

/** Derives a 0-5 rating from likes/views ratio for articles without explicit rating. */
export function deriveArticleRating(likes?: number, views?: number): number {
  if (!likes || !views || likes <= 0 || views <= 0) return 0
  return Math.min(5, Math.max(0, (likes / views) * 25))
}
