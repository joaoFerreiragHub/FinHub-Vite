// components/noticias/index.ts

// Exportar todos os componentes de notícias
export { NewsCard } from './NewsCard'
export { NewsGrid } from './NewsGrid'
export { NewsHeader } from './NewsHeader'
export { NewsStats } from './NewsStats'

// Exportar dados mock
export { mockNews } from './api/mockNews'

// Re-exportar tipos relacionados
export type { NewsArticle, NewsFilters, NewsSource } from '../../types/news'
