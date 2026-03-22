import { ExternalLink, Eye, Globe, ShieldCheck } from 'lucide-react'
import { Badge } from '@/components/ui'
import { formatCount } from '@/lib/cardUtils'
import { RatingStars } from '@/components/shared/RatingStars'

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

/**
 * Card for external resources (tools, calculators, websites).
 * Uses the same visual language as ContentCard — consistent hover, same border-radius.
 * Kept separate because it has unique fields (description, external link CTA, verified badge).
 */
export function ResourceCard({ resource }: ResourceCardProps) {
  return (
    <a
      href={resource.href}
      target={resource.isExternal ? '_blank' : undefined}
      rel={resource.isExternal ? 'noopener noreferrer' : undefined}
      className="content-row__item group block overflow-hidden rounded-2xl border border-border/70 bg-card/80 transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-lg"
      style={{ width: 'clamp(240px, 30vw, 320px)' }}
    >
      {/* Image */}
      <div className="relative aspect-video overflow-hidden bg-muted">
        {resource.imageUrl ? (
          <img
            src={resource.imageUrl}
            alt={resource.name}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
            loading="lazy"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-muted via-muted/80 to-muted/30">
            <Globe className="h-8 w-8 text-muted-foreground" />
          </div>
        )}

        {/* Type badge */}
        <div className="absolute left-3 top-3">
          <Badge variant="secondary" className="border-0 bg-background/85 backdrop-blur-sm">
            {resource.typeLabel}
          </Badge>
        </div>

        {/* Verified badge */}
        {resource.isVerified && (
          <div className="absolute right-3 top-3">
            <Badge className="border-0 bg-emerald-600 text-white">
              <ShieldCheck className="mr-1 h-3.5 w-3.5" />
              Verificado
            </Badge>
          </div>
        )}
      </div>

      {/* Body */}
      <div className="space-y-2 p-4">
        <h3 className="line-clamp-2 text-sm font-semibold leading-snug text-foreground sm:text-base">
          {resource.name}
        </h3>

        {resource.averageRating != null && resource.averageRating > 0 && (
          <RatingStars rating={resource.averageRating} />
        )}

        <p className="line-clamp-2 text-xs text-muted-foreground">{resource.description}</p>

        <div className="flex items-center justify-between text-xs text-muted-foreground">
          {resource.views != null && resource.views > 0 ? (
            <span className="inline-flex items-center gap-1">
              <Eye className="h-3.5 w-3.5" />
              {formatCount(resource.views)}
            </span>
          ) : (
            <span />
          )}
          <span className="inline-flex items-center gap-1 font-medium text-primary">
            {resource.isExternal ? 'Visitar site' : 'Abrir recurso'}
            {resource.isExternal && <ExternalLink className="h-3.5 w-3.5" />}
          </span>
        </div>
      </div>
    </a>
  )
}
