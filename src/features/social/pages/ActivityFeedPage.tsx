import { useEffect, useMemo, useRef, useState } from 'react'
import { Loader2, Rss } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui'
import { Skeleton } from '@/components/ui'
import { ActivityFeedItem } from '../components/ActivityFeedItem'
import { useActivityFeed } from '../hooks/useSocial'
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

export function ActivityFeedPage() {
  const feedSurface = usePublicSurfaceControl('derived_feeds')
  const navigate = useNavigate()
  const [followingOnly, setFollowingOnly] = useState(false)
  const loadMoreRef = useRef<HTMLDivElement | null>(null)
  const { data, isPending, isError, fetchNextPage, hasNextPage, isFetchingNextPage, refetch } =
    useActivityFeed(followingOnly, 20)

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
      { threshold: 0.2 }
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
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold">Feed</h1>
        <p className="mt-1 text-muted-foreground">
          Novidades dos criadores e conteudos da plataforma.
        </p>
      </div>

      {/* Toggle */}
      <div className="flex gap-2">
        <Button
          variant={!followingOnly ? 'default' : 'outline'}
          size="sm"
          onClick={() => setFollowingOnly(false)}
        >
          Tudo
        </Button>
        <Button
          variant={followingOnly ? 'default' : 'outline'}
          size="sm"
          onClick={() => setFollowingOnly(true)}
        >
          A Seguir
        </Button>
      </div>

      {/* Content */}
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
          <Rss className="h-12 w-12 text-muted-foreground/30 mb-4" />
          <h3 className="text-lg font-medium">Sem atividade</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            {followingOnly
              ? 'Os criadores que segues ainda nao publicaram conteudo recente.'
              : 'Ainda nao ha atividade na plataforma.'}
          </p>
          {followingOnly && (
            <Button
              variant="outline"
              size="sm"
              className="mt-4"
              onClick={() => setFollowingOnly(false)}
            >
              Ver tudo
            </Button>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          {items.map((item) => (
            <ActivityFeedItem
              key={item.id}
              item={item}
              onClick={() => {
                const slug = item.content.slug
                const url = resolveContentUrl(item.content.type, slug)
                if (url) navigate(url)
              }}
            />
          ))}

          <div ref={loadMoreRef} className="flex min-h-12 items-center justify-center">
            {isFetchingNextPage ? (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Loader2 className="h-4 w-4 animate-spin" />
                A carregar mais...
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
