import type { CreatorFull } from '@/features/creators/types/creator'
import SidebarLayout from '@/shared/layouts/SidebarLayout'
import { mockCreatorsFull } from '@/lib/mock/mockCreatorsFull'
import ContentSections from '@/features/creators/components/public/ContentSections'
import CreatorProfile from '@/features/creators/components/public/CreatorProfile'

export const passToClient = ['routeParams', 'pageProps', 'user']

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

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const resolveUsername = (props: any): string => {
  const fromProps =
    props.pageContext?.routeParams?.username ?? props.routeParams?.username ?? props.username
  if (fromProps) return decodeURIComponent(String(fromProps))

  if (typeof window !== 'undefined') {
    const routeMatch = window.location.pathname.match(/^\/creators\/([^/?#]+)/)
    if (routeMatch?.[1]) return decodeURIComponent(routeMatch[1])
  }

  return ''
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function Page(props: any) {
  const username = resolveUsername(props)

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

  return <CreatorPage username={username} />
}

function CreatorPage({ username }: { username: string }) {
  const normalizedUsername = username.toLowerCase().trim()
  const found = mockCreatorsFull.find(
    (creator) => creator.username?.toLowerCase().trim() === normalizedUsername,
  )
  const creatorData: CreatorFull = found ?? createFallbackCreator(username)

  return (
    <SidebarLayout>
      <div className="max-w-7xl mx-auto px-4 py-10 space-y-10">
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
          handleCourseClick={(course) => console.log('Curso selecionado:', course)}
          handleArticleClick={(article) => console.log('Artigo selecionado:', article)}
          handleEventClick={(event) => console.log('Evento selecionado:', event)}
          getEmbedUrl={(url) => `https://www.youtube.com/embed/${url}`}
          coursesWithRatings={creatorData.coursesResolved ?? []}
          articlesWithRatings={creatorData.articlesResolved ?? []}
        />
      </div>
    </SidebarLayout>
  )
}
