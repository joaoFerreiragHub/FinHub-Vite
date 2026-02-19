import { Badge } from '@/components/ui'
import { Star, Users } from 'lucide-react'

interface CreatorCardCreator {
  _id: string
  username: string
  firstname?: string
  lastname?: string
  profilePictureUrl?: string
  topics?: string[]
  averageRating?: number
  followers?: { userId: string }[]
  isPremium?: boolean
  famous?: string[]
}

interface CreatorCardLargeProps {
  creator: CreatorCardCreator
}

export function CreatorCardLarge({ creator }: CreatorCardLargeProps) {
  const displayName = creator.username
  const followerCount = creator.followers?.length ?? 0

  return (
    <a
      href={`/creators/${encodeURIComponent(creator.username)}`}
      className="content-row__item netflix-card group/card text-center"
      style={{ width: 'clamp(180px, 22vw, 220px)' }}
    >
      <div className="p-4 sm:p-5 flex flex-col items-center gap-3">
        {/* Avatar */}
        <div className="relative">
          <div
            className={`w-20 h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden ring-2 ring-offset-2 ring-offset-card transition-all duration-300 ${
              creator.isPremium
                ? 'ring-amber-400 group-hover/card:ring-amber-300'
                : 'ring-border group-hover/card:ring-primary/50'
            }`}
          >
            <img
              src={creator.profilePictureUrl || '/placeholder-user.jpg'}
              alt={displayName}
              className="w-full h-full object-cover"
              loading="lazy"
            />
          </div>
          {creator.isPremium && (
            <span className="absolute -bottom-1 -right-1 text-lg" title="Criador Premium">
              \u2B50
            </span>
          )}
        </div>

        {/* Name */}
        <h3 className="text-sm sm:text-base font-semibold leading-tight text-foreground group-hover/card:text-primary transition-colors line-clamp-1">
          {displayName}
        </h3>

        {/* Topics */}
        {creator.topics && creator.topics.length > 0 && (
          <div className="flex flex-wrap justify-center gap-1">
            {creator.topics.slice(0, 2).map((topic) => (
              <Badge key={topic} variant="secondary" className="text-[10px] px-2 py-0.5">
                {topic}
              </Badge>
            ))}
          </div>
        )}

        {/* Stats */}
        <div className="flex items-center gap-3 text-xs text-muted-foreground">
          {creator.averageRating != null && creator.averageRating > 0 && (
            <span className="flex items-center gap-1">
              <Star className="h-3 w-3 fill-amber-500 text-amber-500" />
              {creator.averageRating.toFixed(1)}
            </span>
          )}
          {followerCount > 0 && (
            <span className="flex items-center gap-1">
              <Users className="h-3 w-3" />
              {followerCount}
            </span>
          )}
        </div>

        {/* Platforms */}
        {creator.famous && creator.famous.length > 0 && (
          <p className="text-[10px] text-muted-foreground">{creator.famous.join(' \u00B7 ')}</p>
        )}
      </div>
    </a>
  )
}
