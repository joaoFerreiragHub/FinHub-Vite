import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs"
import { useToast } from "../../utils/use-toast"
import SecurityTab from "./SecurityTab"
import AccountDetailsTab from "./AccountDetailsTab"
import PreferencesTab from "./PreferencesTab"
import { useUserStore } from "../../stores/useUserStore"

export default function AccountSettings() {
  const { toastSuccess } = useToast()
  const user = useUserStore((state) => state.user)
  const updateUser = useUserStore((state) => state.updateUser)

  const handleSave = () => {
    toastSuccess("Alterações guardadas com sucesso ✅")
    // Aqui podes também fazer um fetch PATCH/PUT para a API se aplicável
  }

  return (
    <div className="space-y-12 max-w-3x3 mx-auto mt-8">
      <Tabs defaultValue="detalhes" className="w-full">
        <TabsList className="grid grid-cols-4 w-full">
          <TabsTrigger value="detalhes">Dados Pessoais</TabsTrigger>
          <TabsTrigger value="preferencias">Preferências</TabsTrigger>
          <TabsTrigger value="seguranca">Segurança</TabsTrigger>
        </TabsList>

        <TabsContent value="detalhes">
          <AccountDetailsTab user={user} onChange={updateUser} onSave={handleSave} />
        </TabsContent>

        <TabsContent value="preferencias">
          <PreferencesTab onSave={handleSave} />
        </TabsContent>

        <TabsContent value="seguranca">
          <SecurityTab onSave={handleSave} />
        </TabsContent>

      </Tabs>
    </div>
  )
}
