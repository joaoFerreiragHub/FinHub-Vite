import { useState } from 'react'
import { Rss } from 'lucide-react'
import { Button } from '@/components/ui'
import { Skeleton } from '@/components/ui'
import { ActivityFeedItem } from '../components/ActivityFeedItem'
import { useActivityFeed } from '../hooks/useSocial'

export function ActivityFeedPage() {
  const [followingOnly, setFollowingOnly] = useState(false)
  const { data, isLoading } = useActivityFeed(followingOnly)

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
      {isLoading ? (
        <div className="space-y-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-40 w-full rounded-lg" />
          ))}
        </div>
      ) : !data || data.length === 0 ? (
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
          {data.map((item) => (
            <ActivityFeedItem
              key={item.id}
              item={item}
              onClick={() => {
                const slug = item.content.slug
                const type = item.content.type
                const urlMap: Record<string, string> = {
                  article: `/hub/articles/${slug}`,
                  course: `/hub/courses/${slug}`,
                  video: `/hub/videos/${slug}`,
                  event: `/hub/lives/${slug}`,
                  book: `/hub/books/${slug}`,
                  podcast: `/hub/podcasts/${slug}`,
                }
                const url = urlMap[type]
                if (url) window.location.href = url
              }}
            />
          ))}
        </div>
      )}
    </div>
  )
}
