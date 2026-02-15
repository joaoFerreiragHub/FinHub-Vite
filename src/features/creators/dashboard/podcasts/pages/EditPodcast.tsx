import { useParams, Navigate } from 'react-router-dom'
import { DashboardLayout } from '@/shared/layouts'
import { PodcastForm } from '../components/PodcastForm'
import { usePodcast, useUpdatePodcast } from '@/features/hub/podcasts/hooks/usePodcasts'
import { Card } from '@/components/ui'
import type { UpdatePodcastDto } from '@/features/hub/podcasts/types'

/**
 * Pagina de edicao de podcast
 */
export function EditPodcast() {
  const { id } = useParams<{ id: string }>()
  const { data: podcast, isLoading, error } = usePodcast(id!)
  const updatePodcast = useUpdatePodcast()

  const handleSubmit = async (data: UpdatePodcastDto) => {
    if (!id) return
    await updatePodcast.mutateAsync({ id, data })
  }

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex min-h-[400px] items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        </div>
      </DashboardLayout>
    )
  }

  if (error || !podcast) {
    return <Navigate to="/creators/dashboard/podcasts" replace />
  }

  return (
    <DashboardLayout>
      <div className="mx-auto max-w-4xl space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Editar Podcast</h1>
          <p className="mt-1 text-muted-foreground">
            A editar: <span className="font-medium">{podcast.title}</span>
          </p>
        </div>

        <Card className="p-8">
          <PodcastForm
            podcast={podcast}
            onSubmit={handleSubmit}
            submitText="Atualizar Podcast"
            showDraftOption={false}
          />
        </Card>
      </div>
    </DashboardLayout>
  )
}
