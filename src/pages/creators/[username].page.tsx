// src/pages/creators/[username].page.tsx

import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom' // ou equivalente no teu router
import { CreatorFull } from '../../types/creator'
import SidebarLayout from '../../components/layout/SidebarLayout'
import { CreatorProfile } from '../../components/creators/public/CreatorProfile'
import ContentSections from '../../components/creators/public/ContentSections'
import LoadingSpinner from '../../components/ui/loading-spinner'
import { mockCreatorsFull } from '../../mock/mockCreatorsFull'

// Este fetch será substituído por API real no futuro

export default function CreatorPage() {
  const { username } = useParams()
  const [creatorData, setCreatorData] = useState<CreatorFull | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Mock temporário
    const found = mockCreatorsFull.find((c) => c.username === username)
    setCreatorData(found || null)
    setLoading(false)
  }, [username])

  if (loading) return <LoadingSpinner />
  if (!creatorData) return <p className="text-center">Criador não encontrado.</p>

  return (
    <SidebarLayout>
      <div className="max-w-7xl mx-auto px-4 py-10 space-y-10">
        <CreatorProfile
          creatorData={creatorData}
          averageCreatorRating={creatorData.averageRating ?? 0}
          userRating={0} // mais tarde virá do utilizador autenticado
          submitRating={() => {}} // a implementar
          user={null} // a implementar
        />

        <ContentSections
          creatorData={creatorData}
          contentVisibility={creatorData.contentVisibility}
          handleCourseClick={() => {}}
          handleArticleClick={() => {}}
          handleEventClick={() => {}}
          getEmbedUrl={(url: string) => url}
        />
      </div>
    </SidebarLayout>
  )
}
