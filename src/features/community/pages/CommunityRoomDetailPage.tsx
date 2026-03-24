import { FormEvent, useMemo, useState } from 'react'
import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { formatDistanceToNow } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import {
  Badge,
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
    if (!isAuthenticated) {
      if (typeof window !== 'undefined') {
        window.location.href = loginRedirect
      }
      return
    }
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
      <Card className="mb-6">
        <CardHeader>
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div className="min-w-0">
              <CardTitle className="text-2xl sm:text-3xl">{room.name}</CardTitle>
              <CardDescription className="mt-2 text-sm sm:text-base">
                {room.description}
              </CardDescription>
            </div>
            {isPremiumRoom ? <Badge variant="secondary">PREMIUM</Badge> : null}
          </div>
        </CardHeader>
        <CardContent className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
            <span>{room.memberCount} membros</span>
            <span>{room.postCount} posts</span>
          </div>
          <Button type="button" onClick={handleCreatePostClick}>
            {isComposerOpen ? 'Fechar editor' : 'Criar post'}
          </Button>
        </CardContent>
      </Card>

      {!isAuthenticated ? (
        <p className="mb-4 text-sm text-muted-foreground">
          Inicia sessao para participar. Ao clicar em "Criar post" seras redirecionado para login.
        </p>
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

              <Card>
                <CardHeader className="flex flex-row items-center justify-between gap-3">
                  <div>
                    <CardTitle>Posts da sala</CardTitle>
                    <CardDescription>Ordena por recentes ou populares.</CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      type="button"
                      size="sm"
                      variant={sortBy === 'recent' ? 'default' : 'outline'}
                      onClick={() => setSortBy('recent')}
                      disabled={postsQuery.isFetching}
                    >
                      Recentes
                    </Button>
                    <Button
                      type="button"
                      size="sm"
                      variant={sortBy === 'popular' ? 'default' : 'outline'}
                      onClick={() => setSortBy('popular')}
                      disabled={postsQuery.isFetching}
                    >
                      Popular
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
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
                          className="block rounded-lg border border-border p-4 transition hover:border-primary/50 hover:bg-muted/30"
                        >
                          <div className="flex items-start justify-between gap-3">
                            <h3 className="text-base font-semibold text-foreground">
                              {post.title}
                            </h3>
                            <div className="shrink-0 text-xs text-muted-foreground">
                              {formatRelativeDate(post.createdAt)}
                            </div>
                          </div>
                          <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                            <span className="inline-flex items-center gap-1">
                              {post.author.avatar ? (
                                <img
                                  src={post.author.avatar}
                                  alt={post.author.name}
                                  className="h-5 w-5 rounded-full object-cover"
                                />
                              ) : (
                                <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-muted font-semibold">
                                  {post.author.name.charAt(0).toUpperCase()}
                                </span>
                              )}
                              @{post.author.username}
                              {post.author.level ? (
                                <span
                                  className="rounded-full border border-border bg-muted px-2 py-0.5 text-[11px] font-medium text-foreground"
                                  title={post.author.levelName || `Nivel ${post.author.level}`}
                                >
                                  Nv.{post.author.level}
                                </span>
                              ) : null}
                            </span>
                            <span>{post.upvotes} upvotes</span>
                            <span>
                              {post.replyCount} {post.replyCount === 1 ? 'resposta' : 'respostas'}
                            </span>
                          </div>
                          {post.imageUrl ? (
                            <img
                              src={post.imageUrl}
                              alt={`Imagem do post ${post.title}`}
                              loading="lazy"
                              className="mt-3 max-h-64 w-full rounded object-cover"
                            />
                          ) : null}
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
                </CardContent>
              </Card>
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
