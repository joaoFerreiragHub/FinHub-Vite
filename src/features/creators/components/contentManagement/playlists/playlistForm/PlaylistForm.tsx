import { useEffect, useState } from 'react'
import { Playlist, PlaylistVideo } from '@/features/hub/types/playlist'
import { Input } from '@/components/ui'
import { Label } from '@/components/ui'
import { Button } from '@/components/ui'
import { v4 as uuidv4 } from 'uuid'

export interface PlaylistFormProps {
  initialValues?: PlaylistFormValues | null
  initialId?: string
  onSubmit: (values: Playlist) => void
  onDelete?: () => void
}

export interface PlaylistFormValues {
  name: string
  topic?: string
  isPublic: boolean
  isMain?: boolean
  videos: {
    id: string
    url: string
    order: number
  }[]
}

export default function PlaylistForm({
  initialValues,
  initialId,
  onSubmit,
  onDelete,
}: PlaylistFormProps) {
  const [name, setName] = useState('')
  const [topic, setTopic] = useState('')
  const [isPublic, setIsPublic] = useState(true)
  const [isMain, setIsMain] = useState(false)
  const [videos, setVideos] = useState<PlaylistVideo[]>([])
  const [newVideoUrl, setNewVideoUrl] = useState('')

  useEffect(() => {
    if (initialValues) {
      setName(initialValues.name)
      setTopic(initialValues.topic || '')
      setIsPublic(initialValues.isPublic)
      setIsMain(initialValues.isMain || false)
      setVideos(initialValues.videos || [])
    }
  }, [initialValues])

  const handleAddVideo = () => {
    if (!newVideoUrl.trim()) return
    const newVideo: PlaylistVideo = {
      id: uuidv4(),
      url: newVideoUrl.trim(),
      order: videos.length + 1,
    }
    setVideos([...videos, newVideo])
    setNewVideoUrl('')
  }

  const handleRemoveVideo = (id: string) => {
    const updated = videos.filter((v) => v.id !== id).map((v, i) => ({ ...v, order: i + 1 }))
    setVideos(updated)
  }

  function getYoutubeThumbnail(url: string): string {
    const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/))([\w-]{11})/)
    return match ? `https://img.youtube.com/vi/${match[1]}/hqdefault.jpg` : ''
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const playlist: Playlist = {
      id: initialId || uuidv4(),
      name,
      topic,
      isPublic,
      isMain,
      videos,
    }
    onSubmit(playlist)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="name">Nome da Playlist</Label>
        <Input id="name" value={name} onChange={(e) => setName(e.target.value)} required />
      </div>

      <div>
        <Label htmlFor="topic">Tema (opcional)</Label>
        <Input id="topic" value={topic} onChange={(e) => setTopic(e.target.value)} />
      </div>

      <div>
        <Label htmlFor="newVideoUrl">Novo Vídeo (URL)</Label>
        <div className="flex gap-2">
          <Input
            id="newVideoUrl"
            value={newVideoUrl}
            onChange={(e) => setNewVideoUrl(e.target.value)}
          />
          <Button type="button" onClick={handleAddVideo}>
            Adicionar
          </Button>
        </div>
      </div>

      <div className="space-y-2">
        <Label>Vídeos:</Label>
        {videos.map((video, idx) => (
          <div key={video.id} className="flex justify-between items-center border p-2 rounded">
            <div className="flex items-center gap-4">
              <img
                src={getYoutubeThumbnail(video.url)}
                alt={`Thumbnail ${idx + 1}`}
                className="w-24 h-14 object-cover rounded"
              />
              <span className="text-sm break-all">
                {idx + 1}. {video.url}
              </span>
            </div>

            <Button type="button" variant="destructive" onClick={() => handleRemoveVideo(video.id)}>
              Remover
            </Button>
          </div>
        ))}
      </div>

      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          checked={isPublic}
          onChange={(e) => setIsPublic(e.target.checked)}
          id="isPublic"
        />
        <Label htmlFor="isPublic">Tornar Pública</Label>
      </div>

      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          checked={isMain}
          onChange={(e) => setIsMain(e.target.checked)}
          id="isMain"
        />
        <Label htmlFor="isMain">Definir como Playlist Principal</Label>
      </div>

      <div className="flex justify-between mt-4">
        <Button type="submit">Guardar Playlist</Button>
        {onDelete && (
          <Button type="button" variant="destructive" onClick={onDelete}>
            Eliminar
          </Button>
        )}
      </div>
    </form>
  )
}
