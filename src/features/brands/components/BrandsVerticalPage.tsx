import { type FormEvent, useMemo, useState } from 'react'
import { AlertCircle, ArrowRight, Search, Star } from 'lucide-react'
import { Link } from '@/lib/reactRouterDomCompat'
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
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Skeleton,
} from '@/components/ui'
import { PublicAdSlot } from '@/features/ads/components/PublicAdSlot'
import { usePublicDirectories } from '../hooks/usePublicDirectories'
import {
  PUBLIC_DIRECTORY_SEARCH_MIN_LENGTH,
  type PublicDirectorySort,
  type PublicDirectorySummaryEntry,
  type PublicDirectoryVerificationStatus,
  type PublicDirectoryVertical,
} from '../services/publicDirectoriesService'

const PAGE_SIZE = 12

const numberFormatter = new Intl.NumberFormat('pt-PT')
const ratingFormatter = new Intl.NumberFormat('pt-PT', {
  minimumFractionDigits: 1,
  maximumFractionDigits: 1,
})

type VerificationFilter = 'all' | PublicDirectoryVerificationStatus

const SORT_OPTIONS: Array<{ value: PublicDirectorySort; label: string }> = [
  { value: 'featured', label: 'Destaque' },
  { value: 'popular', label: 'Popularidade' },
  { value: 'rating', label: 'Rating' },
  { value: 'recent', label: 'Mais recentes' },
  { value: 'name', label: 'Nome' },
]

interface BrandsVerticalPageProps {
  vertical: PublicDirectoryVertical
  title: string
  description: string
}

const formatCount = (value: number) => numberFormatter.format(value)
const formatRating = (value: number) => ratingFormatter.format(value)

function DirectoryCard({ item }: { item: PublicDirectorySummaryEntry }) {
  return (
    <Card className="border-border/60 bg-card/85">
      <CardHeader className="space-y-3 pb-4">
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-1">
            <CardTitle className="text-base leading-tight">{item.name}</CardTitle>
            <CardDescription>{item.country || 'Global'}</CardDescription>
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
              {item.ratingsCount > 0 ? formatRating(item.averageRating) : '-'}
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
      </CardFooter>
    </Card>
  )
}

export function BrandsVerticalPage({ vertical, title, description }: BrandsVerticalPageProps) {
  const [searchInput, setSearchInput] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [sort, setSort] = useState<PublicDirectorySort>('featured')
  const [verificationStatus, setVerificationStatus] = useState<VerificationFilter>('all')
  const [featuredOnly, setFeaturedOnly] = useState(false)
  const [page, setPage] = useState(1)

  const query = useMemo(
    () => ({
      verticalType: vertical,
      search: searchTerm || undefined,
      sort,
      verificationStatus: verificationStatus === 'all' ? undefined : verificationStatus,
      featured: featuredOnly ? true : undefined,
      page,
      limit: PAGE_SIZE,
    }),
    [featuredOnly, page, searchTerm, sort, verificationStatus, vertical],
  )

  const listQuery = usePublicDirectories(query)
  const canSubmitSearch =
    searchInput.trim().length === 0 ||
    searchInput.trim().length >= PUBLIC_DIRECTORY_SEARCH_MIN_LENGTH

  const handleSearchSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const normalized = searchInput.trim()
    if (normalized.length > 0 && normalized.length < PUBLIC_DIRECTORY_SEARCH_MIN_LENGTH) return
    setSearchTerm(normalized)
    setPage(1)
  }

  const handleSortChange = (value: string) => {
    setSort(value as PublicDirectorySort)
    setPage(1)
  }

  const handleVerificationChange = (value: string) => {
    setVerificationStatus(value as VerificationFilter)
    setPage(1)
  }

  const toggleFeaturedOnly = () => {
    setFeaturedOnly((prev) => !prev)
    setPage(1)
  }

  const clearFilters = () => {
    setSearchInput('')
    setSearchTerm('')
    setSort('featured')
    setVerificationStatus('all')
    setFeaturedOnly(false)
    setPage(1)
  }

  const hasActiveFilters =
    searchTerm.length > 0 || sort !== 'featured' || verificationStatus !== 'all' || featuredOnly

  const pagination = listQuery.data?.pagination
  const canGoPrev = Boolean(pagination && pagination.page > 1 && !listQuery.isLoading)
  const canGoNext = Boolean(
    pagination && pagination.page < pagination.pages && !listQuery.isLoading,
  )

  return (
    <div className="min-h-screen bg-background">
      <section className="mx-auto w-full max-w-7xl space-y-8 px-4 py-10 sm:px-6 lg:px-8">
        <header className="space-y-4">
          <Badge className="w-fit gap-1.5">
            <Star className="h-3.5 w-3.5" />
            Recursos
          </Badge>
          <div className="space-y-2">
            <h1 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
              {title}
            </h1>
            <p className="max-w-3xl text-sm text-muted-foreground sm:text-base">{description}</p>
          </div>
          {pagination ? (
            <div className="flex flex-wrap gap-2 text-xs">
              <Badge variant="secondary">{formatCount(pagination.total)} resultados</Badge>
              <Badge variant="outline">
                Pagina {formatCount(pagination.page)} de {formatCount(pagination.pages)}
              </Badge>
            </div>
          ) : null}
        </header>

        <Card className="border-border/60 bg-card/85">
          <CardHeader>
            <CardTitle className="text-lg">Filtros da vertical</CardTitle>
            <CardDescription>
              Pesquisa por nome/descricao e ajusta ordenacao, verificacao e destaque.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <form onSubmit={handleSearchSubmit} className="flex flex-col gap-3 lg:flex-row">
              <div className="space-y-1.5 lg:flex-1">
                <Label htmlFor={`search-${vertical}`}>Pesquisa</Label>
                <div className="flex gap-2">
                  <Input
                    id={`search-${vertical}`}
                    value={searchInput}
                    onChange={(event) => setSearchInput(event.target.value)}
                    placeholder="Ex: taxa, ETF, app..."
                  />
                  <Button type="submit" disabled={!canSubmitSearch}>
                    <Search className="h-4 w-4" />
                    Aplicar
                  </Button>
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-2 lg:w-[420px]">
                <div className="space-y-1.5">
                  <Label htmlFor={`sort-${vertical}`}>Ordenar por</Label>
                  <Select value={sort} onValueChange={handleSortChange}>
                    <SelectTrigger id={`sort-${vertical}`}>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {SORT_OPTIONS.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor={`verification-${vertical}`}>Verificacao</Label>
                  <Select value={verificationStatus} onValueChange={handleVerificationChange}>
                    <SelectTrigger id={`verification-${vertical}`}>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todas</SelectItem>
                      <SelectItem value="verified">Verificadas</SelectItem>
                      <SelectItem value="pending">Pendentes</SelectItem>
                      <SelectItem value="unverified">Nao verificadas</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </form>

            <div className="flex flex-wrap gap-2">
              <Button
                type="button"
                variant={featuredOnly ? 'default' : 'outline'}
                size="sm"
                onClick={toggleFeaturedOnly}
              >
                {featuredOnly ? 'Apenas featured (ativo)' : 'Apenas featured'}
              </Button>
              {hasActiveFilters ? (
                <Button type="button" variant="ghost" size="sm" onClick={clearFilters}>
                  Limpar filtros
                </Button>
              ) : null}
            </div>
          </CardContent>
        </Card>

        <PublicAdSlot slotId="DIRECTORY_VERTICAL_INLINE_01" vertical={vertical} />

        {listQuery.isLoading ? (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {Array.from({ length: 6 }).map((_, index) => (
              <Card key={`resource-skeleton-${index}`}>
                <CardHeader className="space-y-3">
                  <Skeleton className="h-4 w-40" />
                  <Skeleton className="h-3 w-24" />
                </CardHeader>
                <CardContent className="space-y-2">
                  <Skeleton className="h-3 w-full" />
                  <Skeleton className="h-3 w-5/6" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : null}

        {listQuery.isError ? (
          <Card className="border-destructive/40">
            <CardContent className="flex items-center gap-2 p-4 text-sm text-destructive">
              <AlertCircle className="h-4 w-4" />
              Nao foi possivel carregar os recursos desta vertical.
            </CardContent>
          </Card>
        ) : null}

        {!listQuery.isLoading && !listQuery.isError ? (
          <div className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {listQuery.data?.items.length ? (
                listQuery.data.items.map((item) => <DirectoryCard key={item.id} item={item} />)
              ) : (
                <Card className="md:col-span-2 xl:col-span-3">
                  <CardContent className="p-6 text-sm text-muted-foreground">
                    Sem resultados para os filtros atuais nesta vertical.
                  </CardContent>
                </Card>
              )}
            </div>

            {pagination && pagination.pages > 1 ? (
              <div className="flex items-center justify-end gap-2">
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  disabled={!canGoPrev}
                  onClick={() => setPage((current) => Math.max(1, current - 1))}
                >
                  Anterior
                </Button>
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  disabled={!canGoNext}
                  onClick={() => setPage((current) => current + 1)}
                >
                  Seguinte
                </Button>
              </div>
            ) : null}
          </div>
        ) : null}
      </section>
    </div>
  )
}
