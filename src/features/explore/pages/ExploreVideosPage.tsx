import { ExploreCollectionPage } from '@/features/explore/components/ExploreCollectionPage'

export default function ExploreVideosPage() {
  return (
    <ExploreCollectionPage
      kind="videos"
      title="Explorar Videos"
      subtitle="Conteudo em video para aprender temas praticos de forma direta."
      searchPlaceholder="Pesquisar videos..."
    />
  )
}
