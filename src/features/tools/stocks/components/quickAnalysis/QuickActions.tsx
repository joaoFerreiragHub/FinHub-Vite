import { Button } from '@/components/ui'
import { Share2, Star, ExternalLink } from 'lucide-react'

interface QuickActionsProps {
  onToggleWatchlist: () => void
  onShare?: () => void
  externalUrl?: string
}

export function QuickActions({ onToggleWatchlist, onShare, externalUrl }: QuickActionsProps) {
  return (
    <div className="flex flex-wrap gap-2">
      <Button variant="outline" size="sm" onClick={onToggleWatchlist}>
        <Star className="w-4 h-4 mr-2" /> Favoritar
      </Button>
      {onShare && (
        <Button variant="outline" size="sm" onClick={onShare}>
          <Share2 className="w-4 h-4 mr-2" /> Partilhar
        </Button>
      )}
      {externalUrl && (
        <Button variant="ghost" size="sm" asChild>
          <a href={externalUrl} target="_blank" rel="noopener noreferrer">
            <ExternalLink className="w-4 h-4 mr-2" /> Website
          </a>
        </Button>
      )}
    </div>
  )
}
