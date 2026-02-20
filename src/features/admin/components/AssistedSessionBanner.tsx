import { ShieldAlert } from 'lucide-react'
import { toast } from 'react-toastify'
import { Button } from '@/components/ui'
import { useAuthStore } from '@/features/auth/stores/useAuthStore'
import { adminAssistedSessionsService } from '../services/adminAssistedSessionsService'
import {
  clearAssistedSessionAdminBackup,
  getAssistedSessionAdminBackup,
} from '../services/assistedSessionRuntime'

const formatDateTime = (value: string): string => {
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value
  return new Intl.DateTimeFormat('pt-PT', {
    dateStyle: 'short',
    timeStyle: 'short',
  }).format(date)
}

export default function AssistedSessionBanner() {
  const user = useAuthStore((state) => state.user)
  const setUser = useAuthStore((state) => state.setUser)
  const logout = useAuthStore((state) => state.logout)

  const assisted = user?.assistedSession
  if (!assisted) return null

  const handleStop = async () => {
    const backup = getAssistedSessionAdminBackup()
    if (!backup) {
      clearAssistedSessionAdminBackup()
      logout()
      toast.warn('Sessao assistida sem backup admin. Foi efetuado logout de seguranca.')
      return
    }

    try {
      setUser(backup.user, backup.tokens.accessToken, backup.tokens.refreshToken)
      await adminAssistedSessionsService.revokeSession(backup.assistedSessionId, {
        reason: 'Sessao assistida encerrada pelo admin.',
      })
      toast.success('Sessao assistida encerrada com sucesso.')
    } catch {
      toast.error('Nao foi possivel confirmar a revogacao no servidor.')
    } finally {
      clearAssistedSessionAdminBackup()
    }
  }

  return (
    <div className="border-b border-yellow-600/30 bg-yellow-500/10">
      <div className="mx-auto flex w-full max-w-[1600px] flex-wrap items-center justify-between gap-3 px-4 py-2 sm:px-6 lg:px-10">
        <div className="flex items-center gap-2 text-sm text-yellow-800 dark:text-yellow-300">
          <ShieldAlert className="h-4 w-4" />
          <span>
            Sessao assistida ativa (read-only). Expira em {formatDateTime(assisted.expiresAt)}.
          </span>
        </div>
        <Button size="sm" variant="outline" onClick={handleStop}>
          Terminar sessao assistida
        </Button>
      </div>
    </div>
  )
}
