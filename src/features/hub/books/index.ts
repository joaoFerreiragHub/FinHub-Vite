/**
 * Books Feature Module
 */

// Types
export * from './types'

// Service
export { bookService } from './services/bookService'

// Hooks
export * from './hooks/useBooks'

// Schema
export { bookFormSchema, type BookFormValues } from './schemas/bookFormSchema'

// Pages
export { BookListPage, BookDetailPage } from './pages'
