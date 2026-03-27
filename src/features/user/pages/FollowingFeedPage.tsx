import { useEffect, useMemo, useRef } from 'react'
import { Loader2, Rss } from 'lucide-react'
import { useNavigate } from '@/lib/reactRouterDomCompat'
import { Button, Skeleton } from '@/components/ui'
import { ActivityFeedItem } from '@/features/social/components/ActivityFeedItem'
import { useActivityFeed } from '@/features/social/hooks/useSocial'
import { PublicSurfaceDisabledState } from '@/features/platform/components/PublicSurfaceDisabledState'
import { usePublicSurfaceControl } from '@/features/platform/hooks/usePublicSurfaceControl'
import { ContentType } from '@/features/hub/types'

const resolveContentUrl = (type: ContentType, slug: string): string | null => {
  switch (type) {
    case ContentType.ARTICLE:
      return `/artigos/${slug}`
    case ContentType.COURSE:
      return `/cursos/${slug}`
    case ContentType.VIDEO:
      return `/videos/${slug}`
    case ContentType.EVENT:
      return `/eventos/${slug}`
    case ContentType.BOOK:
      return `/livros/${slug}`
    case ContentType.PODCAST:
      return `/podcasts/${slug}`
    default:
      return null
  }
}

export default function FollowingFeedPage() {
  const feedSurface = usePublicSurfaceControl('derived_feeds')
  const navigate = useNavigate()
  const loadMoreRef = useRef<HTMLDivElement | null>(null)
  const { data, isPending, isError, fetchNextPage, hasNextPage, isFetchingNextPage, refetch } =
    useActivityFeed(true, 20)

  const items = useMemo(() => data?.pages.flatMap((page) => page.items) ?? [], [data])

  useEffect(() => {
    if (!hasNextPage || isFetchingNextPage) return
    if (!loadMoreRef.current) return

    const target = loadMoreRef.current
    const observer = new IntersectionObserver(
      (entries) => {
        const first = entries[0]
        if (first?.isIntersecting) {
          void fetchNextPage()
        }
      },
      { threshold: 0.2 },
    )

    observer.observe(target)
    return () => observer.disconnect()
  }, [fetchNextPage, hasNextPage, isFetchingNextPage])

  if (feedSurface.data && !feedSurface.data.enabled) {
    return (
      <PublicSurfaceDisabledState
        title="Feed temporariamente indisponivel"
        message={
          feedSurface.data.publicMessage ??
          'Os feeds derivados foram temporariamente desligados enquanto decorre revisao operacional.'
        }
      />
    )
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold">A Seguir</h1>
        <p className="mt-1 text-muted-foreground">
          Conteudos recentes dos criadores que segues, por ordem cronologica.
        </p>
      </div>

      {isPending ? (
        <div className="space-y-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-40 w-full rounded-lg" />
          ))}
        </div>
      ) : isError ? (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-800">
          <p className="font-medium">Erro ao carregar feed</p>
          <p className="mt-1">Nao foi possivel obter atividade agora.</p>
          <Button variant="outline" size="sm" className="mt-3" onClick={() => void refetch()}>
            Tentar novamente
          </Button>
        </div>
      ) : items.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-border py-16">
          <Rss className="mb-4 h-12 w-12 text-muted-foreground/30" />
          <h3 className="text-lg font-medium">Sem atividade dos criadores seguidos</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Quando os criadores que segues publicarem conteudo, aparece aqui.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {items.map((item) => (
            <ActivityFeedItem
              key={item.id}
              item={item}
              onClick={() => {
                const url = resolveContentUrl(item.content.type, item.content.slug)
                if (url) navigate(url)
              }}
            />
          ))}

          <div ref={loadMoreRef} className="flex min-h-12 items-center justify-center">
            {isFetchingNextPage ? (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Loader2 className="h-4 w-4 animate-spin" />A carregar mais...
              </div>
            ) : hasNextPage ? (
              <span className="text-xs text-muted-foreground">A deslizar para mais...</span>
            ) : (
              <span className="text-xs text-muted-foreground">Sem mais resultados.</span>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
