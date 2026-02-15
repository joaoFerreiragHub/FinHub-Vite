/**
 * Podcasts Feature Module
 */

// Types
export * from './types'

// Service
export { podcastService } from './services/podcastService'

// Hooks
export * from './hooks/usePodcasts'

// Schema
export {
  podcastFormSchema,
  episodeFormSchema,
  type PodcastFormValues,
  type EpisodeFormValues,
} from './schemas/podcastFormSchema'

// Pages
export { PodcastListPage, PodcastDetailPage } from './pages'
