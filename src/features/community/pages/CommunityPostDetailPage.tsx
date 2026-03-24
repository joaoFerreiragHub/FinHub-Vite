import { FormEvent, useMemo, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { formatDistanceToNow } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { ChevronDown, ChevronUp, MessageSquare } from 'lucide-react'
import { Button, Textarea } from '@/components/ui'
import { useAuthStore } from '@/features/auth/stores/useAuthStore'
import { getErrorMessage } from '@/lib/api/client'
import { communityService } from '../services/communityService'
import type {
  CommunityPostDetailResponse,
  CommunityReply,
  CommunityReplyThread,
  CommunityVoteDirection,
} from '../types/community'
import { renderCommunityMarkdown } from '../utils/markdown'

interface CommunityPostDetailPageProps {
  postId?: string
}

const formatRelativeDate = (value: string): string => {
  const parsed = new Date(value)
  if (Number.isNaN(parsed.getTime())) return 'agora'
  return formatDistanceToNow(parsed, { addSuffix: true, locale: ptBR })
}

const applyReplyVote = (
  payload: CommunityPostDetailResponse,
  replyId: string,
  vote: {
    upvotes: number
    downvotes: number
    score: number
    viewerVote: CommunityVoteDirection | null
  },
): CommunityPostDetailResponse => ({
  ...payload,
  replies: payload.replies.map((root) => {
    if (root.id === replyId) {
      return {
        ...root,
        upvotes: vote.upvotes,
        downvotes: vote.downvotes,
        score: vote.score,
        viewerVote: vote.viewerVote,
      }
    }

    return {
      ...root,
      replies: root.replies.map((child) =>
        child.id === replyId
          ? {
              ...child,
              upvotes: vote.upvotes,
              downvotes: vote.downvotes,
              score: vote.score,
              viewerVote: vote.viewerVote,
            }
          : child,
      ),
    }
  }),
})

const renderAuthorLabel = (author: { username: string; level?: number; levelName?: string }) => (
  <span className="inline-flex items-center gap-1 font-semibold text-foreground">
    <span>@{author.username}</span>
    {author.level ? (
      <span
        className="rounded-full border border-border bg-muted px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground"
        title={author.levelName ?? `Nivel ${author.level}`}
      >
        Nv.{author.level}
      </span>
    ) : null}
  </span>
)

export function CommunityPostDetailPage({ postId }: CommunityPostDetailPageProps) {
  const normalizedPostId = (postId || '').trim()
  const queryClient = useQueryClient()
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)

  const [newReplyContent, setNewReplyContent] = useState('')
  const [inlineReplyContent, setInlineReplyContent] = useState('')
  const [activeReplyParentId, setActiveReplyParentId] = useState<string | null>(null)
  const [formError, setFormError] = useState<string | null>(null)

  const postQuery = useQuery({
    queryKey: ['community-post', normalizedPostId],
    queryFn: () => communityService.getPostById(normalizedPostId),
    enabled: normalizedPostId.length > 0,
    staleTime: 30_000,
  })

  const postVoteMutation = useMutation({
    mutationFn: (direction: CommunityVoteDirection) =>
      communityService.votePost(normalizedPostId, direction),
    onSuccess: (vote) => {
      queryClient.setQueryData<CommunityPostDetailResponse>(
        ['community-post', normalizedPostId],
        (current) => {
          if (!current) return current
          return {
            ...current,
            post: {
              ...current.post,
              upvotes: vote.upvotes,
              downvotes: vote.downvotes,
              score: vote.score,
              viewerVote: vote.viewerVote,
            },
          }
        },
      )
    },
  })

  const replyVoteMutation = useMutation({
    mutationFn: ({ replyId, direction }: { replyId: string; direction: CommunityVoteDirection }) =>
      communityService.voteReply(replyId, direction),
    onSuccess: (vote) => {
      queryClient.setQueryData<CommunityPostDetailResponse>(
        ['community-post', normalizedPostId],
        (current) => {
          if (!current) return current
          return applyReplyVote(current, vote.targetId, vote)
        },
      )
    },
  })

  const createReplyMutation = useMutation({
    mutationFn: (payload: { content: string; parentReply?: string }) =>
      communityService.createPostReply(normalizedPostId, payload),
    onSuccess: async () => {
      setNewReplyContent('')
      setInlineReplyContent('')
      setActiveReplyParentId(null)
      setFormError(null)
      await queryClient.invalidateQueries({ queryKey: ['community-post', normalizedPostId] })
    },
  })

  const renderedContent = useMemo(
    () => renderCommunityMarkdown(postQuery.data?.post.content || ''),
    [postQuery.data?.post.content],
  )

  const loginRedirect = useMemo(() => {
    if (!normalizedPostId) return '/login'
    return `/login?redirect=${encodeURIComponent(`/comunidade/post/${normalizedPostId}`)}`
  }, [normalizedPostId])

  const handleRequireAuth = (): boolean => {
    if (isAuthenticated) return true
    setFormError('Inicia sessão para votar ou responder.')
    return false
  }

  const handleVotePost = (direction: CommunityVoteDirection) => {
    if (!handleRequireAuth()) return
    postVoteMutation.mutate(direction)
  }

  const handleVoteReply = (replyId: string, direction: CommunityVoteDirection) => {
    if (!handleRequireAuth()) return
    replyVoteMutation.mutate({ replyId, direction })
  }

  const submitReply = async (contentRaw: string, parentReply?: string) => {
    if (!handleRequireAuth()) return
    setFormError(null)

    const content = contentRaw.trim()
    if (content.length < 2 || content.length > 5000) {
      setFormError('Usa uma resposta entre 2 e 5000 caracteres.')
      return
    }

    try {
      await createReplyMutation.mutateAsync({ content, parentReply })
    } catch (error) {
      setFormError(getErrorMessage(error))
    }
  }

  const handleSubmitMainReply = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    await submitReply(newReplyContent)
  }

  const handleSubmitInlineReply = async (
    event: FormEvent<HTMLFormElement>,
    parentReplyId: string,
  ) => {
    event.preventDefault()
    await submitReply(inlineReplyContent, parentReplyId)
  }

  // ─── Error / empty states ─────────────────────────────────────────────────

  if (!normalizedPostId) {
    return (
      <div className="mx-auto w-full max-w-3xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="rounded-xl border border-border/50 bg-card p-6">
          <p className="font-semibold text-foreground">Post não encontrado</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Não foi possível identificar o post pedido.
          </p>
        </div>
      </div>
    )
  }

  if (postQuery.isLoading) {
    return (
      <div className="mx-auto w-full max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="animate-pulse overflow-hidden rounded-2xl border border-border/50 bg-card">
          <div className="flex">
            <div className="hidden w-12 shrink-0 bg-muted/30 sm:block" />
            <div className="flex-1 p-6">
              <div className="mb-3 h-4 w-32 rounded bg-muted" />
              <div className="mb-2 h-8 w-3/4 rounded bg-muted" />
              <div className="mt-4 h-44 rounded bg-muted" />
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (postQuery.error || !postQuery.data) {
    return (
      <div className="mx-auto w-full max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="rounded-xl border border-destructive/40 bg-destructive/5 p-6">
          <p className="font-semibold text-foreground">Erro ao carregar thread</p>
          <p className="mt-1 text-sm text-muted-foreground">{getErrorMessage(postQuery.error)}</p>
        </div>
      </div>
    )
  }

  const { post, replies } = postQuery.data
  const isPostUpActive = post.viewerVote === 'up'
  const isPostDownActive = post.viewerVote === 'down'

  // ─── Reply block (root + children) ───────────────────────────────────────

  const renderChildReply = (child: CommunityReply) => {
    const upActive = child.viewerVote === 'up'
    const downActive = child.viewerVote === 'down'

    return (
      <div key={child.id} className="flex gap-2">
        {/* Vote column */}
        <div className="flex w-5 shrink-0 flex-col items-center gap-0.5 pt-0.5">
          <button
            type="button"
            className={`rounded p-0.5 transition-colors ${upActive ? 'text-brand' : 'text-muted-foreground hover:text-brand'}`}
            onClick={() => handleVoteReply(child.id, 'up')}
            disabled={!isAuthenticated || replyVoteMutation.isPending}
            aria-label="Upvote"
          >
            <ChevronUp className="h-3.5 w-3.5" />
          </button>
          <span
            className={`text-[10px] font-bold leading-none ${upActive ? 'text-brand' : downActive ? 'text-destructive' : 'text-foreground'}`}
          >
            {child.score}
          </span>
          <button
            type="button"
            className={`rounded p-0.5 transition-colors ${downActive ? 'text-destructive' : 'text-muted-foreground hover:text-destructive'}`}
            onClick={() => handleVoteReply(child.id, 'down')}
            disabled={!isAuthenticated || replyVoteMutation.isPending}
            aria-label="Downvote"
          >
            <ChevronDown className="h-3.5 w-3.5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1">
          <div className="mb-1 flex flex-wrap items-center gap-1.5 text-xs text-muted-foreground">
            {renderAuthorLabel(child.author)}
            <span>·</span>
            <span>{formatRelativeDate(child.createdAt)}</span>
          </div>
          <p className="whitespace-pre-wrap text-sm leading-relaxed text-foreground">
            {child.content}
          </p>
        </div>
      </div>
    )
  }

  const renderReplyBlock = (reply: CommunityReplyThread) => {
    const upActive = reply.viewerVote === 'up'
    const downActive = reply.viewerVote === 'down'
    const hasChildren = reply.replies.length > 0

    return (
      <div key={reply.id} className="flex gap-2">
        {/* Vote + thread line column */}
        <div className="flex w-6 shrink-0 flex-col items-center gap-0.5 pt-0.5">
          <button
            type="button"
            className={`rounded p-0.5 transition-colors ${upActive ? 'text-brand' : 'text-muted-foreground hover:text-brand'}`}
            onClick={() => handleVoteReply(reply.id, 'up')}
            disabled={!isAuthenticated || replyVoteMutation.isPending}
            aria-label="Upvote"
          >
            <ChevronUp className="h-4 w-4" />
          </button>
          <span
            className={`text-[11px] font-bold leading-none ${upActive ? 'text-brand' : downActive ? 'text-destructive' : 'text-foreground'}`}
          >
            {reply.score}
          </span>
          <button
            type="button"
            className={`rounded p-0.5 transition-colors ${downActive ? 'text-destructive' : 'text-muted-foreground hover:text-destructive'}`}
            onClick={() => handleVoteReply(reply.id, 'down')}
            disabled={!isAuthenticated || replyVoteMutation.isPending}
            aria-label="Downvote"
          >
            <ChevronDown className="h-4 w-4" />
          </button>
          {/* Thread line */}
          {hasChildren ? (
            <div className="mt-1 w-px flex-1 rounded-full bg-border/50 transition-colors hover:bg-brand/40" />
          ) : null}
        </div>

        {/* Content */}
        <div className="flex-1 pb-3">
          {/* Author + date */}
          <div className="mb-1.5 flex flex-wrap items-center gap-1.5 text-xs text-muted-foreground">
            {renderAuthorLabel(reply.author)}
            <span>·</span>
            <span>{formatRelativeDate(reply.createdAt)}</span>
          </div>

          {/* Body */}
          <p className="whitespace-pre-wrap text-sm leading-relaxed text-foreground">
            {reply.content}
          </p>

          {/* Actions */}
          <div className="mt-2 flex items-center gap-3">
            {isAuthenticated ? (
              <button
                type="button"
                className="text-xs font-semibold text-muted-foreground transition-colors hover:text-brand"
                onClick={() => {
                  setActiveReplyParentId(reply.id)
                  setInlineReplyContent('')
                  setFormError(null)
                }}
              >
                Responder
              </button>
            ) : (
              <a
                href={loginRedirect}
                className="text-xs font-semibold text-muted-foreground transition-colors hover:text-brand"
              >
                Login para responder
              </a>
            )}
          </div>

          {/* Inline reply form */}
          {activeReplyParentId === reply.id ? (
            <form
              className="mt-3 space-y-2"
              onSubmit={(event) => handleSubmitInlineReply(event, reply.id)}
            >
              <Textarea
                value={inlineReplyContent}
                onChange={(event) => setInlineReplyContent(event.target.value)}
                rows={3}
                maxLength={5000}
                placeholder="Escreve a tua resposta..."
                className="text-sm"
              />
              <div className="flex items-center gap-2">
                <Button
                  type="submit"
                  size="sm"
                  className="bg-brand text-brand-foreground hover:bg-brand/90"
                  disabled={createReplyMutation.isPending}
                >
                  {createReplyMutation.isPending ? 'A enviar...' : 'Enviar'}
                </Button>
                <Button
                  type="button"
                  size="sm"
                  variant="ghost"
                  onClick={() => {
                    setActiveReplyParentId(null)
                    setInlineReplyContent('')
                  }}
                >
                  Cancelar
                </Button>
              </div>
            </form>
          ) : null}

          {/* Nested children */}
          {hasChildren ? (
            <div className="mt-3 space-y-3">{reply.replies.map(renderChildReply)}</div>
          ) : null}
        </div>
      </div>
    )
  }

  // ─── Main render ──────────────────────────────────────────────────────────

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
      {/* ── Post card ──────────────────────────────────────────────────────── */}
      <div className="relative mb-5 overflow-hidden rounded-2xl border border-border/70 bg-card">
        {/* Brand accent line */}
        <div className="absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-brand via-brand/50 to-transparent" />

        <div className="flex">
          {/* Left vote column — desktop */}
          <div className="hidden shrink-0 flex-col items-center gap-1 border-r border-border/40 bg-muted/20 px-3 py-6 sm:flex">
            <button
              type="button"
              className={`rounded p-1 transition-colors ${isPostUpActive ? 'text-brand' : 'text-muted-foreground hover:text-brand'}`}
              onClick={() => handleVotePost('up')}
              disabled={!isAuthenticated || postVoteMutation.isPending}
              aria-label="Upvote"
            >
              <ChevronUp className="h-5 w-5" />
            </button>
            <span
              className={`text-sm font-bold ${isPostUpActive ? 'text-brand' : isPostDownActive ? 'text-destructive' : 'text-foreground'}`}
            >
              {post.score}
            </span>
            <button
              type="button"
              className={`rounded p-1 transition-colors ${isPostDownActive ? 'text-destructive' : 'text-muted-foreground hover:text-destructive'}`}
              onClick={() => handleVotePost('down')}
              disabled={!isAuthenticated || postVoteMutation.isPending}
              aria-label="Downvote"
            >
              <ChevronDown className="h-5 w-5" />
            </button>
          </div>

          {/* Post content */}
          <div className="flex-1 p-4 sm:p-6">
            {/* Meta row */}
            <div className="mb-3 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
              <span
                className={`rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${
                  post.room.isPremium
                    ? 'border border-amber-400/50 bg-amber-50 text-amber-600 dark:bg-amber-950/30 dark:text-amber-400'
                    : 'bg-brand/10 text-brand'
                }`}
              >
                {post.room.name}
              </span>
              <span>Por</span>
              {renderAuthorLabel(post.author)}
              <span>·</span>
              <span>{formatRelativeDate(post.createdAt)}</span>
            </div>

            {/* Title */}
            <h1 className="text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl">
              {post.title}
            </h1>

            {/* Image */}
            {post.imageUrl ? (
              <img
                src={post.imageUrl}
                alt={`Imagem do post ${post.title}`}
                loading="lazy"
                className="mb-4 mt-4 max-h-72 w-full rounded-lg object-cover"
              />
            ) : null}

            {/* Markdown body */}
            <div
              className="prose prose-sm mt-4 max-w-none dark:prose-invert prose-headings:font-bold prose-headings:tracking-tight prose-p:leading-relaxed prose-pre:rounded-md prose-pre:bg-muted prose-pre:p-3"
              dangerouslySetInnerHTML={{ __html: renderedContent }}
            />

            {/* Bottom bar: mobile vote + stats */}
            <div className="mt-5 flex flex-wrap items-center gap-4 border-t border-border/40 pt-4">
              {/* Mobile vote */}
              <div className="flex items-center gap-1 sm:hidden">
                <button
                  type="button"
                  className={`rounded p-1 transition-colors ${isPostUpActive ? 'text-brand' : 'text-muted-foreground hover:text-brand'}`}
                  onClick={() => handleVotePost('up')}
                  disabled={!isAuthenticated || postVoteMutation.isPending}
                  aria-label="Upvote"
                >
                  <ChevronUp className="h-4 w-4" />
                </button>
                <span
                  className={`text-sm font-bold ${isPostUpActive ? 'text-brand' : isPostDownActive ? 'text-destructive' : 'text-foreground'}`}
                >
                  {post.score}
                </span>
                <button
                  type="button"
                  className={`rounded p-1 transition-colors ${isPostDownActive ? 'text-destructive' : 'text-muted-foreground hover:text-destructive'}`}
                  onClick={() => handleVotePost('down')}
                  disabled={!isAuthenticated || postVoteMutation.isPending}
                  aria-label="Downvote"
                >
                  <ChevronDown className="h-4 w-4" />
                </button>
              </div>

              {/* Reply count */}
              <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
                <MessageSquare className="h-3.5 w-3.5" />
                {post.replyCount} {post.replyCount === 1 ? 'resposta' : 'respostas'}
              </span>

              {!isAuthenticated ? (
                <a
                  href={loginRedirect}
                  className="text-xs font-semibold text-brand transition-opacity hover:opacity-80"
                >
                  Login para votar
                </a>
              ) : null}
            </div>
          </div>
        </div>
      </div>

      {/* ── Compose box ────────────────────────────────────────────────────── */}
      <div className="mb-5 rounded-xl border border-border/60 bg-card p-4 sm:p-5">
        {isAuthenticated ? (
          <form className="space-y-3" onSubmit={handleSubmitMainReply}>
            <p className="text-xs font-semibold uppercase tracking-widest text-brand">
              Adicionar comentário
            </p>
            <Textarea
              value={newReplyContent}
              onChange={(event) => setNewReplyContent(event.target.value)}
              rows={4}
              maxLength={5000}
              placeholder="Partilha a tua perspetiva..."
              className="text-sm"
            />
            {formError ? <p className="text-sm text-destructive">{formError}</p> : null}
            <Button
              type="submit"
              size="sm"
              className="bg-brand text-brand-foreground hover:bg-brand/90"
              disabled={createReplyMutation.isPending}
            >
              {createReplyMutation.isPending ? 'A publicar...' : 'Publicar comentário'}
            </Button>
          </form>
        ) : (
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm text-muted-foreground">
              Inicia sessão para responder e participar na thread.
            </p>
            <Button asChild size="sm" className="bg-brand text-brand-foreground hover:bg-brand/90">
              <a href={loginRedirect}>Fazer login</a>
            </Button>
          </div>
        )}
      </div>

      {/* ── Thread ─────────────────────────────────────────────────────────── */}
      <div>
        {/* Thread header */}
        <div className="mb-4 flex items-center gap-2">
          <MessageSquare className="h-4 w-4 text-brand" />
          <p className="text-xs font-semibold uppercase tracking-widest text-brand">Comentários</p>
          <span className="text-xs text-muted-foreground">
            ({replies.length} {replies.length === 1 ? 'resposta' : 'respostas'})
          </span>
        </div>

        {replies.length === 0 ? (
          <div className="rounded-xl border border-border/50 bg-card p-8 text-center">
            <p className="font-semibold text-foreground">Sem comentários ainda</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Sê o primeiro a partilhar a tua perspetiva.
            </p>
          </div>
        ) : (
          <div className="space-y-4 divide-y divide-border/40">
            {replies.map((reply) => (
              <div key={`thread-${reply.id}`} className="pt-4 first:pt-0">
                {renderReplyBlock(reply)}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
