// src/features/creators/components/dashboard/ContentSummaryCard.tsx

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui'

export default function ContentSummaryCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Total de Conteúdos</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-2xl font-bold">12</p>
        <p className="text-sm text-muted-foreground">Cursos, Playlists, Ferramentas</p>
      </CardContent>
    </Card>
  )
}
