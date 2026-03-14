import { type MouseEvent, useEffect, useRef } from 'react'
import { ExternalLink } from 'lucide-react'
import { Badge, Button, Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui'
import { useAuthStore } from '@/features/auth/stores/useAuthStore'
import { UserRole } from '@/features/auth/types'
import { cn } from '@/lib/utils'
import { usePublicAdSlot } from '../hooks/usePublicAds'
import { publicAdsService } from '../services/publicAdsService'

interface PublicAdSlotProps {
  slotId: string
  vertical?: string | null
  className?: string
}

const AD_TYPE_LABEL: Record<string, string> = {
  external_ads: 'Ad externo',
  sponsored_ads: 'Patrocinado',
  house_ads: 'Promo FinHub',
  value_ads: 'Sugestao contextual',
}

const resolveAudienceByRole = (role: UserRole | null | undefined): 'free' | 'premium' =>
  role === UserRole.PREMIUM ? 'premium' : 'free'

export function PublicAdSlot({ slotId, vertical = null, className }: PublicAdSlotProps) {
  const role = useAuthStore((state) => state.user?.role)
  const audience = resolveAudienceByRole(role)
  const impressionTrackedRef = useRef<Set<string>>(new Set())

  const adQuery = usePublicAdSlot(
    {
      slotId,
      audience,
      vertical,
    },
    {
      enabled: true,
    },
  )

  const item = adQuery.data?.item ?? null

  useEffect(() => {
    if (!item?.impressionToken) return
    if (impressionTrackedRef.current.has(item.impressionToken)) return

    impressionTrackedRef.current.add(item.impressionToken)
    void publicAdsService.trackImpression(item.impressionToken).catch(() => undefined)
  }, [item?.impressionToken])

  const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
    if (!item?.ctaUrl) {
      event.preventDefault()
      return
    }

    if (item.impressionToken) {
      void publicAdsService.trackClick(item.impressionToken).catch(() => undefined)
    }
  }

  if (!item) return null

  const disclosureLabel = item.disclosureLabel || AD_TYPE_LABEL[item.adType] || 'Patrocinado'

  return (
    <Card className={cn('border-border/60 bg-card/85', className)}>
      <CardHeader className="space-y-3 pb-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <Badge variant="outline">{disclosureLabel}</Badge>
          {item.brand ? (
            <CardDescription className="text-xs">
              {item.brand.name} • {item.brand.verticalType}
            </CardDescription>
          ) : null}
        </div>
        <div className="space-y-1">
          <CardTitle className="text-base leading-tight">{item.headline}</CardTitle>
          {item.body ? <CardDescription>{item.body}</CardDescription> : null}
        </div>
      </CardHeader>

      <CardContent className="space-y-3">
        {item.imageUrl ? (
          <div className="overflow-hidden rounded-md border border-border/60 bg-muted">
            <img
              src={item.imageUrl}
              alt={item.headline}
              loading="lazy"
              className="h-40 w-full object-cover"
            />
          </div>
        ) : null}

        {item.ctaUrl ? (
          <Button asChild size="sm" variant="outline">
            <a href={item.ctaUrl} target="_blank" rel="noreferrer noopener" onClick={handleClick}>
              {item.ctaText || 'Saber mais'}
              <ExternalLink className="h-4 w-4" />
            </a>
          </Button>
        ) : null}
      </CardContent>
    </Card>
  )
}
