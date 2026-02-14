// src/types/podcastEpisode.ts

export interface PodcastEpisode {
  id: string
  podcastId: string
  title: string
  description?: string
  link: string
  createdAt?: string
  updatedAt?: string
  hidden?: boolean // ← novo campo para permitir ocultar episódios
}
