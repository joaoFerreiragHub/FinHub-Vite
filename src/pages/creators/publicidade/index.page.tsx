import ProtectedRoute from "../../../components/auth/ProtectedRoute"
import CreatorSidebar from "../../../components/creators/sidebar/creatorSidebar"
import MarketingTabs from "../../../components/creators/marketing/MarketingTabs"

function WalletPage() {
  return (
    <ProtectedRoute allowedRoles={["creator", "admin"]}>
      <div className="flex min-h-screen">
        <CreatorSidebar />
        <main className="flex-1 bg-background text-foreground p-6">
          <div className="mb-6">
            <h1 className="text-2xl font-bold">Marketing e Publicidade</h1>
            <p className="text-sm text-muted-foreground">
              Gere o teu orçamento e acompanha a performance das campanhas.
            </p>
          </div>
          <MarketingTabs />
        </main>
      </div>
    </ProtectedRoute>
  )
}

export default {
  Page: WalletPage,
}
