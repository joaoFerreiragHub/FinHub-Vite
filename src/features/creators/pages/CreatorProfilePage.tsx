import { PlaceholderPage } from '@/components/layout/PlaceholderPage'
import { PublicSurfaceDisabledState } from '@/features/platform/components/PublicSurfaceDisabledState'
import { usePublicSurfaceControl } from '@/features/platform/hooks/usePublicSurfaceControl'

export default function CreatorProfilePage() {
  const creatorPageSurface = usePublicSurfaceControl('creator_page')

  if (creatorPageSurface.data && !creatorPageSurface.data.enabled) {
    return (
      <PublicSurfaceDisabledState
        title="Pagina de creator temporariamente indisponivel"
        message={
          creatorPageSurface.data.publicMessage ??
          'Os perfis publicos de creators estao temporariamente indisponiveis durante revisao operacional.'
        }
      />
    )
  }

  return (
    <PlaceholderPage
      section="Criadores"
      title="Perfil do Criador"
      description="Estamos a finalizar a experiencia desta pagina com o mesmo padrao de navegacao e responsividade da Home."
    />
  )
}
