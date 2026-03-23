import { Badge, Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui'
import { useAuthStore } from '@/features/auth/stores/useAuthStore'
import { UserRole } from '@/features/auth/types'
import { useMyProfile } from '@/features/social/hooks/useSocial'
import { Helmet } from '@/lib/helmet'
import { UserAccountShell } from '@/shared/layouts/UserAccountShell'

function formatRole(role: UserRole | undefined): string {
  switch (role) {
    case UserRole.PREMIUM:
      return 'Premium'
    case UserRole.FREE:
      return 'Free'
    case UserRole.CREATOR:
      return 'Creator'
    case UserRole.ADMIN:
      return 'Admin'
    case UserRole.BRAND_MANAGER:
      return 'Brand'
    default:
      return 'Visitor'
  }
}

export function Page() {
  const user = useAuthStore((state) => state.user)
  const { data: profile, isLoading } = useMyProfile()

  const favoritesCount = profile?.favoritesCount ?? 0
  const followingCount = profile?.followingCount ?? 0
  const isPremium = user?.role === UserRole.PREMIUM

  return (
    <>
      <Helmet>
        <title>A minha conta | FinHub</title>
      </Helmet>

      <UserAccountShell>
        <div className="mx-auto max-w-5xl space-y-6">
          <section className="rounded-2xl border border-border bg-card p-6 sm:p-8">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-4">
                {user?.avatar ? (
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="h-20 w-20 rounded-full object-cover"
                  />
                ) : (
                  <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary text-2xl font-semibold text-primary-foreground">
                    {user?.name?.charAt(0) ?? 'U'}
                  </div>
                )}

                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h1 className="text-2xl font-bold text-foreground">{user?.name ?? 'Conta'}</h1>
                    <Badge variant="secondary">{formatRole(user?.role)}</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">@{user?.username ?? 'utilizador'}</p>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Bem-vindo de volta, {user?.name ?? 'utilizador'}.
                  </p>
                </div>
              </div>

              <a
                href="/perfil"
                className="inline-flex h-10 items-center justify-center rounded-md border border-border px-4 text-sm font-medium text-foreground transition-colors hover:bg-accent"
              >
                Editar perfil
              </a>
            </div>
          </section>

          <section className="grid gap-4 sm:grid-cols-2">
            <Card>
              <CardHeader className="pb-3">
                <CardDescription>Artigos favoritos</CardDescription>
                <CardTitle className="text-3xl">{isLoading ? '...' : favoritesCount}</CardTitle>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardDescription>Criadores seguidos</CardDescription>
                <CardTitle className="text-3xl">{isLoading ? '...' : followingCount}</CardTitle>
              </CardHeader>
            </Card>
          </section>

          {isPremium ? (
            <Card className="border-emerald-500/40 bg-emerald-500/5">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  Plano Premium activo
                  <Badge className="bg-emerald-600 text-white hover:bg-emerald-600">Ativo</Badge>
                </CardTitle>
                <CardDescription>
                  Tens acesso a ferramentas avancadas, conteudo exclusivo e experiencia sem
                  anuncios.
                </CardDescription>
              </CardHeader>
            </Card>
          ) : (
            <Card className="border-primary/40">
              <CardHeader>
                <CardTitle>Experimenta o Premium</CardTitle>
                <CardDescription>
                  Desbloqueia cursos exclusivos, FIRE completo e analise de stocks sem anuncios.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <a
                  href="/precos"
                  className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
                >
                  Ver planos
                </a>
              </CardContent>
            </Card>
          )}
        </div>
      </UserAccountShell>
    </>
  )
}
