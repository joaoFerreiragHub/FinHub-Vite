// src/mock/mockPodcasts.ts
import { Podcast } from "../types/podcast"

export const mockPodcasts: Podcast[] = [
  {
    id: "1",
    title: "Investir Sem Medo",
    description: "Conversas semanais sobre finanças pessoais, investimentos e liberdade financeira.",
    imageUrl: "https://source.unsplash.com/random/400x300?finance",
    author: "Pedro Santos",
    createdAt: "2024-01-01T10:00:00Z",
    updatedAt: "2024-04-10T15:00:00Z",
    hidden: false,
    episodes: [
      {
        id: "ep1",
        podcastId: "1",
        title: "Como começar a investir com pouco dinheiro",
        description: "Dicas práticas para quem está a começar.",
        link: "https://open.spotify.com/episode/ep1"
      },
      {
        id: "ep2",
        podcastId: "1",
        title: "Erros comuns ao investir",
        description: "Evita estes erros clássicos.",
        link: "https://open.spotify.com/episode/ep2"
      }
    ]
  },
  {
    id: "2",
    title: "Saúde e Bem-Estar",
    description: "O teu podcast de saúde física e mental.",
    imageUrl: "https://source.unsplash.com/random/400x300?health",
    author: "Dra. Ana Costa",
    createdAt: "2024-02-15T14:00:00Z",
    updatedAt: "2024-04-05T09:00:00Z",
    hidden: true,
    episodes: []
  }
]
