// src/components/book/CommentSection/Reply.tsx

import { useState } from 'react'
import { Textarea } from '@/components/ui'
import { Button } from '@/components/ui'

interface ReplyProps {
  onReply: (text: string) => void
  replyingTo: string
}

export function Reply({ onReply, replyingTo }: ReplyProps) {
  const [replyText, setReplyText] = useState('')

  const handleSubmit = () => {
    if (!replyText.trim()) return
    onReply(replyText.trim())
    setReplyText('')
  }

  return (
    <div className="border-l-2 border-border pl-4 mt-2 bg-muted/50 rounded-md p-3 space-y-2">
      <p className="text-sm text-muted-foreground">A responder a {replyingTo}</p>
      <Textarea
        placeholder="Escreve a tua resposta..."
        value={replyText}
        onChange={(e) => setReplyText(e.target.value)}
      />
      <div className="flex justify-end">
        <Button size="sm" onClick={handleSubmit}>
          Responder
        </Button>
      </div>
    </div>
  )
}
