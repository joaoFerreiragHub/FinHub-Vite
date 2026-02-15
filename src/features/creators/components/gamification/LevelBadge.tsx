// 2. LevelBadge.tsx
// Ícone visual com nome do nível

interface LevelBadgeProps {
  level: number
  label: string
}

export function LevelBadge({ level, label }: LevelBadgeProps) {
  const colors = ['bg-gray-200', 'bg-blue-200', 'bg-green-200', 'bg-yellow-200', 'bg-purple-300']
  return (
    <span className={`px-3 py-1 rounded-full text-xs font-medium ${colors[level - 1]} text-black`}>
      Nível {level} – {label}
    </span>
  )
}
