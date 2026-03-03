import { PlaceholderPage } from '@/components/layout/PlaceholderPage'
import { PublicSurfaceDisabledState } from '@/features/platform/components/PublicSurfaceDisabledState'
import { usePublicSurfaceControl } from '@/features/platform/hooks/usePublicSurfaceControl'

export default function FollowingFeedPage() {
  const feedSurface = usePublicSurfaceControl('derived_feeds')

  if (feedSurface.data && !feedSurface.data.enabled) {
    return (
      <PublicSurfaceDisabledState
        title="Feed temporariamente indisponivel"
        message={
          feedSurface.data.publicMessage ??
          'Os feeds derivados foram temporariamente desligados enquanto decorre revisao operacional.'
        }
      />
    )
  }

  return (
    <PlaceholderPage
      section="Area do utilizador"
      title="A Seguir"
      description="Estamos a finalizar a experiencia desta pagina com o mesmo padrao de navegacao e responsividade da Home."
    />
  )
}
