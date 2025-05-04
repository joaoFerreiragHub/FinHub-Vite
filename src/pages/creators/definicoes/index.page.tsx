import ProtectedRoute from "../../../components/auth/ProtectedRoute"
import CreatorSidebar from "../../../components/creators/sidebar/creatorSidebar"
import AccountDetailsTab from "../../../components/definicoes/AccountDetailsTab"
import PreferencesTab from "../../../components/definicoes/PreferencesTab"
import SecurityTab from "../../../components/definicoes/SecurityTab"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../../components/ui/tabs"


function ConfiguracoesPage() {
  return (
    <ProtectedRoute allowedRoles={["creator", "admin"]}>
      <div className="flex min-h-screen">
        <CreatorSidebar />
        <main className="flex-1 bg-background text-foreground p-6">
          <h1 className="text-2xl font-bold mb-4">Configurações da Conta</h1>

          <Tabs defaultValue="perfil" className="w-full">
            <TabsList className="mb-6">
              <TabsTrigger value="perfil">Perfil</TabsTrigger>
              <TabsTrigger value="preferencias">Preferências</TabsTrigger>
              <TabsTrigger value="seguranca">Segurança</TabsTrigger>
            </TabsList>

            <TabsContent value="perfil">
              <AccountDetailsTab />
            </TabsContent>


            <TabsContent value="preferencias">
              <PreferencesTab />
            </TabsContent>

            <TabsContent value="seguranca">
              <SecurityTab />
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </ProtectedRoute>
  )
}

export default {
  Page: ConfiguracoesPage,
}
