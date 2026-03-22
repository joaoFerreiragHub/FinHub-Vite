import { ArrowRight, ExternalLink, ShieldCheck, Star } from 'lucide-react'
import {
  Badge,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui'
import type { PublicDirectorySummaryEntry } from '../services/publicDirectoriesService'

const numberFormatter = new Intl.NumberFormat('pt-PT')
const ratingFormatter = new Intl.NumberFormat('pt-PT', {
  minimumFractionDigits: 1,
  maximumFractionDigits: 1,
})

const verticalLabel: Record<string, string> = {
  broker: 'Corretora',
  insurance: 'Seguradora',
  fintech: 'Plataforma',
  bank: 'Banco',
  exchange: 'Exchange',
  site: 'Site',
  app: 'App',
  fund: 'Fundo',
  event: 'Evento',
  podcast: 'Podcast',
  newsletter: 'Newsletter',
  other: 'Outro',
}

const formatCount = (value: number) => numberFormatter.format(value)
const formatRating = (value: number) => ratingFormatter.format(value)

interface BrandCardProps {
  item: PublicDirectorySummaryEntry
  hrefBase?: string
}

export function BrandCard({ item, hrefBase = '/directory' }: BrandCardProps) {
  const detailHref = `${hrefBase.replace(/\/$/, '')}/${encodeURIComponent(item.slug)}`
  const hasRatings = item.ratingsCount > 0

  return (
    <Card className="border-border/60 bg-card/85">
      <CardHeader className="space-y-3 pb-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex min-w-0 items-start gap-3">
            {item.logo ? (
              <img src={item.logo} alt={item.name} className="h-10 w-10 rounded-md object-cover" />
            ) : (
              <div className="flex h-10 w-10 items-center justify-center rounded-md bg-muted text-xs font-semibold text-muted-foreground">
                {item.name.slice(0, 2).toUpperCase()}
              </div>
            )}
            <div className="space-y-1">
              <CardTitle className="text-base leading-tight">{item.name}</CardTitle>
              <CardDescription>
                {verticalLabel[item.verticalType] || 'Marca'}{' '}
                {item.country ? `• ${item.country}` : ''}
              </CardDescription>
            </div>
          </div>

          <div className="flex flex-wrap justify-end gap-2">
            {item.verificationStatus === 'verified' ? (
              <Badge variant="secondary">
                <ShieldCheck className="mr-1 h-3.5 w-3.5" />
                Verificado
              </Badge>
            ) : null}
            {item.isFeatured ? <Badge>Featured</Badge> : null}
            {item.isSponsoredPlacement ? <Badge variant="outline">Patrocinado</Badge> : null}
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <p className="line-clamp-3 text-sm text-muted-foreground">{item.shortDescription}</p>

        <div className="grid grid-cols-3 gap-2 text-xs text-muted-foreground">
          <div className="rounded-md border border-border/60 px-2 py-1.5">
            <div className="font-medium text-foreground">{formatCount(item.views)}</div>
            <div>Views</div>
          </div>
          <div className="rounded-md border border-border/60 px-2 py-1.5">
            <div className="font-medium text-foreground">
              {hasRatings ? formatRating(item.averageRating) : '-'}
            </div>
            <div>Rating</div>
          </div>
          <div className="rounded-md border border-border/60 px-2 py-1.5">
            <div className="font-medium text-foreground">{formatCount(item.ratingsCount)}</div>
            <div>Avaliacoes</div>
          </div>
        </div>
      </CardContent>

      <CardFooter className="flex flex-wrap gap-2">
        <Button asChild size="sm">
          <a href={detailHref}>
            Ver detalhe
            <ArrowRight className="h-4 w-4" />
          </a>
        </Button>
        {item.website ? (
          <Button asChild size="sm" variant="outline">
            <a href={item.website} target="_blank" rel="noreferrer noopener">
              Site oficial
              <ExternalLink className="h-4 w-4" />
            </a>
          </Button>
        ) : null}
        {hasRatings ? (
          <Badge variant="outline" className="gap-1">
            <Star className="h-3 w-3" />
            {formatRating(item.averageRating)}
          </Badge>
        ) : null}
      </CardFooter>
    </Card>
  )
}
