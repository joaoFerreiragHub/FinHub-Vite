export type SupportedVideoProvider = 'youtube' | 'vimeo'

export interface VideoEmbedPreview {
  provider: SupportedVideoProvider
  embedUrl: string
  youtubeVideoId?: string
  youtubeThumbnailUrl?: string
}

const parseUrl = (input: string): URL | null => {
  try {
    return new URL(input.trim())
  } catch {
    return null
  }
}

const normalizeHost = (url: URL): string => url.hostname.replace(/^www\./, '').toLowerCase()

export const extractYouTubeVideoId = (input: string): string | null => {
  const url = parseUrl(input)
  if (!url) return null

  const host = normalizeHost(url)

  if (host === 'youtu.be') {
    const videoId = url.pathname.split('/').filter(Boolean)[0]
    return videoId || null
  }

  if (host === 'youtube.com' || host === 'm.youtube.com') {
    if (url.pathname === '/watch') {
      const videoId = url.searchParams.get('v')
      return videoId || null
    }

    if (url.pathname.startsWith('/shorts/')) {
      const videoId = url.pathname.replace('/shorts/', '').split('/')[0]
      return videoId || null
    }

    if (url.pathname.startsWith('/embed/')) {
      const videoId = url.pathname.replace('/embed/', '').split('/')[0]
      return videoId || null
    }
  }

  return null
}

export const getYouTubeEmbedUrl = (input: string): string | null => {
  const videoId = extractYouTubeVideoId(input)
  return videoId ? `https://www.youtube.com/embed/${videoId}` : null
}

export const extractVimeoVideoId = (input: string): string | null => {
  const url = parseUrl(input)
  if (!url) return null

  const host = normalizeHost(url)
  if (host !== 'vimeo.com' && host !== 'player.vimeo.com') {
    return null
  }

  const segments = url.pathname.split('/').filter(Boolean)
  const lastNumeric = [...segments].reverse().find((segment) => /^\d+$/.test(segment))
  return lastNumeric || null
}

export const getVimeoEmbedUrl = (input: string): string | null => {
  const videoId = extractVimeoVideoId(input)
  return videoId ? `https://player.vimeo.com/video/${videoId}` : null
}

export const resolveVideoEmbedPreview = (input: string): VideoEmbedPreview | null => {
  const youtubeEmbedUrl = getYouTubeEmbedUrl(input)
  if (youtubeEmbedUrl) {
    const youtubeVideoId = extractYouTubeVideoId(input) || undefined
    return {
      provider: 'youtube',
      embedUrl: youtubeEmbedUrl,
      youtubeVideoId,
      youtubeThumbnailUrl: youtubeVideoId
        ? `https://img.youtube.com/vi/${youtubeVideoId}/maxresdefault.jpg`
        : undefined,
    }
  }

  const vimeoEmbedUrl = getVimeoEmbedUrl(input)
  if (vimeoEmbedUrl) {
    return {
      provider: 'vimeo',
      embedUrl: vimeoEmbedUrl,
    }
  }

  return null
}

export const isSupportedVideoUrl = (input: string): boolean =>
  Boolean(resolveVideoEmbedPreview(input))
