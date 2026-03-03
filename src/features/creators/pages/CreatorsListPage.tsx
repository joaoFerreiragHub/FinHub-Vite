import { PlaceholderPage } from '@/components/layout/PlaceholderPage'
import { PublicSurfaceDisabledState } from '@/features/platform/components/PublicSurfaceDisabledState'
import { usePublicSurfaceControl } from '@/features/platform/hooks/usePublicSurfaceControl'

export default function CreatorsListPage() {
  const creatorPageSurface = usePublicSurfaceControl('creator_page')

  if (creatorPageSurface.data && !creatorPageSurface.data.enabled) {
    return (
      <PublicSurfaceDisabledState
        title="Pagina de creators temporariamente indisponivel"
        message={
          creatorPageSurface.data.publicMessage ??
          'A area publica de creators foi temporariamente desligada durante revisao operacional.'
        }
      />
    )
  }

  return (
    <PlaceholderPage
      section="Criadores"
      title="Criadores"
      description="Estamos a finalizar a experiencia desta pagina com o mesmo padrao de navegacao e responsividade da Home."
    />
  )
}
