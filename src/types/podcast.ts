// src/types/podcast.ts
import { PodcastEpisode } from "./podcastEpisode"

export interface Podcast {
  id: string
  title: string
  description?: string
  imageUrl?: string
  author?: string            // ← adicionar
  episodes?: PodcastEpisode[] // ← adicionar
  createdAt?: string
  updatedAt?: string
  hidden?: boolean
}
