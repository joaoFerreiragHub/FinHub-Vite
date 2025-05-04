// MiniPlaylistSlider.tsx

import { PlaylistVideo } from "../../../../types/playlist"


interface MiniPlaylistSliderProps {
  videos: PlaylistVideo[]
}

export default function MiniPlaylistSlider({ videos }: MiniPlaylistSliderProps) {
  if (videos.length === 0) {
    return <p className="text-sm text-muted-foreground">Sem vídeos</p>
  }

  return (
    <div className="flex overflow-x-auto gap-4 py-2">
      {videos.map((video) => (
        <div
          key={video.id}
          className="min-w-[200px] aspect-video bg-muted rounded overflow-hidden shadow-sm"
        >
          <iframe
            src={getEmbedUrl(video.url)}
            className="w-full h-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      ))}
    </div>
  )
}

function getEmbedUrl(url: string): string {
  const youtubeMatch = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/))([\w-]{11})/)
  if (youtubeMatch) {
    return `https://www.youtube.com/embed/${youtubeMatch[1]}`
  }

  const spotifyMatch = url.match(/spotify\.com\/episode\/([a-zA-Z0-9]+)/)
  if (spotifyMatch) {
    return `https://open.spotify.com/embed/episode/${spotifyMatch[1]}`
  }

  return url // fallback
}
