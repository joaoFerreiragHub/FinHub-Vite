// src/components/creators/dashboard/RankingCard.tsx
import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card";

export default function RankingCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Teu Ranking</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-2xl font-bold">#5</p>
        <p className="text-sm text-muted-foreground">Top Criadores este mês</p>
      </CardContent>
    </Card>
  )
}
