// src/mocks/mockReels.ts

export interface ReelType {
  id: string
  title: string
  platform: "youtube" | "tiktok" | "instagram"
  url: string
  topic: string
  isVisible: boolean
  createdAt: string
}

export const mockReels: ReelType[] = [
  {
    id: "reel-1",
    title: "Como investir com pouco dinheiro",
    platform: "youtube",
    url: "https://www.youtube.com/shorts/0Ihah8IXtgg",
    topic: "Investimentos",
    isVisible: true,
    createdAt: "2024-12-01T12:00:00Z",
  },
  {
    id: "reel-2",
    title: "Dica rápida sobre ETFs",
    platform: "tiktok",
    url: "https://www.tiktok.com/@desventuras6/video/7492432754664082693?is_from_webapp=1&sender_device=pc",
    topic: "ETFs",
    isVisible: true,
    createdAt: "2024-12-02T08:30:00Z",
  },
  {
    id: "reel-3",
    title: "Erro comum ao poupar",
    platform: "youtube",
    url: "https://www.youtube.com/shorts/O46ueFoj7-o",
    topic: "Poupança",
    isVisible: true,
    createdAt: "2024-12-03T17:45:00Z",
  },
]
