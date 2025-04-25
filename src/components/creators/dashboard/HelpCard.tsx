// src/components/creators/dashboard/HelpCard.tsx
import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card";

export default function HelpCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Precisas de ajuda?</CardTitle>
      </CardHeader>
      <CardContent>
        <p>Consulta o nosso guia ou fala connosco!</p>
      </CardContent>
    </Card>
  )
}
