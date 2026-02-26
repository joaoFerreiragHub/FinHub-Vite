import { useEffect, useMemo, useState } from 'react'
import { AlertCircle, ArrowLeft, ArrowRight, ExternalLink, RefreshCw } from 'lucide-react'
import { HomepageLayout } from '@/components/home/HomepageLayout'
import { PageHero } from '@/components/public'
import { Badge, Button, Card, CardContent, Input, Label } from '@/components/ui'
import {
  useEditorialLanding,
  useEditorialShowAll,
} from '@/features/markets/hooks/useEditorialPublic'
import type { PublicEditorialSort } from '@/features/markets/services/editorialPublicApi'
import { MarketSubNav } from '@/pages/mercados/_components/MarketSubNav'
import {
  EDITORIAL_VERTICALS,
  getEditorialVerticalBySlug,
  type EditorialVerticalRouteConfig,
} from './editorialVerticals'

export type EditorialDirectoryPageMode = 'landing' | 'show-all'

interface EditorialDirectoryPageProps {
  verticalSlug: string
  mode: EditorialDirectoryPageMode
}

const LIST_LIMITS: Record<EditorialDirectoryPageMode, number> = {
  landing: 12,
  'show-all': 24,
}

const SORT_OPTIONS: Array<{ value: PublicEditorialSort; label: string }> = [
  { value: 'featured', label: 'Destaque' },
  { value: 'recent', label: 'Mais recente' },
  { value: 'name', label: 'Nome (A-Z)' },
]

const splitCommaValues = (value: string): string[] =>
  value
    .split(',')
    .map((item) => item.trim())
    .filter((item) => item.length > 0)

function InvalidVerticalState() {
  return (
    <HomepageLayout>
      <div className="min-h-screen bg-background">
        <PageHero
          title="Vertical nao encontrada"
          subtitle="A vertical pedida nao existe no diretorio editorial."
          compact
          backgroundImage="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1800&q=80"
        />

        <section className="px-4 sm:px-6 md:px-10 lg:px-12 py-10">
          <div className="mx-auto max-w-6xl space-y-6">
            <MarketSubNav current="/mercados/recursos" />
            <Card className="border border-border/60 bg-card/70">
              <CardContent className="space-y-4 p-6">
                <p className="text-sm text-muted-foreground">
                  Escolhe uma das verticais disponiveis para continuar:
                </p>
                <div className="flex flex-wrap gap-2">
                  {EDITORIAL_VERTICALS.map((vertical) => (
                    <a
                      key={vertical.slug}
                      href={`/mercados/recursos/${vertical.slug}`}
                      className="rounded-lg border border-border px-3 py-1.5 text-sm text-muted-foreground transition hover:border-primary/40 hover:text-foreground"
                    >
                      {vertical.label}
                    </a>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </section>
      </div>
    </HomepageLayout>
  )
}

function DirectoryPageContent({
  vertical,
  mode,
}: {
  vertical: EditorialVerticalRouteConfig
  mode: EditorialDirectoryPageMode
}) {
  const [search, setSearch] = useState('')
  const [country, setCountry] = useState('')
  const [categories, setCategories] = useState('')
  const [tags, setTags] = useState('')
  const [featuredOnly, setFeaturedOnly] = useState(false)
  const [sort, setSort] = useState<PublicEditorialSort>('featured')
  const [page, setPage] = useState(1)

  const query = useMemo(() => {
    const parsedCategories = splitCommaValues(categories)
    const parsedTags = splitCommaValues(tags)
    const limit = LIST_LIMITS[mode]

    return {
      search: search.trim() || undefined,
      country: country.trim() || undefined,
      categories: parsedCategories.length > 0 ? parsedCategories : undefined,
      tags: parsedTags.length > 0 ? parsedTags : undefined,
      featured: featuredOnly ? true : undefined,
      sort,
      page,
      limit,
    }
  }, [categories, country, featuredOnly, mode, page, search, sort, tags])

  useEffect(() => {
    setPage(1)
  }, [search, country, categories, tags, featuredOnly, sort, mode])

  const landingQuery = useEditorialLanding(vertical.apiVertical, query, {
    enabled: mode === 'landing',
  })
  const showAllQuery = useEditorialShowAll(vertical.apiVertical, query, {
    enabled: mode === 'show-all',
  })

  const activeQuery = mode === 'show-all' ? showAllQuery : landingQuery
  const data = activeQuery.data
  const isLoading = activeQuery.isLoading
  const isError = activeQuery.isError
  const isFetching = activeQuery.isFetching

  const pagination = data?.pagination ?? {
    page,
    limit: LIST_LIMITS[mode],
    total: 0,
    pages: 1,
  }
  const items = data?.items ?? []
  const canGoPrev = pagination.page > 1
  const canGoNext = pagination.page < pagination.pages

  return (
    <HomepageLayout>
      <div className="min-h-screen bg-background">
        <PageHero
          title={`${vertical.label} ${mode === 'show-all' ? '- Show all' : ''}`}
          subtitle={vertical.description}
          compact
          backgroundImage="https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1800&q=80"
        />

        <section className="px-4 sm:px-6 md:px-10 lg:px-12 py-10">
          <div className="mx-auto max-w-6xl space-y-6">
            <MarketSubNav current="/mercados/recursos" />

            <Card className="border border-border/60 bg-card/70">
              <CardContent className="space-y-5 p-6">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <p className="text-sm text-muted-foreground">
                    Filtros publicos alimentados por `/api/editorial/{vertical.apiVertical}`.
                  </p>
                  {mode === 'landing' ? (
                    <Button asChild variant="outline">
                      <a href={`/mercados/recursos/${vertical.slug}/show-all`}>
                        Ver show-all
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </a>
                    </Button>
                  ) : (
                    <Button asChild variant="outline">
                      <a href={`/mercados/recursos/${vertical.slug}`}>
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Voltar a landing
                      </a>
                    </Button>
                  )}
                </div>

                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  <div className="space-y-2">
                    <Label htmlFor="resource-search">Pesquisa</Label>
                    <Input
                      id="resource-search"
                      value={search}
                      onChange={(event) => setSearch(event.target.value)}
                      placeholder="Nome, slug ou descricao"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="resource-country">Pais</Label>
                    <Input
                      id="resource-country"
                      value={country}
                      onChange={(event) => setCountry(event.target.value)}
                      placeholder="ex: PT"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="resource-sort">Ordenacao</Label>
                    <select
                      id="resource-sort"
                      value={sort}
                      onChange={(event) => setSort(event.target.value as PublicEditorialSort)}
                      className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
                    >
                      {SORT_OPTIONS.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="resource-categories">Categorias (separadas por virgula)</Label>
                    <Input
                      id="resource-categories"
                      value={categories}
                      onChange={(event) => setCategories(event.target.value)}
                      placeholder="broker, derivados, forex"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="resource-tags">Tags (separadas por virgula)</Label>
                    <Input
                      id="resource-tags"
                      value={tags}
                      onChange={(event) => setTags(event.target.value)}
                      placeholder="low-fees, beginner"
                    />
                  </div>
                </div>

                <label className="inline-flex items-center gap-2 text-sm text-muted-foreground">
                  <input
                    type="checkbox"
                    checked={featuredOnly}
                    onChange={(event) => setFeaturedOnly(event.target.checked)}
                    className="h-4 w-4 rounded border-border"
                  />
                  Mostrar apenas featured
                </label>
              </CardContent>
            </Card>

            <div className="flex items-center justify-between gap-3 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Badge variant="outline">{pagination.total}</Badge>
                <span>registos encontrados</span>
                {isFetching ? <span className="text-primary">a atualizar...</span> : null}
              </div>
              <Button variant="ghost" size="sm" onClick={() => activeQuery.refetch()}>
                <RefreshCw className="mr-2 h-4 w-4" />
                Atualizar
              </Button>
            </div>

            {isLoading ? (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {Array.from({ length: 6 }).map((_, index) => (
                  <Card key={`skeleton-${index}`} className="border border-border/60 bg-card/70">
                    <CardContent className="space-y-3 p-5">
                      <div className="h-4 w-2/3 animate-pulse rounded bg-muted" />
                      <div className="h-3 w-full animate-pulse rounded bg-muted" />
                      <div className="h-3 w-1/2 animate-pulse rounded bg-muted" />
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : null}

            {isError ? (
              <Card className="border border-red-500/40 bg-red-500/5">
                <CardContent className="flex items-start gap-3 p-6">
                  <AlertCircle className="mt-0.5 h-5 w-5 text-red-500" />
                  <div className="space-y-2">
                    <p className="font-medium text-foreground">
                      Nao foi possivel carregar os recursos desta vertical.
                    </p>
                    <Button variant="outline" size="sm" onClick={() => activeQuery.refetch()}>
                      Tentar novamente
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ) : null}

            {!isLoading && !isError && items.length === 0 ? (
              <Card className="border border-border/60 bg-card/70">
                <CardContent className="p-6 text-sm text-muted-foreground">
                  Nenhum recurso encontrado com os filtros atuais.
                </CardContent>
              </Card>
            ) : null}

            {!isLoading && !isError && items.length > 0 ? (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {items.map((item) => (
                  <Card
                    key={item.id}
                    className="group border border-border/60 bg-card/70 transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-lg"
                  >
                    <CardContent className="space-y-4 p-5">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <h2 className="text-lg font-semibold text-foreground">{item.name}</h2>
                          <p className="text-xs text-muted-foreground">{item.slug}</p>
                        </div>
                        {item.isFeatured ? (
                          <Badge className="bg-primary text-primary-foreground">Featured</Badge>
                        ) : (
                          <Badge variant="outline">{item.verificationStatus}</Badge>
                        )}
                      </div>

                      <p className="text-sm text-muted-foreground">{item.shortDescription}</p>

                      <div className="flex flex-wrap gap-2">
                        {item.country ? (
                          <Badge variant="outline" className="text-xs">
                            {item.country}
                          </Badge>
                        ) : null}
                        {item.categories.slice(0, 2).map((category) => (
                          <Badge
                            key={`${item.id}-${category}`}
                            variant="outline"
                            className="text-xs"
                          >
                            {category}
                          </Badge>
                        ))}
                      </div>

                      <div className="flex items-center justify-between gap-2">
                        {item.website ? (
                          <a
                            href={item.website}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center text-sm text-primary hover:underline"
                          >
                            Aceder
                            <ExternalLink className="ml-1 h-3.5 w-3.5" />
                          </a>
                        ) : (
                          <span className="text-xs text-muted-foreground">
                            URL externa indisponivel
                          </span>
                        )}
                        {item.updatedAt ? (
                          <span className="text-xs text-muted-foreground">
                            {new Date(item.updatedAt).toLocaleDateString('pt-PT')}
                          </span>
                        ) : null}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : null}

            <div className="flex items-center justify-between rounded-xl border border-border/60 bg-card/70 p-4">
              <div className="text-sm text-muted-foreground">
                Pagina <span className="font-semibold text-foreground">{pagination.page}</span> de{' '}
                <span className="font-semibold text-foreground">{pagination.pages}</span>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => canGoPrev && setPage((prev) => Math.max(1, prev - 1))}
                  disabled={!canGoPrev}
                >
                  Anterior
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    canGoNext && setPage((prev) => Math.min(pagination.pages, prev + 1))
                  }
                  disabled={!canGoNext}
                >
                  Seguinte
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </section>
      </div>
    </HomepageLayout>
  )
}

export function EditorialDirectoryPage({ verticalSlug, mode }: EditorialDirectoryPageProps) {
  const vertical = getEditorialVerticalBySlug(verticalSlug)
  if (!vertical) {
    return <InvalidVerticalState />
  }

  return <DirectoryPageContent vertical={vertical} mode={mode} />
}
