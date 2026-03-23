import { Helmet } from '@/lib/helmet'
import { UserAccountShell } from '@/shared/layouts/UserAccountShell'
import { AccountSettings } from '@/features/auth/components/settings'

export function Page() {
  return (
    <>
      <Helmet>
        <title>Definicoes | FinHub</title>
      </Helmet>

      <UserAccountShell>
        <div className="mx-auto max-w-5xl">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-foreground">Definicoes da conta</h1>
            <p className="text-sm text-muted-foreground">
              Atualiza dados pessoais, preferencias e seguranca da tua conta.
            </p>
          </div>

          <AccountSettings />
        </div>
      </UserAccountShell>
    </>
  )
}
