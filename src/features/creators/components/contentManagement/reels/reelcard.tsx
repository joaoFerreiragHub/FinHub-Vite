import { ReelType } from '@/lib/mock/mockReels'
import TikTokEmbed from './TikTokEmbed'
import { Button } from '@/components/ui'

interface ReelCardProps {
  reel: ReelType
  onEdit: (reel: ReelType) => void
  onDelete: (id: string) => void
  onToggleVisibility: (id: string) => void
}

function extractYouTubeID(url: string): string {
  const match = url.match(
    /(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/,
  )
  return match ? match[1] : ''
}

export default function ReelCard({ reel, onEdit, onDelete, onToggleVisibility }: ReelCardProps) {
  return (
    <div className="flex flex-col gap-2 xl:aspect-[5/6] lg:aspect-[3/5] rounded border shadow bg-background p-2">
      <div className="flex-1 overflow-hidden rounded">
        {reel.platform === 'youtube' && (
          <iframe
            src={`https://www.youtube.com/embed/${extractYouTubeID(reel.url)}`}
            className="w-full h-full"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        )}

        {reel.platform === 'tiktok' && <TikTokEmbed url={reel.url} />}

        {reel.platform === 'instagram' && (
          <iframe
            src={reel.url.replace('/reel/', '/p/') + 'embed'}
            className="w-full h-full"
            frameBorder="0"
            allow="autoplay; encrypted-media"
            allowFullScreen
          ></iframe>
        )}
      </div>

      {/* Botões */}
      <div className="flex justify-between gap-2 mt-2">
        <Button variant="outline" onClick={() => onEdit(reel)} className="w-full text-sm">
          Editar
        </Button>
        <Button
          variant="outline"
          onClick={() => onToggleVisibility(reel.id)}
          className="w-full text-sm"
        >
          {reel.isVisible ? 'Ocultar' : 'Mostrar'}
        </Button>
        <Button variant="destructive" onClick={() => onDelete(reel.id)} className="w-full text-sm">
          Eliminar
        </Button>
      </div>
    </div>
  )
}
