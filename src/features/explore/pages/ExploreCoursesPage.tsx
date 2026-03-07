import { ExploreCollectionPage } from '@/features/explore/components/ExploreCollectionPage'

export default function ExploreCoursesPage() {
  return (
    <ExploreCollectionPage
      kind="courses"
      title="Explorar Cursos"
      subtitle="Cursos estruturados para evoluires do basico ao avancado."
      searchPlaceholder="Pesquisar cursos..."
    />
  )
}
