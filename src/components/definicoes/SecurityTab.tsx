import { useState } from "react"
import { Button } from "../ui/button"
import { Badge } from "../ui/badge"
import StepPassword from "../auth/userForm/StepPassword"
import { mockFormik } from "../../mock/mockFormik"
import { Separator } from "../ui/separator"
import { FormikProps } from "formik"
import { FormValues } from "../../types/FormValues"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "../ui/tabs"
import SecurityEmailAlerts from "./SecurityEmailAlerts"
import SecurityLogs from "./SecurityLogs"

interface SecurityTabProps {
  onSave: () => void
}

export default function SecurityTab({ onSave }: SecurityTabProps) {
  const [emailVerified, setEmailVerified] = useState(false)

  return (
    <div className="space-y-8">
      {/* Alterar Palavra-passe */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold">Alterar Palavra-passe</h2>
        <StepPassword
          formik={mockFormik as FormikProps<FormValues>}
          isInvalid={() => false}
          errorMessage={() => null}
        />
        <Button onClick={onSave}>Guardar Alterações</Button>
      </div>

      <Separator />

      {/* Subtabs de Segurança */}
      <Tabs defaultValue="email" className="w-full">
        <TabsList className="grid grid-cols-2 w-full">
          <TabsTrigger value="email">Notificações por Email</TabsTrigger>
          <TabsTrigger value="logs">Logs de Segurança</TabsTrigger>
        </TabsList>

        <TabsContent value="email">
          <SecurityEmailAlerts />
        </TabsContent>

        <TabsContent value="logs">
          <SecurityLogs />
        </TabsContent>
      </Tabs>

      <Separator />

      {/* Validação de Email */}
      <div className="space-y-2">
        <h2 className="text-lg font-semibold">Validação de Email</h2>
        <p className="text-sm text-muted-foreground">
          O teu email está {emailVerified ? "verificado" : "por verificar"}.
        </p>
        {emailVerified ? (
          <Badge variant="default" className="bg-green-100 text-green-800">
            Verificado
          </Badge>
        ) : (
          <Button onClick={() => setEmailVerified(true)}>
            Reenviar Email de Verificação
          </Button>
        )}
      </div>

      <Separator />

      {/* Sessões ativas */}
      <div className="space-y-2">
        <h2 className="text-lg font-semibold">Sessões Ativas</h2>
        <p className="text-sm text-muted-foreground">
          Vê e termina sessões iniciadas noutros dispositivos.
        </p>
        <Button variant="outline">Gerir Sessões</Button>
      </div>

      <Separator />

      {/* Autenticação em dois passos */}
      <div className="space-y-2">
        <h2 className="text-lg font-semibold">Autenticação em Dois Fatores (2FA)</h2>
        <p className="text-sm text-muted-foreground">
          Protege a tua conta com uma camada extra de segurança.
        </p>
        <Button>Ativar 2FA</Button>
      </div>

      <Separator />

      {/* Eliminar Conta */}
      <div className="space-y-2">
        <h2 className="text-lg font-semibold text-red-600">Desativar ou Eliminar Conta</h2>
        <p className="text-sm text-muted-foreground">
          Esta ação é irreversível. Todos os dados serão removidos.
        </p>
        <Button variant="destructive">Eliminar Conta</Button>
      </div>
    </div>
  )
}
