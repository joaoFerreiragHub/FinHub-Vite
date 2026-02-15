import { Coins, ArrowUpRight, ArrowDownLeft } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui'

interface KPICardsProps {
  balance: number
  totalLoaded: number
  totalSpent: number
}

export default function WalletKPICards({ balance, totalLoaded, totalSpent }: KPICardsProps) {
  return (
    <div className="grid gap-4 grid-cols-1 md:grid-cols-3">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Saldo Atual</CardTitle>
          <Coins className="w-4 h-4 text-yellow-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{balance.toFixed(2)} €</div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Carregado</CardTitle>
          <ArrowDownLeft className="w-4 h-4 text-green-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">+{totalLoaded.toFixed(2)} €</div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Gasto</CardTitle>
          <ArrowUpRight className="w-4 h-4 text-red-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">-{totalSpent.toFixed(2)} €</div>
        </CardContent>
      </Card>
    </div>
  )
}
