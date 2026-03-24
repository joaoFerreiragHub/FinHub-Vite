import { useQuery } from '@tanstack/react-query'
import {
  Badge,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Progress,
} from '@/components/ui'
import { useAuthStore } from '@/features/auth/stores/useAuthStore'
import { UserRole } from '@/features/auth/types'
import {
  COMMUNITY_BADGES,
  getCommunityLevelMeta,
  getNextCommunityLevelMeta,
} from '@/features/community/lib/xpMeta'
import { communityService } from '@/features/community/services/communityService'
import { useMyProfile } from '@/features/social/hooks/useSocial'
import { getErrorMessage } from '@/lib/api/client'
import { Helmet } from '@/lib/helmet'
import { trackUpgradeCtaClicked } from '@/lib/analytics'
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

const calculateLevelProgress = (
  totalXp: number,
  currentLevelMinXp: number,
  nextLevelMinXp: number | null,
): number => {
  if (!nextLevelMinXp || nextLevelMinXp <= currentLevelMinXp) return 100
  const progress = ((totalXp - currentLevelMinXp) / (nextLevelMinXp - currentLevelMinXp)) * 100
  return Math.max(0, Math.min(100, progress))
}

export function Page() {
  const user = useAuthStore((state) => state.user)
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)
  const { data: profile, isLoading } = useMyProfile()
  const myXpQuery = useQuery({
    queryKey: ['my-xp'],
    queryFn: () => communityService.getMyXp(),
    enabled: isAuthenticated,
    staleTime: 30_000,
  })

  const favoritesCount = profile?.favoritesCount ?? 0
  const followingCount = profile?.followingCount ?? 0
  const isPremium = user?.role === UserRole.PREMIUM
  const currentLevelMeta = getCommunityLevelMeta(myXpQuery.data?.level ?? 1)
  const nextLevelMeta = getNextCommunityLevelMeta(currentLevelMeta.level)
  const currentLevelName = myXpQuery.data?.levelName || currentLevelMeta.name
  const progressPercent = calculateLevelProgress(
    myXpQuery.data?.totalXp ?? 0,
    currentLevelMeta.minXp,
    nextLevelMeta?.minXp ?? null,
  )
  const badgeCatalog = COMMUNITY_BADGES
  const unlockedBadges = myXpQuery.data?.badges ?? []
  const unlockedBadgeIds = new Set(unlockedBadges.map((badge) => badge.id))
  const nextLockedBadge = badgeCatalog.find((badge) => !unlockedBadgeIds.has(badge.id)) ?? null

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

          <Card>
            <CardHeader>
              <CardTitle>O teu progresso</CardTitle>
              <CardDescription>XP da comunidade e evolucao de nivel.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {myXpQuery.isLoading ? (
                <p className="text-sm text-muted-foreground">A carregar progresso...</p>
              ) : null}

              {myXpQuery.error ? (
                <p className="text-sm text-red-600">{getErrorMessage(myXpQuery.error)}</p>
              ) : null}

              {!myXpQuery.isLoading && !myXpQuery.error ? (
                <>
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div>
                      <p className="text-sm text-muted-foreground">Nivel atual</p>
                      <p className="text-2xl font-semibold text-foreground">
                        {currentLevelMeta.level} • {currentLevelName}
                      </p>
                    </div>
                    <Badge variant="secondary">{myXpQuery.data?.totalXp ?? 0} XP</Badge>
                  </div>

                  <div className="space-y-2">
                    <Progress value={progressPercent} />
                    <p className="text-xs text-muted-foreground">
                      {nextLevelMeta
                        ? `${myXpQuery.data?.totalXp ?? 0} / ${nextLevelMeta.minXp} XP para ${nextLevelMeta.name}`
                        : 'Nivel maximo atingido.'}
                    </p>
                  </div>

                  <p className="text-xs text-muted-foreground">
                    XP desta semana: {myXpQuery.data?.weeklyXp ?? 0}
                  </p>
                </>
              ) : null}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Badges da comunidade</CardTitle>
              <CardDescription>Progresso das tuas conquistas comunitarias.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {myXpQuery.isLoading ? (
                <p className="text-sm text-muted-foreground">A carregar badges...</p>
              ) : null}

              {myXpQuery.error ? (
                <p className="text-sm text-red-600">{getErrorMessage(myXpQuery.error)}</p>
              ) : null}

              {!myXpQuery.isLoading && !myXpQuery.error ? (
                <>
                  <p className="text-sm text-muted-foreground">
                    {unlockedBadges.length} / {badgeCatalog.length} badges desbloqueadas.
                  </p>

                  <div className="grid gap-3 sm:grid-cols-2">
                    {badgeCatalog.map((badge) => {
                      const unlocked = unlockedBadgeIds.has(badge.id)
                      return (
                        <article
                          key={badge.id}
                          className={`rounded-lg border p-3 ${unlocked ? 'border-border/70 bg-card' : 'border-dashed border-border/60 bg-muted/20 opacity-80'}`}
                        >
                          <div className="flex items-start justify-between gap-2">
                            <p className="text-sm font-semibold text-foreground">
                              {badge.emoji} {badge.name}
                            </p>
                            <Badge variant={unlocked ? 'default' : 'outline'}>
                              {unlocked ? 'Desbloqueada' : 'Por desbloquear'}
                            </Badge>
                          </div>
                          <p className="mt-2 text-xs text-muted-foreground">
                            {unlocked ? badge.description : badge.unlockHint}
                          </p>
                        </article>
                      )
                    })}
                  </div>

                  {nextLockedBadge ? (
                    <div className="rounded-lg border border-border/60 bg-muted/20 p-3">
                      <p className="text-xs uppercase tracking-wide text-muted-foreground">
                        Proxima badge
                      </p>
                      <p className="mt-1 text-sm font-semibold text-foreground">
                        {nextLockedBadge.emoji} {nextLockedBadge.name}
                      </p>
                      <p className="mt-1 text-xs text-muted-foreground">
                        {nextLockedBadge.unlockHint}
                      </p>
                    </div>
                  ) : (
                    <p className="text-xs text-muted-foreground">
                      Excelente: desbloqueaste todas as badges atuais.
                    </p>
                  )}
                </>
              ) : null}
            </CardContent>
          </Card>

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
                  onClick={() => trackUpgradeCtaClicked('account_overview')}
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
