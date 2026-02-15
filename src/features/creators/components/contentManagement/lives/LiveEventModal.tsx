// LiveEventModal.ts
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui'

import LiveEventForm from './livesForm/LiveEventForm'
import { LiveEvent } from '~/features/hub/types/liveEvent'

interface LiveEventModalProps {
  open: boolean
  initialDate: string | null
  initialData?: LiveEvent | null
  onClose: () => void
  onSave: (event: LiveEvent) => void
  onDelete?: (id: string) => void
}
export interface LiveEventFormValues {
  title: string
  type: 'online' | 'presencial'
  description: string
  startTime: string
  endTime: string
  coverImage: string
  address?: string
  eventCreatorName: string
}
export default function LiveEventModal({
  open,
  onClose,
  onSave,
  initialDate,
  initialData,
  onDelete,
}: LiveEventModalProps) {
  const handleFormSubmit = (values: LiveEventFormValues) => {
    if (!initialDate) return
    const event: LiveEvent = {
      id: initialData?.id || crypto.randomUUID(),
      title: values.title,
      type: values.type,
      date: initialDate,
      description: values.description,
      startTime: values.startTime,
      endTime: values.endTime,
      coverImage: values.coverImage,
      address: values.type === 'presencial' ? values.address : undefined,
      eventCreatorName: values.eventCreatorName,
    }
    onSave(event)
    onClose()
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{initialData ? 'Editar Evento' : 'Novo Evento'}</DialogTitle>
        </DialogHeader>

        <LiveEventForm
          initialValues={
            initialData
              ? {
                  title: initialData.title,
                  type: initialData.type,
                  description: initialData.description ?? '',
                  startTime: initialData.startTime ?? '',
                  endTime: initialData.endTime ?? '',
                  coverImage: initialData.coverImage ?? '',
                  address: initialData.address ?? '',
                  eventCreatorName: initialData.eventCreatorName ?? '',
                }
              : null
          }
          onSubmit={handleFormSubmit}
          onDelete={onDelete}
        />
      </DialogContent>
    </Dialog>
  )
}
