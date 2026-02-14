import { apiClient } from '@/lib/api/client'
import type {
  Course,
  CreateCourseDto,
  UpdateCourseDto,
  CourseModule,
  CreateModuleDto,
  Lesson,
  CreateLessonDto,
  CourseEnrollment,
  CourseProgress,
} from '../types'
import type { ContentListResponse, ContentFilters } from '../../types'

/**
 * Course Service
 */
export const courseService = {
  // ========== COURSES ==========

  /**
   * Buscar cursos (público)
   */
  getCourses: async (filters?: ContentFilters): Promise<ContentListResponse<Course>> => {
    const response = await apiClient.get<ContentListResponse<Course>>('/courses', {
      params: filters,
    })
    return response.data
  },

  /**
   * Buscar curso por slug (público)
   */
  getCourseBySlug: async (slug: string): Promise<Course> => {
    const response = await apiClient.get<Course>(`/courses/${slug}`)
    return response.data
  },

  /**
   * Criar curso (CREATOR/ADMIN)
   */
  createCourse: async (data: CreateCourseDto): Promise<Course> => {
    const response = await apiClient.post<Course>('/courses', data)
    return response.data
  },

  /**
   * Atualizar curso (CREATOR/ADMIN)
   */
  updateCourse: async (id: string, data: UpdateCourseDto): Promise<Course> => {
    const response = await apiClient.patch<Course>(`/courses/${id}`, data)
    return response.data
  },

  /**
   * Eliminar curso (CREATOR/ADMIN)
   */
  deleteCourse: async (id: string): Promise<void> => {
    await apiClient.delete(`/courses/${id}`)
  },

  /**
   * Publicar curso (CREATOR/ADMIN)
   */
  publishCourse: async (id: string): Promise<Course> => {
    const response = await apiClient.post<Course>(`/courses/${id}/publish`)
    return response.data
  },

  /**
   * Buscar cursos do creator atual (CREATOR/ADMIN)
   */
  getMyCourses: async (filters?: ContentFilters): Promise<ContentListResponse<Course>> => {
    const response = await apiClient.get<ContentListResponse<Course>>('/courses/me', {
      params: filters,
    })
    return response.data
  },

  // ========== MODULES ==========

  /**
   * Criar módulo
   */
  createModule: async (data: CreateModuleDto): Promise<CourseModule> => {
    const response = await apiClient.post<CourseModule>('/courses/modules', data)
    return response.data
  },

  /**
   * Atualizar módulo
   */
  updateModule: async (id: string, data: Partial<CreateModuleDto>): Promise<CourseModule> => {
    const response = await apiClient.patch<CourseModule>(`/courses/modules/${id}`, data)
    return response.data
  },

  /**
   * Eliminar módulo
   */
  deleteModule: async (id: string): Promise<void> => {
    await apiClient.delete(`/courses/modules/${id}`)
  },

  /**
   * Reordenar módulos
   */
  reorderModules: async (courseId: string, moduleIds: string[]): Promise<void> => {
    await apiClient.post(`/courses/${courseId}/modules/reorder`, { moduleIds })
  },

  // ========== LESSONS ==========

  /**
   * Criar aula
   */
  createLesson: async (data: CreateLessonDto): Promise<Lesson> => {
    const response = await apiClient.post<Lesson>('/courses/lessons', data)
    return response.data
  },

  /**
   * Atualizar aula
   */
  updateLesson: async (id: string, data: Partial<CreateLessonDto>): Promise<Lesson> => {
    const response = await apiClient.patch<Lesson>(`/courses/lessons/${id}`, data)
    return response.data
  },

  /**
   * Eliminar aula
   */
  deleteLesson: async (id: string): Promise<void> => {
    await apiClient.delete(`/courses/lessons/${id}`)
  },

  /**
   * Marcar aula como completa
   */
  completeLesson: async (lessonId: string): Promise<void> => {
    await apiClient.post(`/courses/lessons/${lessonId}/complete`)
  },

  // ========== ENROLLMENT ==========

  /**
   * Inscrever-se no curso
   */
  enrollCourse: async (courseId: string): Promise<CourseEnrollment> => {
    const response = await apiClient.post<CourseEnrollment>(`/courses/${courseId}/enroll`)
    return response.data
  },

  /**
   * Cancelar inscrição
   */
  unenrollCourse: async (courseId: string): Promise<void> => {
    await apiClient.post(`/courses/${courseId}/unenroll`)
  },

  /**
   * Buscar progresso do user
   */
  getCourseProgress: async (courseId: string): Promise<CourseProgress> => {
    const response = await apiClient.get<CourseProgress>(`/courses/${courseId}/progress`)
    return response.data
  },

  /**
   * Buscar cursos inscritos
   */
  getEnrolledCourses: async (): Promise<Course[]> => {
    const response = await apiClient.get<Course[]>('/courses/enrolled')
    return response.data
  },

  // ========== ACTIONS ==========

  /**
   * Increment view count
   */
  incrementView: async (id: string): Promise<void> => {
    await apiClient.post(`/courses/${id}/view`)
  },

  /**
   * Like/Unlike
   */
  toggleLike: async (id: string): Promise<{ liked: boolean; likeCount: number }> => {
    const response = await apiClient.post<{ liked: boolean; likeCount: number }>(
      `/courses/${id}/like`
    )
    return response.data
  },

  /**
   * Favorite/Unfavorite
   */
  toggleFavorite: async (id: string): Promise<{ favorited: boolean; favoriteCount: number }> => {
    const response = await apiClient.post<{ favorited: boolean; favoriteCount: number }>(
      `/courses/${id}/favorite`
    )
    return response.data
  },
}
