// src/components/CommentSection/Comment.tsx

import { useState } from 'react'
import { Textarea } from '@/components/ui'
import { Button } from '@/components/ui'

interface CommentProps {
  comment: {
    _id: string
    text: string
    userId: { _id: string; name?: string }
    replies: { _id: string; text: string; userId: { _id: string; name?: string } }[]
  }
  commentIndex: number
  addReply: (index: number, text: string) => void
}

export function Comment({ comment, commentIndex, addReply }: CommentProps) {
  const [showReply, setShowReply] = useState(false)
  const [replyText, setReplyText] = useState('')

  const handleReply = () => {
    if (!replyText.trim()) return
    addReply(commentIndex, replyText)
    setReplyText('')
    setShowReply(false)
  }

  return (
    <div className="border border-border p-4 rounded-md bg-muted/70">
      <p className="text-sm font-medium text-foreground mb-1">
        {comment.userId.name || comment.userId._id}
      </p>
      <p className="text-sm text-muted-foreground mb-2">{comment.text}</p>

      <div className="text-right">
        <Button variant="link" size="sm" onClick={() => setShowReply(!showReply)}>
          {showReply ? 'Cancelar' : 'Responder'}
        </Button>
      </div>

      {showReply && (
        <div className="mt-2 space-y-2">
          <Textarea
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
            placeholder="A tua resposta..."
          />
          <Button onClick={handleReply} size="sm">
            Enviar Resposta
          </Button>
        </div>
      )}

      {comment.replies?.length > 0 && (
        <div className="mt-4 border-t border-border pt-3 space-y-2">
          {comment.replies.map((reply) => (
            <div
              key={reply._id}
              className="pl-4 border-l border-border bg-muted/50 rounded-md py-2 px-3"
            >
              <p className="text-xs font-medium">{reply.userId.name || reply.userId._id}</p>
              <p className="text-sm">{reply.text}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
