import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui'
import { Lightbulb, BarChart3 } from 'lucide-react'

export default function CampaignInsightsCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Insights das Campanhas</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-3">
          <BarChart3 className="w-5 h-5 text-pink-500" />
          <div>
            <p className="text-sm font-medium">
              Melhor Campanha: <span className="font-bold">"Promo Spring"</span>{' '}
              <span className="ml-2 text-xs bg-pink-500 text-white px-2 py-0.5 rounded">
                🔥 Popular
              </span>
            </p>
            <p className="text-sm text-muted-foreground">CTR 6.2%</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Lightbulb className="w-5 h-5 text-yellow-400" />
          <div>
            <p className="text-sm font-medium">Sugestão:</p>
            <p className="text-sm text-muted-foreground">
              Aumenta o orçamento da "Promo Spring" para maximizar os resultados.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
