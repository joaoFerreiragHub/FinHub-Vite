import { Card, CardContent } from '@/components/ui'

interface QualityScoresProps {
  data: {
    piotroskiScore?: number
    altmanZScore?: number
    earningsQuality?: number
  }
}

export function QualityScores({ data }: QualityScoresProps) {
  const { piotroskiScore = 6, altmanZScore = 3.2, earningsQuality = 75 } = data

  return (
    <Card>
      <CardContent className="space-y-2 p-4">
        <h4 className="text-base font-semibold">Indicadores de Qualidade</h4>
        <ul className="text-sm space-y-1">
          <li>Piotroski Score: {piotroskiScore}/9</li>
          <li>Altman Z-Score: {altmanZScore}</li>
          <li>Earnings Quality Score: {earningsQuality}/100</li>
        </ul>
      </CardContent>
    </Card>
  )
}
