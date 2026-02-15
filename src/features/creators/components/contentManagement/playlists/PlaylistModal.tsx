import { Playlist } from '@/features/hub/types/playlist'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui'
import PlaylistForm, { PlaylistFormValues } from './playlistForm/PlaylistForm'

interface PlaylistModalProps {
  open: boolean
  onClose: () => void
  initialData?: Playlist | null
  onSave: (playlist: Playlist) => void
  onDelete?: (id: string) => void
}

export default function PlaylistModal({
  open,
  onClose,
  initialData,
  onSave,
  onDelete,
}: PlaylistModalProps) {
  const handleSubmit = (values: PlaylistFormValues) => {
    const newPlaylist: Playlist = {
      id: initialData?.id || crypto.randomUUID(),
      name: values.name,
      topic: values.topic,
      isPublic: values.isPublic,
      isMain: values.isMain,
      videos: values.videos,
    }
    onSave(newPlaylist)
    onClose()
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="w-full max-w-2xl">
        <DialogHeader>
          <DialogTitle>{initialData ? 'Editar Playlist' : 'Nova Playlist'}</DialogTitle>
        </DialogHeader>

        <PlaylistForm
          initialValues={initialData}
          initialId={initialData?.id}
          onSubmit={handleSubmit}
          onDelete={initialData ? () => onDelete?.(initialData.id) : undefined}
        />
      </DialogContent>
    </Dialog>
  )
}
