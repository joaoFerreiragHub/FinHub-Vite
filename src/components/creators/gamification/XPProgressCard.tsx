// 1. XPPProgressCard.tsx
// Mostra o progresso visual do criador no nível atual

import { Progress } from "../../ui/progress"
import { Card, CardHeader, CardTitle, CardContent } from "../../ui/card"

interface XPPProgressCardProps {
  currentXP: number
  nextLevelXP: number
  level: number
}

export default function XPPProgressCard({ currentXP, nextLevelXP, level }: XPPProgressCardProps) {
  const percentage = Math.min((currentXP / nextLevelXP) * 100, 100)

  return (
    <Card>
      <CardHeader>
        <CardTitle>Nível {level} - Progresso</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between text-sm mb-2">
          <span>{currentXP} XP</span>
          <span>{nextLevelXP} XP</span>
        </div>
        <Progress value={percentage} />
      </CardContent>
    </Card>
  )
}
