import type { ExploreContentItem } from '@/features/explore/services/publicExploreService'
import { ExploreContentCard } from './ExploreContentCard'

interface ExploreContentGridProps {
  items: ExploreContentItem[]
  isLoading?: boolean
  emptyMessage?: string
}

export function ExploreContentGrid({
  items,
  isLoading = false,
  emptyMessage = 'Nao ha conteudo disponivel neste momento.',
}: ExploreContentGridProps) {
  if (isLoading) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {Array.from({ length: 8 }).map((_, index) => (
          <div
            key={`explore-loading-${index}`}
            className="h-[320px] animate-pulse rounded-xl border border-border/60 bg-card/60"
          />
        ))}
      </div>
    )
  }

  if (items.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-border/80 bg-card/30 p-8 text-center text-sm text-muted-foreground">
        {emptyMessage}
      </div>
    )
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {items.map((item) => (
        <ExploreContentCard key={`${item.kind}-${item.id}`} item={item} />
      ))}
    </div>
  )
}

