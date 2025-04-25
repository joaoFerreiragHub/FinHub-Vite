// src/components/creators/dashboard/FeedbackCard.tsx
import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card";

export default function FeedbackCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Feedback da Comunidade</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-2xl font-bold">4.8 / 5 ⭐</p>
        <p className="text-sm text-muted-foreground">Baseado em 56 avaliações</p>
      </CardContent>
    </Card>
  )
}
