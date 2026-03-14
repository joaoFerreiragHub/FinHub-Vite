import { type FormEvent, useMemo, useState } from 'react'
import {
  AlertCircle,
  ArrowRight,
  BookOpen,
  Building2,
  CalendarClock,
  Globe,
  Mic2,
  Newspaper,
  Scale,
  Search,
  Smartphone,
  Sparkles,
  Star,
  Wallet,
} from 'lucide-react'
import { Link } from 'react-router-dom'
import {
  Badge,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  Input,
  Skeleton,
} from '@/components/ui'
import { PublicAdSlot } from '@/features/ads/components/PublicAdSlot'
import {
  useFeaturedPublicDirectories,
  usePublicDirectoryCategories,
  useSearchPublicDirectories,
} from '../hooks/usePublicDirectories'
import {
  PUBLIC_DIRECTORY_SEARCH_MIN_LENGTH,
  type PublicDirectorySummaryEntry,
  type PublicDirectoryVertical,
} from '../services/publicDirectoriesService'

const FEATURED_LIMIT = 6
const SEARCH_RESULTS_LIMIT = 8

const numberFormatter = new Intl.NumberFormat('pt-PT')
const ratingFormatter = new Intl.NumberFormat('pt-PT', {
  minimumFractionDigits: 1,
  maximumFractionDigits: 1,
})

type VerticalMeta = {
  label: string
  description: string
  href: string | null
  icon: typeof Building2
}

const VERTICAL_META: Record<PublicDirectoryVertical, VerticalMeta> = {
  broker: {
    label: 'Corretoras',
    description: 'Plataformas para negociar acoes, ETF e outros ativos.',
    href: '/recursos/corretoras',
    icon: Building2,
  },
  exchange: {
    label: 'Exchanges',
    description: 'Exchanges centralizadas para ativos digitais.',
    href: '/recursos/exchanges',
    icon: Wallet,
  },
  site: {
    label: 'Sites',
    description: 'Recursos editoriais, research e acompanhamento de mercado.',
    href: '/recursos/sites',
    icon: Globe,
  },
  app: {
    label: 'Apps',
    description: 'Aplicacoes moveis para acompanhamento e operacao.',
    href: '/recursos/apps',
    icon: Smartphone,
  },
  podcast: {
    label: 'Podcasts',
    description: 'Conteudo audio para analise e literacia financeira.',
    href: '/recursos/podcasts',
    icon: Mic2,
  },
  event: {
    label: 'Eventos',
    description: 'Eventos e agendas de mercado com cobertura editorial.',
    href: null,
    icon: CalendarClock,
  },
  other: {
    label: 'Outros',
    description: 'Entidades que nao encaixam nas verticais principais.',
    href: null,
    icon: BookOpen,
  },
  insurance: {
    label: 'Seguradoras',
    description: 'Entidades de seguros e produtos de protecao financeira.',
    href: null,
    icon: Building2,
  },
  bank: {
    label: 'Bancos',
    description: 'Instituicoes bancarias com oferta para retalho e investimento.',
    href: null,
    icon: Building2,
  },
  fund: {
    label: 'Fundos',
    description: 'Gestoras e produtos coletivos de investimento.',
    href: null,
    icon: Wallet,
  },
  fintech: {
    label: 'Fintech',
    description: 'Servicos financeiros digitais e produtos de nova geracao.',
    href: '/recursos/plataformas',
    icon: Smartphone,
  },
  newsletter: {
    label: 'Newsletters',
    description: 'Curadoria de mercado por email e research recorrente.',
    href: null,
    icon: Newspaper,
  },
}

const formatCount = (value: number) => numberFormatter.format(value)
const formatRating = (value: number) => ratingFormatter.format(value)

const resolveVerticalMeta = (vertical: PublicDirectoryVertical) => VERTICAL_META[vertical]

type DirectoryCardMode = 'featured' | 'search'

interface DirectoryEntryCardProps {
  item: PublicDirectorySummaryEntry
  mode: DirectoryCardMode
}

function DirectoryEntryCard({ item, mode }: DirectoryEntryCardProps) {
  const verticalMeta = resolveVerticalMeta(item.verticalType)
  const hasRatings = item.ratingsCount > 0

  return (
    <Card className="border-border/60 bg-card/85">
      <CardHeader className="space-y-3 pb-4">
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-1">
            <CardTitle className="text-base leading-tight">{item.name}</CardTitle>
            <CardDescription>{verticalMeta.label}</CardDescription>
          </div>
          <div className="flex flex-wrap justify-end gap-2">
            {item.verificationStatus === 'verified' ? (
              <Badge variant="secondary">Verificado</Badge>
            ) : null}
            {item.isFeatured ? <Badge>Featured</Badge> : null}
            {item.isSponsoredPlacement ? <Badge variant="outline">Patrocinado</Badge> : null}
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground">{item.shortDescription}</p>

        <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground sm:grid-cols-4">
          <div className="rounded-md border border-border/60 px-2 py-1.5">
            <div className="font-medium text-foreground">{formatCount(item.views)}</div>
            <div>Views</div>
          </div>
          <div className="rounded-md border border-border/60 px-2 py-1.5">
            <div className="font-medium text-foreground">
              {hasRatings ? formatRating(item.averageRating) : '-'}
            </div>
            <div>Rating</div>
          </div>
          <div className="rounded-md border border-border/60 px-2 py-1.5">
            <div className="font-medium text-foreground">{formatCount(item.ratingsCount)}</div>
            <div>Ratings</div>
          </div>
          <div className="rounded-md border border-border/60 px-2 py-1.5">
            <div className="font-medium text-foreground">{formatCount(item.commentsCount)}</div>
            <div>Comentarios</div>
          </div>
        </div>
      </CardContent>

      <CardFooter className="flex flex-wrap gap-2">
        <Button asChild size="sm">
          <Link to={`/recursos/${item.slug}`}>
            Ver detalhe
            <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
        {item.website ? (
          <Button asChild size="sm" variant="outline">
            <a href={item.website} target="_blank" rel="noreferrer noopener">
              Site oficial
            </a>
          </Button>
        ) : null}
        {mode === 'search' ? <Badge variant="outline">Resultado de pesquisa</Badge> : null}
      </CardFooter>
    </Card>
  )
}

export default function BrandsListPage() {
  const [searchInput, setSearchInput] = useState('')
  const [searchTerm, setSearchTerm] = useState('')

  const categoriesQuery = usePublicDirectoryCategories()
  const featuredQuery = useFeaturedPublicDirectories(FEATURED_LIMIT)
  const searchQuery = useSearchPublicDirectories(searchTerm, { limit: SEARCH_RESULTS_LIMIT })

  const canSubmitSearch = searchInput.trim().length >= PUBLIC_DIRECTORY_SEARCH_MIN_LENGTH
  const hasSearch = searchTerm.trim().length >= PUBLIC_DIRECTORY_SEARCH_MIN_LENGTH

  const categoryItems = useMemo(() => {
    const items = categoriesQuery.data?.items ?? []
    return items.filter((item) => item.count > 0).sort((left, right) => right.count - left.count)
  }, [categoriesQuery.data?.items])

  const featuredItems = featuredQuery.data?.items ?? []
  const searchItems = searchQuery.data?.items ?? []

  const handleSearchSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const normalized = searchInput.trim()
    if (normalized.length < PUBLIC_DIRECTORY_SEARCH_MIN_LENGTH) return
    setSearchTerm(normalized)
  }

  const clearSearch = () => {
    setSearchInput('')
    setSearchTerm('')
  }

  const summary = categoriesQuery.data?.summary

  return (
    <div className="min-h-screen bg-background">
      <section className="mx-auto w-full max-w-7xl space-y-8 px-4 py-10 sm:px-6 lg:px-8">
        <header className="space-y-4">
          <Badge className="w-fit gap-1.5">
            <Sparkles className="h-3.5 w-3.5" />
            Diretorio de Recursos
          </Badge>
          <div className="space-y-2">
            <h1 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
              Recursos financeiros para comparar com contexto
            </h1>
            <p className="max-w-3xl text-sm text-muted-foreground sm:text-base">
              Acede a categorias, descobre entidades em destaque e pesquisa por nome para encontrar
              o recurso certo para o teu perfil.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="secondary">
              {formatCount(summary?.total ?? 0)} recursos publicados
            </Badge>
            <Badge variant="outline">{formatCount(summary?.totalFeatured ?? 0)} featured</Badge>
            <Badge variant="outline">{formatCount(summary?.totalVerified ?? 0)} verificados</Badge>
            <Button asChild size="sm" variant="outline">
              <Link to="/recursos/comparar">
                Abrir comparador
                <Scale className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </header>

        <Card className="border-border/60 bg-card/85">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Search className="h-4 w-4" />
              Pesquisa global
            </CardTitle>
            <CardDescription>
              Pesquisa por nome ou descricao. Minimo de {PUBLIC_DIRECTORY_SEARCH_MIN_LENGTH}{' '}
              caracteres.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSearchSubmit} className="flex flex-col gap-3 sm:flex-row">
              <Input
                value={searchInput}
                onChange={(event) => setSearchInput(event.target.value)}
                placeholder="Ex: corretora portugal, ETF, fintech..."
                className="sm:flex-1"
                aria-label="Pesquisar recursos"
              />
              <div className="flex gap-2">
                <Button type="submit" disabled={!canSubmitSearch}>
                  Pesquisar
                </Button>
                {hasSearch ? (
                  <Button type="button" variant="ghost" onClick={clearSearch}>
                    Limpar
                  </Button>
                ) : null}
              </div>
            </form>
          </CardContent>
        </Card>

        <section className="space-y-4">
          <div className="space-y-1">
            <h2 className="text-xl font-semibold text-foreground">Categorias</h2>
            <p className="text-sm text-muted-foreground">
              Mapa por vertical com contagens, verificados e featured.
            </p>
          </div>

          {categoriesQuery.isLoading ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, index) => (
                <Card key={`category-skeleton-${index}`}>
                  <CardHeader className="space-y-3">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-3 w-full" />
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <Skeleton className="h-3 w-32" />
                    <Skeleton className="h-3 w-20" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : null}

          {categoriesQuery.isError ? (
            <Card className="border-destructive/40">
              <CardContent className="flex items-center gap-2 p-4 text-sm text-destructive">
                <AlertCircle className="h-4 w-4" />
                Nao foi possivel carregar as categorias do diretorio.
              </CardContent>
            </Card>
          ) : null}

          {!categoriesQuery.isLoading && !categoriesQuery.isError ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {categoryItems.length === 0 ? (
                <Card className="sm:col-span-2 lg:col-span-3">
                  <CardContent className="p-6 text-sm text-muted-foreground">
                    Ainda nao existem categorias com entradas publicadas.
                  </CardContent>
                </Card>
              ) : (
                categoryItems.map((item) => {
                  const meta = resolveVerticalMeta(item.verticalType)
                  const Icon = meta.icon
                  return (
                    <Card key={item.verticalType} className="border-border/60 bg-card/85">
                      <CardHeader className="space-y-3 pb-4">
                        <div className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-primary/15 text-primary">
                          <Icon className="h-5 w-5" />
                        </div>
                        <div className="space-y-1">
                          <CardTitle className="text-base">{meta.label}</CardTitle>
                          <CardDescription>{meta.description}</CardDescription>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="flex flex-wrap gap-2 text-xs">
                          <Badge variant="secondary">{formatCount(item.count)} recursos</Badge>
                          <Badge variant="outline">
                            {formatCount(item.verifiedCount)} verificados
                          </Badge>
                          <Badge variant="outline">
                            {formatCount(item.featuredCount)} featured
                          </Badge>
                        </div>
                      </CardContent>
                      <CardFooter>
                        {meta.href ? (
                          <Button asChild size="sm" variant="outline">
                            <Link to={meta.href}>
                              Explorar categoria
                              <ArrowRight className="h-4 w-4" />
                            </Link>
                          </Button>
                        ) : (
                          <Button size="sm" variant="outline" disabled>
                            Em breve
                          </Button>
                        )}
                      </CardFooter>
                    </Card>
                  )
                })
              )}
            </div>
          ) : null}
        </section>

        <PublicAdSlot slotId="DIRECTORY_HOME_INLINE_01" vertical="directory" />

        <section className="space-y-4">
          <div className="space-y-1">
            <h2 className="text-xl font-semibold text-foreground">Entidades em destaque</h2>
            <p className="text-sm text-muted-foreground">
              Selecoes featured para entrada rapida no diretorio.
            </p>
          </div>

          {featuredQuery.isLoading ? (
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {Array.from({ length: FEATURED_LIMIT }).map((_, index) => (
                <Card key={`featured-skeleton-${index}`}>
                  <CardHeader className="space-y-3">
                    <Skeleton className="h-4 w-36" />
                    <Skeleton className="h-3 w-24" />
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <Skeleton className="h-3 w-full" />
                    <Skeleton className="h-3 w-4/5" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : null}

          {featuredQuery.isError ? (
            <Card className="border-destructive/40">
              <CardContent className="flex items-center gap-2 p-4 text-sm text-destructive">
                <AlertCircle className="h-4 w-4" />
                Nao foi possivel carregar os recursos em destaque.
              </CardContent>
            </Card>
          ) : null}

          {!featuredQuery.isLoading && !featuredQuery.isError ? (
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {featuredItems.length === 0 ? (
                <Card className="md:col-span-2 xl:col-span-3">
                  <CardContent className="p-6 text-sm text-muted-foreground">
                    Ainda nao existem recursos featured.
                  </CardContent>
                </Card>
              ) : (
                featuredItems.map((item) => (
                  <DirectoryEntryCard key={item.id} item={item} mode="featured" />
                ))
              )}
            </div>
          ) : null}
        </section>

        {hasSearch ? (
          <section className="space-y-4">
            <div className="space-y-1">
              <h2 className="flex items-center gap-2 text-xl font-semibold text-foreground">
                <Star className="h-4 w-4" />
                Resultados para "{searchTerm}"
              </h2>
              <p className="text-sm text-muted-foreground">
                {searchQuery.data
                  ? `${formatCount(searchQuery.data.pagination.total)} resultados encontrados`
                  : 'A processar pesquisa...'}
              </p>
            </div>

            {searchQuery.isLoading ? (
              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {Array.from({ length: 3 }).map((_, index) => (
                  <Card key={`search-skeleton-${index}`}>
                    <CardHeader className="space-y-3">
                      <Skeleton className="h-4 w-40" />
                      <Skeleton className="h-3 w-28" />
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <Skeleton className="h-3 w-full" />
                      <Skeleton className="h-3 w-5/6" />
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : null}

            {searchQuery.isError ? (
              <Card className="border-destructive/40">
                <CardContent className="flex items-center gap-2 p-4 text-sm text-destructive">
                  <AlertCircle className="h-4 w-4" />
                  Nao foi possivel executar a pesquisa agora.
                </CardContent>
              </Card>
            ) : null}

            {!searchQuery.isLoading && !searchQuery.isError ? (
              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {searchItems.length === 0 ? (
                  <Card className="md:col-span-2 xl:col-span-3">
                    <CardContent className="p-6 text-sm text-muted-foreground">
                      Sem resultados para este termo.
                    </CardContent>
                  </Card>
                ) : (
                  searchItems.map((item) => (
                    <DirectoryEntryCard key={item.id} item={item} mode="search" />
                  ))
                )}
              </div>
            ) : null}
          </section>
        ) : null}
      </section>
    </div>
  )
}
