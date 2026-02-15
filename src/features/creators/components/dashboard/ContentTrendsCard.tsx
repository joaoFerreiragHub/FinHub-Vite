// src/features/creators/components/dashboard/ContentTrendsCard.tsx
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui'
import { TrendingUp, Clock, ThumbsUp } from 'lucide-react'

export default function ContentTrendsCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Tendências de Conteúdo</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center gap-3">
          <TrendingUp className="w-5 h-5 text-primary" />
          <div>
            <p className="text-sm font-medium">Mais Visto:</p>
            <p className="text-sm text-muted-foreground">"Guia de Investimentos 2024"</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Clock className="w-5 h-5 text-primary" />
          <div>
            <p className="text-sm font-medium">Melhor Hora:</p>
            <p className="text-sm text-muted-foreground">Segunda, 20h-22h</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <ThumbsUp className="w-5 h-5 text-primary" />
          <div>
            <p className="text-sm font-medium">Tipo com Mais Interação:</p>
            <p className="text-sm text-muted-foreground">Ferramentas & Cursos</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
