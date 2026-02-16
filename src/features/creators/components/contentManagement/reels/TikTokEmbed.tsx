import { useEffect, useRef } from 'react'

export default function TikTokEmbed({ url }: { url: string }) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const loadScript = () => {
      if (!window['tiktokEmbedScript']) {
        const script = document.createElement('script')
        script.src = 'https://www.tiktok.com/embed.js'
        script.async = true
        script.onload = () => {
          window['tiktokEmbedScript'] = true
          window?.tiktok?.widgets?.load(containerRef.current)
        }
        document.body.appendChild(script)
      } else {
        window?.tiktok?.widgets?.load(containerRef.current)
      }
    }

    loadScript()
  }, [url])

  return (
    <div className="relative w-full h-full overflow-hidden aspect-[9/16]" ref={containerRef}>
      <blockquote
        className="tiktok-embed absolute top-0 left-0 w-full h-full"
        cite={url}
        data-video-id={extractTikTokID(url)}
      >
        <a href={url}>Ver no TikTok</a>
      </blockquote>
    </div>
  )
}

function extractTikTokID(url: string): string | null {
  // Suporte para vários formatos de URL do TikTok
  const patterns = [/\/video\/(\d+)/, /tiktok\.com\/@[^/]+\/video\/(\d+)/]

  for (const pattern of patterns) {
    const match = url.match(pattern)
    if (match && match[1]) return match[1]
  }

  return null
}

// Declaração de tipos para o TypeScript
declare global {
  interface Window {
    tiktokEmbedScript?: boolean
    tiktok?: {
      widgets: {
        load: (element?: HTMLElement | null) => void
      }
    }
  }
}
