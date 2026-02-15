import { useState } from 'react'
import { Users, Search } from 'lucide-react'
import { Input } from '@/components/ui'
import { Skeleton } from '@/components/ui'
import { FollowButton } from '../components/FollowButton'
import { useFollowing } from '../hooks/useSocial'

export function FollowingPage() {
  const { data, isLoading } = useFollowing()
  const [searchQuery, setSearchQuery] = useState('')

  const filteredCreators = data?.filter((creator) =>
    searchQuery
      ? creator.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        creator.username.toLowerCase().includes(searchQuery.toLowerCase())
      : true,
  )

  return (
    <div className="mx-auto max-w-4xl space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">A Seguir</h1>
          <p className="mt-1 text-muted-foreground">Criadores que segues ({data?.length ?? 0})</p>
        </div>
      </div>

      {/* Search */}
      {data && data.length > 0 && (
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Pesquisar criadores..."
            className="pl-10"
          />
        </div>
      )}

      {/* Content */}
      {isLoading ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-28 w-full rounded-lg" />
          ))}
        </div>
      ) : !filteredCreators || filteredCreators.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-border py-16">
          <Users className="h-12 w-12 text-muted-foreground/30 mb-4" />
          {searchQuery ? (
            <>
              <h3 className="text-lg font-medium">Nenhum resultado</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Nenhum criador corresponde a &quot;{searchQuery}&quot;
              </p>
            </>
          ) : (
            <>
              <h3 className="text-lg font-medium">Ainda nao segues ninguem</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Descobre criadores na pagina de exploracao e comeca a seguir.
              </p>
            </>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {filteredCreators.map((creator) => (
            <div
              key={creator.creatorId}
              className="flex items-start gap-4 rounded-lg border border-border bg-card p-5 transition-colors hover:border-primary/30"
            >
              {creator.avatar ? (
                <img
                  src={creator.avatar}
                  alt={creator.name}
                  className="h-14 w-14 rounded-full object-cover"
                />
              ) : (
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-foreground text-lg font-bold">
                  {creator.name.charAt(0)}
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className="font-medium">{creator.name}</p>
                <p className="text-sm text-muted-foreground">@{creator.username}</p>
                {creator.bio && (
                  <p className="mt-1 text-sm text-muted-foreground line-clamp-2">{creator.bio}</p>
                )}
                <p className="mt-1 text-xs text-muted-foreground">
                  A seguir desde{' '}
                  {new Date(creator.followedAt).toLocaleDateString('pt-PT', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                  })}
                </p>
              </div>
              <FollowButton
                creatorId={creator.creatorId}
                creatorName={creator.name}
                creatorUsername={creator.username}
                creatorAvatar={creator.avatar}
                size="sm"
              />
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
