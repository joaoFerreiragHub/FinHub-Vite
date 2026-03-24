import { useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Badge, Card } from '@/components/ui'
import { UserRole } from '@/features/auth/types'
import { COMMUNITY_BADGES } from '@/features/community/lib/xpMeta'
import { Helmet } from '@/lib/helmet'
import {
  fetchPublicUserProfile,
  type PublicUserProfile,
} from '../services/publicUserProfileService'

interface PublicUserProfilePageProps {
  username: string
}

const safeDecode = (value: string): string => {
  try {
    return decodeURIComponent(value)
  } catch {
    return value
  }
}

const formatMembershipDate = (rawDate?: string): string => {
  if (!rawDate) return 'Membro desde data indisponivel'

  const parsed = Date.parse(rawDate)
  if (!Number.isFinite(parsed)) return 'Membro desde data indisponivel'

  const monthYear = new Intl.DateTimeFormat('pt-PT', {
    month: 'long',
    year: 'numeric',
  }).format(new Date(parsed))

  const capitalizedMonthYear = monthYear.charAt(0).toUpperCase() + monthYear.slice(1)

  return `Membro desde ${capitalizedMonthYear}`
}

const getInitials = (profile: PublicUserProfile): string => {
  const source = profile.name.trim() || profile.username.trim()
  if (!source) return 'U'

  const chunks = source.split(/\s+/).filter(Boolean)
  if (chunks.length >= 2) {
    return `${chunks[0].charAt(0)}${chunks[1].charAt(0)}`.toUpperCase()
  }

  return source.slice(0, 2).toUpperCase()
}

const toCreatorHref = (username: string): string => `/creators/${encodeURIComponent(username)}`

const isCreatorRole = (role: string | UserRole): boolean =>
  String(role).toLowerCase() === UserRole.CREATOR

const formatCount = (value: number): string => new Intl.NumberFormat('pt-PT').format(value)

const formatBadgeUnlockDate = (rawDate: string): string | null => {
  const parsed = Date.parse(rawDate)
  if (!Number.isFinite(parsed)) return null

  return new Intl.DateTimeFormat('pt-PT', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(new Date(parsed))
}

export function PublicUserProfilePage({ username }: PublicUserProfilePageProps) {
  const decodedUsername = useMemo(() => safeDecode(username).trim(), [username])
  const normalizedUsername = decodedUsername.toLowerCase()

  const profileQuery = useQuery({
    queryKey: ['public-user-profile', normalizedUsername],
    queryFn: () => fetchPublicUserProfile(normalizedUsername),
    enabled: normalizedUsername.length > 0,
    staleTime: 60 * 1000,
    retry: 1,
  })

  const profile = profileQuery.data

  if (profileQuery.isLoading) {
    return (
      <div className="mx-auto w-full max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
        <Card className="border-border/70 p-6 sm:p-8">
          <div className="animate-pulse space-y-6">
            <div className="flex items-center gap-4">
              <div className="h-20 w-20 rounded-full bg-muted" />
              <div className="space-y-2">
                <div className="h-6 w-48 rounded bg-muted" />
                <div className="h-4 w-32 rounded bg-muted" />
                <div className="h-4 w-40 rounded bg-muted" />
              </div>
            </div>
            <div className="h-16 w-full rounded-lg bg-muted" />
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="h-20 rounded-lg bg-muted" />
              <div className="h-20 rounded-lg bg-muted" />
            </div>
          </div>
        </Card>
      </div>
    )
  }

  if (profileQuery.isError || !profile) {
    return (
      <div className="mx-auto w-full max-w-3xl px-4 py-10 sm:px-6 lg:px-8">
        <Card className="border-border/70 p-8 text-center">
          <h1 className="text-2xl font-semibold text-foreground">Utilizador nao encontrado</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            O perfil publico que procuras nao existe ou nao esta disponivel.
          </p>
          <a href="/" className="mt-5 inline-flex text-sm font-medium text-primary hover:underline">
            Voltar a home
          </a>
        </Card>
      </div>
    )
  }

  const creator = isCreatorRole(profile.role)
  const renderedBadges = COMMUNITY_BADGES
  const unlockedBadgeIds = new Set(profile.badges.map((badge) => badge.id))
  const hasTopWeekBadge = unlockedBadgeIds.has('top_da_semana')

  return (
    <>
      <Helmet>
        <title>{`${profile.name} (@${profile.username}) | FinHub`}</title>
        <meta
          name="description"
          content={profile.bio || `Perfil publico de ${profile.name} na comunidade FinHub.`}
        />
      </Helmet>

      <div className="mx-auto w-full max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
        <Card className="border-border/70">
          <div className="space-y-6 p-6 sm:p-8">
            <header className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div className="flex min-w-0 items-center gap-4">
                {profile.avatar ? (
                  <img
                    src={profile.avatar}
                    alt={profile.name}
                    className="h-20 w-20 rounded-full object-cover"
                  />
                ) : (
                  <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/10 text-xl font-semibold text-primary">
                    {getInitials(profile)}
                  </div>
                )}

                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <h1 className="truncate text-2xl font-semibold text-foreground">
                      {profile.name}
                    </h1>
                    {hasTopWeekBadge ? (
                      <Badge variant="secondary" title="Top da Semana">
                        🏆 Top da Semana
                      </Badge>
                    ) : null}
                  </div>
                  <p className="text-sm text-muted-foreground">@{profile.username}</p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {formatMembershipDate(profile.createdAt)}
                  </p>
                  <div className="mt-2 flex flex-wrap items-center gap-2">
                    <Badge variant="outline" title={profile.levelName}>
                      Nv.{profile.level} • {profile.levelName}
                    </Badge>
                    <Badge variant="secondary">{formatCount(profile.totalXp)} XP</Badge>
                  </div>
                </div>
              </div>

              {creator ? (
                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant="secondary">Criador</Badge>
                  <a
                    href={toCreatorHref(profile.username)}
                    className="text-sm font-medium text-primary hover:underline"
                  >
                    Ver pagina de criador
                  </a>
                </div>
              ) : null}
            </header>

            <section className="rounded-lg border border-border/60 bg-muted/20 p-4">
              <p className="text-sm text-muted-foreground">
                {profile.bio || 'Este utilizador ainda nao adicionou uma bio publica.'}
              </p>
            </section>

            <section className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-lg border border-border/60 bg-card p-4">
                <p className="text-xs uppercase tracking-wide text-muted-foreground">
                  Artigos favoritos
                </p>
                <p className="mt-2 text-2xl font-semibold text-foreground tabular-nums">
                  {formatCount(profile.favoriteArticlesCount)}
                </p>
              </div>

              <div className="rounded-lg border border-border/60 bg-card p-4">
                <p className="text-xs uppercase tracking-wide text-muted-foreground">
                  Criadores seguidos
                </p>
                <p className="mt-2 text-2xl font-semibold text-foreground tabular-nums">
                  {formatCount(profile.followingCreatorsCount)}
                </p>
              </div>
            </section>

            <section className="space-y-3">
              <div className="flex items-center justify-between gap-2">
                <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                  Conquistas
                </h2>
                <span className="text-xs text-muted-foreground">
                  {profile.badges.length} / {renderedBadges.length} desbloqueadas
                </span>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                {renderedBadges.map((badge) => {
                  const unlocked = unlockedBadgeIds.has(badge.id)
                  const unlockedAt = profile.badges.find(
                    (entry) => entry.id === badge.id,
                  )?.unlockedAt
                  const unlockedAtLabel = unlockedAt ? formatBadgeUnlockDate(unlockedAt) : null

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
                      {unlockedAtLabel ? (
                        <p className="mt-2 text-[11px] text-muted-foreground">
                          Desbloqueada em {unlockedAtLabel}
                        </p>
                      ) : null}
                    </article>
                  )
                })}
              </div>
            </section>
          </div>
        </Card>
      </div>
    </>
  )
}
