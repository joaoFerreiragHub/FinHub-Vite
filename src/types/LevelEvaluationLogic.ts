// 4. LevelEvaluationLogic.ts
// Avalia o nível com base em dados mock

export interface CreatorStats {
  verified: boolean
  contents: number
  views: number
  interactions: number
  feedbackScore: number // de 0 a 1
}

export function evaluateLevel(stats: CreatorStats): number {
  if (!stats.verified) return 0
  if (stats.contents >= 30 && stats.views >= 1000 && stats.interactions >= 20) return 4
  if (stats.contents >= 10 && stats.views >= 300) return 3
  if (stats.contents >= 3 && stats.views >= 50) return 2
  return 1
}
