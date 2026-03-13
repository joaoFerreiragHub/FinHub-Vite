import { useMemo, useState } from 'react'
import { Trophy, Users, Star } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import type { Creator } from '@/features/creators/types/creator'
import LoadingSpinner from '@/components/ui/loading-spinner'
import { HomepageLayout } from '@/components/home/HomepageLayout'
import { ContentRow } from '@/components/home/ContentRow'
import { CreatorCard } from '@/features/creators/components/cards/CreatorCard'
import { CreatorModal } from '@/features/creators/components/modals/CreatorModal'
import { fetchPublicCreators } from '@/features/creators/services/publicCreatorsService'
import { PageHero } from '@/components/public'
import { PublicSurfaceDisabledState } from '@/features/platform/components/PublicSurfaceDisabledState'
import { usePublicSurfaceControl } from '@/features/platform/hooks/usePublicSurfaceControl'

export default function TopCreatorsPage() {
  const creatorPageSurface = usePublicSurfaceControl('creator_page')
  const [selectedCreator, setSelectedCreator] = useState<Creator | null>(null)
  const creatorsQuery = useQuery({
    queryKey: ['public-creators-top'],
    queryFn: () =>
      fetchPublicCreators({
        sortBy: 'followers',
        sortOrder: 'desc',
        limit: 120,
      }),
    staleTime: 60 * 1000,
    retry: 1,
  })
  const creators = useMemo(() => creatorsQuery.data ?? [], [creatorsQuery.data])
  const topByFollowers = useMemo(() => creators.slice(0, 12), [creators])
  const topByRating = useMemo(
    () =>
      [...creators].sort((a, b) => (b.averageRating ?? 0) - (a.averageRating ?? 0)).slice(0, 12),
    [creators],
  )

  if (creatorPageSurface.data && !creatorPageSurface.data.enabled) {
    return (
      <HomepageLayout>
        <PublicSurfaceDisabledState
          title="Top creators temporariamente indisponivel"
          message={
            creatorPageSurface.data.publicMessage ??
            'A descoberta publica de creators foi temporariamente desligada durante revisao operacional.'
          }
        />
      </HomepageLayout>
    )
  }

  return (
    <HomepageLayout>
      <div className="min-h-screen bg-background">
        <PageHero
          title="Top criadores"
          subtitle="Acompanha os perfis com maior impacto e relevancia na comunidade."
          searchPlaceholder="Pesquisa desativada nesta vista"
          searchValue=""
          onSearchChange={() => {}}
          onSearch={() => {}}
          backgroundImage="https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=1800&q=80"
        >
          <div className="flex flex-wrap justify-center gap-2">
            <span className="filter-bar__pill border-border/40 bg-background/60 text-foreground">
              <Trophy className="mr-1 h-3.5 w-3.5" />
              Ranking semanal
            </span>
            <span className="filter-bar__pill border-border/40 bg-background/60 text-foreground">
              <Users className="mr-1 h-3.5 w-3.5" />
              Por seguidores
            </span>
            <span className="filter-bar__pill border-border/40 bg-background/60 text-foreground">
              <Star className="mr-1 h-3.5 w-3.5" />
              Por avaliacao media
            </span>
          </div>
        </PageHero>

        {creatorsQuery.isLoading ? (
          <div className="flex justify-center py-16">
            <LoadingSpinner />
          </div>
        ) : creators.length === 0 ? (
          <p className="py-16 text-center text-muted-foreground">Sem criadores para mostrar.</p>
        ) : (
          <div className="space-y-6 pt-8">
            <ContentRow title="Top por seguidores">
              {topByFollowers.map((creator) => (
                <CreatorCard
                  key={`followers-${creator._id}`}
                  creator={creator}
                  variant="row"
                  onOpenModal={() => setSelectedCreator(creator)}
                />
              ))}
            </ContentRow>
            <ContentRow title="Top por avaliacao media">
              {topByRating.map((creator) => (
                <CreatorCard
                  key={`rating-${creator._id}`}
                  creator={creator}
                  variant="row"
                  onOpenModal={() => setSelectedCreator(creator)}
                />
              ))}
            </ContentRow>
          </div>
        )}

        {creatorsQuery.isError ? (
          <div className="mx-4 mt-8 rounded-md border border-red-500/40 bg-red-500/10 p-3 text-xs text-red-300 sm:mx-6 md:mx-10 lg:mx-12">
            Nao foi possivel carregar o ranking de criadores neste momento.
          </div>
        ) : null}
      </div>

      {selectedCreator ? (
        <CreatorModal
          open={true}
          onClose={() => setSelectedCreator(null)}
          creator={selectedCreator}
        />
      ) : null}
    </HomepageLayout>
  )
}
