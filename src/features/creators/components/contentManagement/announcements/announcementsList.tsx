import { Announcement } from '@/features/hub/types/announcement'
import AnnouncementItem from './announcementItem'

interface AnnouncementsListProps {
  announcements: Announcement[]
  onEdit: (announcement: Announcement) => void
  onDelete: (id: string) => void
  hiddenAnnouncements: string[]
  onToggleHide: (id: string) => void
}

export default function AnnouncementsList({
  announcements,
  onEdit,
  onDelete,
  hiddenAnnouncements,
  onToggleHide,
}: AnnouncementsListProps) {
  if (!announcements.length) {
    return <p className="text-muted-foreground mt-4">Nenhum anúncio criado ainda.</p>
  }

  return (
    <div className="flex flex-col gap-6">
      {announcements.map((announcement) => (
        <AnnouncementItem
          key={announcement.id}
          announcement={announcement}
          onEdit={() => onEdit(announcement)}
          onDelete={() => onDelete(announcement.id)}
          onToggleHide={() => onToggleHide(announcement.id)}
          isHidden={hiddenAnnouncements.includes(announcement.id)}
        />
      ))}
    </div>
  )
}
