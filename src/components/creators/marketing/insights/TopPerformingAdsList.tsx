import { Card, CardContent, CardHeader, CardTitle } from "../../../ui/card"
import { Badge } from "../../../ui/badge"
import { TrendingUp } from "lucide-react"

interface Ad {
  id: string
  title: string
  ctr: number
  clicks: number
  conversions: number
}

const topAdsMock: Ad[] = [
  { id: "ad1", title: "Curso de Investimento", ctr: 5.4, clicks: 230, conversions: 12 },
  { id: "ad2", title: "Checklist de Finanças", ctr: 4.8, clicks: 180, conversions: 8 },
  { id: "ad3", title: "Webinar Gratuito", ctr: 4.1, clicks: 150, conversions: 5 },
]

export default function TopPerformingAdsList() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-green-600" />
          Top Anúncios
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {topAdsMock.map((ad) => (
          <div key={ad.id} className="flex justify-between items-center">
            <div>
              <p className="font-medium">{ad.title}</p>
              <div className="text-xs text-muted-foreground">
                {ad.clicks} cliques • {ad.conversions} conversões • CTR {ad.ctr.toFixed(1)}%
              </div>
            </div>
            <Badge variant="outline">#{ad.id}</Badge>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
