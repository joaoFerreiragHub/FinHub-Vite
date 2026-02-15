import { useKeenSlider } from 'keen-slider/react'
import 'keen-slider/keen-slider.min.css'
import { Playlist } from '@/features/hub/types/playlist'

interface PlaylistSliderProps {
  playlist: Playlist
}

export default function PlaylistSlider({ playlist }: PlaylistSliderProps) {
  const [sliderRef] = useKeenSlider<HTMLDivElement>({
    loop: true,
    slides: { perView: 1, spacing: 10 },
  })

  const getEmbedUrl = (url: string) => {
    // Aqui poderás adaptar se quiseres suportar YouTube/Spotify/etc
    if (url.includes('youtube.com') || url.includes('youtu.be')) {
      const videoId = url.split('v=')[1] || url.split('/').pop()
      return `https://www.youtube.com/embed/${videoId}`
    }
    if (url.includes('spotify.com')) {
      const segments = url.split('/')
      const id = segments[segments.length - 1]
      return `https://open.spotify.com/embed/episode/${id}`
    }
    return url // fallback
  }

  return (
    <div className="space-y-2">
      <h3 className="text-xl font-semibold">{playlist.name}</h3>
      <div ref={sliderRef} className="keen-slider">
        {playlist.videos.map((video) => (
          <div key={video.id} className="keen-slider__slide rounded overflow-hidden shadow-lg">
            <iframe
              title={video.id}
              src={getEmbedUrl(video.url)}
              className="w-full h-64"
              allow="autoplay; encrypted-media"
              allowFullScreen
            />
          </div>
        ))}
      </div>
    </div>
  )
}
