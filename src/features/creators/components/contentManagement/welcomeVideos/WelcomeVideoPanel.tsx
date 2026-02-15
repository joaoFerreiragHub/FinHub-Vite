import { Switch } from '@/components/ui'
import useWelcomeVideo from './hooks/useWelcomeVideo'
import UserVideosDisplay from './UserVideosDisplay'
import VideoDisplay from './VideoDisplay'
import VideoLinkForm from './welcomeForms/VideoLinkForm'

interface Props {
  title: string
  videoType: 'creatorCard' | 'creatorPage'
}

export default function WelcomeVideoPanel({ title, videoType }: Props) {
  const {
    currentVideo,
    userVideos,
    welcomeVideoVisible,
    toggleVideoVisibility,
    fetchUserVideos,
    setVideoLink,
  } = useWelcomeVideo(videoType)

  return (
    <div className="space-y-4 p-6 border rounded-2xl shadow-md bg-card w-full">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-semibold">{title}</h3>
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Mostrar vídeo</span>
          <Switch checked={welcomeVideoVisible} onCheckedChange={toggleVideoVisibility} />
        </div>
      </div>

      {/* Video selecionado no topo */}
      {currentVideo ? (
        <div className="rounded-lg overflow-hidden border">
          <VideoDisplay videoLink={currentVideo.videoLink} />
        </div>
      ) : (
        <p className="text-muted-foreground">Nenhum vídeo selecionado.</p>
      )}

      <VideoLinkForm
        onSubmit={({ videoLink }) => setVideoLink(videoLink)}
        fetchUserVideos={fetchUserVideos}
        videoType={videoType}
      />

      <UserVideosDisplay
        videos={userVideos}
        onReorder={(newOrder) => console.log('reordenado', newOrder)}
        onDelete={(id) => console.log('apagar', id)}
        onSelect={(id) => console.log('selecionar', id)}
      />
    </div>
  )
}
