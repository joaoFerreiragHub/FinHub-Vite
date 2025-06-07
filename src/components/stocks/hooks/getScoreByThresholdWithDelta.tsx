import { getScoreByThreshold, Threshold } from "./getScoreByThreshold"

export function getScoreByThresholdWithDelta(
  value: number,
  previous?: number,
  threshold?: Threshold
): 'good' | 'medium' | 'bad' {
  const baseScore = getScoreByThreshold(value.toString(), threshold)

  if (!previous || isNaN(previous) || baseScore === 'good') return baseScore


  const improving = value > previous

  if (baseScore === 'bad' && improving) return 'medium'
  if (baseScore === 'medium' && !improving) return 'bad'

  return baseScore
}
