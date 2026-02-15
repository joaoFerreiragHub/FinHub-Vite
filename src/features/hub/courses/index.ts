/**
 * Courses Feature Module
 */

export * from './types'
export { courseService } from './services/courseService'
export * from './hooks/useCourses'
export { courseFormSchema, type CourseFormValues } from './schemas/courseFormSchema'
export { CourseListPage, CourseDetailPage } from './pages'
