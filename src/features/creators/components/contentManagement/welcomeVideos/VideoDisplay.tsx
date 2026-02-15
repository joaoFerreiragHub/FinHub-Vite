// src/features/creators/components/welcomeVideos/VideoDisplay.tsx
interface Props {
  videoLink: string
}

export default function VideoDisplay({ videoLink }: Props) {
  const getEmbedUrl = (url: string): string | null => {
    const ytRegex =
      /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/
    const match = url.match(ytRegex)

    if (match && match[1]) {
      return `https://www.youtube.com/embed/${match[1]}`
    }

    // Futuro: suporta outros formatos (ex: Vimeo, Wistia, etc.)
    return null
  }

  const embedUrl = getEmbedUrl(videoLink)

  if (!embedUrl) {
    return (
      <div className="p-4 border rounded text-sm text-red-500 bg-red-50">
        Link inválido. Por favor, insere um link válido do YouTube.
      </div>
    )
  }

  return (
    <div className="w-full aspect-video rounded overflow-hidden border shadow-sm">
      <iframe
        src={embedUrl}
        title="Vídeo de apresentação"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        className="w-full h-full"
      />
    </div>
  )
}
