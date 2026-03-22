import { ProtectedRoute } from '@/shared/guards'
import { CreatorDashboardShell } from '@/shared/layouts'
import { AccountSettings } from '@/features/auth/components/settings'
import { CreatorCardConfigPanel } from '@/features/creators/components/dashboard/CreatorCardConfigPanel'

function ConfiguracoesPage() {
  return (
    <ProtectedRoute allowedRoles={['creator', 'admin']}>
      <CreatorDashboardShell>
        <div>
          <h1 className="text-2xl font-bold">Definicoes da Conta</h1>
          <p className="text-sm text-muted-foreground">
            Altera os teus dados, preferencias e definicoes de seguranca.
          </p>

          <div className="mt-8 space-y-8">
            <AccountSettings />
            <CreatorCardConfigPanel />
          </div>
        </div>
      </CreatorDashboardShell>
    </ProtectedRoute>
  )
}

export default {
  Page: ConfiguracoesPage,
}
