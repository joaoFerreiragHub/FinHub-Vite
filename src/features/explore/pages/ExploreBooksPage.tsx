import { ExploreCollectionPage } from '@/features/explore/components/ExploreCollectionPage'

export default function ExploreBooksPage() {
  return (
    <ExploreCollectionPage
      kind="books"
      title="Explorar Livros"
      subtitle="Livros recomendados para reforcar conhecimento financeiro."
      searchPlaceholder="Pesquisar livros..."
    />
  )
}
