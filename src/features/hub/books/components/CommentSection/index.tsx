import { useState, useEffect, useCallback } from 'react'
import { Comment } from './Comment'

import type { CommentType } from '@/features/hub/types/comment'
import { useAuthStore } from '@/features/auth/stores/useAuthStore'
import { Textarea } from '@/components/ui'
import { Button } from '@/components/ui'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui'
import { apiClient } from '@/lib/api/client'

interface CommentSectionProps {
  bookId: string
}

interface ApiCommentNode {
  _id: string
  content?: string
  text?: string
  user?: {
    _id?: string
    name?: string
  }
  userId?: {
    _id?: string
    name?: string
  }
  replies?: ApiCommentNode[]
}

const mapApiCommentToLegacy = (comment: ApiCommentNode): CommentType => {
  const userData = comment.user ?? comment.userId ?? {}
  return {
    _id: comment._id,
    text: comment.content ?? comment.text ?? '',
    userId: {
      _id: userData._id ?? 'unknown',
      name: userData.name,
    },
    replies: (comment.replies ?? []).map((reply) => mapApiCommentToLegacy(reply)),
  }
}

export default function CommentSection({ bookId }: CommentSectionProps) {
  const [comments, setComments] = useState<CommentType[]>([])
  const [newComment, setNewComment] = useState('')
  const [visitorDialogVisible, setVisitorDialogVisible] = useState(false)

  const user = useAuthStore((state) => state.user)
  const accessToken = useAuthStore((state) => state.accessToken)

  const fetchComments = useCallback(async () => {
    try {
      const res = await apiClient.get<{ comments?: ApiCommentNode[] }>(
        `/comments/book/${bookId}/tree`,
      )
      const apiComments = Array.isArray(res.data?.comments) ? res.data.comments : []
      setComments(apiComments.map((comment) => mapApiCommentToLegacy(comment)))
    } catch (err) {
      console.error('Erro ao buscar comentarios:', err)
    }
  }, [bookId])

  useEffect(() => {
    if (bookId) {
      void fetchComments()
    }
  }, [bookId, fetchComments])

  const handleCommentSubmit = async () => {
    if (!accessToken || user?.role === 'visitor') return setVisitorDialogVisible(true)
    if (!newComment.trim()) return

    try {
      await apiClient.post('/comments', {
        targetType: 'book',
        targetId: bookId,
        content: newComment.trim(),
      })
      setNewComment('')
      await fetchComments()
    } catch (err) {
      console.error('Erro ao enviar comentario:', err)
    }
  }

  const handleReply = useCallback(
    async (commentIndex: number, replyText: string) => {
      if (!accessToken || user?.role === 'visitor') return setVisitorDialogVisible(true)
      const commentId = comments[commentIndex]?._id
      if (!commentId || !replyText.trim()) return

      try {
        await apiClient.post('/comments', {
          targetType: 'book',
          targetId: bookId,
          content: replyText.trim(),
          parentCommentId: commentId,
        })
        await fetchComments()
      } catch (err) {
        console.error('Erro ao responder comentario:', err)
      }
    },
    [comments, accessToken, user?.role, bookId, fetchComments],
  )

  return (
    <section className="space-y-4 mt-6">
      <h4 className="text-lg font-semibold">Comentarios</h4>

      <div className="space-y-2">
        <Textarea
          placeholder="Deixa o teu comentario..."
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
        />
        <Button onClick={handleCommentSubmit}>Enviar</Button>
      </div>

      <div className="space-y-3">
        {comments.length === 0 ? (
          <p className="text-muted-foreground">Ainda nao ha comentarios.</p>
        ) : (
          comments.map((comment, index) => (
            <Comment
              key={comment._id || index}
              comment={comment}
              commentIndex={index}
              addReply={handleReply}
            />
          ))
        )}
      </div>

      <Dialog open={visitorDialogVisible} onOpenChange={setVisitorDialogVisible}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Acesso Restrito</DialogTitle>
          </DialogHeader>
          <p>Para comentar, precisas de iniciar sessao.</p>
          <div className="flex justify-end gap-2 mt-4">
            <Button
              onClick={() => {
                setVisitorDialogVisible(false)
                window.location.href = '/login'
              }}
            >
              Login
            </Button>

            <Button variant="outline" onClick={() => setVisitorDialogVisible(false)}>
              Cancelar
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </section>
  )
}
