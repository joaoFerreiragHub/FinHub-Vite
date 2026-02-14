import { VideoData } from "../types/video"

export const mockWelcomeVideos: VideoData[] = [
  {
    id: "vid-1",
    title: "Bem-vindo à Página Pública",
    description: "Este vídeo apresenta-te ao que faço.",
    videoLink: "https://www.youtube.com/watch?v=IKWaP4CPaD8",
    videoType: "creatorPage",
    isSelected: true,
  },
  {
    id: "vid-2",
    title: "Apresentação no Cartão",
    description: "Uma introdução rápida sobre mim e os conteúdos que produzo.",
    videoLink: "https://www.youtube.com/watch?v=hxrb0ZqlCvk",
    videoType: "creatorCard",
    isSelected: true,
  },
  {
    id: "vid-3",
    title: "Apresentação CNBC",
    description: "Cobertura financeira do dia.",
    videoLink: "https://www.youtube.com/watch?v=1LWBphTImy4",
    videoType: "creatorCard",
    isSelected: false,
  },
  {
    id: "vid-4",
    title: "Gameplay Asmongold",
    description: "Gameplay e reações da comunidade.",
    videoLink: "https://www.youtube.com/watch?v=5HRbcOIM340",
    videoType: "creatorPage",
    isSelected: false,
  },
]
