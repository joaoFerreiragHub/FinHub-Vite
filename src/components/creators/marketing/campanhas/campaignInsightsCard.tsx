// components/creators/marketing/campanhas/campaignInsightsCard.tsx

import { Card, CardHeader, CardTitle, CardContent } from "../../../ui/card"
import { Eye, MousePointerClick, ShoppingCart, TrendingUp } from "lucide-react"

interface CampaignInsightsProps {
  title: string
  impressions: number
  clicks: number
  conversions: number
  spend: number
}

export default function CampaignInsightsCard({
  title,
  impressions,
  clicks,
  conversions,
  spend,
}: CampaignInsightsProps) {
  const ctr = impressions ? (clicks / impressions) * 100 : 0
  const cpc = clicks ? spend / clicks : 0

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base font-semibold">{title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2 text-sm text-muted-foreground">
        <div className="flex justify-between items-center">
          <span className="flex items-center gap-1">
            <Eye className="w-4 h-4" /> {impressions} impressões
          </span>
          <span className="flex items-center gap-1">
            <MousePointerClick className="w-4 h-4" /> {clicks} cliques
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span className="flex items-center gap-1">
            <TrendingUp className="w-4 h-4" /> CTR: {ctr.toFixed(1)}%
          </span>
          <span className="flex items-center gap-1">
            <ShoppingCart className="w-4 h-4" /> CPC: {cpc.toFixed(2)} €
          </span>
        </div>
        <div className="text-xs text-right mt-2">Conversões: {conversions}</div>
      </CardContent>
    </Card>
  )
}
