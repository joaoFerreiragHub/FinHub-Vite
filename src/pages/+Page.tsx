import { useEffect, useMemo, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { HeroBanner, type HeroBannerSlide } from '@/components/home/HeroBanner'
import { ContentRow } from '@/components/home/ContentRow'
import { ArticleCard, CourseCard, BookCardHome, ResourceCard } from '@/components/home/cards'
import { Creator } from '@/features/creators/components/Creator'
import {
  fetchPublicCreatorsPage,
  mapPublicCreatorListItemToCreator,
} from '@/features/creators/services/publicCreatorsService'
import type { Creator as CreatorModel } from '@/features/creators/types/creator'
import { communityService } from '@/features/community/services/communityService'
import { apiClient } from '@/lib/api/client'
import { useAuthStore } from '@/features/auth/stores/useAuthStore'

type ContentListKey = 'articles' | 'courses' | 'books'

interface ApiContentItem {
  _id?: string
  id?: string
  slug?: string
  title?: string
  type?: RecommendationContentType
  href?: string
  category?: string
  coverImage?: string
  imageUrl?: string
  author?: string
  creator?:
    | {
        _id?: string
        id?: string
        username?: string
        name?: string
      }
    | string
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

type RecommendationContentType = 'article' | 'video' | 'course'

interface ApiRecommendationsResponse {
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
  creators: CreatorModel[]
}

type RequestParams = Record<string, string | number | boolean | undefined>

const ONBOARDING_PREFS_STORAGE_KEY = 'finhub_onboarding_prefs'
const ONBOARDING_PREFS_LEGACY_KEY = 'finhub-onboarding-prefs'
const PERSONALIZED_CONTENT_LIMIT = 4

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

const fetchCollection = async (endpoint: string, key: ContentListKey, params?: RequestParams) => {
  try {
    const response = await apiClient.get<ApiCollectionResponse>(endpoint, {
      params: { limit: 12, sort: 'popular', ...params },
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
  const [articles, courses, books, resources, creatorsPage] = await Promise.all([
    fetchCollection('/articles', 'articles'),
    fetchCollection('/courses', 'courses'),
    fetchCollection('/books', 'books'),
    fetchResourceCollection(),
    fetchPublicCreatorsPage({
      page: 1,
      limit: 12,
      sortBy: 'followers',
      sortOrder: 'desc',
    }),
  ])

  return {
    articles,
    courses,
    books,
    resources,
    creators: creatorsPage.items.map(mapPublicCreatorListItemToCreator),
  }
}

const toUniqueStringList = (value: unknown): string[] => {
  if (!Array.isArray(value)) return []

  const uniqueValues = new Set<string>()
  for (const item of value) {
    if (typeof item !== 'string') continue
    const normalized = item.trim()
    if (normalized.length === 0) continue
    uniqueValues.add(normalized)
  }

  return Array.from(uniqueValues)
}

const readOnboardingInterests = (): string[] => {
  if (typeof window === 'undefined') return []

  const raw =
    window.localStorage.getItem(ONBOARDING_PREFS_STORAGE_KEY) ??
    window.localStorage.getItem(ONBOARDING_PREFS_LEGACY_KEY)

  if (!raw) return []

  try {
    const parsed: unknown = JSON.parse(raw)

    if (Array.isArray(parsed)) {
      return toUniqueStringList(parsed)
    }

    if (parsed && typeof parsed === 'object') {
      const record = parsed as { interests?: unknown; topics?: unknown; selectedTopics?: unknown }
      const interests = toUniqueStringList(record.interests)
      if (interests.length > 0) return interests

      const topics = toUniqueStringList(record.topics)
      if (topics.length > 0) return topics

      return toUniqueStringList(record.selectedTopics)
    }
  } catch {
    return []
  }

  return []
}

const dedupeByContentId = (items: ApiContentItem[]) => {
  const seen = new Set<string>()

  return items.filter((item, index) => {
    const id = toCardId(item, index, 'content')
    if (seen.has(id)) return false
    seen.add(id)
    return true
  })
}

const fetchPopularArticles = async (): Promise<ApiContentItem[]> => {
  const popularItems = await fetchCollection('/articles', 'articles', {
    limit: PERSONALIZED_CONTENT_LIMIT,
    sort: 'views',
  })

  return popularItems.slice(0, PERSONALIZED_CONTENT_LIMIT)
}

const fetchArticlesForInterests = async (interests: string[]): Promise<ApiContentItem[]> => {
  const topics = toUniqueStringList(interests).slice(0, PERSONALIZED_CONTENT_LIMIT)
  if (topics.length === 0) {
    return fetchPopularArticles()
  }

  const topicBuckets = await Promise.all(
    topics.map((topic) =>
      fetchCollection('/articles', 'articles', {
        limit: PERSONALIZED_CONTENT_LIMIT,
        sort: 'views',
        topic,
      }),
    ),
  )

  const merged = dedupeByContentId(topicBuckets.flat())
    .sort((left, right) => (right.views ?? 0) - (left.views ?? 0))
    .slice(0, PERSONALIZED_CONTENT_LIMIT)

  if (merged.length > 0) return merged
  return fetchPopularArticles()
}

const recommendationHrefByType: Record<RecommendationContentType, string> = {
  article: '/hub/articles',
  video: '/hub/videos',
  course: '/hub/courses',
}

const normalizeRecommendationItems = (
  payload: ApiRecommendationsResponse | ApiContentItem[] | null | undefined,
): ApiContentItem[] => {
  if (!payload) return []
  if (Array.isArray(payload)) return payload
  if (Array.isArray(payload.items)) return payload.items
  return []
}

const fetchRecommendationsForUser = async (
  limit: number,
  userId?: string,
): Promise<ApiContentItem[]> => {
  try {
    const response = await apiClient.get<ApiRecommendationsResponse>('/recommendations', {
      params: { limit, userId },
    })
    return normalizeRecommendationItems(response.data).slice(0, limit)
  } catch (error) {
    console.error('[HOME] Falha ao carregar recomendacoes:', error)
    return []
  }
}

const toCardId = (item: ApiContentItem, index: number, prefix: string) =>
  item.id || item._id || item.slug || `${prefix}-${index}`

const resolveCreatorName = (creator: ApiContentItem['creator']) => {
  if (!creator) return 'FinHub'
  if (typeof creator === 'string') return 'FinHub'
  return creator.name || creator.username || 'FinHub'
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

const toContentHref = (item: ApiContentItem): string | undefined => {
  if (item.href) return item.href

  if (!item.type) return undefined
  const slugOrId = item.slug || item.id || item._id
  if (!slugOrId) return undefined

  return `${recommendationHrefByType[item.type]}/${encodeURIComponent(slugOrId)}`
}

const resolveCardTopic = (item: ApiContentItem): string => {
  if (item.category) return toTopicLabel(item.category)
  if (item.type === 'video') return 'Video'
  if (item.type === 'course') return 'Curso'
  return 'Artigo'
}

const mapArticleItemsToCards = (items: ApiContentItem[], limit = 12) =>
  items.slice(0, limit).map((item, index) => ({
    id: toCardId(item, index, 'article'),
    slug: item.slug,
    href: toContentHref(item),
    title: item.title || 'Sem titulo',
    topic: resolveCardTopic(item),
    imageUrl: item.coverImage || item.imageUrl,
    author: item.author || resolveCreatorName(item.creator),
    createdAt: item.createdAt || new Date().toISOString(),
    views: item.views ?? 0,
    likes: item.likes ?? 0,
  }))

export function Page() {
  const [mounted, setMounted] = useState(false)
  const [hasLoadedOnboardingPrefs, setHasLoadedOnboardingPrefs] = useState(false)
  const [onboardingInterests, setOnboardingInterests] = useState<string[]>([])
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)
  const authUserId = useAuthStore((state) => state.user?.id)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted) return

    setOnboardingInterests(readOnboardingInterests())
    setHasLoadedOnboardingPrefs(true)
  }, [mounted])

  const { data, isLoading } = useQuery({
    queryKey: ['home-feed'],
    queryFn: fetchHomepageData,
    staleTime: 60_000,
  })

  const personalizedContentQuery = useQuery({
    queryKey: ['home-feed', 'for-you', isAuthenticated, authUserId, onboardingInterests],
    queryFn: () =>
      isAuthenticated
        ? fetchRecommendationsForUser(PERSONALIZED_CONTENT_LIMIT, authUserId)
        : fetchArticlesForInterests(onboardingInterests),
    enabled: mounted && hasLoadedOnboardingPrefs,
    staleTime: 60_000,
  })

  const leaderboardQuery = useQuery({
    queryKey: ['community-leaderboard', 'homepage'],
    queryFn: () => communityService.getLeaderboard(),
    staleTime: 300_000,
  })

  const hasOnboardingInterests = onboardingInterests.length > 0
  const isUsingBackendRecommendations = isAuthenticated
  const showingPersonalizedFeed = isUsingBackendRecommendations || hasOnboardingInterests

  const articleCards = useMemo(() => mapArticleItemsToCards(data?.articles ?? []), [data?.articles])

  const personalizedArticleCards = useMemo(
    () => mapArticleItemsToCards(personalizedContentQuery.data ?? [], PERSONALIZED_CONTENT_LIMIT),
    [personalizedContentQuery.data],
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

  const creatorCards = useMemo(() => data?.creators ?? [], [data?.creators])
  const topWeekEntries = useMemo(
    () => (leaderboardQuery.data?.items ?? []).slice(0, 3),
    [leaderboardQuery.data?.items],
  )

  return (
    <>
      <HeroBanner slides={heroSlides} />

      {topWeekEntries.length > 0 ? (
        <section className="px-4 py-10 sm:px-6 lg:px-12">
          <div className="mx-auto max-w-6xl rounded-2xl border border-border bg-card p-6 sm:p-8">
            <div className="mb-4 flex items-center justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-primary">
                  Comunidade
                </p>
                <h2 className="mt-1 text-2xl font-bold text-foreground">Top da Semana</h2>
              </div>
              <a href="/comunidade" className="text-sm font-medium text-primary hover:underline">
                Ver leaderboard
              </a>
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              {topWeekEntries.map((entry) => (
                <article
                  key={`${entry.rank}-${entry.username}`}
                  className="rounded-xl border border-border/70 p-4"
                >
                  <div className="mb-2 flex items-center justify-between gap-2">
                    <span className="text-xs font-semibold text-muted-foreground">
                      #{entry.rank}
                    </span>
                    <span className="rounded-full border border-border px-2 py-0.5 text-[11px] font-medium text-foreground">
                      Nv.{entry.level}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    {entry.avatar ? (
                      <img
                        src={entry.avatar}
                        alt={entry.username}
                        className="h-10 w-10 rounded-full object-cover"
                      />
                    ) : (
                      <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-muted text-sm font-semibold text-foreground">
                        {entry.username.slice(0, 2).toUpperCase()}
                      </span>
                    )}
                    <div>
                      <p className="text-sm font-semibold text-foreground">@{entry.username}</p>
                      <p className="text-xs text-muted-foreground">
                        {entry.weeklyXp} XP esta semana
                      </p>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      {mounted ? (
        <ContentRow
          title={showingPersonalizedFeed ? 'Para ti' : 'Popular agora'}
          subtitle={
            isUsingBackendRecommendations
              ? 'Recomendacoes personalizadas com base no teu comportamento recente.'
              : hasOnboardingInterests
                ? 'Conteudo selecionado a partir dos teus topicos de interesse.'
                : 'Conteudos com mais visualizacoes neste momento.'
          }
          href="/hub/articles"
        >
          {personalizedContentQuery.isLoading ? (
            <LoadingRowState count={PERSONALIZED_CONTENT_LIMIT} />
          ) : personalizedArticleCards.length > 0 ? (
            personalizedArticleCards.map((article) => (
              <ArticleCard key={article.id} article={article} />
            ))
          ) : (
            <EmptyRowState message="Sem conteudos relevantes para mostrar agora." />
          )}
        </ContentRow>
      ) : null}

      <ContentRow
        title="Criadores Populares"
        subtitle="Criadores com dados completos para preview e modal"
        href="/creators"
      >
        {isLoading ? (
          <LoadingRowState />
        ) : creatorCards.length > 0 ? (
          creatorCards.map((creator) => (
            <Creator key={creator._id} creator={creator} variant="row" />
          ))
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
    </>
  )
}
