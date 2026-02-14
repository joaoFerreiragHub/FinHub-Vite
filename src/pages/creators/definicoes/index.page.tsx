import ProtectedRoute from "@/shared/guards"
import CreatorSidebar from "../../../components/creators/sidebar/creatorSidebar"
import AccountSettings from "../../../components/definicoes/AccountSettings"


function ConfiguracoesPage() {
  return (
    <ProtectedRoute allowedRoles={["creator", "admin"]}>
      <div className="flex min-h-screen">
        <CreatorSidebar />
        <main className="flex-1 bg-background text-foreground p-6">
        <div>
        <h1 className="text-2xl font-bold">Definições da Conta</h1>
        <p className="text-muted-foreground text-sm">
          Altera os teus dados, preferências e definições de segurança.
        </p>
      </div>


              <AccountSettings />

        </main>
      </div>
    </ProtectedRoute>
  )
}

export default {
  Page: ConfiguracoesPage,
}
