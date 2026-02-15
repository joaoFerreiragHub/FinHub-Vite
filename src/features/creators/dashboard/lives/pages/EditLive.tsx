import { useParams, Navigate } from 'react-router-dom'
import { DashboardLayout } from '@/shared/layouts'
import { LiveForm } from '../components/LiveForm'
import { useLive, useUpdateLive } from '@/features/hub/lives/hooks/useLives'
import { Card } from '@/components/ui'
import type { UpdateLiveEventDto } from '@/features/hub/lives/types'

/**
 * Pagina de edicao de evento
 */
export function EditLive() {
  const { id } = useParams<{ id: string }>()
  const { data: live, isLoading, error } = useLive(id!)
  const updateLive = useUpdateLive()

  const handleSubmit = async (data: UpdateLiveEventDto) => {
    if (!id) return
    await updateLive.mutateAsync({ id, data })
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

  if (error || !live) {
    return <Navigate to="/creators/dashboard/lives" replace />
  }

  return (
    <DashboardLayout>
      <div className="mx-auto max-w-4xl space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Editar Evento</h1>
          <p className="mt-1 text-muted-foreground">
            A editar: <span className="font-medium">{live.title}</span>
          </p>
        </div>

        <Card className="p-8">
          <LiveForm
            live={live}
            onSubmit={handleSubmit}
            submitText="Atualizar Evento"
            showDraftOption={false}
          />
        </Card>
      </div>
    </DashboardLayout>
  )
}
