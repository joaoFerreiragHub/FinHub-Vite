export interface Playlist {
  id: string
  name: string
  topic?: string
  videos: PlaylistVideo[]
  isPublic: boolean
  isMain?: boolean
}

export interface PlaylistVideo {
  id: string
  url: string
  order: number
}
