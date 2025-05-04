export interface Article {
  id: string
  title: string
  content: string // Assumindo que é HTML ou texto simples.
  topic: string
  createdAt: string
  updatedAt: string
  author: string
  imageUrl?: string
  hidden?: boolean
  views: number,
  likes: number
  // likes: number
  // comments: number
  // isPublished: boolean
}
