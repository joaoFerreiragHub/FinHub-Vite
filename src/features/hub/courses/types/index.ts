import { BaseContent, ContentType, ContentCategory } from '../../types'
import { User } from '@/features/auth/types'

/**
 * Course - Curso educativo com módulos e aulas
 */
export interface Course extends BaseContent {
  type: ContentType.COURSE

  // Estrutura do curso
  modules: CourseModule[]
  totalModules: number
  totalLessons: number
  totalDuration: number // minutos

  // Pricing
  price: number // 0 = gratuito
  currency: string // 'EUR'
  discountPrice?: number
  isPaid: boolean

  // Enrollment
  enrolledCount: number
  maxEnrollments?: number
  isEnrolled?: boolean // Se user atual está inscrito

  // Links
  purchaseLink?: string
  certificateTemplate?: string

  // Metadata
  level: 'beginner' | 'intermediate' | 'advanced'
  language: string
  prerequisites?: string[]
  learningOutcomes?: string[]

  // Instructor
  instructor: User | string
  instructorId: string
}

/**
 * Módulo do curso
 */
export interface CourseModule {
  id: string
  courseId: string
  title: string
  description?: string
  order: number
  lessons: Lesson[]
  duration: number // minutos
  isLocked: boolean // Se requer módulos anteriores
}

/**
 * Aula dentro de um módulo
 */
export interface Lesson {
  id: string
  moduleId: string
  title: string
  description?: string
  order: number
  type: 'video' | 'article' | 'quiz' | 'assignment'
  content?: string // HTML/Markdown
  videoUrl?: string
  duration?: number // minutos
  resources?: LessonResource[]
  isCompleted?: boolean // Se user completou
  isFree?: boolean // Pode ser preview gratuito
}

/**
 * Recurso anexo à aula
 */
export interface LessonResource {
  id: string
  name: string
  type: 'pdf' | 'video' | 'link' | 'file'
  url: string
  size?: number // bytes
}

/**
 * Progresso do utilizador no curso
 */
export interface CourseProgress {
  userId: string
  courseId: string
  enrolledAt: string
  lastAccessedAt: string
  completedLessons: string[] // IDs
  currentModuleId?: string
  currentLessonId?: string
  progressPercentage: number // 0-100
  completedAt?: string
  certificateIssued: boolean
}

/**
 * Enrollment (inscrição)
 */
export interface CourseEnrollment {
  id: string
  userId: string
  courseId: string
  enrolledAt: string
  expiresAt?: string
  status: 'active' | 'completed' | 'expired' | 'cancelled'
  progress: CourseProgress
}

/**
 * Dados para criar Course
 */
export interface CreateCourseDto {
  title: string
  description: string
  excerpt?: string
  coverImage?: string
  category: ContentCategory
  tags?: string[]
  price: number
  currency?: string
  discountPrice?: number
  level: 'beginner' | 'intermediate' | 'advanced'
  requiredRole?: 'visitor' | 'free' | 'premium'
  isPremium?: boolean
  status?: 'draft' | 'published'
  language?: string
  prerequisites?: string[]
  learningOutcomes?: string[]
}

/**
 * Dados para atualizar Course
 */
export interface UpdateCourseDto {
  title?: string
  description?: string
  excerpt?: string
  coverImage?: string
  category?: ContentCategory
  tags?: string[]
  price?: number
  discountPrice?: number
  level?: 'beginner' | 'intermediate' | 'advanced'
  requiredRole?: 'visitor' | 'free' | 'premium'
  isPremium?: boolean
  status?: 'draft' | 'published'
  commentsEnabled?: boolean
  isFeatured?: boolean
  maxEnrollments?: number
}

/**
 * Dados para criar Module
 */
export interface CreateModuleDto {
  courseId: string
  title: string
  description?: string
  order: number
}

/**
 * Dados para criar Lesson
 */
export interface CreateLessonDto {
  moduleId: string
  title: string
  description?: string
  type: 'video' | 'article' | 'quiz' | 'assignment'
  content?: string
  videoUrl?: string
  duration?: number
  isFree?: boolean
  order: number
}
