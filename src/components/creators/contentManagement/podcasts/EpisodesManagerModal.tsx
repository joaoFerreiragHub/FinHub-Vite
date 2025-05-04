import { useState } from "react"
import { Podcast } from "../../../../types/podcast"
import { PodcastEpisode } from "../../../../types/podcastEpisode"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../../../ui/dialog"
import { Button } from "../../../ui/button"
import EpisodeForm from "./podcastsForm/EpisodeForm"
import { Eye, EyeOff } from "lucide-react"

interface Props {
  podcast: Podcast
  open: boolean
  onClose: () => void
}

export default function EpisodesManagerModal({ podcast, open, onClose }: Props) {
  const [episodes, setEpisodes] = useState<PodcastEpisode[]>([])
  const [isAdding, setIsAdding] = useState(false)

  const handleAddEpisode = (episode: PodcastEpisode) => {
    setEpisodes(prev => [...prev, { ...episode, hidden: false }])
    setIsAdding(false)
  }

  const handleRemove = (id: string) => {
    setEpisodes(prev => prev.filter(e => e.id !== id))
  }

  const handleToggleVisibility = (id: string) => {
    setEpisodes(prev =>
      prev.map(e => (e.id === id ? { ...e, hidden: !e.hidden } : e))
    )
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Episódios de "{podcast.title}"</DialogTitle>
        </DialogHeader>

        <div className="space-y-3">
          {episodes.map(e => (
            <div
              key={e.id}
              className="flex justify-between items-center border p-2 rounded"
            >
              <div className="flex-1">
                <span className="text-sm">{e.title}</span>
                {e.hidden && (
                  <span className="ml-2 text-xs text-muted-foreground">(oculto)</span>
                )}
              </div>

              <div className="flex gap-1">
                <Button
                  variant="ghost"
                  onClick={() => handleToggleVisibility(e.id)}
                  title={e.hidden ? "Mostrar episódio" : "Ocultar episódio"}
                >
                  {e.hidden ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </Button>

                <Button variant="ghost" onClick={() => handleRemove(e.id)}>
                  Remover
                </Button>
              </div>
            </div>
          ))}

          {isAdding ? (
            <EpisodeForm
              podcastId={podcast.id}
              onSave={handleAddEpisode}
              onCancel={() => setIsAdding(false)}
            />
          ) : (
            <Button onClick={() => setIsAdding(true)}>Adicionar Episódio</Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
