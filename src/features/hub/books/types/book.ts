export interface Book {
  _id: string
  title: string
  author: string
  coverImage: string
  summary?: string
  keyPhrases?: string[]
  genres?: string[]
  averageRating?: number
  createdAt?: string
  updatedAt?: string
  ratings: Rating[]
  reviews: Review[]
}

export interface Rating {
  userId: {
    _id: string
  }
  rating: number
  review?: string
}

export interface Review {
  userId: {
    _id: string
    name?: string // ou username?
  }
  review: string
  createdAt?: string
}
