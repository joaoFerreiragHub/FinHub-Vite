import { useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import { HomepageLayout } from '@/components/home/HomepageLayout'
import { HeroBanner, type HeroBannerSlide } from '@/components/home/HeroBanner'
import { ContentRow } from '@/components/home/ContentRow'
import {
  ArticleCard,
  CourseCard,
  CreatorCardLarge,
  BookCardHome,
  ResourceCard,
} from '@/components/home/cards'
import { apiClient } from '@/lib/api/client'

type ContentListKey = 'articles' | 'courses' | 'books'

interface ApiCreatorSummary {
  _id?: string
  id?: string
  username?: string
  name?: string
  avatar?: string
  averageRating?: number
  isPremium?: boolean
}

interface ApiContentItem {
  _id?: string
  id?: string
  slug?: string
  title?: string
  category?: string
  coverImage?: string
  imageUrl?: string
  author?: string
  creator?: ApiCreatorSummary | string
  createdAt?: string
  views?: number
  likes?: number
  averageRating?: number
  ratingsCount?: number
  ratingCount?: number
  enrolledCount?: number
  totalDuration?: number
  duration?: number
  price?: number
  isPremium?: boolean
  level?: string
}

interface ApiCollectionResponse {
  articles?: ApiContentItem[]
  courses?: ApiContentItem[]
  books?: ApiContentItem[]
  items?: ApiContentItem[]
}

interface ApiBrandItem {
  _id?: string
  id?: string
  slug?: string
  name?: string
  description?: string
  brandType?: string
  category?: string
  logo?: string
  coverImage?: string
  website?: string
  tags?: string[]
  averageRating?: number
  ratingsCount?: number
  views?: number
  isVerified?: boolean
}

interface ApiBrandsResponse {
  brands?: ApiBrandItem[]
  items?: ApiBrandItem[]
}

interface HomeFeedData {
  articles: ApiContentItem[]
  courses: ApiContentItem[]
  books: ApiContentItem[]
  resources: ApiBrandItem[]
}

interface CreatorCardData {
  _id: string
  username: string
  profilePictureUrl?: string
  topics?: string[]
  averageRating?: number
  followers?: { userId: string }[]
  isPremium?: boolean
  famous?: string[]
}

const heroSlides: HeroBannerSlide[] = [
  {
    id: 'hero-1',
    badge: 'Plataforma #1 em Portugal',
    title: 'Domina as tuas financas, constroi o teu futuro',
    description:
      'Aprende com os melhores criadores de literacia financeira. Cursos, artigos, ferramentas e uma comunidade que te ajuda a crescer.',
    imageUrl: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=1600&q=80',
    ctaLabel: 'Explorar conteudo',
    ctaHref: '/hub/conteudos',
    secondaryLabel: 'Conhecer criadores',
    secondaryHref: '/creators',
  },
  {
    id: 'hero-2',
    badge: 'Novo curso disponivel',
    title: 'Financas Pessoais para Iniciantes',
    description:
      'Orcamento, poupanca, fundo de emergencia. Tudo o que precisas para comecar a controlar o teu dinheiro - totalmente gratuito.',
    imageUrl: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=1600&q=80',
    ctaLabel: 'Comecar gratis',
    ctaHref: '/hub/courses',
    secondaryLabel: 'Ver todos os cursos',
    secondaryHref: '/hub/courses',
  },
  {
    id: 'hero-3',
    badge: 'Compara e escolhe',
    title: 'As melhores corretoras e plataformas para investir',
    description:
      'Compara comissoes, funcionalidades e avaliacoes reais de outros utilizadores. Encontra a plataforma ideal para ti.',
    imageUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1600&q=80',
    ctaLabel: 'Comparar corretoras',
    ctaHref: '/mercados/recursos',
    secondaryLabel: 'Guia de investimento',
    secondaryHref: '/hub/conteudos',
  },
]

const normalizeCollection = (
  payload: ApiCollectionResponse | ApiContentItem[],
  key: ContentListKey,
) => {
  if (Array.isArray(payload)) return payload
  if (Array.isArray(payload?.[key])) return payload[key] ?? []
  if (Array.isArray(payload?.items)) return payload.items
  return []
}

const fetchCollection = async (endpoint: string, key: ContentListKey) => {
  try {
    const response = await apiClient.get<ApiCollectionResponse>(endpoint, {
      params: { limit: 12, sort: 'popular' },
    })
    return normalizeCollection(response.data, key)
  } catch (error) {
    console.error(`[HOME] Falha ao carregar ${key}:`, error)
    return []
  }
}

const normalizeBrands = (payload: ApiBrandsResponse | ApiBrandItem[]) => {
  if (Array.isArray(payload)) return payload
  if (Array.isArray(payload?.brands)) return payload.brands ?? []
  if (Array.isArray(payload?.items)) return payload.items
  return []
}

const fetchResourceCollection = async (): Promise<ApiBrandItem[]> => {
  try {
    const featuredResponse = await apiClient.get<ApiBrandsResponse | ApiBrandItem[]>('/brands', {
      params: { limit: 12, sort: 'featured', isActive: true },
    })

    const featuredItems = normalizeBrands(featuredResponse.data)
    if (featuredItems.length > 0) return featuredItems

    const fallbackResponse = await apiClient.get<ApiBrandsResponse | ApiBrandItem[]>(
      '/brands/featured',
      { params: { limit: 12 } },
    )
    return normalizeBrands(fallbackResponse.data)
  } catch (error) {
    console.error('[HOME] Falha ao carregar recursos:', error)
    return []
  }
}

const fetchHomepageData = async (): Promise<HomeFeedData> => {
  const [articles, courses, books, resources] = await Promise.all([
    fetchCollection('/articles', 'articles'),
    fetchCollection('/courses', 'courses'),
    fetchCollection('/books', 'books'),
    fetchResourceCollection(),
  ])

  return { articles, courses, books, resources }
}

const toCardId = (item: ApiContentItem, index: number, prefix: string) =>
  item.id || item._id || item.slug || `${prefix}-${index}`

const resolveCreatorName = (creator: ApiContentItem['creator']) => {
  if (!creator) return 'FinHub'
  if (typeof creator === 'string') return 'FinHub'
  return creator.name || creator.username || 'FinHub'
}

const resolveCreatorUsername = (creator: ApiContentItem['creator']) => {
  if (!creator || typeof creator === 'string') return ''
  return creator.username || ''
}

const toTopicLabel = (value?: string) => {
  if (!value) return 'Geral'
  return value
    .replace(/_/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .replace(/\b\w/g, (letter) => letter.toUpperCase())
}

const toCourseDurationMinutes = (item: ApiContentItem) => {
  const duration = item.totalDuration ?? item.duration
  if (!duration || duration <= 0) return 0
  return duration <= 24 ? Math.round(duration * 60) : Math.round(duration)
}

const toBrandTypeLabel = (brandType?: string) => {
  switch (brandType) {
    case 'broker':
      return 'Corretora'
    case 'platform':
      return 'Plataforma'
    case 'website':
      return 'Website'
    case 'tool':
      return 'Ferramenta'
    case 'exchange':
      return 'Exchange'
    case 'news-source':
      return 'Fonte de noticias'
    case 'podcast':
      return 'Podcast'
    default:
      return 'Recurso'
  }
}

const toResourceHref = (resource: ApiBrandItem) =>
  resource.website && resource.website.trim().length > 0 ? resource.website : '/mercados/recursos'

const isExternalHref = (href: string) => /^https?:\/\//i.test(href)

const EmptyRowState = ({ message }: { message: string }) => (
  <div
    className="content-row__item rounded-xl border border-dashed border-border bg-card/50 p-4 text-sm text-muted-foreground"
    style={{ width: 'clamp(240px, 30vw, 320px)' }}
  >
    {message}
  </div>
)

const LoadingRowState = ({ count = 4 }: { count?: number }) => (
  <>
    {Array.from({ length: count }).map((_, index) => (
      <div
        key={`loading-${index}`}
        className="content-row__item animate-pulse rounded-xl border border-border bg-card/40"
        style={{ width: 'clamp(240px, 30vw, 320px)', height: '220px' }}
      />
    ))}
  </>
)

export function Page() {
  const { data, isLoading } = useQuery({
    queryKey: ['home-feed'],
    queryFn: fetchHomepageData,
    staleTime: 60_000,
  })

  const articleCards = useMemo(
    () =>
      (data?.articles ?? []).slice(0, 12).map((item, index) => ({
        id: toCardId(item, index, 'article'),
        title: item.title || 'Sem titulo',
        topic: toTopicLabel(item.category),
        imageUrl: item.coverImage || item.imageUrl,
        author: item.author || resolveCreatorName(item.creator),
        createdAt: item.createdAt || new Date().toISOString(),
        views: item.views ?? 0,
        likes: item.likes ?? 0,
      })),
    [data?.articles],
  )

  const courseCards = useMemo(
    () =>
      (data?.courses ?? []).slice(0, 12).map((item, index) => {
        const price = item.price ?? 0
        return {
          id: toCardId(item, index, 'course'),
          slug: item.slug,
          title: item.title || 'Sem titulo',
          coverImage: item.coverImage || item.imageUrl,
          averageRating: item.averageRating ?? 0,
          ratingCount: item.ratingsCount ?? item.ratingCount ?? 0,
          enrolledCount: item.enrolledCount ?? 0,
          totalDuration: toCourseDurationMinutes(item),
          price,
          isPaid: price > 0,
          isPremium: item.isPremium ?? false,
          level: item.level,
          creator: { name: resolveCreatorName(item.creator) },
        }
      }),
    [data?.courses],
  )

  const bookCards = useMemo(
    () =>
      (data?.books ?? []).slice(0, 12).map((item, index) => ({
        id: toCardId(item, index, 'book'),
        slug: item.slug,
        title: item.title || 'Sem titulo',
        author: item.author || resolveCreatorName(item.creator),
        coverImage: item.coverImage || item.imageUrl,
        averageRating: item.averageRating ?? 0,
        isPremium: item.isPremium ?? false,
      })),
    [data?.books],
  )

  const resourceCards = useMemo(
    () =>
      (data?.resources ?? []).slice(0, 12).map((item, index) => {
        const href = toResourceHref(item)
        return {
          id: item.id || item._id || item.slug || `resource-${index}`,
          name: item.name || 'Recurso sem nome',
          description: item.description || 'Recurso financeiro em destaque na plataforma.',
          typeLabel: toBrandTypeLabel(item.brandType || item.category),
          imageUrl: item.logo || item.coverImage,
          href,
          isExternal: isExternalHref(href),
          averageRating: item.averageRating,
          ratingsCount: item.ratingsCount,
          views: item.views,
          isVerified: item.isVerified,
        }
      }),
    [data?.resources],
  )

  const creatorCards = useMemo(() => {
    const source = [...(data?.articles ?? []), ...(data?.courses ?? []), ...(data?.books ?? [])]
    const creatorMap = new Map<string, CreatorCardData & { score: number; topicSet: Set<string> }>()

    for (const item of source) {
      const username = resolveCreatorUsername(item.creator)
      if (!username) continue

      const key = username.toLowerCase()
      const existing = creatorMap.get(key)
      const topic = toTopicLabel(item.category)

      if (existing) {
        existing.score += 1
        existing.topicSet.add(topic)
        continue
      }

      const creatorInfo =
        typeof item.creator === 'string' || !item.creator ? undefined : item.creator
      creatorMap.set(key, {
        _id: creatorInfo?._id || creatorInfo?.id || username,
        username,
        profilePictureUrl: creatorInfo?.avatar,
        averageRating: creatorInfo?.averageRating,
        isPremium: creatorInfo?.isPremium,
        followers: [],
        famous: [],
        topics: [],
        score: 1,
        topicSet: new Set([topic]),
      })
    }

    return Array.from(creatorMap.values())
      .sort((a, b) => b.score - a.score)
      .slice(0, 12)
      .map((creator) => ({
        _id: creator._id,
        username: creator.username,
        profilePictureUrl: creator.profilePictureUrl,
        averageRating: creator.averageRating,
        isPremium: creator.isPremium,
        followers: creator.followers,
        famous: creator.famous,
        topics: Array.from(creator.topicSet).slice(0, 2),
      }))
  }, [data?.articles, data?.courses, data?.books])

  return (
    <HomepageLayout>
      <HeroBanner slides={heroSlides} />

      <ContentRow
        title="Criadores Populares"
        subtitle="Criadores derivados de conteudos reais publicados"
        href="/creators"
      >
        {isLoading ? (
          <LoadingRowState />
        ) : creatorCards.length > 0 ? (
          creatorCards.map((creator) => <CreatorCardLarge key={creator._id} creator={creator} />)
        ) : (
          <EmptyRowState message="Sem criadores disponiveis neste momento." />
        )}
      </ContentRow>

      <ContentRow
        title="Recursos em Destaque"
        subtitle="Corretoras, plataformas e ferramentas com dados reais"
        href="/mercados/recursos"
      >
        {isLoading ? (
          <LoadingRowState />
        ) : resourceCards.length > 0 ? (
          resourceCards.map((resource) => <ResourceCard key={resource.id} resource={resource} />)
        ) : (
          <EmptyRowState message="Sem recursos disponiveis neste momento." />
        )}
      </ContentRow>

      <ContentRow
        title="Artigos em Tendencia"
        subtitle="Dados reais carregados da API de artigos"
        href="/hub/articles"
      >
        {isLoading ? (
          <LoadingRowState />
        ) : articleCards.length > 0 ? (
          articleCards.map((article) => <ArticleCard key={article.id} article={article} />)
        ) : (
          <EmptyRowState message="Sem artigos publicados neste momento." />
        )}
      </ContentRow>

      <ContentRow
        title="Cursos Recomendados"
        subtitle="Dados reais carregados da API de cursos"
        href="/hub/courses"
      >
        {isLoading ? (
          <LoadingRowState />
        ) : courseCards.length > 0 ? (
          courseCards.map((course) => <CourseCard key={course.id} course={course} />)
        ) : (
          <EmptyRowState message="Sem cursos publicados neste momento." />
        )}
      </ContentRow>

      <ContentRow
        title="Livros Essenciais"
        subtitle="Dados reais carregados da API de livros"
        href="/hub/books"
      >
        {isLoading ? (
          <LoadingRowState />
        ) : bookCards.length > 0 ? (
          bookCards.map((book) => <BookCardHome key={book.id} book={book} />)
        ) : (
          <EmptyRowState message="Sem livros publicados neste momento." />
        )}
      </ContentRow>

      <section className="px-4 sm:px-6 md:px-10 lg:px-12 py-12 sm:py-16 md:py-20">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-foreground">
            Pronto para comecar a tua jornada financeira?
          </h2>
          <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Junta-te a milhares de portugueses que estao a tomar controlo das suas financas. Acesso
            gratuito a artigos, cursos e ferramentas.
          </p>
          <div className="flex flex-wrap justify-center gap-4 pt-2">
            <a href="/creators">
              <button className="inline-flex items-center justify-center px-8 py-3 rounded-lg bg-primary text-primary-foreground font-semibold text-sm sm:text-base shadow-lg hover:opacity-90 transition-opacity">
                Criar conta gratuita
              </button>
            </a>
            <a href="/hub/courses">
              <button className="inline-flex items-center justify-center px-8 py-3 rounded-lg border border-border bg-card text-foreground font-semibold text-sm sm:text-base hover:bg-accent transition-colors">
                Explorar cursos
              </button>
            </a>
          </div>
        </div>
      </section>
    </HomepageLayout>
  )
}

export default { Page }
