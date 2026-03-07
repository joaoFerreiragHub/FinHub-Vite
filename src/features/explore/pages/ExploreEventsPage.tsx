import { ExploreCollectionPage } from '@/features/explore/components/ExploreCollectionPage'

export default function ExploreEventsPage() {
  return (
    <ExploreCollectionPage
      kind="events"
      title="Explorar Eventos"
      subtitle="Descobre eventos ao vivo, workshops e sessoes especiais."
      searchPlaceholder="Pesquisar eventos..."
    />
  )
}
