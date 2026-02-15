import { DashboardLayout } from '@/shared/layouts'
import { LiveForm } from '../components/LiveForm'
import { useCreateLive } from '@/features/hub/lives/hooks/useLives'
import { Card } from '@/components/ui'
import type { CreateLiveEventDto } from '@/features/hub/lives/types'

/**
 * Pagina de criacao de evento
 */
export function CreateLive() {
  const createLive = useCreateLive()

  const handleSubmit = async (data: CreateLiveEventDto) => {
    await createLive.mutateAsync(data)
  }

  return (
    <DashboardLayout>
      <div className="mx-auto max-w-4xl space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Criar Novo Evento</h1>
          <p className="mt-1 text-muted-foreground">
            Organiza eventos ao vivo para a tua audiencia
          </p>
        </div>

        <Card className="p-8">
          <LiveForm onSubmit={handleSubmit} submitText="Criar Evento" />
        </Card>

        <Card className="border-dashed bg-muted/30 p-6">
          <h3 className="mb-2 font-semibold">Dicas para um bom evento</h3>
          <ul className="space-y-1 text-sm text-muted-foreground">
            <li>- Escolhe um titulo claro e descritivo</li>
            <li>- Define a data e horario com antecedencia</li>
            <li>- Para eventos online, testa o link antes</li>
            <li>- Adiciona uma imagem de capa atrativa</li>
            <li>- Define um limite de participantes se necessario</li>
            <li>- Promove o evento nas redes sociais</li>
          </ul>
        </Card>
      </div>
    </DashboardLayout>
  )
}
