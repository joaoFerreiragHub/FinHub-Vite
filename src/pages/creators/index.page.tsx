import { useEffect, useState } from 'react'
import { Creator } from '../../types/creator'
import SearchBar from '../../components/creators/filters/SearchBar'
import TopicTabs from '../../components/creators/filters/TopicTabs'
import SortFilter from '../../components/creators/filters/SortFilter'
import { Button } from '../../components/ui/button'
import LoadingSpinner from '../../components/ui/loading-spinner'
import SidebarLayout from '../../components/layout/SidebarLayout'
import { CreatorCard } from '../../components/creators/cards/CreatorCard'
import { addVisitedTopics } from '../../utils/visitedTopics'
import { useVisitedTopics } from '../../hooks/useVisitedTopics'
import { CreatorModal } from '../../components/creators/modals/CreatorModal'
import { mockCreators } from '../../components/creators/api/mockCreators'

export function Page() {
  const [selectedTopic, setSelectedTopic] = useState('Todos')
  const [sortOption, setSortOption] = useState('popular')
  const [selectedRating, setSelectedRating] = useState<number | null>(null)
  const [selectedFrequency, setSelectedFrequency] = useState('')
  const [selectedType, setSelectedType] = useState('')
  const [selectedTag, setSelectedTag] = useState('')
  const visitedTopics = useVisitedTopics()
  const [creators, setCreators] = useState<Creator[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedCreator, setSelectedCreator] = useState<Creator | null>(null)

  useEffect(() => {
    setLoading(true)
    const timer = setTimeout(() => {
      let filtered = [...mockCreators]

      if (selectedTopic !== 'Todos') {
        filtered = filtered.filter((c) => c.topics.includes(selectedTopic))
      }

      if (selectedRating !== null) {
        filtered = filtered.filter((c) => (c.averageRating ?? 0) >= selectedRating)
      }

      if (selectedTag) {
        filtered = filtered.filter((c) => c.bio?.toLowerCase().includes(selectedTag.toLowerCase()))
      }

      if (selectedFrequency) {
        filtered = filtered.filter((c) => c.publicationFrequency === selectedFrequency)
      }

      if (selectedType) {
        filtered = filtered.filter((c) => c.typeOfContent === selectedType.toLowerCase())
      }

      if (sortOption === 'rating') {
        filtered.sort((a, b) => (b.averageRating ?? 0) - (a.averageRating ?? 0))
      } else if (sortOption === 'recent') {
        filtered.reverse() // mock: assume ordem de entrada = tempo
      }

      setCreators(filtered)
      setLoading(false)
    }, 300)

    return () => clearTimeout(timer)
  }, [selectedTopic, selectedRating, selectedFrequency, selectedType, selectedTag, sortOption])

  const handleSearch = (query: string) => {
    const found = creators.find((c) => c.username.toLowerCase() === query.toLowerCase())
    if (found) window.location.href = `/creators/${encodeURIComponent(found.username)}`
    else alert('Criador não encontrado.')
  }

  return (
    <SidebarLayout>
      <div className="max-w-7xl mx-auto px-4 py-10 space-y-10">
        {/* 1. Título + Subtítulo */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold">🎯 Criadores em Destaque</h1>
          <p className="text-muted-foreground">Aprende com os melhores da comunidade.</p>
        </div>

        {/* 2. SearchBar centralizada */}
        <div className="flex justify-center">
          <SearchBar onSearch={handleSearch} creators={mockCreators} />
        </div>

        {/* 3. Tabs de temas principais */}
        <TopicTabs selectedTopic={selectedTopic} setSelectedTopic={setSelectedTopic} />

        {/* 4. Filtros avançados (accordion em mobile, grid em desktop) */}
        <section aria-label="Filtros">
          {/* Mobile: Accordion */}
          <div className="md:hidden mb-6">
            <details className="border rounded-md">
              <summary className="cursor-pointer px-4 py-2 font-medium bg-muted rounded-md">
                🎛️ Filtros Avançados
              </summary>
              <div className="px-4 py-4 space-y-6">
                {/* Tipo + Frequência */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium mb-1">📽️ Tipo de Conteúdo</p>
                    <div className="flex flex-wrap gap-2">
                      {['Vídeos', 'Artigos', 'Cursos', 'Playlists'].map((type) => (
                        <Button
                          key={type}
                          size="sm"
                          variant={selectedType === type ? 'default' : 'outline'}
                          onClick={() => setSelectedType(type === selectedType ? '' : type)}
                        >
                          {type}
                        </Button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <p className="text-sm font-medium mb-1">🕒 Frequência</p>
                    <div className="flex flex-wrap gap-2">
                      {['Diário', 'Semanal', 'Mensal', 'Ocasional'].map((freq) => (
                        <Button
                          key={freq}
                          size="sm"
                          variant={selectedFrequency === freq ? 'default' : 'outline'}
                          onClick={() =>
                            setSelectedFrequency(freq === selectedFrequency ? '' : freq)
                          }
                        >
                          {freq}
                        </Button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Avaliação */}
                <div>
                  <p className="text-sm font-medium mb-1">🌟 Avaliação</p>
                  <div className="flex flex-wrap gap-2">
                    {[5, 4, 3, 2].map((rating) => (
                      <Button
                        key={rating}
                        size="sm"
                        variant={selectedRating === rating ? 'default' : 'outline'}
                        onClick={() => setSelectedRating(rating === selectedRating ? null : rating)}
                      >
                        {'⭐'.repeat(rating)}+
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Tags */}
                <div>
                  <p className="text-sm font-medium mb-1">🏷️ Temas</p>
                  <div className="flex flex-wrap gap-2">
                    {['Investimento sustentável', 'Ações americanas', 'Day trading'].map((tag) => (
                      <Button
                        key={tag}
                        size="sm"
                        variant={selectedTag === tag ? 'default' : 'outline'}
                        onClick={() => setSelectedTag(tag === selectedTag ? '' : tag)}
                      >
                        {tag}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
            </details>
          </div>

          {/* Desktop: Grid */}
          <div className="hidden md:grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Tipo de Conteúdo */}
            <div>
              <p className="text-sm font-medium mb-1">📽️ Tipo de Conteúdo</p>
              <div className="flex flex-wrap gap-2">
                {['Vídeos', 'Artigos', 'Cursos', 'Playlists'].map((type) => (
                  <Button
                    key={type}
                    size="sm"
                    variant={selectedType === type ? 'default' : 'outline'}
                    onClick={() => setSelectedType(type === selectedType ? '' : type)}
                  >
                    {type}
                  </Button>
                ))}
              </div>
            </div>

            {/* Frequência */}
            <div>
              <p className="text-sm font-medium mb-1">🕒 Frequência</p>
              <div className="flex flex-wrap gap-2">
                {['Diário', 'Semanal', 'Mensal', 'Ocasional'].map((freq) => (
                  <Button
                    key={freq}
                    size="sm"
                    variant={selectedFrequency === freq ? 'default' : 'outline'}
                    onClick={() => setSelectedFrequency(freq === selectedFrequency ? '' : freq)}
                  >
                    {freq}
                  </Button>
                ))}
              </div>
            </div>

            {/* Avaliação */}
            <div>
              <p className="text-sm font-medium mb-1">🌟 Avaliação</p>
              <div className="flex flex-wrap gap-2">
                {[5, 4, 3, 2].map((rating) => (
                  <Button
                    key={rating}
                    size="sm"
                    variant={selectedRating === rating ? 'default' : 'outline'}
                    onClick={() => setSelectedRating(rating === selectedRating ? null : rating)}
                  >
                    {'⭐'.repeat(rating)}+
                  </Button>
                ))}
              </div>
            </div>

            {/* Tags */}
            <div>
              <p className="text-sm font-medium mb-1">🏷️ Temas</p>
              <div className="flex flex-wrap gap-2">
                {['Investimento sustentável', 'Ações americanas', 'Day trading'].map((tag) => (
                  <Button
                    key={tag}
                    size="sm"
                    variant={selectedTag === tag ? 'default' : 'outline'}
                    onClick={() => setSelectedTag(tag === selectedTag ? '' : tag)}
                  >
                    {tag}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </section>
        {/* 5. Secção “Top criadores da semana” */}
        <section
          id="top-criadores"
          aria-label="Top criadores da semana"
          className="pt-10 border-t scroll-mt-[var(--altura-navbar)]"
        >
          <h2 className="text-xl font-semibold mb-4">📊 Top criadores da semana</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {mockCreators
              .filter((c) => visitedTopics.some((topic) => c.topics.includes(topic)))
              .slice(0, 4)
              .map((creator) => (
                <CreatorCard
                  key={creator._id}
                  creator={creator}
                  onOpenModal={() => {
                    addVisitedTopics(creator.topics)
                    setSelectedCreator(creator)
                  }}
                />
              ))}
          </div>
        </section>

        {/* 6. Secção “Novos criadores sobre {tema}” */}
        {selectedTopic !== 'Todos' && (
          <section
            id="novos-criadores"
            aria-label={`Novos criadores sobre ${selectedTopic}`}
            className="scroll-mt-[var(--altura-navbar)]"
          >
            <h2 className="text-xl font-semibold mb-4">💡 Novos criadores sobre {selectedTopic}</h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {mockCreators
                .filter((c) => visitedTopics.some((topic) => c.topics.includes(topic)))
                .slice(0, 4)
                .map((creator) => (
                  <CreatorCard
                    key={creator._id}
                    creator={creator}
                    onOpenModal={() => {
                      addVisitedTopics(creator.topics)
                      setSelectedCreator(creator)
                    }}
                  />
                ))}
            </div>
          </section>
        )}
        <section
          id="criadores-sem-visitados"
          aria-label="Criadores semelhantes aos que visitaste"
          className="scroll-mt-[var(--altura-navbar)] pt-10 border-t"
        >
          <h2 className="text-xl font-semibold mb-4">🔁 Criadores semelhantes aos que visitaste</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {mockCreators
              .filter((c) => visitedTopics.some((topic) => c.topics.includes(topic)))
              .slice(0, 4)
              .map((creator) => (
                <CreatorCard
                  key={creator._id}
                  creator={creator}
                  onOpenModal={() => {
                    addVisitedTopics(creator.topics)
                    setSelectedCreator(creator)
                  }}
                />
              ))}
          </div>
        </section>

        <section
          id="recomendado-para-ti"
          aria-label="Recomendado para ti"
          className="scroll-mt-[var(--altura-navbar)] pt-10 border-t"
        >
          <h2 className="text-xl font-semibold mb-4">❤️ Recomendado para ti</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {mockCreators
              .filter((c) => visitedTopics.some((topic) => c.topics.includes(topic)))
              .slice(0, 4)
              .map((creator) => (
                <CreatorCard
                  key={creator._id}
                  creator={creator}
                  onOpenModal={() => {
                    addVisitedTopics(creator.topics)
                    setSelectedCreator(creator)
                  }}
                />
              ))}
          </div>
        </section>

        {selectedTopic !== 'Todos' && (
          <section
            id="temas-parecidos"
            aria-label={`Criadores que também falam de ${selectedTopic}`}
            className="scroll-mt-[var(--altura-navbar)] pt-10 border-t"
          >
            <h2 className="text-xl font-semibold mb-4">
              🧠 Criadores que também falam de {selectedTopic}
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {mockCreators
                .filter((c) => visitedTopics.some((topic) => c.topics.includes(topic)))
                .slice(0, 4)
                .map((creator) => (
                  <CreatorCard
                    key={creator._id}
                    creator={creator}
                    onOpenModal={() => {
                      addVisitedTopics(creator.topics)
                      setSelectedCreator(creator)
                    }}
                  />
                ))}
            </div>
          </section>
        )}
        {/* 7. SortFilter + resultados */}
        <div className="pt-10 space-y-6">
          <SortFilter sortOption={sortOption} setSortOption={setSortOption} />
          {loading ? (
            <div className="flex justify-center mt-10">
              <LoadingSpinner />
            </div>
          ) : creators.length === 0 ? (
            <p className="text-center text-muted-foreground">Nenhum criador encontrado.</p>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
              {creators.map((creator) => (
                <CreatorCard
                  key={creator._id}
                  creator={creator}
                  onOpenModal={() => {
                    addVisitedTopics(creator.topics)
                    setSelectedCreator(creator)
                  }}
                />
              ))}
            </div>
          )}
        </div>

        {/* 8. Botão final */}
        <div className="text-center mt-16">
          <Button variant="secondary">Explora todos os criadores →</Button>
        </div>
      </div>
      {selectedCreator && (
        <CreatorModal
          open={true}
          onClose={() => setSelectedCreator(null)}
          creator={selectedCreator}
        />
      )}
    </SidebarLayout>
  )
}

export default {
  Page,
}
