export type PublicSurfaceControlKey =
  | 'editorial_home'
  | 'editorial_verticals'
  | 'creator_page'
  | 'search'
  | 'derived_feeds'
  | 'comments_read'
  | 'comments_write'
  | 'reviews_read'
  | 'reviews_write'

export interface PublicSurfaceControlItem {
  key: PublicSurfaceControlKey
  enabled: boolean
  publicMessage: string | null
  reason: string | null
  updatedAt: string | null
}

export interface PublicSurfaceControlsResponse {
  generatedAt: string
  items: PublicSurfaceControlItem[]
}
