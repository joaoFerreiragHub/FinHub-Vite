// src/features/creators/components/modals/CreatorHeader.tsx

import { ExternalLink, Star, Users } from 'lucide-react'

import { Button } from '@/components/ui'
import type { Creator } from '@/features/creators/types/creator'

interface CreatorHeaderProps {
  creator: Creator
  showRatings?: boolean
}

export function CreatorHeader({ creator, showRatings = true }: CreatorHeaderProps) {
  const followerCount =
    typeof creator.followersCount === 'number'
      ? creator.followersCount
      : (creator.followers?.length ?? 0)

  const displayName = creator.firstname
    ? `${creator.firstname}${creator.lastname ? ` ${creator.lastname}` : ''}`
    : creator.name || creator.username

  const formattedFollowers =
    followerCount >= 1000
      ? `${(followerCount / 1000).toFixed(followerCount >= 10000 ? 0 : 1)}k`
      : String(followerCount)

  const ratingValue = creator.averageRating || 0

  return (
    <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-primary/8 via-primary/4 to-transparent border border-border/40 p-5">
      <div className="flex items-start gap-4">
        {/* Avatar */}
        <div className="shrink-0">
          {creator.avatar ? (
            <img
              src={creator.avatar}
              alt={displayName}
              className="h-16 w-16 rounded-full object-cover ring-2 ring-background shadow-md"
            />
          ) : (
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 ring-2 ring-background shadow-md">
              <span className="text-xl font-bold text-primary">
                {displayName.charAt(0).toUpperCase()}
              </span>
            </div>
          )}
        </div>

        {/* Info */}
        <div className="min-w-0 flex-1">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
            <div className="min-w-0">
              <h2 className="text-xl font-bold tracking-tight truncate">{displayName}</h2>
              <p className="text-sm text-muted-foreground">@{creator.username}</p>

              {/* Stats row */}
              <div className="mt-2 flex flex-wrap items-center gap-3 text-sm">
                <span className="inline-flex items-center gap-1.5 text-muted-foreground">
                  <Users size={14} className="text-primary/70" />
                  <span className="font-medium text-foreground tabular-nums">
                    {formattedFollowers}
                  </span>{' '}
                  seguidores
                </span>

                {showRatings && ratingValue > 0 ? (
                  <span className="inline-flex items-center gap-1.5 text-muted-foreground">
                    <Star size={14} className="fill-amber-400 text-amber-400" />
                    <span className="font-medium text-foreground tabular-nums">
                      {ratingValue.toFixed(1)}
                    </span>
                  </span>
                ) : null}
              </div>
            </div>

            {/* CTA */}
            <Button asChild size="sm" className="shrink-0 gap-1.5">
              <a href={`/creators/${creator.username}`}>
                Ver perfil
                <ExternalLink size={14} />
              </a>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
