import { useEffect, useMemo, useState } from 'react'
import { Helmet } from '@/lib/helmet'
import { ExternalLink, Users } from 'lucide-react'
import { useQueries, useQuery } from '@tanstack/react-query'
import { Button, Card, Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui'
import { useAuthStore } from '@/features/auth/stores/useAuthStore'
import { getErrorMessage } from '@/lib/api/client'
import SidebarLayout from '@/shared/layouts/SidebarLayout'
import { PublicSurfaceDisabledState } from '@/features/platform/components/PublicSurfaceDisabledState'
import { usePublicSurfaceControl } from '@/features/platform/hooks/usePublicSurfaceControl'
import {
  fetchCreatorContentByType,
  fetchIsFollowingCreator,
  fetchPublicCreatorByUsername,
  followCreatorById,
  PublicCreatorContentType,
  unfollowCreatorById,
} from '@/features/creators/services/publicCreatorsService'

interface CreatorProfilePageProps {
  username?: string
}

const TAB_DEFINITIONS: Array<{ label: string; type: PublicCreatorContentType }> = [
  { label: 'Artigos', type: 'article' },
  { label: 'Videos', type: 'video' },
  { label: 'Cursos', type: 'course' },
  { label: 'Podcasts', type: 'podcast' },
  { label: 'Livros', type: 'book' },
]

const safeDecode = (value: string): string => {
  try {
    return decodeURIComponent(value)
  } catch {
    return value
  }
}

const formatDate = (value?: string): string => {
  if (!value) return 'Data indisponivel'
  const parsed = Date.parse(value)
  if (!Number.isFinite(parsed)) return 'Data indisponivel'
  return new Date(parsed).toLocaleDateString('pt-PT')
}

const toSocialLinks = (value?: {
  website?: string | null
  twitter?: string | null
  linkedin?: string | null
  instagram?: string | null
}) => {
  if (!value) return []

  return Object.entries(value)
    .filter(([, url]) => typeof url === 'string' && url.trim().length > 0)
    .map(([platform, url]) => ({
      platform: platform.charAt(0).toUpperCase() + platform.slice(1),
      url: String(url),
    }))
}

export default function CreatorProfilePage({ username }: CreatorProfilePageProps) {
  const creatorPageSurface = usePublicSurfaceControl('creator_page')
  const rawUsername =
    username ||
    (typeof window !== 'undefined'
      ? (new URLSearchParams(window.location.search).get('username') ?? '')
      : '')
  const resolvedUsername = safeDecode(rawUsername.trim())
  const normalizedUsername = resolvedUsername.toLowerCase()

  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)
  const currentUserId = useAuthStore((state) => state.user?.id)

  const [activeTab, setActiveTab] = useState<PublicCreatorContentType>('article')
  const [isFollowing, setIsFollowing] = useState(false)
  const [followersCount, setFollowersCount] = useState(0)
  const [isFollowLoading, setIsFollowLoading] = useState(false)
  const [followError, setFollowError] = useState<string | null>(null)

  const profileQuery = useQuery({
    queryKey: ['public-creator-profile-v2', normalizedUsername],
    queryFn: () => fetchPublicCreatorByUsername(normalizedUsername),
    enabled: normalizedUsername.length > 0,
    staleTime: 60 * 1000,
    retry: 1,
  })

  const creator = profileQuery.data

  const followStatusQuery = useQuery({
    queryKey: ['public-creator-follow-status', creator?.id, isAuthenticated],
    queryFn: () => fetchIsFollowingCreator(creator?.id ?? ''),
    enabled: Boolean(creator?.id) && isAuthenticated,
    staleTime: 60 * 1000,
    retry: 1,
  })

  const contentQueries = useQueries({
    queries: TAB_DEFINITIONS.map((tab) => ({
      queryKey: ['public-creator-content-tab', creator?.id, tab.type],
      queryFn: () => fetchCreatorContentByType(creator?.id ?? '', tab.type, 6),
      enabled: Boolean(creator?.id),
      staleTime: 60 * 1000,
      retry: 1,
    })),
  })

  useEffect(() => {
    if (!creator) return
    setFollowersCount(creator.followersCount)
  }, [creator])

  useEffect(() => {
    if (!isAuthenticated) {
      setIsFollowing(false)
      return
    }

    setIsFollowing(Boolean(followStatusQuery.data))
  }, [isAuthenticated, followStatusQuery.data, creator?.id])

  const socialLinks = useMemo(() => toSocialLinks(creator?.socialLinks), [creator?.socialLinks])
  const totalPublications = useMemo(
    () => contentQueries.reduce((sum, query) => sum + (query.data?.total ?? 0), 0),
    [contentQueries],
  )

  const handleToggleFollow = async () => {
    if (!creator?.id || isFollowLoading) {
      return
    }

    if (!isAuthenticated) {
      window.location.href = '/login'
      return
    }

    const previousFollowing = isFollowing
    const previousFollowerCount = followersCount
    const nextFollowing = !previousFollowing

    setFollowError(null)
    setIsFollowLoading(true)
    setIsFollowing(nextFollowing)
    setFollowersCount((current) => Math.max(0, current + (nextFollowing ? 1 : -1)))

    try {
      if (nextFollowing) {
        await followCreatorById(creator.id)
      } else {
        await unfollowCreatorById(creator.id)
      }
    } catch (error) {
      setIsFollowing(previousFollowing)
      setFollowersCount(previousFollowerCount)
      setFollowError(getErrorMessage(error))
    } finally {
      setIsFollowLoading(false)
    }
  }

  if (!resolvedUsername) {
    if (typeof window !== 'undefined') window.location.replace('/creators')
    return null
  }

  if (creatorPageSurface.data && !creatorPageSurface.data.enabled) {
    return (
      <SidebarLayout>
        <PublicSurfaceDisabledState
          title="Pagina de creator temporariamente indisponivel"
          message={
            creatorPageSurface.data.publicMessage ??
            'Os perfis publicos de creators estao temporariamente indisponiveis durante revisao operacional.'
          }
        />
      </SidebarLayout>
    )
  }

  if (profileQuery.isLoading) {
    return (
      <SidebarLayout>
        <div className="flex min-h-[50vh] items-center justify-center">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        </div>
      </SidebarLayout>
    )
  }

  if (profileQuery.isError || !creator) {
    return (
      <SidebarLayout>
        <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4 text-center">
          <p className="text-muted-foreground">Criador nao encontrado ou indisponivel.</p>
          <a href="/creators" className="text-sm text-primary hover:underline">
            ← Ver todos os criadores
          </a>
        </div>
      </SidebarLayout>
    )
  }

  const isOwnProfile = Boolean(currentUserId && currentUserId === creator.id)
  const canFollow = isAuthenticated && !isOwnProfile
  const canonicalUrl =
    typeof window !== 'undefined'
      ? window.location.href
      : `/creators/${encodeURIComponent(creator.username)}`

  return (
    <SidebarLayout>
      <Helmet>
        <title>{`${creator.name} (@${creator.username}) | FinHub`}</title>
        <meta
          name="description"
          content={creator.bio || `Perfil publico de ${creator.name} na comunidade FinHub.`}
        />
        <meta property="og:title" content={`${creator.name} | FinHub`} />
        <meta
          property="og:description"
          content={creator.bio || `Perfil publico de ${creator.name} na comunidade FinHub.`}
        />
        {creator.avatar ? <meta property="og:image" content={creator.avatar} /> : null}
        <link rel="canonical" href={canonicalUrl} />
      </Helmet>

      <div className="mx-auto max-w-7xl space-y-8 px-4 py-8">
        {profileQuery.isError ? (
          <div className="rounded-md border border-amber-400/30 bg-amber-400/10 px-4 py-3 text-xs text-amber-100">
            Perfil carregado com fallback parcial porque a API publica de creators nao respondeu.
          </div>
        ) : null}

        <Card className="overflow-hidden border-border/70 bg-card/70">
          <div className="grid gap-6 p-6 md:grid-cols-[auto_minmax(0,1fr)_auto] md:items-center">
            <div className="flex items-center gap-4">
              {creator.avatar ? (
                <img
                  src={creator.avatar}
                  alt={creator.name}
                  className="h-24 w-24 rounded-full object-cover"
                />
              ) : (
                <div className="flex h-24 w-24 items-center justify-center rounded-full bg-muted text-xl font-semibold text-muted-foreground">
                  {creator.name.slice(0, 2).toUpperCase()}
                </div>
              )}

              <div>
                <h1 className="text-2xl font-semibold text-foreground">{creator.name}</h1>
                <p className="text-sm text-muted-foreground">@{creator.username}</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Ativo desde {formatDate(creator.createdAt)}
                </p>
              </div>
            </div>

            <div className="space-y-3">
              <p className="text-sm text-muted-foreground">
                {creator.bio || 'Este criador ainda nao adicionou uma biografia publica.'}
              </p>

              {socialLinks.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {socialLinks.map((link) => (
                    <a
                      key={`${link.platform}-${link.url}`}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 rounded-full border border-border px-3 py-1 text-xs text-muted-foreground hover:text-foreground"
                    >
                      {link.platform}
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  ))}
                </div>
              ) : null}
            </div>

            <div className="space-y-3 md:text-right">
              <div className="inline-flex items-center gap-2 rounded-full border border-border bg-background px-3 py-1 text-sm">
                <Users className="h-4 w-4 text-muted-foreground" />
                <span className="tabular-nums font-semibold">{followersCount}</span>
                <span className="text-muted-foreground">seguidores</span>
              </div>

              <div className="text-sm text-muted-foreground">
                <span className="tabular-nums font-semibold text-foreground">
                  {totalPublications}
                </span>{' '}
                publicacoes
              </div>

              {canFollow ? (
                <Button
                  type="button"
                  onClick={handleToggleFollow}
                  disabled={isFollowLoading}
                  variant={isFollowing ? 'outline' : 'default'}
                >
                  {isFollowLoading ? 'A atualizar...' : isFollowing ? 'Unfollow' : 'Follow'}
                </Button>
              ) : !isAuthenticated ? (
                <a href="/login">
                  <Button type="button" variant="outline">
                    Fazer login para seguir
                  </Button>
                </a>
              ) : (
                <Button type="button" variant="outline" disabled>
                  Este e o teu perfil
                </Button>
              )}

              {followError ? <p className="text-xs text-red-600">{followError}</p> : null}
            </div>
          </div>
        </Card>

        <Card className="border-border/70 bg-card/70 p-6">
          <Tabs
            value={activeTab}
            onValueChange={(value) => setActiveTab(value as PublicCreatorContentType)}
          >
            <TabsList className="mb-4 flex h-auto w-full flex-wrap justify-start gap-1 bg-muted/60 p-1">
              {TAB_DEFINITIONS.map((tab) => (
                <TabsTrigger key={tab.type} value={tab.type} className="text-xs sm:text-sm">
                  {tab.label}
                </TabsTrigger>
              ))}
            </TabsList>

            {TAB_DEFINITIONS.map((tab, index) => {
              const query = contentQueries[index]
              const items = query.data?.items ?? []
              const total = query.data?.total ?? 0

              return (
                <TabsContent key={tab.type} value={tab.type} className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h2 className="text-lg font-semibold">{tab.label}</h2>
                    <span className="text-sm text-muted-foreground">{total} publicados</span>
                  </div>

                  {query.isLoading ? (
                    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                      {Array.from({ length: 3 }).map((_, skeletonIndex) => (
                        <div
                          key={`skeleton-${tab.type}-${skeletonIndex}`}
                          className="h-40 animate-pulse rounded-lg border border-border bg-muted/40"
                        />
                      ))}
                    </div>
                  ) : query.isError ? (
                    <div className="rounded-md border border-red-500/40 bg-red-500/10 p-3 text-sm text-red-300">
                      Erro ao carregar {tab.label.toLowerCase()} deste criador.
                    </div>
                  ) : items.length === 0 ? (
                    <div className="rounded-lg border border-border bg-background/60 p-8 text-center text-sm text-muted-foreground">
                      Este criador ainda nao publicou {tab.label.toLowerCase()}.
                    </div>
                  ) : (
                    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                      {items.map((item) => (
                        <a
                          key={`${tab.type}-${item.id}`}
                          href={item.href}
                          className="group rounded-lg border border-border bg-background/60 p-3 transition hover:border-primary/40 hover:shadow-md"
                        >
                          {item.coverImage ? (
                            <img
                              src={item.coverImage}
                              alt={item.title}
                              className="mb-3 h-28 w-full rounded-md object-cover"
                            />
                          ) : (
                            <div className="mb-3 flex h-28 items-center justify-center rounded-md bg-muted text-xs text-muted-foreground">
                              Sem imagem
                            </div>
                          )}

                          <h3 className="line-clamp-2 text-sm font-semibold text-foreground group-hover:text-primary">
                            {item.title}
                          </h3>
                          <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">
                            {item.description}
                          </p>
                          <p className="mt-3 text-[11px] text-muted-foreground">
                            Publicado em {formatDate(item.publishedAt || item.createdAt)}
                          </p>
                        </a>
                      ))}
                    </div>
                  )}
                </TabsContent>
              )
            })}
          </Tabs>
        </Card>
      </div>
    </SidebarLayout>
  )
}
