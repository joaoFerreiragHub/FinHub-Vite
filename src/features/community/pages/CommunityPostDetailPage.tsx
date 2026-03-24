import { FormEvent, useMemo, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
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
  Textarea,
} from '@/components/ui'
import { useAuthStore } from '@/features/auth/stores/useAuthStore'
import { getErrorMessage } from '@/lib/api/client'
import { communityService } from '../services/communityService'
import type {
  CommunityPostDetailResponse,
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
  <span className="inline-flex items-center gap-1 font-medium text-foreground">
    <span>@{author.username}</span>
    {author.level ? (
      <span
        className="rounded-full border border-border bg-muted px-2 py-0.5 text-[11px] font-medium text-foreground"
        title={author.levelName || `Nivel ${author.level}`}
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
    if (typeof window !== 'undefined') {
      window.location.href = loginRedirect
    }
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
      await createReplyMutation.mutateAsync({
        content,
        parentReply,
      })
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

  if (!normalizedPostId) {
    return (
      <div className="mx-auto w-full max-w-3xl px-4 py-10 sm:px-6 lg:px-8">
        <Card>
          <CardHeader>
            <CardTitle>Post nao encontrado</CardTitle>
            <CardDescription>Nao foi possivel identificar o post pedido.</CardDescription>
          </CardHeader>
        </Card>
      </div>
    )
  }

  if (postQuery.isLoading) {
    return (
      <div className="mx-auto w-full max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
        <Card className="animate-pulse">
          <CardHeader>
            <div className="mb-2 h-8 w-3/4 rounded bg-muted" />
            <div className="h-4 w-40 rounded bg-muted" />
          </CardHeader>
          <CardContent>
            <div className="h-44 rounded bg-muted" />
          </CardContent>
        </Card>
      </div>
    )
  }

  if (postQuery.error || !postQuery.data) {
    return (
      <div className="mx-auto w-full max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
        <Card className="border-red-500/60 bg-red-50/70">
          <CardHeader>
            <CardTitle>Erro ao carregar thread</CardTitle>
            <CardDescription>{getErrorMessage(postQuery.error)}</CardDescription>
          </CardHeader>
        </Card>
      </div>
    )
  }

  const { post, replies } = postQuery.data

  const renderReplyBlock = (reply: CommunityReplyThread) => (
    <div key={reply.id} className="rounded-lg border border-border p-3">
      <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-muted-foreground">
        {renderAuthorLabel(reply.author)}
        <span>{formatRelativeDate(reply.createdAt)}</span>
      </div>
      <p className="mt-2 whitespace-pre-wrap text-sm text-foreground">{reply.content}</p>
      <div className="mt-3 flex flex-wrap items-center gap-2">
        <Button
          type="button"
          size="sm"
          variant={reply.viewerVote === 'up' ? 'default' : 'outline'}
          onClick={() => handleVoteReply(reply.id, 'up')}
          disabled={replyVoteMutation.isPending}
        >
          ▲ {reply.upvotes}
        </Button>
        <Button
          type="button"
          size="sm"
          variant={reply.viewerVote === 'down' ? 'default' : 'outline'}
          onClick={() => handleVoteReply(reply.id, 'down')}
          disabled={replyVoteMutation.isPending}
        >
          ▼ {reply.downvotes}
        </Button>
        <Button
          type="button"
          size="sm"
          variant="ghost"
          onClick={() => {
            setActiveReplyParentId(reply.id)
            setInlineReplyContent('')
            setFormError(null)
          }}
        >
          Responder
        </Button>
      </div>

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
          />
          <div className="flex flex-wrap items-center gap-2">
            <Button type="submit" size="sm" disabled={createReplyMutation.isPending}>
              {createReplyMutation.isPending ? 'A enviar...' : 'Enviar resposta'}
            </Button>
            <Button
              type="button"
              size="sm"
              variant="outline"
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

      {reply.replies.length > 0 ? (
        <div className="mt-3 space-y-2 border-l border-border pl-3">
          {reply.replies.map((child) => (
            <div key={child.id} className="rounded-md border border-border bg-muted/20 p-3">
              <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-muted-foreground">
                {renderAuthorLabel(child.author)}
                <span>{formatRelativeDate(child.createdAt)}</span>
              </div>
              <p className="mt-2 whitespace-pre-wrap text-sm text-foreground">{child.content}</p>
              <div className="mt-2 flex flex-wrap items-center gap-2">
                <Button
                  type="button"
                  size="sm"
                  variant={child.viewerVote === 'up' ? 'default' : 'outline'}
                  onClick={() => handleVoteReply(child.id, 'up')}
                  disabled={replyVoteMutation.isPending}
                >
                  ▲ {child.upvotes}
                </Button>
                <Button
                  type="button"
                  size="sm"
                  variant={child.viewerVote === 'down' ? 'default' : 'outline'}
                  onClick={() => handleVoteReply(child.id, 'down')}
                  disabled={replyVoteMutation.isPending}
                >
                  ▼ {child.downvotes}
                </Button>
              </div>
            </div>
          ))}
        </div>
      ) : null}
    </div>
  )

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
      <Card className="mb-5">
        <CardHeader>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <Badge variant={post.room.isPremium ? 'secondary' : 'outline'}>{post.room.name}</Badge>
            <span className="text-xs text-muted-foreground">
              {formatRelativeDate(post.createdAt)}
            </span>
          </div>
          <CardTitle className="text-2xl">{post.title}</CardTitle>
          <CardDescription className="flex flex-wrap items-center gap-1">
            <span>Por</span>
            {renderAuthorLabel(post.author)}
            <span>•</span>
            <span>
              {post.replyCount} {post.replyCount === 1 ? 'resposta' : 'respostas'}
            </span>
          </CardDescription>
        </CardHeader>
        <CardContent>
          {post.imageUrl ? (
            <img
              src={post.imageUrl}
              alt={`Imagem do post ${post.title}`}
              loading="lazy"
              className="mb-4 max-h-64 w-full rounded object-cover"
            />
          ) : null}
          <div
            className="prose max-w-none prose-headings:mb-3 prose-p:my-2 prose-pre:rounded-md prose-pre:bg-muted prose-pre:p-3"
            dangerouslySetInnerHTML={{ __html: renderedContent }}
          />

          <div className="mt-5 flex flex-wrap items-center gap-2">
            <Button
              type="button"
              variant={post.viewerVote === 'up' ? 'default' : 'outline'}
              onClick={() => handleVotePost('up')}
              disabled={postVoteMutation.isPending}
            >
              ▲ {post.upvotes}
            </Button>
            <Button
              type="button"
              variant={post.viewerVote === 'down' ? 'default' : 'outline'}
              onClick={() => handleVotePost('down')}
              disabled={postVoteMutation.isPending}
            >
              ▼ {post.downvotes}
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card className="mb-5">
        <CardHeader>
          <CardTitle>Responder</CardTitle>
          <CardDescription>Participa na discussao com a tua perspetiva.</CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-3" onSubmit={handleSubmitMainReply}>
            <Textarea
              value={newReplyContent}
              onChange={(event) => setNewReplyContent(event.target.value)}
              rows={4}
              maxLength={5000}
              placeholder="Escreve a tua resposta..."
            />
            {formError ? <p className="text-sm text-red-600">{formError}</p> : null}
            <div className="flex flex-wrap items-center gap-2">
              <Button type="submit" disabled={createReplyMutation.isPending}>
                {createReplyMutation.isPending ? 'A enviar...' : 'Publicar resposta'}
              </Button>
              {!isAuthenticated ? (
                <Button type="button" variant="outline" onClick={() => handleRequireAuth()}>
                  Fazer login
                </Button>
              ) : null}
            </div>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Thread</CardTitle>
          <CardDescription>
            {replies.length} {replies.length === 1 ? 'resposta principal' : 'respostas principais'}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {replies.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              Sem respostas ainda. Sê o primeiro a responder.
            </p>
          ) : (
            replies.map(renderReplyBlock)
          )}
        </CardContent>
      </Card>
    </div>
  )
}
