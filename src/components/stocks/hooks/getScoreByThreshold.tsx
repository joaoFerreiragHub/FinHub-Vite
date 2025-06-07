export type Threshold =
  | {
      good: number
      medium: number
      reverse?: boolean
      neutralRange?: [number, number]
    }
  | {
      min?: number
      max?: number
      reverse?: boolean
    }
  | {
      custom: string // para tratamento especial noutro lado
    }

export function getScoreByThreshold(
  valueStr: string,
  threshold?: Threshold
): 'good' | 'medium' | 'bad' {
  if (!threshold) return 'bad'

  const value = parseFloat(valueStr)
  if (isNaN(value)) return 'bad'

  // 🎯 Caso 1: threshold com custom handler (devolve sempre 'medium' por default, ou 'bad' para destaque)
  if ('custom' in threshold) {
    return 'medium' // ou 'bad' se quiseres mostrar como pendente
  }

  // 🎯 Caso 2: threshold com min/max (genérico)
  if ('min' in threshold || 'max' in threshold) {
    const { min, max, reverse } = threshold

    if (reverse) {
      if (max !== undefined && value > max) return 'bad'
      if (min !== undefined && value > min) return 'medium'
      return 'good'
    } else {
      if (min !== undefined && value < min) return 'bad'
      if (max !== undefined && value > max) return 'bad'
      return 'good'
    }
  }

  // 🎯 Caso 3: threshold com good/medium/reverse (como Healthcare, Tech)
  const { good, medium, reverse, neutralRange } = threshold as {
    good: number
    medium: number
    reverse?: boolean
    neutralRange?: [number, number]
  }

  if (neutralRange) {
    const [min, max] = neutralRange
    if (value >= min && value <= max) return 'medium'
  }

  if (reverse) {
    if (value <= good) return 'good'
    if (value <= medium) return 'medium'
    return 'bad'
  } else {
    if (value >= good) return 'good'
    if (value >= medium) return 'medium'
    return 'bad'
  }
}
