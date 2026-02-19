import { Badge } from '@/components/ui'
import { ExternalLink, Eye, ShieldCheck, Star } from 'lucide-react'

interface ResourceCardResource {
  id: string
  name: string
  description: string
  typeLabel: string
  imageUrl?: string
  href: string
  isExternal?: boolean
  averageRating?: number
  ratingsCount?: number
  views?: number
  isVerified?: boolean
}

interface ResourceCardProps {
  resource: ResourceCardResource
}

const formatCount = (value?: number) => {
  if (!value || value <= 0) return '0'
  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(1)}M`
  if (value >= 1_000) return `${(value / 1_000).toFixed(1)}k`
  return String(value)
}

export function ResourceCard({ resource }: ResourceCardProps) {
  return (
    <a
      href={resource.href}
      target={resource.isExternal ? '_blank' : undefined}
      rel={resource.isExternal ? 'noopener noreferrer' : undefined}
      className="content-row__item netflix-card group/card"
      style={{ width: 'clamp(240px, 30vw, 320px)' }}
    >
      <div className="netflix-card__image-container" style={{ aspectRatio: '16/9' }}>
        <img
          src={
            resource.imageUrl ||
            'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=640&q=80'
          }
          alt={resource.name}
          className="netflix-card__image"
          loading="lazy"
        />
        <div className="netflix-card__overlay" />
        <div className="netflix-card__overlay--hover" />

        <div className="absolute top-3 left-3 z-10">
          <Badge
            variant="secondary"
            className="text-xs bg-background/80 backdrop-blur-sm border-0 text-foreground font-medium"
          >
            {resource.typeLabel}
          </Badge>
        </div>

        {resource.isVerified && (
          <div className="absolute top-3 right-3 z-10">
            <Badge className="text-xs bg-emerald-600 text-white border-0">
              <ShieldCheck className="mr-1 h-3.5 w-3.5" />
              Verificado
            </Badge>
          </div>
        )}

        <div className="netflix-card__info">
          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            {resource.averageRating != null && resource.averageRating > 0 && (
              <span className="flex items-center gap-1 text-amber-500">
                <Star className="h-3.5 w-3.5 fill-amber-500" />
                {resource.averageRating.toFixed(1)}
                {resource.ratingsCount != null && resource.ratingsCount > 0 && (
                  <span className="text-muted-foreground">({resource.ratingsCount})</span>
                )}
              </span>
            )}
            {resource.views != null && resource.views > 0 && (
              <span className="flex items-center gap-1">
                <Eye className="h-3.5 w-3.5" />
                {formatCount(resource.views)}
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="netflix-card__body">
        <h3 className="text-sm sm:text-base font-semibold leading-tight line-clamp-2 text-foreground group-hover/card:text-primary transition-colors">
          {resource.name}
        </h3>
        <p className="text-xs text-muted-foreground line-clamp-2">{resource.description}</p>
        <span className="inline-flex items-center gap-1 text-xs font-medium text-primary pt-0.5">
          {resource.isExternal ? 'Visitar site' : 'Abrir recurso'}
          {resource.isExternal && <ExternalLink className="h-3.5 w-3.5" />}
        </span>
      </div>
    </a>
  )
}
