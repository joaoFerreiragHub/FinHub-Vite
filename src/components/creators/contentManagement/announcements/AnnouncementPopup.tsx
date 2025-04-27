import { Announcement } from '../../../../types/announcement'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../../../ui/dialog'
import { Button } from '../../../ui/button'

interface AnnouncementPopupProps {
  announcement: Announcement
  onClose: () => void
}

export function AnnouncementPopup({ announcement, onClose }: AnnouncementPopupProps) {
  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="space-y-4">
        <DialogHeader>
          <DialogTitle>{announcement.title}</DialogTitle>
        </DialogHeader>

        {announcement.imageUrl && (
          <img
            src={announcement.imageUrl}
            alt="Imagem do anúncio"
            className="w-full h-auto rounded-md border"
          />
        )}

        <p className="text-muted-foreground">{announcement.text}</p>

        <div className="flex justify-end">
          <Button onClick={onClose} variant="secondary">
            Fechar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
