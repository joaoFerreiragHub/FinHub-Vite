// src/components/contentManagement/podcasts/podcastsForm/EpisodeForm.tsx
import { useState } from "react"
import { Label } from "../../../../ui/label"
import { Input } from "../../../../ui/input"
import { Textarea } from "../../../../ui/textarea"
import { Button } from "../../../../ui/button"
import { PodcastEpisode } from "../../../../../types/podcastEpisode"

interface Props {
  podcastId: string
  onSave: (data: PodcastEpisode) => void
  onCancel: () => void
  initialData?: PodcastEpisode
}

export default function EpisodeForm({ podcastId, onSave, onCancel, initialData }: Props) {
  const [episode, setEpisode] = useState<PodcastEpisode>({
    id: initialData?.id || crypto.randomUUID(),
    podcastId,
    title: initialData?.title || "",
    description: initialData?.description || "",
    link: initialData?.link || "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setEpisode(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!episode.title || !episode.link) {
      return alert("Preenche pelo menos o título e o link.")
    }
    onSave(episode)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 border p-4 rounded">
      <div>
        <Label htmlFor="title">Título do Episódio</Label>
        <Input
          id="title"
          name="title"
          value={episode.title}
          onChange={handleChange}
          required
        />
      </div>

      <div>
        <Label htmlFor="description">Descrição</Label>
        <Textarea
          id="description"
          name="description"
          value={episode.description}
          onChange={handleChange}
        />
      </div>

      <div>
        <Label htmlFor="link">Link do Episódio</Label>
        <Input
          id="link"
          name="link"
          value={episode.link}
          onChange={handleChange}
          required
        />
      </div>

      <div className="flex justify-end gap-2 pt-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit">Guardar Episódio</Button>
      </div>
    </form>
  )
}
