import { useMemo, useState } from 'react'
import { Sparkles, Users } from 'lucide-react'
import { Creator } from '@/features/creators/types/creator'
import { AspectRatio, Badge, Button, Card, CardContent } from '@/components/ui'
import { cn } from '@/lib/utils'
import { RatingDisplay } from '~/features/hub'

type CreatorCardVariant = 'grid' | 'row'

interface CreatorCardProps {
  creator: Creator
  onOpenModal?: () => void
  variant?: CreatorCardVariant
  className?: string
}

export function CreatorCard({
  creator,
  onOpenModal,
  variant = 'grid',
  className,
}: CreatorCardProps) {
  const [imageFailed, setImageFailed] = useState(false)
  const profileUrl = `/creators/${encodeURIComponent(creator.username)}`
  const followerCount = creator.followers?.length ?? 0
  const rating = creator.averageRating ?? 0
  const imageUrl = creator.profilePictureUrl
  const hasImage = Boolean(imageUrl) && !imageFailed

  const initials = useMemo(() => {
    const first = creator.firstname?.trim().charAt(0) ?? creator.username.charAt(0)
    const last = creator.lastname?.trim().charAt(0) ?? creator.username.charAt(1) ?? ''
    return `${first}${last}`.toUpperCase()
  }, [creator.firstname, creator.lastname, creator.username])

  const subtitle =
    creator.bio ||
    creator.topics?.slice(0, 2).join(' | ') ||
    'Educador financeiro na comunidade FinHub'

  return (
    <Card
      onClick={onOpenModal}
      className={cn(
        'group relative overflow-hidden rounded-xl border border-border/60 bg-card/70 backdrop-blur-sm transition-all duration-300',
        onOpenModal &&
          'cursor-pointer hover:-translate-y-1 hover:border-primary/40 hover:shadow-xl hover:shadow-primary/10',
        variant === 'row' ? 'content-row__item w-[210px] sm:w-[230px]' : 'w-full',
        className,
      )}
    >
      <CardContent className="space-y-3 p-3 sm:p-4">
        <AspectRatio
          ratio={16 / 10}
          className="relative overflow-hidden rounded-lg border border-border/40 bg-muted/40"
        >
          {hasImage ? (
            <img
              src={imageUrl}
              alt={`Foto de ${creator.username}`}
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
              loading="lazy"
              onError={() => setImageFailed(true)}
            />
          ) : (
            <div className="flex h-full flex-col items-center justify-center bg-gradient-to-br from-primary/25 via-primary/10 to-muted">
              <div className="flex h-14 w-14 items-center justify-center rounded-full border border-border/40 bg-background/80 text-sm font-semibold text-foreground">
                {initials}
              </div>
              <span className="mt-2 text-xs text-muted-foreground">Imagem em breve</span>
            </div>
          )}

          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-14 bg-gradient-to-t from-background/70 to-transparent" />

          {creator.isPremium && (
            <Badge className="absolute left-2 top-2 border-amber-300/40 bg-amber-400/20 text-amber-200 hover:bg-amber-400/30">
              <Sparkles className="mr-1 h-3 w-3" />
              Premium
            </Badge>
          )}
        </AspectRatio>

        <div className="space-y-1">
          <h3 className="line-clamp-1 text-sm font-semibold text-foreground sm:text-base">
            {creator.username}
          </h3>
          <p className="line-clamp-1 text-xs text-muted-foreground">{subtitle}</p>
        </div>

        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span className="inline-flex items-center gap-1">
            <Users className="h-3.5 w-3.5" />
            {followerCount}
          </span>
          <span className="font-medium">{rating.toFixed(1)}</span>
        </div>

        <RatingDisplay rating={rating} size="sm" className="justify-center" />

        <Button asChild variant="outline" size="sm" className="w-full">
          <a href={profileUrl} onClick={(event) => event.stopPropagation()}>
            Ver perfil
          </a>
        </Button>
      </CardContent>
    </Card>
  )
}
