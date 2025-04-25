// src/components/creators/dashboard/XPProgressCard.tsx

import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card";
import { Progress } from "../../ui/progress";
export default function XPProgressCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Teu Progresso</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm mb-2">Nível 3 - 120 XP</p>
        <Progress value={60} />
      </CardContent>
    </Card>
  )
}
