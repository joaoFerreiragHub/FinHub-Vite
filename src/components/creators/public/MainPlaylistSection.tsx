import React from 'react'

import { useMediaQuery } from '../../../hooks/useMediaQuery'
import { PlaylistResolved } from '../../../types/content'


type Props = {
  playlists: PlaylistResolved[]
  getEmbedUrl: (id: string) => string
}

const MainPlaylistSection: React.FC<Props> = ({ playlists, getEmbedUrl }) => {
  const isMobile = useMediaQuery('(max-width: 768px)')

  const mainRegularPlaylist = playlists.find(
    (playlist) => playlist.isSelected && playlist.type === 'regular'
  )

  if (!mainRegularPlaylist) {
    return (
      <p className="text-center text-muted-foreground mt-4">
        Nenhuma playlist regular principal encontrada.
      </p>
    )
  }

  return (
    <section className="mt-8 space-y-6">
      <h2 className="text-2xl font-semibold text-primary">Playlist Principal</h2>

      {isMobile ? (
        <div className="space-y-4">
         {mainRegularPlaylist.videos?.map((video, index) => {
            const videoId = typeof video === 'string' ? video : video.videoId
            return (
              <div
                key={index}
                className="min-w-[30%] aspect-video rounded overflow-hidden shadow shrink-0"
              >
                <iframe
                  title={`Main Playlist Video ${index}`}
                  src={getEmbedUrl(videoId)}
                  className="w-full h-full"
                  allowFullScreen
                />
              </div>
            )
          })}
        </div>
      ) : (
        <div className="flex gap-4 overflow-x-auto pb-4">
          {mainRegularPlaylist.videos?.map((video, index) => {
            const videoId = typeof video === 'string' ? video : video.videoId

            return (
              <div
                key={index}
                className="min-w-[30%] aspect-video rounded overflow-hidden shadow shrink-0"
              >
                <iframe
                  title={`Main Playlist Video ${index}`}
                  src={getEmbedUrl(videoId)}
                  className="w-full h-full"
                  allowFullScreen
                />
              </div>
            )
          })}

        </div>
      )}
    </section>
  )
}

export default MainPlaylistSection
