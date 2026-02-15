import { useState } from 'react'
import PlaylistModal from './PlaylistModal'
import { mockPlaylists } from '@/lib/mock/mockPlaylists'
import { Playlist } from '@/features/hub/types/playlist'
import { Button } from '@/components/ui'
import MiniPlaylistSlider from './MiniPlaylistSlider'
import { Pencil, Eye, EyeOff, Trash } from 'lucide-react'

export default function PlaylistsManager() {
  const [playlists, setPlaylists] = useState<Playlist[]>(mockPlaylists)
  const [selectedPlaylist, setSelectedPlaylist] = useState<Playlist | null>(null)
  const [showModal, setShowModal] = useState(false)

  const handleSave = (playlist: Playlist) => {
    setPlaylists((prev) => {
      const exists = prev.find((p) => p.id === playlist.id)
      return exists ? prev.map((p) => (p.id === playlist.id ? playlist : p)) : [...prev, playlist]
    })
    setShowModal(false)
    setSelectedPlaylist(null)
  }

  const handleDelete = (id: string) => {
    setPlaylists((prev) => prev.filter((p) => p.id !== id))
    setShowModal(false)
    setSelectedPlaylist(null)
  }

  const handleEdit = (playlist: Playlist) => {
    setSelectedPlaylist(playlist)
    setShowModal(true)
  }

  const toggleVisibility = (id: string) => {
    setPlaylists((prev) => prev.map((p) => (p.id === id ? { ...p, isPublic: !p.isPublic } : p)))
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold"></h1>
        <Button
          onClick={() => {
            setSelectedPlaylist(null)
            setShowModal(true)
          }}
        >
          Nova Playlist
        </Button>
      </div>

      <div className="space-y-6">
        {playlists.map((playlist) => (
          <div
            key={playlist.id}
            className="border rounded p-4 shadow-sm hover:shadow-md relative space-y-2 bg-white"
          >
            <div className="absolute top-3 right-3 flex gap-2">
              <Button variant="outline" size="icon" onClick={() => handleEdit(playlist)}>
                <Pencil className="w-4 h-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={() => toggleVisibility(playlist.id)}
                title={playlist.isPublic ? 'Ocultar' : 'Tornar visível'}
              >
                {playlist.isPublic ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </Button>
              <Button variant="destructive" size="icon" onClick={() => handleDelete(playlist.id)}>
                <Trash className="w-4 h-4" />
              </Button>
            </div>

            <h2 className="text-lg font-bold">{playlist.name}</h2>
            <p className="text-muted-foreground text-sm">
              {playlist.topic || 'Sem tópico'} • {playlist.videos.length} vídeos
            </p>

            <MiniPlaylistSlider videos={playlist.videos} />
          </div>
        ))}
      </div>

      <PlaylistModal
        open={showModal}
        initialData={selectedPlaylist}
        onClose={() => {
          setShowModal(false)
          setSelectedPlaylist(null)
        }}
        onSave={handleSave}
        onDelete={handleDelete}
      />
    </div>
  )
}
