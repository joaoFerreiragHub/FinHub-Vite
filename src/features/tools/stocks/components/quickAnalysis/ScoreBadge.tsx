interface ScoreBadgeProps {
  label: string
  score: number
  max?: number
}

const getColor = (score: number, label?: string) => {
  if (label === 'Risco') {
    // Score baixo = risco alto (vermelho), score alto = risco baixo (verde)
    if (score >= 40) return 'bg-red-500'
    if (score >= 70) return 'bg-yellow-400'
    return 'bg-green-500'
  }

  // Lógica padrão para os restantes
  if (score >= 80) return 'bg-green-500'
  if (score >= 50) return 'bg-yellow-400'
  return 'bg-red-500'
}

export function ScoreBadge({ label, score, max = 100 }: ScoreBadgeProps) {
  const roundedScore = Math.round(score)

  return (
    <div className="flex items-center gap-2 text-sm">
      <span className="text-muted-foreground">{label}:</span>
      <span className={`px-2 py-1 rounded-full text-white ${getColor(roundedScore, label)}`}>
        {roundedScore}/{max}
      </span>
    </div>
  )
}
