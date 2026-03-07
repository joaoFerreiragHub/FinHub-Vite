import { ExploreCollectionPage } from '@/features/explore/components/ExploreCollectionPage'

export default function ExploreArticlesPage() {
  return (
    <ExploreCollectionPage
      kind="articles"
      title="Explorar Artigos"
      subtitle="Analises, guias e opiniao financeira em formato de leitura."
      searchPlaceholder="Pesquisar artigos..."
    />
  )
}
