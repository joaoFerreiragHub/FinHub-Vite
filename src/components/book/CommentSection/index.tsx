// src/components/book/CommentSection/index.tsx

import { useState, useEffect, useCallback } from 'react'
import axios from 'axios'
import { Comment } from './Comment'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../../ui/dialog'
import { Textarea } from '../../ui/textarea'
import { Button } from '../../ui/button'
import { useUserStore } from '../../../stores/useUserStore'
import { CommentType } from '../../../types/comment'

interface CommentSectionProps {
  bookId: string
}

export default function CommentSection({ bookId }: CommentSectionProps) {
  const [comments, setComments] = useState<CommentType[]>([])
  const [newComment, setNewComment] = useState('')
  const [visitorDialogVisible, setVisitorDialogVisible] = useState(false)

  const user = useUserStore((state) => state.user)

  const fetchComments = useCallback(async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/commentsBookRouter/books/${bookId}/comments`,
        {
          headers: {
            Authorization: `Bearer ${user?.accessToken}`,
          },
        },
      )
      setComments(res.data)
    } catch (err) {
      console.error('Erro ao buscar comentários:', err)
    }
  }, [bookId, user?.accessToken])

  useEffect(() => {
    if (bookId && user?.accessToken) {
      fetchComments()
    }
  }, [bookId, fetchComments, user?.accessToken])

  const handleCommentSubmit = async () => {
    if (user?.role === 'visitor') return setVisitorDialogVisible(true)
    if (!newComment.trim()) return

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/commentsBookRouter/books/${bookId}/comments`,
        { text: newComment },
        {
          headers: {
            Authorization: `Bearer ${user?.accessToken}`,
          },
        },
      )
      setComments((prev) => [...prev, res.data])
      setNewComment('')
    } catch (err) {
      console.error('Erro ao enviar comentário:', err)
    }
  }

  const handleReply = useCallback(
    async (commentIndex: number, replyText: string) => {
      if (user?.role === 'visitor') return setVisitorDialogVisible(true)
      const commentId = comments[commentIndex]._id

      try {
        const res = await axios.post(
          `${import.meta.env.VITE_API_URL}/commentsBookRouter/comments/${commentId}/replies`,
          { text: replyText },
          {
            headers: {
              Authorization: `Bearer ${user?.accessToken}`,
            },
          },
        )
        setComments((prev) => {
          const updated = [...prev]
          updated[commentIndex].replies.push(res.data)
          return updated
        })
      } catch (err) {
        console.error('Erro ao responder comentário:', err)
      }
    },
    [comments, user?.accessToken, user?.role],
  )

  return (
    <section className="space-y-4 mt-6">
      <h4 className="text-lg font-semibold">Comentários</h4>

      <div className="space-y-2">
        <Textarea
          placeholder="Deixa o teu comentário..."
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
        />
        <Button onClick={handleCommentSubmit}>Enviar</Button>
      </div>

      <div className="space-y-3">
        {comments.length === 0 ? (
          <p className="text-muted-foreground">Ainda não há comentários.</p>
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
          <p>Para comentar, precisas de iniciar sessão.</p>
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
