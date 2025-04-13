import { Playlist, Announcement, Article, Event, CourseWithRatings } from './content'
import { CreatorFile } from './creatorFile'

export interface SocialMediaLink {
  platform: string
  url: string
}

export interface CreatorContent {
  contentId: string
  type: 'video' | 'article' | 'image' | 'course'
  timestamp: string
}

export interface CreatorEngagement {
  enrolledCourses?: { courseId: string; timestamp: string }[]
  likedCourses?: { courseId: string; timestamp: string }[]
}

// Modelo base
export interface Creator {
  _id: string
  username: string
  email: string
  firstname: string
  lastname: string
  password?: string
  profilePictureUrl?: string
  profilePictureKey?: string
  role: string
  city?: string
  isPremium: boolean
  topics: string[]
  dateOfBirth?: string
  termsAccepted: boolean

  bio?: string
  typeOfContent?: string
  contentCategories?: string[]
  website?: string
  publicationFrequency?: 'Diário' | 'Semanal' | 'Mensal' | 'Ocasional'

  termsOfServiceAgreement: boolean
  contentLicenseAgreement: boolean
  paymentTermsAgreement: boolean

  contentVisibility?: {
    announcements?: boolean
    courses?: boolean
    articles?: boolean
    events?: boolean
    files?: boolean
    playlists?: {
      regular?: boolean
      shorts?: boolean
      podcast?: boolean
    }
    welcomeVideo?: boolean
  }

  socialMediaLinks: SocialMediaLink[]
  followers: { userId: string }[]
  famous: ('Youtube' | 'Spotify' | 'Instagram' | 'Facebook' | 'Tiktok' | 'Twitter' | 'other')[]
  content: CreatorContent[]
  courseInteractions?: CreatorEngagement

  // Relacionamentos como IDs
  welcomeVideo?: string[]
  playlists?: { playlistId: string; timestamp: string }[]
  courses?: {
    coursesId: string
    courseName: string
    bannerImage: string
    purchaseLink: string
    timestamp: string
  }[]
  articles?: { articleId: string; timestamp: string }[]
  events?: { eventId: string; timestamp: string }[]
  files?: { fileId: string; timestamp: string }[]
  announcements?: { announcementsId: string; timestamp: string }[]

  averageRating?: number
  createdAt?: string
  updatedAt?: string
}

// Criador expandido (para página pública)
export interface CreatorFull extends Creator {
  // Dados resolvidos (apenas na página pública, por exemplo)
  fullPlaylists?: Playlist[]
  announcementsResolved?: Announcement[]
  articlesResolved?: Article[]
  eventsResolved?: Event[]
  documentsResolved?: CreatorFile[]
  coursesResolved?: CourseWithRatings[]

  // Se quiseres, também podes manter o contentVisibility aqui como override
  contentVisibility?: {
    playlists?: { regular?: boolean; featured?: boolean }
    announcements?: boolean
    courses?: boolean
    files?: boolean
    articles?: boolean
    events?: boolean
  }
}
