// src/features/creators/components/dashboard/TopContentCard.tsx
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui'

export default function TopContentCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Conteúdo em Alta</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="font-semibold">"Guia Completo de Finanças Pessoais"</p>
        <p className="text-sm text-muted-foreground">145 visualizações esta semana</p>
      </CardContent>
    </Card>
  )
}
