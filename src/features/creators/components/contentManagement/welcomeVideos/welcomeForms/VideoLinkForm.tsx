// src/features/creators/components/welcomeVideos/welcomeForms/VideoLinkForm.tsx

import { useState } from 'react'
import { Input } from '@/components/ui'
import { Textarea } from '@/components/ui'
import { Button } from '@/components/ui'

interface Props {
  onSubmit: (linkData: {
    title: string
    description: string
    videoLink: string
  }) => void | Promise<void>
  fetchUserVideos: () => void
  videoType: 'creatorCard' | 'creatorPage'
}

export default function VideoLinkForm({ onSubmit, fetchUserVideos }: Props) {
  const [videoLink, setVideoLink] = useState('')
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await onSubmit({ title, description, videoLink })
    fetchUserVideos()
    setTitle('')
    setDescription('')
    setVideoLink('')
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        value={videoLink}
        onChange={(e) => setVideoLink(e.target.value)}
        placeholder="Link do vídeo (YouTube)"
        required
      />
      <Input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Título"
        required
      />
      <Textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Descrição"
        required
      />
      <Button type="submit">Adicionar Vídeo</Button>
    </form>
  )
}
