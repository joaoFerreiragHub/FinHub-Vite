import { ArrowDown, ArrowUp } from "lucide-react"
import { ScrollArea } from "../../../ui/scroll-area"
import { Card } from "../../../ui/card"
import { mockTransactions } from '@/lib/mock/mockTransactions'


interface WalletTransactionListProps {
  limit?: number
  scroll?: boolean
}

export default function WalletTransactionList({ limit, scroll = true }: WalletTransactionListProps) {
  const transactionsToShow = limit ? mockTransactions.slice(0, limit) : mockTransactions

  const content = (
    <ul className="space-y-3">
      {transactionsToShow.map((tx, index) => (
        <Card key={index} className="p-3 flex items-center justify-between text-sm">
          <div className="flex items-center gap-2">
            {tx.type === "load" ? (
              <ArrowDown className="w-4 h-4 text-green-600" />
            ) : (
              <ArrowUp className="w-4 h-4 text-red-600" />
            )}
          <span>
          {tx.type === "load"
            ? `Carregamento via ${tx.method === "card" ? "Cartão" : tx.method === "paypal" ? "PayPal" : "Cupão"}`
            : tx.status}
        </span>

          </div>
          <div className="text-muted-foreground">{tx.date}</div>
          <div className={`font-semibold ${tx.amount > 0 ? "text-green-600" : "text-red-600"}`}>
            {tx.amount > 0 ? "+" : ""}
            {tx.amount.toFixed(2)}€
          </div>
        </Card>
      ))}
    </ul>
  )

  return scroll ? <ScrollArea className="h-60 pr-2">{content}</ScrollArea> : content
}
