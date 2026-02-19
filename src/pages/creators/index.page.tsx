import { useEffect, useMemo, useState } from 'react'
import { Compass, Sparkles, Users } from 'lucide-react'
import { Creator } from '@/features/creators/types/creator'
import { Button } from '@/components/ui'
import LoadingSpinner from '@/components/ui/loading-spinner'
import { HomepageLayout } from '@/components/home/HomepageLayout'
import { ContentRow } from '@/components/home/ContentRow'
import { CreatorCard } from '@/features/creators/components/cards/CreatorCard'
import { addVisitedTopics } from '@/features/hub/utils/visitedTopics'
import { useVisitedTopics } from '@/features/hub/hooks/useVisitedTopics'
import { CreatorModal } from '@/features/creators/components/modals/CreatorModal'
import { mockCreators } from '@/features/creators/components/api/mockCreators'
import { PageHero, FilterBar } from '@/components/public'

const SORT_OPTIONS = [
  { label: 'Mais populares', value: 'popular' },
  { label: 'Melhor avaliados', value: 'rating' },
  { label: 'Mais recentes', value: 'recent' },
]

export function Page() {
  const [selectedTopic, setSelectedTopic] = useState('')
  const [sortOption, setSortOption] = useState('popular')
  const [selectedRating, setSelectedRating] = useState<number | null>(null)
  const [selectedFrequency, setSelectedFrequency] = useState('')
  const [selectedType, setSelectedType] = useState('')
  const [creators, setCreators] = useState<Creator[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedCreator, setSelectedCreator] = useState<Creator | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const visitedTopics = useVisitedTopics()

  const topics = useMemo(
    () =>
      Array.from(new Set(mockCreators.flatMap((creator) => creator.topics))).map((topic) => ({
        label: topic,
        value: topic,
      })),
    [],
  )

  useEffect(() => {
    setLoading(true)
    const timer = setTimeout(() => {
      let filtered = [...mockCreators]

      if (selectedTopic) {
        filtered = filtered.filter((creator) => creator.topics.includes(selectedTopic))
      }

      if (selectedRating !== null) {
        filtered = filtered.filter((creator) => (creator.averageRating ?? 0) >= selectedRating)
      }

      if (selectedFrequency === 'daily') {
        filtered = filtered.filter((creator) =>
          (creator.publicationFrequency ?? '').toLowerCase().startsWith('di'),
        )
      } else if (selectedFrequency === 'weekly') {
        filtered = filtered.filter((creator) =>
          (creator.publicationFrequency ?? '').toLowerCase().startsWith('se'),
        )
      }

      if (selectedType) {
        filtered = filtered.filter(
          (creator) => creator.typeOfContent?.toLowerCase() === selectedType.toLowerCase(),
        )
      }

      if (sortOption === 'rating') {
        filtered.sort((a, b) => (b.averageRating ?? 0) - (a.averageRating ?? 0))
      } else if (sortOption === 'recent') {
        filtered.reverse()
      }

      setCreators(filtered)
      setLoading(false)
    }, 250)

    return () => clearTimeout(timer)
  }, [selectedFrequency, selectedRating, selectedTopic, selectedType, sortOption])

  const handleSearch = (query: string) => {
    const cleanQuery = query.trim().toLowerCase()
    if (!cleanQuery) return
    const found = creators.find((creator) => creator.username.toLowerCase().includes(cleanQuery))
    if (found) {
      window.location.href = `/creators/${encodeURIComponent(found.username)}`
    }
  }

  const openCreatorModal = (creator: Creator) => {
    addVisitedTopics(creator.topics)
    setSelectedCreator(creator)
  }

  const toggleFilters = [
    { label: 'Videos', key: 'videos', active: selectedType === 'videos' },
    { label: 'Artigos', key: 'artigos', active: selectedType === 'artigos' },
    { label: 'Cursos', key: 'cursos', active: selectedType === 'cursos' },
    { label: 'Diario', key: 'daily', active: selectedFrequency === 'daily' },
    { label: 'Semanal', key: 'weekly', active: selectedFrequency === 'weekly' },
    { label: 'Rating 4+', key: 'rating4', active: selectedRating === 4 },
    { label: 'Rating 5', key: 'rating5', active: selectedRating === 5 },
  ]

  const handleToggleFilter = (key: string) => {
    if (['videos', 'artigos', 'cursos'].includes(key)) {
      setSelectedType(selectedType === key ? '' : key)
    } else if (['daily', 'weekly'].includes(key)) {
      setSelectedFrequency(selectedFrequency === key ? '' : key)
    } else if (key === 'rating4') {
      setSelectedRating(selectedRating === 4 ? null : 4)
    } else if (key === 'rating5') {
      setSelectedRating(selectedRating === 5 ? null : 5)
    }
  }

  const hasActiveFilters = !!(selectedTopic || selectedType || selectedFrequency || selectedRating)

  const handleClearFilters = () => {
    setSelectedTopic('')
    setSelectedType('')
    setSelectedFrequency('')
    setSelectedRating(null)
    setSearchTerm('')
  }

  const byVisitedTopics = creators.filter((creator) =>
    visitedTopics.some((visitedTopic) => creator.topics.includes(visitedTopic)),
  )

  const topCreators = (byVisitedTopics.length > 0 ? byVisitedTopics : creators).slice(0, 8)
  const topicCreators = selectedTopic
    ? creators.filter((creator) => creator.topics.includes(selectedTopic)).slice(0, 8)
    : []
  const similarCreators = (byVisitedTopics.length > 0 ? byVisitedTopics : creators).slice(0, 8)
  const recommendedCreators = [...creators]
    .sort((a, b) => (b.averageRating ?? 0) - (a.averageRating ?? 0))
    .slice(0, 8)

  const premiumCreators = creators.filter((creator) => creator.isPremium).length

  return (
    <HomepageLayout>
      <div className="min-h-screen bg-background">
        <PageHero
          title="Criadores em destaque"
          subtitle="Descobre os educadores da comunidade e encontra quem encaixa no teu estilo de aprendizagem."
          searchPlaceholder="Pesquisar criadores por nome..."
          searchValue={searchTerm}
          onSearchChange={setSearchTerm}
          onSearch={handleSearch}
          categories={topics}
          activeCategory={selectedTopic}
          onCategoryChange={setSelectedTopic}
          backgroundImage="https://images.unsplash.com/photo-1520607162513-77705c0f0d4a?w=1800&q=80"
        >
          <div className="flex flex-wrap justify-center gap-2">
            <span className="filter-bar__pill border-border/40 bg-background/60 text-foreground">
              <Users className="mr-1 h-3.5 w-3.5" />
              {creators.length} criadores
            </span>
            <span className="filter-bar__pill border-border/40 bg-background/60 text-foreground">
              <Sparkles className="mr-1 h-3.5 w-3.5" />
              {premiumCreators} premium
            </span>
            <span className="filter-bar__pill border-border/40 bg-background/60 text-foreground">
              <Compass className="mr-1 h-3.5 w-3.5" />
              Navegacao rapida por tema
            </span>
          </div>
        </PageHero>

        <FilterBar
          sortOptions={SORT_OPTIONS}
          sortValue={sortOption}
          onSortChange={setSortOption}
          toggleFilters={toggleFilters}
          onToggleFilter={handleToggleFilter}
          resultCount={creators.length}
          resultLabel="Criadores"
          hasActiveFilters={hasActiveFilters}
          onClearFilters={handleClearFilters}
        />

        <div className="space-y-2 pt-6">
          {topCreators.length > 0 && (
            <ContentRow title="Top criadores da semana">
              {topCreators.map((creator) => (
                <CreatorCard
                  key={creator._id}
                  creator={creator}
                  variant="row"
                  onOpenModal={() => openCreatorModal(creator)}
                />
              ))}
            </ContentRow>
          )}

          {topicCreators.length > 0 && (
            <ContentRow title={`Novos criadores em ${selectedTopic}`}>
              {topicCreators.map((creator) => (
                <CreatorCard
                  key={creator._id}
                  creator={creator}
                  variant="row"
                  onOpenModal={() => openCreatorModal(creator)}
                />
              ))}
            </ContentRow>
          )}

          {similarCreators.length > 0 && (
            <ContentRow title="Criadores semelhantes aos que visitaste">
              {similarCreators.map((creator) => (
                <CreatorCard
                  key={creator._id}
                  creator={creator}
                  variant="row"
                  onOpenModal={() => openCreatorModal(creator)}
                />
              ))}
            </ContentRow>
          )}

          {recommendedCreators.length > 0 && (
            <ContentRow title="Recomendado para ti">
              {recommendedCreators.map((creator) => (
                <CreatorCard
                  key={creator._id}
                  creator={creator}
                  variant="row"
                  onOpenModal={() => openCreatorModal(creator)}
                />
              ))}
            </ContentRow>
          )}
        </div>

        <section className="px-4 py-8 sm:px-6 md:px-10 lg:px-12">
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-foreground">Todos os criadores</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Explora perfis, abre o detalhe e escolhe quem queres seguir.
            </p>
          </div>

          {loading ? (
            <div className="flex justify-center py-16">
              <LoadingSpinner />
            </div>
          ) : creators.length === 0 ? (
            <p className="py-16 text-center text-muted-foreground">Nenhum criador encontrado.</p>
          ) : (
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
              {creators.map((creator) => (
                <CreatorCard
                  key={creator._id}
                  creator={creator}
                  onOpenModal={() => openCreatorModal(creator)}
                />
              ))}
            </div>
          )}
        </section>

        <div className="pb-16 text-center">
          <Button variant="secondary">Explorar mais criadores</Button>
        </div>
      </div>

      {selectedCreator && (
        <CreatorModal
          open={true}
          onClose={() => setSelectedCreator(null)}
          creator={selectedCreator}
        />
      )}
    </HomepageLayout>
  )
}

export default {
  Page,
}
