import type { Book } from '@/features/hub/books/types'
import { ContentType, ContentCategory, PublishStatus } from '@/features/hub/types'

export const mockBooks: Book[] = [
  {
    id: 'book-1',
    type: ContentType.BOOK,
    slug: 'o-homem-mais-rico-da-babilonia',
    title: 'O Homem Mais Rico da Babilonia',
    description:
      'Principios financeiros antigos que continuam a guiar milhoes de pessoas para a independencia financeira. Atraves de parabolas ambientadas na antiga Babilonia, George S. Clason ensina licoes atemporais sobre poupanca, investimento e gestao financeira.',
    excerpt: 'Principios atemporais de riqueza e poupanca',
    coverImage: 'https://m.media-amazon.com/images/I/81TR4j3QWDL._AC_UF1000,1000_QL80_.jpg',

    creator: { id: 'creator-1', name: 'Pedro Santos', username: 'pedro-santos' },
    creatorId: 'creator-1',

    category: ContentCategory.PERSONAL_FINANCE,
    tags: ['financas', 'poupanca', 'classico', 'iniciantes'],

    viewCount: 450,
    likeCount: 78,
    favoriteCount: 52,
    shareCount: 23,
    averageRating: 4.6,
    ratingCount: 34,
    reviewCount: 34,
    commentCount: 8,
    commentsEnabled: true,

    requiredRole: 'visitor',
    isPremium: false,
    isFeatured: true,

    status: PublishStatus.PUBLISHED,
    isPublished: true,
    publishedAt: '2025-06-15T10:00:00Z',
    createdAt: '2025-06-10T14:00:00Z',
    updatedAt: '2026-01-10T10:00:00Z',

    author: 'George S. Clason',
    publisher: 'Presenca',
    publishYear: 1926,
    pages: 144,
    isbn: '978-9722340731',
    genres: ['Financas Pessoais', 'Desenvolvimento Pessoal'],
    keyPhrases: [
      'Uma parte de tudo o que ganhas e tua para guardar',
      'A riqueza cresce onde quer que homens de energia e iniciativa a procurem',
      'O ouro foge do homem que o investe em negocios que nao conhece',
    ],
    purchaseUrl: 'https://www.amazon.pt/dp/9722340735',
  },
  {
    id: 'book-2',
    type: ContentType.BOOK,
    slug: 'pai-rico-pai-pobre',
    title: 'Pai Rico, Pai Pobre',
    description:
      'Descobre o que os ricos ensinam aos filhos sobre dinheiro que os pobres e a classe media nao sabem. Robert Kiyosaki partilha a sua experiencia com dois pais: o seu pai biologico e o pai do seu melhor amigo.',
    excerpt: 'O que os ricos ensinam sobre dinheiro',
    coverImage: 'https://m.media-amazon.com/images/I/81bsw6fnUiL._AC_UF1000,1000_QL80_.jpg',

    creator: { id: 'creator-1', name: 'Pedro Santos', username: 'pedro-santos' },
    creatorId: 'creator-1',

    category: ContentCategory.PERSONAL_FINANCE,
    tags: ['educacao-financeira', 'investimento', 'mindset'],

    viewCount: 680,
    likeCount: 92,
    favoriteCount: 61,
    shareCount: 35,
    averageRating: 4.2,
    ratingCount: 45,
    reviewCount: 45,
    commentCount: 15,
    commentsEnabled: true,

    requiredRole: 'visitor',
    isPremium: false,
    isFeatured: true,

    status: PublishStatus.PUBLISHED,
    isPublished: true,
    publishedAt: '2025-07-01T10:00:00Z',
    createdAt: '2025-06-25T11:00:00Z',
    updatedAt: '2026-01-05T09:00:00Z',

    author: 'Robert T. Kiyosaki',
    publisher: 'Objetiva',
    publishYear: 1997,
    pages: 336,
    isbn: '978-9724622491',
    genres: ['Financas', 'Educacao Financeira'],
    keyPhrases: [
      'Os ricos nao trabalham por dinheiro, fazem o dinheiro trabalhar para eles',
      'Ativos poem dinheiro no teu bolso, passivos tiram dinheiro do teu bolso',
    ],
    purchaseUrl: 'https://www.amazon.pt/dp/9724622495',
  },
  {
    id: 'book-3',
    type: ContentType.BOOK,
    slug: 'liberdade-financeira',
    title: 'Liberdade Financeira',
    description:
      'Estrategias praticas para alcancar a independencia financeira baseadas em entrevistas com os maiores especialistas financeiros do mundo.',
    excerpt: 'Guia completo para a independencia financeira',
    coverImage: 'https://m.media-amazon.com/images/I/81xU2oc4HXL._AC_UF1000,1000_QL80_.jpg',

    creator: { id: 'creator-2', name: 'Ana Costa', username: 'ana-costa' },
    creatorId: 'creator-2',

    category: ContentCategory.ADVANCED,
    tags: ['investimento', 'liberdade-financeira', 'estrategia'],

    viewCount: 320,
    likeCount: 55,
    favoriteCount: 38,
    shareCount: 18,
    averageRating: 4.8,
    ratingCount: 22,
    reviewCount: 22,
    commentCount: 6,
    commentsEnabled: true,

    requiredRole: 'free',
    isPremium: false,
    isFeatured: false,

    status: PublishStatus.PUBLISHED,
    isPublished: true,
    publishedAt: '2025-08-10T10:00:00Z',
    createdAt: '2025-08-05T14:00:00Z',
    updatedAt: '2026-01-20T12:00:00Z',

    author: 'Tony Robbins',
    publisher: 'Lua de Papel',
    publishYear: 2014,
    pages: 688,
    genres: ['Investimento', 'Financas'],
    keyPhrases: [
      'A diversificacao e a unica estrategia gratuita no mundo dos investimentos',
      'Nao se trata de quanto ganhas, mas de quanto guardas',
    ],
    purchaseUrl: 'https://www.amazon.pt/dp/9892330185',
  },
]
