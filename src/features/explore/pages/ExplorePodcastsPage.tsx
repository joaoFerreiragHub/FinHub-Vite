import { ExploreCollectionPage } from '@/features/explore/components/ExploreCollectionPage'

export default function ExplorePodcastsPage() {
  return (
    <ExploreCollectionPage
      kind="podcasts"
      title="Explorar Podcasts"
      subtitle="Episodios e entrevistas para aprender em qualquer contexto."
      searchPlaceholder="Pesquisar podcasts..."
    />
  )
}
