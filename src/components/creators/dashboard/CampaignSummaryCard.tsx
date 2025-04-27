import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card'
import { Megaphone, DollarSign, MousePointerClick, TrendingUp } from 'lucide-react'

export default function CampaignSummaryCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Resumo das Campanhas</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-3">
          <Megaphone className="w-5 h-5 text-yellow-500" />
          <div>
            <p className="text-lg font-bold">2 Ativas</p>
            <p className="text-sm text-muted-foreground">Campanhas em curso</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <DollarSign className="w-5 h-5 text-green-600" />
          <div>
            <p className="text-sm font-medium">Orçamento do mês:</p>
            <p className="text-sm text-muted-foreground">€120,00</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <MousePointerClick className="w-5 h-5 text-blue-500" />
          <div>
            <p className="text-sm font-medium">Impressões / Cliques:</p>
            <p className="text-sm text-muted-foreground">5.200 / 320 cliques</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <TrendingUp className="w-5 h-5 text-purple-500" />
          <div>
            <p className="text-sm font-medium">CTR Médio:</p>
            <p className="text-sm text-muted-foreground">6,15%</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
