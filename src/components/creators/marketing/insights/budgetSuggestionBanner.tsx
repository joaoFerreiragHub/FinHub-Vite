import { Lightbulb } from "lucide-react"
import { Card, CardContent } from "../../../ui/card"
import { Button } from "../../../ui/button"

export default function BudgetSuggestionBanner() {
  const suggestion = {
    reason: "A tua campanha de produto está a ter uma taxa de cliques acima da média.",
    recommendation: "Considera aumentar o orçamento diário em 10€ para potenciar o alcance.",
  }

  return (
    <Card className="bg-yellow-50 border-yellow-200">
      <CardContent className="flex items-center justify-between py-4">
        <div className="flex items-start gap-3">
          <Lightbulb className="text-yellow-500 mt-1" />
          <div>
            <p className="text-sm font-medium text-yellow-800">{suggestion.reason}</p>
            <p className="text-sm text-yellow-700">{suggestion.recommendation}</p>
          </div>
        </div>
        <Button variant="outline" size="sm">Ajustar Orçamento</Button>
      </CardContent>
    </Card>
  )
}
