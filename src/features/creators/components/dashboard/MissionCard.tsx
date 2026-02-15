// src/features/creators/components/dashboard/MissionCard.tsx
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui'
import { Progress } from '@/components/ui'

export default function MissionCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Missão da Semana</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="mb-2">Publicar 2 novos conteúdos</p>
        <Progress value={50} />
        <p className="text-sm text-muted-foreground mt-1">1 de 2 concluído</p>
      </CardContent>
    </Card>
  )
}
