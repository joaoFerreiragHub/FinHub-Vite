export interface Article {
  id: string
  title: string
  content: string // Assumindo que é HTML ou texto simples.
  topic: string
  createdAt: string
  updatedAt: string
  author: string
  imageUrl?: string
  // likes: number
  // comments: number
  // isPublished: boolean
}
