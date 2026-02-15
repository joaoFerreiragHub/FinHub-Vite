// src/components/contentManagement/podcasts/PodcastsList.tsx
import { Podcast } from '@/features/hub/types/podcast'
import { Button } from '@/components/ui'
import { Card } from '@/components/ui'
import { Eye, EyeOff } from 'lucide-react'

interface Props {
  podcasts: Podcast[]
  onEdit: (podcast: Podcast) => void
  onDelete: (id: string) => void
  onToggleVisibility: (id: string, hidden: boolean) => void
  onManageEpisodes: (podcast: Podcast) => void
}

export default function PodcastsList({
  podcasts,
  onEdit,
  onDelete,
  onToggleVisibility,
  onManageEpisodes,
}: Props) {
  if (!podcasts.length) {
    return <p className="text-muted-foreground">Nenhum podcast criado ainda.</p>
  }

  return (
    <div className="grid md:grid-cols-2 gap-6">
      {podcasts.map((podcast) => (
        <Card key={podcast.id} className="p-4 space-y-2">
          {podcast.imageUrl && (
            <img
              src={podcast.imageUrl}
              alt={`Capa do podcast ${podcast.title}`}
              className="w-full h-40 object-cover rounded"
            />
          )}

          <h3 className="text-lg font-semibold">{podcast.title}</h3>
          {podcast.description && (
            <p className="text-sm text-muted-foreground">{podcast.description}</p>
          )}

          <div className="flex justify-end flex-wrap gap-2 pt-2">
            <Button variant="ghost" onClick={() => onToggleVisibility(podcast.id, !podcast.hidden)}>
              {podcast.hidden ? (
                <>
                  <EyeOff className="w-4 h-4 mr-1" /> Mostrar
                </>
              ) : (
                <>
                  <Eye className="w-4 h-4 mr-1" /> Ocultar
                </>
              )}
            </Button>

            <Button variant="outline" onClick={() => onManageEpisodes(podcast)}>
              Gerir Episódios
            </Button>

            <Button variant="outline" onClick={() => onEdit(podcast)}>
              Editar
            </Button>

            <Button variant="destructive" onClick={() => onDelete(podcast.id)}>
              Apagar
            </Button>
          </div>
        </Card>
      ))}
    </div>
  )
}
