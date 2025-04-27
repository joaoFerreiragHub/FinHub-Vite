export type AnnouncementType = 'inline' | 'popup'

export interface Announcement {
  id: string
  title: string
  text: string
  creatorId: string
  createdAt: string
  updatedAt: string
  isVisible: boolean
  type: 'inline' | 'popup'
  imageUrl?: string // 👈 NOVO
}
