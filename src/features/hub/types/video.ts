export type VideoType = "creatorCard" | "creatorPage"

export interface VideoData {
  id: string
  title: string
  description?: string
  videoLink: string
  videoType: VideoType    // 👈 Adiciona esta linha
  isSelected?: boolean
  order?: number
  createdAt?: string
  updatedAt?: string
}
