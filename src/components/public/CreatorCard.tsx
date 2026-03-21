import type { CSSProperties } from 'react'
import { Badge } from '@/components/ui'
import { Star, User, Users } from 'lucide-react'
import { cn } from '@/lib/utils'

type FollowerEntry = { userId?: string }

export interface CreatorCardCreator {
  _id?: string
  id?: string
  username: string
  href?: string
  name?: string
  firstname?: string
  lastname?: string
  profilePictureUrl?: string
  avatar?: string
  averageRating?: number
  followers?: FollowerEntry[] | number
  followersCount?: number
  publicationCount?: number
  publicationsCount?: number
  topics?: string[]
  contentTypes?: string[]
  isPremium?: boolean
}

export interface CreatorCardProps {
  creator: CreatorCardCreator
  className?: string
  style?: CSSProperties
}

function clampRating(value?: number): number {
  if (!Number.isFinite(value)) return 0
  return Math.max(0, Math.min(5, Number(value)))
}

function resolveDisplayName(creator: CreatorCardCreator): string {
  if (creator.name && creator.name.trim()) return creator.name.trim()
  const fullName = `${creator.firstname || ''} ${creator.lastname || ''}`.trim()
  if (fullName) return fullName
  return creator.username
}

function resolveFollowerCount(creator: CreatorCardCreator): number {
  if (typeof creator.followersCount === 'number') return creator.followersCount
  if (typeof creator.followers === 'number') return creator.followers
  if (Array.isArray(creator.followers)) return creator.followers.length
  return 0
}

function resolvePublicationCount(creator: CreatorCardCreator): number {
  if (typeof creator.publicationCount === 'number') return creator.publicationCount
  if (typeof creator.publicationsCount === 'number') return creator.publicationsCount
  return 0
}

function resolveContentBadges(creator: CreatorCardCreator): string[] {
  const values = creator.contentTypes?.length ? creator.contentTypes : creator.topics
  if (!values?.length) return ['Conteudo']
  return values.slice(0, 3)
}

export function CreatorCard({ creator, className, style }: CreatorCardProps) {
  const href = creator.href || `/creators/${encodeURIComponent(creator.username)}`
  const displayName = resolveDisplayName(creator)
  const imageUrl = creator.profilePictureUrl || creator.avatar
  const followerCount = resolveFollowerCount(creator)
  const publicationCount = resolvePublicationCount(creator)
  const rating = clampRating(creator.averageRating)
  const roundedRating = Math.round(rating)
  const contentBadges = resolveContentBadges(creator)

  return (
    <a
      href={href}
      className={cn(
        'content-row__item group block overflow-hidden rounded-2xl border border-border/70 bg-card/85 transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-lg',
        className,
      )}
      style={{ width: 'clamp(220px, 25vw, 280px)', ...style }}
    >
      <div className="bg-gradient-to-b from-primary/10 via-transparent to-transparent p-4">
        <div className="mx-auto h-24 w-24 overflow-hidden rounded-full border-2 border-primary/30 shadow-sm">
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={displayName}
              className="h-full w-full object-cover"
              loading="lazy"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-muted to-muted/40">
              <User className="h-8 w-8 text-muted-foreground" />
            </div>
          )}
        </div>
      </div>

      <div className="space-y-3 p-4 pt-0 text-center">
        <div>
          <h3 className="line-clamp-1 text-base font-semibold text-foreground">{displayName}</h3>
          <p className="line-clamp-1 text-sm text-muted-foreground">@{creator.username}</p>
        </div>

        <div className="flex items-center justify-center gap-1.5">
          <div className="flex items-center gap-0.5">
            {Array.from({ length: 5 }).map((_, index) => {
              const filled = index < roundedRating
              return (
                <Star
                  key={`creator-star-${index}`}
                  className={cn(
                    'h-3.5 w-3.5',
                    filled ? 'fill-market-bull text-market-bull' : 'text-market-bull/35',
                  )}
                />
              )
            })}
          </div>
          <span className="tabular-nums text-xs text-muted-foreground">{rating.toFixed(1)}</span>
        </div>

        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="rounded-lg border border-border/70 bg-background/60 px-2 py-2">
            <p className="inline-flex items-center gap-1 text-muted-foreground">
              <Users className="h-3.5 w-3.5" />
              Seguidores
            </p>
            <p className="tabular-nums text-sm font-semibold text-foreground">{followerCount}</p>
          </div>
          <div className="rounded-lg border border-border/70 bg-background/60 px-2 py-2">
            <p className="text-muted-foreground">Publicacoes</p>
            <p className="tabular-nums text-sm font-semibold text-foreground">{publicationCount}</p>
          </div>
        </div>

        <div className="flex flex-wrap justify-center gap-1.5">
          {contentBadges.map((contentType) => (
            <Badge
              key={`creator-content-${contentType}`}
              variant="secondary"
              className="border-0 bg-muted/70"
            >
              {contentType}
            </Badge>
          ))}
        </div>
      </div>
    </a>
  )
}
