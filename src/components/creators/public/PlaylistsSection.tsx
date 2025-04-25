import React from 'react'
import useEmblaCarousel from 'embla-carousel-react'
import { CreatorFull } from '../../../types/creator'
import { PlaylistResolved } from '../../../types/content'



interface PlaylistsSectionProps {
  playlists: PlaylistResolved[]
  contentVisibility?: CreatorFull['contentVisibility']
  creatorData: CreatorFull
  getEmbedUrl: (videoId: string, type: string) => string
}

const Carousel: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [emblaRef] = useEmblaCarousel({ loop: true, align: 'center' })

  return (
    <div className="overflow-hidden" ref={emblaRef}>
      <div className="flex gap-4 px-2">{children}</div>
    </div>
  )
}

const PlaylistsSection: React.FC<PlaylistsSectionProps> = ({
  playlists,
  contentVisibility = {},
  creatorData,
  getEmbedUrl,
}) => {
  const mainPlaylist = creatorData.mainPlaylist

  const isMainPlaylistRegularAndSelected =
    mainPlaylist?.type === 'regular' && mainPlaylist?.isSelected

  const filteredPlaylists = playlists.filter((playlist) => {
    const isVisible = contentVisibility?.playlists?.[playlist.type] ?? true
    const isNotMainRegular =
      !(isMainPlaylistRegularAndSelected && playlist.type === 'regular')
    return playlist.isSelected && isVisible && isNotMainRegular
  })

  if (filteredPlaylists.length === 0) return null

  return (
    <>
          {filteredPlaylists.map((playlist, index) => (
            <section
              key={playlist.id || index}
              className="mb-10 space-y-4 playlist-section"
            >
              <h2 className="text-xl font-semibold playlist-title">
                {playlist.title}
              </h2>
              <Carousel>
              {playlist.videos?.map((video, videoIndex) => {
      const videoId =
        typeof video === 'string' ? video : (video.videoId as string)

      return (
        <div
          key={videoId}
          className="min-w-[300px] max-w-[500px] flex-shrink-0"
        >
          <iframe
            title={`video-${videoIndex}`}
            width="100%"
            height="300px"
            src={getEmbedUrl(videoId, playlist.type)}
            allowFullScreen
            className="rounded-xl shadow-md w-full h-[300px] video-iframe"
          />
        </div>
      )
    })}
          </Carousel>
        </section>
      ))}
    </>
  )
}

export default PlaylistsSection
