import { Card } from "../../../ui/card"
import { ArrowDown, ArrowUp } from "lucide-react"

interface Transaction {
  id: string
  type: "income" | "expense"
  label: string
  date: string
  amount: number
}

const mockRecent: Transaction[] = [] // sem transações recentes

export default function WalletRecentActivity() {
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">Últimas transações</h2>
      {mockRecent.length === 0 ? (
        <p className="text-sm text-muted-foreground">Sem transações recentes.</p>
      ) : (
        <div className="space-y-3">
          {mockRecent.map((tx) => (
            <Card
              key={tx.id}
              className="p-3 flex items-center justify-between border"
            >
              <div className="flex items-center gap-2">
                {tx.type === "income" ? (
                  <ArrowDown className="w-4 h-4 text-green-600" />
                ) : (
                  <ArrowUp className="w-4 h-4 text-red-600" />
                )}
                <span className="text-sm font-medium">
                  {tx.label}
                </span>
              </div>
              <div className="text-sm text-muted-foreground">
                {tx.date}
              </div>
              <div
                className={
                  tx.type === "income"
                    ? "text-green-600 font-medium"
                    : "text-red-600 font-medium"
                }
              >
                {tx.amount > 0 ? "+" : ""}
                {tx.amount.toFixed(2)}€
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
