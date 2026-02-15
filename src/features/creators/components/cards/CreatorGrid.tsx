// src/features/creators/components/cards/CreatorGrid.tsx

import { Creator } from '@/features/creators/types/creator'
import { CreatorCard } from './CreatorCard'

interface CreatorGridProps {
  creators: Creator[]
  onCardClick?: (creator: Creator) => void
}

export function CreatorGrid({ creators, onCardClick }: CreatorGridProps) {
  if (!creators?.length) {
    return <p className="text-muted-foreground">Sem criadores para mostrar.</p>
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
      {creators.map((creator) => (
        <CreatorCard
          key={creator._id}
          creator={creator}
          onOpenModal={() => onCardClick?.(creator)}
        />
      ))}
    </div>
  )
}
