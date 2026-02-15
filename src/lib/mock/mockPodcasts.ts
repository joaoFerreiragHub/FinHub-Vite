import type { Podcast } from '@/features/hub/podcasts/types'
import { ContentType, ContentCategory, PublishStatus } from '@/features/hub/types'

export const mockPodcasts: Podcast[] = [
  {
    id: 'podcast-1',
    type: ContentType.PODCAST,
    slug: 'investir-sem-medo',
    title: 'Investir Sem Medo',
    description:
      'Conversas semanais sobre financas pessoais, investimentos e liberdade financeira. Cada episodio traz dicas praticas e entrevistas com especialistas.',
    excerpt: 'O teu podcast de financas pessoais e investimentos',
    coverImage: 'https://images.unsplash.com/photo-1590602847861-f357a9332bbc?w=800',

    creator: { id: 'creator-1', name: 'Pedro Santos', username: 'pedro-santos' },
    creatorId: 'creator-1',

    category: ContentCategory.PERSONAL_FINANCE,
    tags: ['financas', 'investimento', 'liberdade-financeira', 'ETFs'],

    viewCount: 1250,
    likeCount: 89,
    favoriteCount: 56,
    shareCount: 34,
    averageRating: 4.8,
    ratingCount: 42,
    reviewCount: 42,
    commentCount: 18,
    commentsEnabled: true,

    requiredRole: 'visitor',
    isPremium: false,
    isFeatured: true,

    status: PublishStatus.PUBLISHED,
    isPublished: true,
    publishedAt: '2025-01-15T10:00:00Z',
    createdAt: '2025-01-10T14:00:00Z',
    updatedAt: '2026-02-10T10:00:00Z',

    frequency: 'weekly',
    rssFeedUrl: 'https://feed.example.com/investir-sem-medo',
    spotifyUrl: 'https://open.spotify.com/show/example1',
    applePodcastsUrl: 'https://podcasts.apple.com/example1',
    subscriberCount: 324,
    totalEpisodes: 2,
    totalDuration: 75,

    episodes: [
      {
        id: 'ep-1',
        podcastId: 'podcast-1',
        title: 'Como comecar a investir com pouco dinheiro',
        description:
          'Dicas praticas para quem esta a comecar a investir. Falamos de ETFs, roboadvisors e estrategias de poupanca.',
        order: 1,
        audioUrl: 'https://example.com/audio/ep1.mp3',
        duration: 2400,
        publishedAt: '2026-01-20T10:00:00Z',
        isPublished: true,
        showNotes:
          'Neste episodio abordamos: 1) Quanto dinheiro precisas para comecar 2) Melhores plataformas 3) ETFs recomendados para iniciantes',
      },
      {
        id: 'ep-2',
        podcastId: 'podcast-1',
        title: 'Erros comuns ao investir (e como evita-los)',
        description:
          'Os 10 erros mais comuns que os investidores iniciantes cometem e estrategias para os evitar.',
        order: 2,
        audioUrl: 'https://example.com/audio/ep2.mp3',
        duration: 2100,
        publishedAt: '2026-01-27T10:00:00Z',
        isPublished: true,
        transcript: 'Ola a todos, bem-vindos a mais um episodio do Investir Sem Medo...',
      },
    ],
  },
  {
    id: 'podcast-2',
    type: ContentType.PODCAST,
    slug: 'crypto-talks',
    title: 'Crypto Talks',
    description:
      'O podcast sobre criptomoedas, blockchain e DeFi. Analises semanais do mercado e entrevistas com especialistas.',
    excerpt: 'Tudo sobre criptomoedas e blockchain',
    coverImage: 'https://images.unsplash.com/photo-1621761191319-c6fb62004040?w=800',

    creator: { id: 'creator-2', name: 'Ana Costa', username: 'ana-costa' },
    creatorId: 'creator-2',

    category: ContentCategory.CRYPTO,
    tags: ['crypto', 'bitcoin', 'blockchain', 'DeFi'],

    viewCount: 890,
    likeCount: 67,
    favoriteCount: 38,
    shareCount: 22,
    averageRating: 4.5,
    ratingCount: 28,
    reviewCount: 28,
    commentCount: 12,
    commentsEnabled: true,

    requiredRole: 'free',
    isPremium: false,
    isFeatured: false,

    status: PublishStatus.PUBLISHED,
    isPublished: true,
    publishedAt: '2025-03-01T09:00:00Z',
    createdAt: '2025-02-15T11:00:00Z',
    updatedAt: '2026-02-05T09:00:00Z',

    frequency: 'biweekly',
    spotifyUrl: 'https://open.spotify.com/show/example2',
    subscriberCount: 189,
    totalEpisodes: 1,
    totalDuration: 55,

    episodes: [
      {
        id: 'ep-3',
        podcastId: 'podcast-2',
        title: 'Bitcoin em 2026: O que esperar?',
        description: 'Analise completa do mercado crypto e previsoes para 2026.',
        order: 1,
        audioUrl: 'https://example.com/audio/ep3.mp3',
        duration: 3300,
        publishedAt: '2026-02-01T09:00:00Z',
        isPublished: true,
        showNotes: 'Temas abordados: halving, ETFs de Bitcoin, regulacao europeia, DeFi trends.',
      },
    ],
  },
]
