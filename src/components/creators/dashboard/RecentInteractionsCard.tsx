// src/components/creators/dashboard/RecentInteractionsCard.tsx
import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card";

export default function RecentInteractionsCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Interações Recentes</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-2xl font-bold">24</p>
        <p className="text-sm text-muted-foreground">Últimos 7 dias</p>
      </CardContent>
    </Card>
  )
}
