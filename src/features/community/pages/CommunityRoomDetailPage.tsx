import { FormEvent, useMemo, useState } from 'react'
import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { formatDistanceToNow } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { MessageSquare, Users } from 'lucide-react'
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Input,
} from '@/components/ui'
import { usePaywall } from '@/features/auth'
import { useAuthStore } from '@/features/auth/stores/useAuthStore'
import { UserRole } from '@/features/auth/types'
import { getErrorMessage } from '@/lib/api/client'
import { isRoleAtLeast } from '@/lib/permissions/config'
import { LeaderboardWidget } from '../components/LeaderboardWidget'
import { MarkdownEditor } from '../components/MarkdownEditor'
import { communityService } from '../services/communityService'
import type { CommunityPostSort } from '../types/community'

interface CommunityRoomDetailPageProps {
  slug?: string
}

const POSTS_PER_PAGE = 12

const resolveRequiredRole = (requiredRole?: string): UserRole => {
  if (requiredRole === UserRole.FREE) return UserRole.FREE
  if (requiredRole === UserRole.PREMIUM) return UserRole.PREMIUM
  if (requiredRole === UserRole.CREATOR) return UserRole.CREATOR
  if (requiredRole === UserRole.BRAND_MANAGER) return UserRole.BRAND_MANAGER
  if (requiredRole === UserRole.ADMIN) return UserRole.ADMIN
  return UserRole.VISITOR
}

const formatRelativeDate = (value: string): string => {
  const parsed = new Date(value)
  if (Number.isNaN(parsed.getTime())) return 'agora'
  return formatDistanceToNow(parsed, { addSuffix: true, locale: ptBR })
}

export function CommunityRoomDetailPage({ slug }: CommunityRoomDetailPageProps) {
  const normalizedSlug = (slug || '').trim()
  const queryClient = useQueryClient()
  const { PaywallComponent } = usePaywall()

  const currentRole = useAuthStore((state) => state.user?.role ?? UserRole.VISITOR)
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)
  const hydrated = useAuthStore((state) => state.hydrated)

  const [sortBy, setSortBy] = useState<CommunityPostSort>('recent')
  const [isComposerOpen, setIsComposerOpen] = useState(false)
  const [postTitle, setPostTitle] = useState('')
  const [postContent, setPostContent] = useState('')
  const [postImageUrl, setPostImageUrl] = useState('')
  const [formError, setFormError] = useState<string | null>(null)

  const roomQuery = useQuery({
    queryKey: ['community-room', normalizedSlug],
    queryFn: () => communityService.getRoomBySlug(normalizedSlug),
    enabled: normalizedSlug.length > 0,
    staleTime: 60_000,
  })

  const room = roomQuery.data
  const requiredRole = resolveRequiredRole(room?.requiredRole)
  const hasAccess = isRoleAtLeast(currentRole, requiredRole)
  const isPremiumRoom = Boolean(room && (room.isPremium || requiredRole !== UserRole.VISITOR))
  const showPaywall = Boolean(room && hydrated && isPremiumRoom && !hasAccess)

  const loginRedirect = useMemo(() => {
    if (!normalizedSlug) return '/login'
    return `/login?redirect=${encodeURIComponent(`/comunidade/${normalizedSlug}`)}`
  }, [normalizedSlug])

  const postsQuery = useInfiniteQuery({
    queryKey: ['community-room-posts', normalizedSlug, sortBy],
    queryFn: ({ pageParam }) =>
      communityService.listRoomPosts(normalizedSlug, {
        limit: POSTS_PER_PAGE,
        sort: sortBy,
        cursor: typeof pageParam === 'string' ? pageParam : undefined,
      }),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) =>
      lastPage.pageInfo.hasMore ? (lastPage.pageInfo.nextCursor ?? undefined) : undefined,
    enabled: normalizedSlug.length > 0 && Boolean(room) && !showPaywall,
    staleTime: 30_000,
  })

  const createPostMutation = useMutation({
    mutationFn: (payload: { title: string; content: string; imageUrl?: string }) =>
      communityService.createRoomPost(normalizedSlug, payload),
    onSuccess: async () => {
      setPostTitle('')
      setPostContent('')
      setPostImageUrl('')
      setFormError(null)
      setIsComposerOpen(false)
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['community-room-posts', normalizedSlug] }),
        queryClient.invalidateQueries({ queryKey: ['community-room', normalizedSlug] }),
      ])
    },
  })

  const posts = useMemo(
    () => postsQuery.data?.pages.flatMap((page) => page.items) ?? [],
    [postsQuery.data?.pages],
  )

  const handleCreatePostClick = () => {
    setIsComposerOpen((current) => !current)
  }

  const handleSubmitPost = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setFormError(null)

    const title = postTitle.trim()
    const content = postContent.trim()
    const imageUrl = postImageUrl.trim()

    if (title.length < 3 || title.length > 200) {
      setFormError('Usa um titulo entre 3 e 200 caracteres.')
      return
    }

    if (content.length < 3 || content.length > 10000) {
      setFormError('Usa conteudo entre 3 e 10000 caracteres.')
      return
    }

    if (imageUrl && !/^https?:\/\/\S+$/i.test(imageUrl)) {
      setFormError('A imagem deve ser uma URL valida iniciada por http:// ou https://.')
      return
    }

    try {
      await createPostMutation.mutateAsync({
        title,
        content,
        imageUrl: imageUrl || undefined,
      })
    } catch (error) {
      setFormError(getErrorMessage(error))
    }
  }

  if (!normalizedSlug) {
    return (
      <div className="mx-auto w-full max-w-3xl px-4 py-10 sm:px-6 lg:px-8">
        <Card>
          <CardHeader>
            <CardTitle>Sala invalida</CardTitle>
            <CardDescription>O identificador desta sala nao e valido.</CardDescription>
          </CardHeader>
        </Card>
      </div>
    )
  }

  if (roomQuery.isLoading) {
    return (
      <div className="mx-auto w-full max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
        <Card className="animate-pulse">
          <CardHeader>
            <div className="mb-2 h-8 w-40 rounded bg-muted" />
            <div className="h-5 w-3/4 rounded bg-muted" />
          </CardHeader>
          <CardContent>
            <div className="h-20 rounded bg-muted" />
          </CardContent>
        </Card>
      </div>
    )
  }

  if (roomQuery.error || !room) {
    return (
      <div className="mx-auto w-full max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
        <Card className="border-red-500/60 bg-red-50/70">
          <CardHeader>
            <CardTitle>Erro ao carregar sala</CardTitle>
            <CardDescription>{getErrorMessage(roomQuery.error)}</CardDescription>
          </CardHeader>
        </Card>
      </div>
    )
  }

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="relative mb-6 overflow-hidden rounded-2xl border border-brand/20 bg-brand/[0.03] p-6 dark:bg-brand/[0.06] sm:p-8">
        <div className="absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-brand via-brand/50 to-transparent" />
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="flex min-w-0 flex-1 items-start gap-4">
            {/* Room icon */}
            <span className="mt-0.5 text-4xl leading-none sm:text-5xl" aria-hidden="true">
              {room.icon}
            </span>

            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <p className="text-xs font-semibold uppercase tracking-widest text-brand">Sala</p>
                {isPremiumRoom ? (
                  <span className="rounded-full border border-amber-400/50 bg-amber-50 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-amber-600 dark:bg-amber-950/30 dark:text-amber-400">
                    Premium
                  </span>
                ) : null}
              </div>
              <h1 className="mt-0.5 text-2xl font-extrabold tracking-tighter text-foreground sm:text-3xl">
                {room.name}
              </h1>
              <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">
                {room.description}
              </p>
              <div className="mt-3 flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                <span className="inline-flex items-center gap-1.5">
                  <Users className="h-4 w-4" />
                  {room.memberCount.toLocaleString('pt-PT')} membros
                </span>
                <span className="text-border">·</span>
                <span className="inline-flex items-center gap-1.5">
                  <MessageSquare className="h-4 w-4" />
                  {room.postCount.toLocaleString('pt-PT')} posts
                </span>
              </div>
            </div>
          </div>
          <div className="shrink-0">
            {isAuthenticated ? (
              <Button
                type="button"
                className="bg-brand text-brand-foreground hover:bg-brand/90"
                onClick={handleCreatePostClick}
              >
                {isComposerOpen ? 'Fechar editor' : 'Criar post'}
              </Button>
            ) : (
              <Button asChild type="button" variant="outline">
                <a href={loginRedirect}>Login para criar post</a>
              </Button>
            )}
          </div>
        </div>
      </div>

      {!isAuthenticated ? (
        <p className="mb-4 text-sm text-muted-foreground">Inicia sessao para participar.</p>
      ) : null}

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
        <div>
          {showPaywall ? (
            <PaywallComponent
              title="Sala Premium"
              description="Esta sala e exclusiva para membros Premium. Faz upgrade para desbloquear os posts."
              cta="Ver planos"
              upgradePath="/precos"
            />
          ) : (
            <div className="space-y-4">
              {isComposerOpen && isAuthenticated ? (
                <Card>
                  <CardHeader>
                    <CardTitle>Criar novo post</CardTitle>
                    <CardDescription>Podes usar markdown no conteudo.</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form className="space-y-3" onSubmit={handleSubmitPost}>
                      <div className="space-y-1">
                        <label
                          className="text-sm font-medium text-foreground"
                          htmlFor="community-post-title"
                        >
                          Titulo
                        </label>
                        <Input
                          id="community-post-title"
                          value={postTitle}
                          onChange={(event) => setPostTitle(event.target.value)}
                          maxLength={200}
                          placeholder="Ex: Como organizam o vosso fundo de emergencia?"
                        />
                      </div>
                      <div className="space-y-1">
                        <label
                          className="text-sm font-medium text-foreground"
                          htmlFor="community-post-content"
                        >
                          Conteudo (markdown)
                        </label>
                        <MarkdownEditor
                          id="community-post-content"
                          value={postContent}
                          onChange={setPostContent}
                          maxLength={10000}
                          rows={8}
                          placeholder="Partilha contexto e pergunta de forma clara."
                        />
                      </div>
                      <div className="space-y-1">
                        <label
                          className="text-sm font-medium text-foreground"
                          htmlFor="community-post-image-url"
                        >
                          URL da imagem (opcional)
                        </label>
                        <Input
                          id="community-post-image-url"
                          value={postImageUrl}
                          onChange={(event) => setPostImageUrl(event.target.value)}
                          maxLength={2048}
                          placeholder="https://exemplo.com/imagem.jpg"
                        />
                      </div>
                      {formError ? <p className="text-sm text-red-600">{formError}</p> : null}
                      <div className="flex flex-wrap items-center gap-2">
                        <Button type="submit" disabled={createPostMutation.isPending}>
                          {createPostMutation.isPending ? 'A publicar...' : 'Publicar post'}
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => {
                            setIsComposerOpen(false)
                            setPostImageUrl('')
                            setFormError(null)
                          }}
                        >
                          Cancelar
                        </Button>
                      </div>
                    </form>
                  </CardContent>
                </Card>
              ) : null}

              <div>
                {/* Sort tabs — pill style */}
                <div className="mb-4 flex items-center justify-between gap-3">
                  <p className="text-xs font-semibold uppercase tracking-widest text-brand">
                    Posts
                  </p>
                  <div className="flex items-center gap-1 rounded-full border border-border/50 bg-muted/40 p-1">
                    <button
                      type="button"
                      disabled={postsQuery.isFetching}
                      onClick={() => setSortBy('recent')}
                      className={`rounded-full px-4 py-1.5 text-xs font-semibold transition-all ${
                        sortBy === 'recent'
                          ? 'bg-brand text-brand-foreground shadow-sm'
                          : 'text-muted-foreground hover:text-foreground'
                      }`}
                    >
                      Recentes
                    </button>
                    <button
                      type="button"
                      disabled={postsQuery.isFetching}
                      onClick={() => setSortBy('popular')}
                      className={`rounded-full px-4 py-1.5 text-xs font-semibold transition-all ${
                        sortBy === 'popular'
                          ? 'bg-brand text-brand-foreground shadow-sm'
                          : 'text-muted-foreground hover:text-foreground'
                      }`}
                    >
                      Popular
                    </button>
                  </div>
                </div>
                <div className="space-y-2">
                  {postsQuery.isLoading ? (
                    <div className="space-y-2">
                      {Array.from({ length: 3 }).map((_, index) => (
                        <div
                          key={`post-loading-${index}`}
                          className="h-20 animate-pulse rounded bg-muted"
                        />
                      ))}
                    </div>
                  ) : null}

                  {postsQuery.error ? (
                    <p className="text-sm text-red-600">{getErrorMessage(postsQuery.error)}</p>
                  ) : null}

                  {!postsQuery.isLoading && !postsQuery.error && posts.length === 0 ? (
                    <p className="text-sm text-muted-foreground">Sem posts ainda nesta sala.</p>
                  ) : null}

                  {!postsQuery.isLoading && !postsQuery.error && posts.length > 0 ? (
                    <div className="space-y-2">
                      {posts.map((post) => (
                        <a
                          key={post.id}
                          href={`/comunidade/post/${encodeURIComponent(post.id)}`}
                          className="group flex gap-3 rounded-xl border border-border/60 p-4 transition-all hover:border-brand/30 hover:bg-brand/[0.02]"
                        >
                          {/* Upvote column — Reddit style */}
                          <div className="flex flex-col items-center gap-0.5 pt-0.5">
                            <span className="text-base leading-none text-muted-foreground transition-colors group-hover:text-brand">
                              ↑
                            </span>
                            <span className="text-xs font-bold tabular-nums text-foreground">
                              {post.upvotes}
                            </span>
                          </div>

                          {/* Content */}
                          <div className="min-w-0 flex-1">
                            <h3 className="text-base font-semibold leading-snug text-foreground transition-colors group-hover:text-brand">
                              {post.title}
                            </h3>
                            <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                              {post.author.avatar ? (
                                <img
                                  src={post.author.avatar}
                                  alt={post.author.name}
                                  className="h-4 w-4 rounded-full object-cover"
                                />
                              ) : (
                                <span className="inline-flex h-4 w-4 items-center justify-center rounded-full bg-muted text-[9px] font-bold">
                                  {post.author.name.charAt(0).toUpperCase()}
                                </span>
                              )}
                              <span className="font-medium text-foreground/80">
                                @{post.author.username}
                              </span>
                              {post.author.level ? (
                                <span
                                  className="rounded-full border border-border px-1.5 py-0.5 text-[10px] font-medium"
                                  title={post.author.levelName || `Nível ${post.author.level}`}
                                >
                                  Nv.{post.author.level}
                                </span>
                              ) : null}
                              <span className="text-border/60">·</span>
                              <span>{formatRelativeDate(post.createdAt)}</span>
                              <span className="text-border/60">·</span>
                              <span className="inline-flex items-center gap-1">
                                <MessageSquare className="h-3 w-3" />
                                {post.replyCount} {post.replyCount === 1 ? 'resposta' : 'respostas'}
                              </span>
                            </div>
                            {post.imageUrl ? (
                              <img
                                src={post.imageUrl}
                                alt={`Imagem do post ${post.title}`}
                                loading="lazy"
                                className="mt-3 max-h-48 w-full rounded-lg object-cover"
                              />
                            ) : null}
                          </div>
                        </a>
                      ))}
                    </div>
                  ) : null}

                  {postsQuery.hasNextPage ? (
                    <div className="pt-2">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => postsQuery.fetchNextPage()}
                        disabled={postsQuery.isFetchingNextPage}
                      >
                        {postsQuery.isFetchingNextPage ? 'A carregar...' : 'Carregar mais'}
                      </Button>
                    </div>
                  ) : null}
                </div>
              </div>
            </div>
          )}
        </div>

        <aside className="lg:sticky lg:top-24">
          <LeaderboardWidget />
        </aside>
      </div>
    </div>
  )
}
