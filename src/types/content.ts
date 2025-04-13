// src/types/content.ts

export interface Playlist {
  id: string
  title: string
  description?: string
  videos?: string[] // ou estrutura mais completa no futuro
  createdAt: string
  updatedAt?: string
}

export interface Announcement {
  id: string
  title: string
  body: string
  publishedAt: string
}

export interface Article {
  id: string
  title: string
  content: string
  publishedAt: string
  tags?: string[]
}

export interface Event {
  id: string
  title: string
  date: string
  location?: string
  description?: string
}

export interface CourseWithRatings {
  id: string
  title: string
  description: string
  bannerImage: string
  rating: number
  purchaseLink?: string
  createdAt?: string
}
