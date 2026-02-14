// Legacy content types and utilities
// @deprecated - Migrar para usar types das features individuais

import { Creator, PlaylistVideo } from "@/features/creators/types/creator"

export interface Playlist {
  _id: string
  playlistName: string
  videoLinks: string[]
  isSelected: boolean
  creator: string
  contents: string[]
  viewsCount: number
  type: 'regular' | 'shorts' | 'podcast'
  topic: string
  createdAt?: string
  updatedAt?: string
videos?: string[]
}
export interface PlaylistResolved {
  id: string
  title: string
  description?: string
  videos?: (string | PlaylistVideo)[]
  createdAt: string
  updatedAt?: string
  isSelected: boolean
  type: 'regular' | 'shorts' | 'podcast'
  topic:
    | 'ETFs'
    | 'Ações'
    | 'REITs'
    | 'Cripto Moedas'
    | 'Finanças Pessoais'
    | 'Poupança'
    | 'Imobiliário'
    | 'Obrigações'
    | 'Fundos mútuos'
    | 'Empreendedorismo'
    | 'Futuros e Opções'
    | 'Trading'
  viewsCount: number
  creator: {
    id: string
    username: string
    profilePictureUrl?: string
    isPremium: boolean
  }
}
export function resolvePlaylists(
  playlists: Playlist[],
  creator: Creator
): PlaylistResolved[] {
  return playlists.map((playlist) => ({
    id: playlist._id,
    title: playlist.playlistName,
    description: '', // ou algum outro campo que queiras usar
    videos: playlist.videoLinks,
    createdAt: playlist.createdAt ?? '',
    updatedAt: playlist.updatedAt,
    isSelected: playlist.isSelected,
    type: playlist.type,
    topic: playlist.topic as PlaylistResolved['topic'], // cast para garantir tipo
    viewsCount: playlist.viewsCount,
    creator: {
      id: creator._id,
      username: creator.username,
      profilePictureUrl: creator.profilePictureUrl,
      isPremium: creator.isPremium,
    },
  }))
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
export interface ArticleWithRatings extends Article {
  averageRating: number
  bannerImage?: string
}

type MaybeRatedArticle = Article & {
  averageRating?: number
  bannerImage?: string
}
export function resolveArticles(articles: Article[]): ArticleWithRatings[] {
  return articles.map((article) => {
    const a = article as MaybeRatedArticle
    return {
      ...article,
      averageRating: a.averageRating ?? 0,
      bannerImage: a.bannerImage ?? '/assets/serriquinho.jpg',
    }
  })
}


export interface Event {
  id: string
  name: string // ← muda de title para name, ou adiciona os dois se precisares
  date: string
  location?: string
  description?: string
  bannerImage?: string // ← se também usas isto
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
