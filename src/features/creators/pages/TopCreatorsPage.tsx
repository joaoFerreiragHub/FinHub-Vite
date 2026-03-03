import { PlaceholderPage } from '@/components/layout/PlaceholderPage'
import { PublicSurfaceDisabledState } from '@/features/platform/components/PublicSurfaceDisabledState'
import { usePublicSurfaceControl } from '@/features/platform/hooks/usePublicSurfaceControl'

export default function TopCreatorsPage() {
  const creatorPageSurface = usePublicSurfaceControl('creator_page')

  if (creatorPageSurface.data && !creatorPageSurface.data.enabled) {
    return (
      <PublicSurfaceDisabledState
        title="Top creators temporariamente indisponivel"
        message={
          creatorPageSurface.data.publicMessage ??
          'A descoberta publica de creators foi temporariamente desligada durante revisao operacional.'
        }
      />
    )
  }

  return (
    <PlaceholderPage
      section="Criadores"
      title="Top Criadores"
      description="Estamos a finalizar a experiencia desta pagina com o mesmo padrao de navegacao e responsividade da Home."
    />
  )
}
