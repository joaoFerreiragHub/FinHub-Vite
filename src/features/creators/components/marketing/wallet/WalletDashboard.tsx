import WalletKPICards from './WalletKPICards'
import WalletTopUpModal from './walletTopUpModal'
import WalletRecentActivity from './WalletRecentActivity'
import WalletTransactionList from './walletTransactionList'

export default function WalletDashboardPage() {
  return (
    <main className="flex-1 bg-background text-foreground p-6 space-y-8">
      <div>
        <h1 className="text-2xl font-bold">Wallet / Anúncios</h1>
        <p className="text-sm text-muted-foreground">
          Consulta o saldo, carrega a tua conta e acompanha os movimentos relacionados com
          publicidade.
        </p>
      </div>

      {/* KPIs */}
      <WalletKPICards balance={37.5} totalLoaded={50} totalSpent={12.5} />

      {/* Ações rápidas */}
      <div className="flex flex-col md:flex-row items-start gap-6">
        <WalletTopUpModal />
      </div>

      {/* Atividade recente */}
      <div>
        <h2 className="text-lg font-semibold">Atividade Recente</h2>
        <WalletRecentActivity />
      </div>

      {/* Últimas transações */}
      <div>
        <h2 className="text-lg font-semibold">Últimas transações</h2>
        <WalletTransactionList limit={3} scroll={false} />
      </div>

      {/* Histórico completo */}
      <div>
        <h2 className="text-lg font-semibold">Histórico de Transações</h2>
        <WalletTransactionList />
      </div>
    </main>
  )
}
