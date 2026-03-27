import { useState, type FormEvent } from 'react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useToast } from '@/components/ui/use-toast'
import { authService } from '@/features/auth/services/authService'
import { getErrorMessage } from '@/lib/api/client'
import SecurityEmailAlerts from './SecurityEmailAlerts'
import SecurityLogs from './SecurityLogs'

interface SecurityTabProps {
  onSave: () => void
}

const MIN_PASSWORD_LENGTH = 8

export default function SecurityTab({ onSave }: SecurityTabProps) {
  const [emailVerified, setEmailVerified] = useState(false)
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const handlePasswordSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (newPassword !== confirmPassword) {
      toast({ title: 'As palavras-passe não coincidem', variant: 'destructive' })
      return
    }

    if (newPassword.length < MIN_PASSWORD_LENGTH) {
      toast({
        title: `A nova palavra-passe deve ter pelo menos ${MIN_PASSWORD_LENGTH} caracteres`,
        variant: 'destructive',
      })
      return
    }

    setIsLoading(true)
    try {
      await authService.changePassword(currentPassword, newPassword)
      toast({ title: 'Palavra-passe alterada com sucesso' })
      setCurrentPassword('')
      setNewPassword('')
      setConfirmPassword('')
      onSave()
    } catch (error) {
      toast({ title: getErrorMessage(error), variant: 'destructive' })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-8">
      {/* Alterar Palavra-passe */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold">Alterar Palavra-passe</h2>

        <form className="space-y-4" onSubmit={handlePasswordSubmit}>
          <div className="space-y-2">
            <Label htmlFor="currentPassword">Palavra-passe actual</Label>
            <Input
              id="currentPassword"
              type="password"
              value={currentPassword}
              onChange={(event) => setCurrentPassword(event.target.value)}
              autoComplete="current-password"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="newPassword">Nova palavra-passe</Label>
            <Input
              id="newPassword"
              type="password"
              value={newPassword}
              onChange={(event) => setNewPassword(event.target.value)}
              autoComplete="new-password"
              required
              minLength={MIN_PASSWORD_LENGTH}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirmar nova palavra-passe</Label>
            <Input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
              autoComplete="new-password"
              required
            />
          </div>

          <Button type="submit" disabled={isLoading}>
            {isLoading ? 'A guardar...' : 'Alterar palavra-passe'}
          </Button>
        </form>
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
          O teu email está {emailVerified ? 'verificado' : 'por verificar'}.
        </p>
        {emailVerified ? (
          <Badge variant="default" className="bg-green-100 text-green-800">
            Verificado
          </Badge>
        ) : (
          <Button onClick={() => setEmailVerified(true)}>Reenviar Email de Verificação</Button>
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
