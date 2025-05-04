import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs"
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { Label } from "../ui/label"

import StepTopics from "../auth/userForm/StepTopics"
import StepDateOfBirth from "../auth/userForm/StepDateOfBirth"
import StepPassword from "../auth/userForm/StepPassword"
import StepSocialLinks from "./SocialLinksTab"
import { mockFormik } from "../../mock/mockFormik"
import { useToast } from "../../utils/use-toast"

export default function AccountSettings() {
  const { toastSuccess } = useToast()

  const [details, setDetails] = useState({
    username: "sergiocriador",
    name: "Sérgio",
    lastName: "Criador",
    email: "sergio@finhub.pt",
    bio: "Sou apaixonado por educação financeira."
  })

const handleSave = () => {
  toastSuccess("Alterações guardadas com sucesso ✅")
}

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold">Definições da Conta</h1>
        <p className="text-muted-foreground text-sm">
          Altera os teus dados, preferências e definições de segurança.
        </p>
      </div>

      <Tabs defaultValue="detalhes" className="w-full">
        <TabsList className="grid grid-cols-4 w-full">
          <TabsTrigger value="detalhes">Dados Pessoais</TabsTrigger>
          <TabsTrigger value="preferencias">Preferências</TabsTrigger>
          <TabsTrigger value="seguranca">Segurança</TabsTrigger>
          <TabsTrigger value="sociais">Redes Sociais</TabsTrigger>
        </TabsList>

        <TabsContent value="detalhes">
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <img
                src="/default-avatar.png"
                alt="Avatar"
                className="w-16 h-16 rounded-full"
              />
              <Button variant="outline">Alterar Imagem</Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="username">Username</Label>
                <Input id="username" value={details.username} onChange={(e) => setDetails({ ...details, username: e.target.value })} />
              </div>
              <div>
                <Label htmlFor="name">Nome</Label>
                <Input id="name" value={details.name} onChange={(e) => setDetails({ ...details, name: e.target.value })} />
              </div>
              <div>
                <Label htmlFor="lastName">Apelido</Label>
                <Input id="lastName" value={details.lastName} onChange={(e) => setDetails({ ...details, lastName: e.target.value })} />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" value={details.email} onChange={(e) => setDetails({ ...details, email: e.target.value })} />
              </div>
            </div>

            <div>
              <Label htmlFor="bio">Bio</Label>
              <Input id="bio" value={details.bio} onChange={(e) => setDetails({ ...details, bio: e.target.value })} />
            </div>
            <Button onClick={handleSave}>Guardar Alterações</Button>
          </div>
        </TabsContent>

        <TabsContent value="preferencias">
          <div className="space-y-6">
            <StepTopics formik={mockFormik} isInvalid={() => false} errorMessage={() => null} />
            <div>
              <Label htmlFor="website">Website</Label>
              <Input id="website" defaultValue={mockFormik.values.website} />
            </div>
            <StepDateOfBirth formik={mockFormik} isInvalid={() => false} errorMessage={() => null} />
            <Button onClick={handleSave}>Guardar Alterações</Button>
          </div>
        </TabsContent>

        <TabsContent value="seguranca">
          <div className="space-y-6">
            <StepPassword formik={mockFormik} isInvalid={() => false} errorMessage={() => null} />
            <Button onClick={handleSave}>Guardar Alterações</Button>
          </div>
        </TabsContent>

        <TabsContent value="sociais">
          <div className="space-y-6">
            <StepSocialLinks />
            <Button onClick={handleSave}>Guardar Alterações</Button>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
