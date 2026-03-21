// src/features/creators/components/modals/CreatorHeader.tsx

import { User2 } from 'lucide-react'

import { Button } from '@/components/ui'
import type { Creator } from '@/features/creators/types/creator'
import { RatingDisplay } from '~/features/hub'

interface CreatorHeaderProps {
  creator: Creator
  showRatings?: boolean
}

export function CreatorHeader({ creator, showRatings = true }: CreatorHeaderProps) {
  const followerCount =
    typeof creator.followersCount === 'number'
      ? creator.followersCount
      : (creator.followers?.length ?? 0)

  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div>
        <h2 className="text-2xl font-bold">{creator.username}</h2>
        <div className="text-muted-foreground flex items-center gap-2 text-sm">
          <User2 size={16} />
          {followerCount} seguidores
        </div>
      </div>

      <div className="flex items-center gap-4 flex-wrap">
        {showRatings ? (
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Avaliacoes:</span>
            <RatingDisplay rating={creator.averageRating || 0} />
          </div>
        ) : null}

        {showRatings ? (
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Tua avaliacao:</span>
            <RatingDisplay rating={3.5} />
          </div>
        ) : null}

        <Button asChild size="sm" variant="outline">
          <a href={`/creators/${creator.username}`}>Saber mais</a>
        </Button>
      </div>
    </div>
  )
}
