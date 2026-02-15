// src/features/creators/components/modals/CreatorHeader.tsx

import { User2 } from 'lucide-react'

import { Button } from '@/components/ui'
import type { Creator } from '@/features/creators/types/creator'
import { RatingDisplay } from '~/features/hub'

interface CreatorHeaderProps {
  creator: Creator
}

export function CreatorHeader({ creator }: CreatorHeaderProps) {
  console.log('Creator:', creator.username)
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
      {/* Informação base */}
      <div>
        <h2 className="text-2xl font-bold">{creator.username}</h2>
        <div className="text-muted-foreground flex items-center gap-2 text-sm">
          <User2 size={16} />
          {creator.followers?.length ?? 0} seguidores
        </div>
      </div>

      {/* Ratings */}
      <div className="flex items-center gap-4 flex-wrap">
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Avaliações:</span>
          <RatingDisplay rating={creator.averageRating || 0} />
        </div>

        {/* Placeholder da tua avaliação (futuramente dinâmico) */}
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Tua avaliação:</span>
          <RatingDisplay rating={3.5} />
        </div>

        {/* Botão para mais info */}

        <Button asChild size="sm" variant="outline">
          <a href={`/creators/${creator.username}`}>Saber mais</a>
        </Button>
      </div>
    </div>
  )
}
