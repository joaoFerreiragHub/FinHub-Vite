import { useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { PublicSurfaceDisabledState } from '@/features/platform/components/PublicSurfaceDisabledState'
import { usePublicSurfaceControl } from '@/features/platform/hooks/usePublicSurfaceControl'
import type { CreatorFull } from '@/features/creators/types/creator'
import SidebarLayout from '@/shared/layouts/SidebarLayout'
import { mockCreatorsFull } from '@/lib/mock/mockCreatorsFull'
import ContentSections from '@/features/creators/components/public/ContentSections'
import CreatorProfile from '@/features/creators/components/public/CreatorProfile'
import { fetchPublicCreatorProfile } from '@/features/creators/services/publicCreatorsService'

const createFallbackCreator = (username: string): CreatorFull => ({
  _id: `virtual-${username}`,
  username,
  email: `${username}@finhub.local`,
  firstname: username,
  lastname: '',
  role: 'creator',
  isPremium: false,
  topics: [],
  termsAccepted: true,
  termsOfServiceAgreement: true,
  contentLicenseAgreement: true,
  paymentTermsAgreement: true,
  bio: 'Este criador ainda nao adicionou informacoes.',
  socialMediaLinks: [],
  followers: [],
  famous: [],
  content: [],
  averageRating: 0,
  contentVisibility: {
    announcements: false,
    courses: false,
    articles: false,
    events: false,
    files: false,
    playlists: {
      regular: false,
      shorts: false,
      podcast: false,
      featured: false,
    },
    welcomeVideo: false,
  },
  fullPlaylists: [],
  announcementsResolved: [],
  articlesResolved: [],
  eventsResolved: [],
  documentsResolved: [],
  coursesResolved: [],
})

export default function CreatorProfilePage() {
  const params = useParams<{ username?: string }>()
  const username = decodeURIComponent(params.username ?? '').trim()
  const creatorPageSurface = usePublicSurfaceControl('creator_page')
  const normalizedUsername = username.toLowerCase()

  const creatorQuery = useQuery({
    queryKey: ['public-creator-profile', normalizedUsername],
    queryFn: () => fetchPublicCreatorProfile(normalizedUsername),
    enabled: normalizedUsername.length > 0,
    staleTime: 60 * 1000,
    retry: 1,
  })

  if (!username) {
    return (
      <SidebarLayout>
        <div className="mx-auto max-w-7xl px-4 py-10">
          <p className="text-center text-muted-foreground">
            Nao foi possivel identificar o criador.
          </p>
        </div>
      </SidebarLayout>
    )
  }

  if (creatorPageSurface.data && !creatorPageSurface.data.enabled) {
    return (
      <SidebarLayout>
        <PublicSurfaceDisabledState
          title="Pagina de creator temporariamente indisponivel"
          message={
            creatorPageSurface.data.publicMessage ??
            'Os perfis publicos de creators estao temporariamente indisponiveis durante revisao operacional.'
          }
        />
      </SidebarLayout>
    )
  }

  const found = mockCreatorsFull.find(
    (creator) => creator.username?.toLowerCase().trim() === normalizedUsername,
  )
  const creatorData: CreatorFull = creatorQuery.data ?? found ?? createFallbackCreator(username)

  return (
    <SidebarLayout>
      <div className="max-w-7xl mx-auto px-4 py-10 space-y-10">
        {creatorQuery.isError ? (
          <div className="rounded-md border border-amber-400/30 bg-amber-400/10 px-4 py-3 text-xs text-amber-100">
            Perfil carregado em fallback local porque a API publica de creators nao respondeu.
          </div>
        ) : null}

        <CreatorProfile
          creatorData={creatorData}
          averageCreatorRating={creatorData.averageRating ?? 0}
          userRating={0}
          submitRating={() => {}}
          user={{ id: 'visitor', role: 'visitor' }}
        />

        <ContentSections
          creatorData={creatorData}
          contentVisibility={creatorData.contentVisibility}
          handleCourseClick={() => {}}
          handleArticleClick={() => {}}
          handleEventClick={() => {}}
          getEmbedUrl={(url) => `https://www.youtube.com/embed/${url}`}
          coursesWithRatings={creatorData.coursesResolved ?? []}
          articlesWithRatings={creatorData.articlesResolved ?? []}
        />
      </div>
    </SidebarLayout>
  )
}
