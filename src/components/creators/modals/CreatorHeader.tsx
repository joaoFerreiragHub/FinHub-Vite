// src/components/creators/modals/CreatorHeader.tsx

import { Creator as CreatorType } from '../../../types/creator'
import { User2 } from 'lucide-react'
import { RatingDisplay } from '../../ratings/RatingDisplay'
import { Button } from '../../ui/button'

interface CreatorHeaderProps {
  creator: CreatorType
}

export function CreatorHeader({ creator }: CreatorHeaderProps) {
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
          <RatingDisplay rating={creator.averageRating || 0} size={18} />
        </div>

        {/* Placeholder da tua avaliação (futuramente dinâmico) */}
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Tua avaliação:</span>
          <RatingDisplay rating={3.5} size={18} />
        </div>

        {/* Botão para mais info */}
        <Button size="sm" variant="outline">
          Saber mais
        </Button>
      </div>
    </div>
  )
}
