import { useMemo, useState } from 'react'
import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  Plus,
  Scale,
  Search,
  ShieldCheck,
  X,
} from 'lucide-react'
import { Link, useSearchParams } from 'react-router-dom'
import { getErrorMessage } from '@/lib/api/client'
import {
  Badge,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Input,
  Skeleton,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui'
import {
  useComparePublicDirectories,
  useSearchPublicDirectories,
} from '../hooks/usePublicDirectories'
import {
  PUBLIC_DIRECTORY_SEARCH_MIN_LENGTH,
  type PublicDirectoryCompareMetrics,
  type PublicDirectoryDetailEntry,
} from '../services/publicDirectoriesService'

const MIN_COMPARE_ITEMS = 2
const MAX_COMPARE_ITEMS = 3

const numberFormatter = new Intl.NumberFormat('pt-PT')
const ratingFormatter = new Intl.NumberFormat('pt-PT', {
  minimumFractionDigits: 1,
  maximumFractionDigits: 1,
})

const verticalLabel: Record<string, string> = {
  broker: 'Corretora',
  exchange: 'Exchange',
  site: 'Site',
  app: 'App',
  podcast: 'Podcast',
  event: 'Evento',
  insurance: 'Seguradora',
  bank: 'Banco',
  fund: 'Fundo',
  fintech: 'Plataforma',
  newsletter: 'Newsletter',
  other: 'Outro',
}

const parseSlugsParam = (value: string | null): string[] => {
  if (!value) return []

  return Array.from(
    new Set(
      value
        .split(',')
        .map((item) => item.trim().toLowerCase())
        .filter((item) => item.length >= PUBLIC_DIRECTORY_SEARCH_MIN_LENGTH),
    ),
  ).slice(0, MAX_COMPARE_ITEMS)
}

const formatCount = (value: number) => numberFormatter.format(value)
const formatRating = (value: number) => ratingFormatter.format(value)

const metricRows: Array<{
  key: keyof PublicDirectoryCompareMetrics
  label: string
  format: (value: number) => string
}> = [
  {
    key: 'views',
    label: 'Views',
    format: formatCount,
  },
  {
    key: 'averageRating',
    label: 'Rating medio',
    format: formatRating,
  },
  {
    key: 'ratingsCount',
    label: 'Avaliacoes',
    format: formatCount,
  },
  {
    key: 'commentsCount',
    label: 'Comentarios',
    format: formatCount,
  },
]

const resolveComparisonValue = (
  entry: PublicDirectoryDetailEntry,
  metricKey: keyof PublicDirectoryCompareMetrics,
): number => {
  if (metricKey === 'views') return entry.views
  if (metricKey === 'averageRating') return entry.averageRating
  if (metricKey === 'ratingsCount') return entry.ratingsCount
  return entry.commentsCount
}

export default function BrandsComparePage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [searchInput, setSearchInput] = useState('')

  const selectedSlugs = useMemo(
    () => parseSlugsParam(searchParams.get('slugs')),
    [searchParams],
  )

  const canCompare = selectedSlugs.length >= MIN_COMPARE_ITEMS
  const canAddMore = selectedSlugs.length < MAX_COMPARE_ITEMS
  const hasSearchTerm = searchInput.trim().length >= PUBLIC_DIRECTORY_SEARCH_MIN_LENGTH

  const searchQuery = useSearchPublicDirectories(
    searchInput,
    {
      limit: 8,
      sort: 'featured',
    },
    {
      enabled: hasSearchTerm && canAddMore,
    },
  )

  const compareQuery = useComparePublicDirectories(selectedSlugs, {
    enabled: canCompare,
  })

  const searchResults = searchQuery.data?.items ?? []
  const availableResults = searchResults.filter((item) => !selectedSlugs.includes(item.slug))

  const updateSelectedSlugs = (nextSlugs: string[]) => {
    const normalized = Array.from(
      new Set(
        nextSlugs
          .map((item) => item.trim().toLowerCase())
          .filter((item) => item.length >= PUBLIC_DIRECTORY_SEARCH_MIN_LENGTH),
      ),
    ).slice(0, MAX_COMPARE_ITEMS)

    const nextParams = new URLSearchParams(searchParams)
    if (normalized.length > 0) {
      nextParams.set('slugs', normalized.join(','))
    } else {
      nextParams.delete('slugs')
    }

    setSearchParams(nextParams, { replace: true })
  }

  const addSlug = (slug: string) => {
    if (!canAddMore) return
    if (selectedSlugs.includes(slug)) return
    updateSelectedSlugs([...selectedSlugs, slug])
  }

  const removeSlug = (slug: string) => {
    updateSelectedSlugs(selectedSlugs.filter((item) => item !== slug))
  }

  const clearSelected = () => {
    updateSelectedSlugs([])
  }

  const comparedItems = compareQuery.data?.items ?? []
  const comparison = compareQuery.data?.comparison

  return (
    <div className="min-h-screen bg-background">
      <section className="mx-auto w-full max-w-7xl space-y-8 px-4 py-10 sm:px-6 lg:px-8">
        <div className="flex flex-wrap gap-2">
          <Button asChild variant="ghost" size="sm">
            <Link to="/recursos">
              <ArrowLeft className="h-4 w-4" />
              Diretorio
            </Link>
          </Button>
          <Badge variant="outline">
            {selectedSlugs.length}/{MAX_COMPARE_ITEMS} selecionados
          </Badge>
        </div>

        <header className="space-y-3">
          <Badge className="w-fit gap-1.5">
            <Scale className="h-3.5 w-3.5" />
            Comparador de recursos
          </Badge>
          <div className="space-y-2">
            <h1 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
              Compara entidades lado a lado
            </h1>
            <p className="max-w-3xl text-sm text-muted-foreground sm:text-base">
              Seleciona entre 2 e 3 recursos para comparar metrica de views, ratings e comentarios
              num unico painel.
            </p>
          </div>
        </header>

        <Card className="border-border/60 bg-card/85">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Search className="h-4 w-4" />
              Selecionar recursos
            </CardTitle>
            <CardDescription>
              Pesquisa por nome ou slug e adiciona no maximo {MAX_COMPARE_ITEMS} recursos.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input
              value={searchInput}
              onChange={(event) => setSearchInput(event.target.value)}
              placeholder="Ex: xtb, degiro, trading212..."
              aria-label="Pesquisar recursos para comparar"
              disabled={!canAddMore}
            />

            <div className="flex flex-wrap gap-2">
              {selectedSlugs.length > 0 ? (
                selectedSlugs.map((slug) => (
                  <Badge key={slug} variant="secondary" className="gap-1.5">
                    {slug}
                    <button
                      type="button"
                      className="inline-flex items-center"
                      onClick={() => removeSlug(slug)}
                      aria-label={`Remover ${slug} da comparacao`}
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </Badge>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">Nenhum recurso selecionado.</p>
              )}
            </div>

            {selectedSlugs.length > 0 ? (
              <Button type="button" variant="ghost" size="sm" onClick={clearSelected}>
                Limpar selecao
              </Button>
            ) : null}

            {!canAddMore ? (
              <p className="text-xs text-muted-foreground">
                Limite atingido. Remove um recurso para adicionar outro.
              </p>
            ) : null}

            {hasSearchTerm && searchQuery.isLoading ? (
              <div className="grid gap-2">
                {Array.from({ length: 3 }).map((_, index) => (
                  <Skeleton key={`compare-search-skeleton-${index}`} className="h-12 w-full" />
                ))}
              </div>
            ) : null}

            {hasSearchTerm && searchQuery.isError ? (
              <Card className="border-destructive/40">
                <CardContent className="flex items-center gap-2 p-4 text-sm text-destructive">
                  <AlertCircle className="h-4 w-4" />
                  {getErrorMessage(searchQuery.error)}
                </CardContent>
              </Card>
            ) : null}

            {hasSearchTerm && !searchQuery.isLoading && !searchQuery.isError ? (
              <div className="space-y-2">
                {availableResults.length === 0 ? (
                  <p className="text-sm text-muted-foreground">
                    Sem resultados novos para adicionar.
                  </p>
                ) : (
                  availableResults.map((item) => (
                    <div
                      key={item.id}
                      className="flex flex-wrap items-center justify-between gap-3 rounded-md border border-border/60 p-3"
                    >
                      <div className="space-y-1">
                        <p className="text-sm font-medium text-foreground">{item.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {verticalLabel[item.verticalType] || 'Recurso'} • slug: {item.slug}
                        </p>
                      </div>
                      <Button type="button" size="sm" onClick={() => addSlug(item.slug)}>
                        <Plus className="h-4 w-4" />
                        Adicionar
                      </Button>
                    </div>
                  ))
                )}
              </div>
            ) : null}
          </CardContent>
        </Card>

        {!canCompare ? (
          <Card className="border-border/60 bg-card/85">
            <CardContent className="p-5 text-sm text-muted-foreground">
              Seleciona pelo menos {MIN_COMPARE_ITEMS} recursos para ativar a comparacao.
            </CardContent>
          </Card>
        ) : null}

        {canCompare && compareQuery.isLoading ? (
          <div className="space-y-4">
            <Skeleton className="h-64 w-full" />
            <Skeleton className="h-48 w-full" />
          </div>
        ) : null}

        {canCompare && compareQuery.isError ? (
          <Card className="border-destructive/40">
            <CardContent className="flex items-center gap-2 p-4 text-sm text-destructive">
              <AlertCircle className="h-4 w-4" />
              {getErrorMessage(compareQuery.error)}
            </CardContent>
          </Card>
        ) : null}

        {canCompare && !compareQuery.isLoading && !compareQuery.isError && comparison ? (
          <section className="space-y-6">
            <Card className="border-border/60 bg-card/90">
              <CardHeader>
                <CardTitle className="text-lg">Comparacao de metricas</CardTitle>
                <CardDescription>
                  Leaderboard por metrica com destaque automatico de quem lidera.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-44">Metrica</TableHead>
                      {comparedItems.map((item) => (
                        <TableHead key={`head-${item.id}`}>
                          <div className="space-y-1">
                            <p className="text-foreground">{item.name}</p>
                            <p className="text-xs font-normal text-muted-foreground">
                              {verticalLabel[item.verticalType] || 'Recurso'}
                            </p>
                          </div>
                        </TableHead>
                      ))}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {metricRows.map((row) => (
                      <TableRow key={row.key}>
                        <TableCell className="font-medium text-foreground">{row.label}</TableCell>
                        {comparedItems.map((item) => {
                          const value = resolveComparisonValue(item, row.key)
                          const isLeader = comparison.metrics[row.key].leaderIds.includes(item.id)
                          return (
                            <TableCell key={`${row.key}-${item.id}`}>
                              <div className="flex flex-wrap items-center gap-2">
                                <span>{row.format(value)}</span>
                                {isLeader ? <Badge variant="secondary">Lider</Badge> : null}
                              </div>
                            </TableCell>
                          )
                        })}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            <div className="grid gap-4 lg:grid-cols-3">
              <Card className="border-border/60 bg-card/85 lg:col-span-2">
                <CardHeader>
                  <CardTitle className="text-base">Contexto comum</CardTitle>
                  <CardDescription>
                    Interseccao automatica dos campos partilhados pelos recursos selecionados.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3 text-sm">
                  <div>
                    <p className="mb-1 font-medium text-foreground">Tags em comum</p>
                    <div className="flex flex-wrap gap-2">
                      {comparison.shared.tags.length > 0 ? (
                        comparison.shared.tags.map((tag) => (
                          <Badge key={`shared-tag-${tag}`} variant="outline">
                            #{tag}
                          </Badge>
                        ))
                      ) : (
                        <span className="text-muted-foreground">Sem interseccao.</span>
                      )}
                    </div>
                  </div>
                  <div>
                    <p className="mb-1 font-medium text-foreground">Categorias em comum</p>
                    <div className="flex flex-wrap gap-2">
                      {comparison.shared.categories.length > 0 ? (
                        comparison.shared.categories.map((category) => (
                          <Badge key={`shared-category-${category}`} variant="outline">
                            {category}
                          </Badge>
                        ))
                      ) : (
                        <span className="text-muted-foreground">Sem interseccao.</span>
                      )}
                    </div>
                  </div>
                  <div>
                    <p className="mb-1 font-medium text-foreground">Reguladores em comum</p>
                    <div className="flex flex-wrap gap-2">
                      {comparison.shared.regulatedBy.length > 0 ? (
                        comparison.shared.regulatedBy.map((regulatedBy) => (
                          <Badge key={`shared-reg-${regulatedBy}`} variant="outline">
                            {regulatedBy}
                          </Badge>
                        ))
                      ) : (
                        <span className="text-muted-foreground">Sem interseccao.</span>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-border/60 bg-card/85">
                <CardHeader>
                  <CardTitle className="text-base">Resumo</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm text-muted-foreground">
                  <p>
                    <span className="font-medium text-foreground">Itens:</span>{' '}
                    {formatCount(comparison.count)}
                  </p>
                  <p>
                    <span className="font-medium text-foreground">Verticais:</span>{' '}
                    {comparison.verticalTypes.length > 0
                      ? comparison.verticalTypes.map((value) => verticalLabel[value] || value).join(', ')
                      : 'Sem dados'}
                  </p>
                </CardContent>
              </Card>
            </div>

            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {comparedItems.map((item) => (
                <Card key={`compared-${item.id}`} className="border-border/60 bg-card/85">
                  <CardHeader className="space-y-2">
                    <CardTitle className="text-base">{item.name}</CardTitle>
                    <CardDescription>
                      {verticalLabel[item.verticalType] || 'Recurso'} • {item.country || 'Global'}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3 text-sm text-muted-foreground">
                    {item.verificationStatus === 'verified' ? (
                      <Badge variant="secondary">
                        <ShieldCheck className="mr-1 h-3.5 w-3.5" />
                        Verificado
                      </Badge>
                    ) : null}
                    <p>{item.shortDescription}</p>
                    <p>
                      Rating: {item.ratingsCount > 0 ? formatRating(item.averageRating) : '-'}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      <Button asChild size="sm" variant="outline">
                        <Link to={`/recursos/${item.slug}`}>
                          Ver detalhe
                          <ArrowRight className="h-4 w-4" />
                        </Link>
                      </Button>
                      {item.website ? (
                        <Button asChild size="sm" variant="ghost">
                          <a href={item.website} target="_blank" rel="noreferrer noopener">
                            Site
                          </a>
                        </Button>
                      ) : null}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        ) : null}
      </section>
    </div>
  )
}
