interface ScoreBadgeProps {
  label: string
  score: number
  max?: number
}

const getColor = (score: number) => {
  if (score >= 80) return 'bg-green-500'
  if (score >= 50) return 'bg-yellow-400'
  return 'bg-red-500'
}

export function ScoreBadge({ label, score, max = 100 }: ScoreBadgeProps) {
  return (
    <div className="flex items-center gap-2 text-sm">
      <span className="text-muted-foreground">{label}:</span>
      <span className={`px-2 py-1 rounded-full text-white ${getColor(score)}`}>
        {score}/{max}
      </span>
    </div>
  )
}
