import { CreatorFull } from '../../types/creator'
import SidebarLayout from '../../components/layout/SidebarLayout'
import LoadingSpinner from '../../components/ui/loading-spinner'
import { mockCreatorsFull } from '../../mock/mockCreatorsFull'
import { useEffect, useState } from 'react'
import { usePageContext } from '../../renderer/PageShell'
import ContentSections from '../../components/creators/public/ContentSections'
import CreatorProfile from '../../components/creators/public/CreatorProfile'

// Define passToClient directly here
export const passToClient = ['routeParams', 'pageProps', 'user']

// Two options to access the pageContext:
// 1. Via props drilling
// 2. Via the new context hook
export function Page(props: any) {
  try {
    // Try to get pageContext from usePageContext hook
    const pageContext = usePageContext()
    const username = pageContext.routeParams?.username

    if (!username) {
      console.error('Username not found in pageContext', pageContext)
      return <div>Error: Username not available</div>
    }

    return <CreatorPage username={username} />
  } catch (error) {
    // Fallback to props drilling if context isn't available
    console.log('Using fallback props-based approach')

    // Get username either from pageContext prop or from routeParams directly
    const username =
      props.pageContext?.routeParams?.username ||
      props.routeParams?.username

    if (!username) {
      console.error('Username not found in props', props)
      return <div>Error: Creator not found</div>
    }

    return <CreatorPage username={username} />
  }
}

function CreatorPage({ username }: { username: string }) {
  const [creatorData, setCreatorData] = useState<CreatorFull | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    console.log('Username in CreatorPage:', username)
    if (!username) {
      console.log('No username provided')
      return
    }

    const found = mockCreatorsFull.find(
      (c) => c.username?.toLowerCase().trim() === username.toLowerCase().trim()
    )
    console.log('Creator found:', found)
    setCreatorData(found || null)
    setLoading(false)
  }, [username])

  if (!username) return <p className="text-center">A carregar...</p>
  if (loading) return <LoadingSpinner />
  if (!creatorData) return <p className="text-center">Criador não encontrado.</p>

  return (
<SidebarLayout>
    <div className="max-w-7xl mx-auto px-4 py-10 space-y-10">
      {/* Welcome Video */}
      {/* {creatorData.contentVisibility?.welcomeVideo && creatorData.mainVideo?.videoLink && (
        <div className="w-full aspect-video">
          <iframe
            src={getEmbedUrl(creatorData.mainVideo.videoLink)}
            className="w-full h-full rounded-lg"
            allowFullScreen
            title="Vídeo de Boas-Vindas"
          />
        </div>
      )} */}

      {/* Perfil do Criador */}
      <CreatorProfile
        creatorData={creatorData}
        averageCreatorRating={5} // mock por agora
        userRating={4} // mock por agora
        submitRating={() => {}} // mock por agora
         user={{ id: 'mock-user-id', role: 'RegularUser' }}
      />

      {/* Secções de Conteúdos */}
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
