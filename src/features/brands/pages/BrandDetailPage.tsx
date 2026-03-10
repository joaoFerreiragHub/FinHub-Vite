import { ArrowLeft, ArrowRight, ExternalLink, ShieldCheck } from 'lucide-react'
import { Link, useParams } from 'react-router-dom'
import { CommentSection, RatingsSection } from '@/features/hub/components'
import { useAuthStore } from '@/features/auth/stores/useAuthStore'
import { getErrorMessage } from '@/lib/api/client'
import {
  Badge,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  Skeleton,
} from '@/components/ui'
import {
  usePublicDirectoryDetailBySlug,
  usePublicDirectoryRelatedContent,
} from '@/features/brands/hooks/usePublicDirectories'
import { useDirectoryComments } from '@/features/brands/hooks/useDirectoryComments'
import type { PublicDirectoryRelatedContentType } from '@/features/brands/services/publicDirectoriesService'

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

const typeLabel: Record<PublicDirectoryRelatedContentType, string> = {
  article: 'Artigo',
  course: 'Curso',
  video: 'Video',
  event: 'Live',
  book: 'Livro',
  podcast: 'Podcast',
}

const getRelatedLink = (
  type: PublicDirectoryRelatedContentType,
  slug: string,
  fallbackUrl: string,
) => {
  const normalizedSlug = slug.trim()
  if (!normalizedSlug) return fallbackUrl || '/explorar/tudo'

  if (type === 'article') return `/artigos/${normalizedSlug}`
  if (type === 'course') return `/cursos/${normalizedSlug}`
  if (type === 'video') return `/videos/${normalizedSlug}`
  if (type === 'event') return `/eventos/${normalizedSlug}`
  if (type === 'book') return `/livros/${normalizedSlug}`
  if (type === 'podcast') return `/podcasts/${normalizedSlug}`
  return fallbackUrl || '/explorar/tudo'
}

const formatCount = (value: number) => numberFormatter.format(value)
const formatRating = (value: number) => ratingFormatter.format(value)

const formatDate = (value: string | null) => {
  if (!value) return null
  const parsed = new Date(value)
  if (Number.isNaN(parsed.getTime())) return null
  return parsed.toLocaleDateString('pt-PT', {
    year: 'numeric',
    month: 'short',
    day: '2-digit',
  })
}

export default function BrandDetailPage() {
  const { slug = '' } = useParams<{ slug: string }>()
  const normalizedSlug = slug.trim().toLowerCase()
  const currentUserId = useAuthStore((state) => state.user?.id)

  const detailQuery = usePublicDirectoryDetailBySlug(normalizedSlug)
  const entry = detailQuery.data
  const relatedQuery = usePublicDirectoryRelatedContent(
    entry?.verticalType ?? null,
    normalizedSlug,
    9,
    {
      enabled: Boolean(entry?.verticalType),
    },
  )
  const comments = useDirectoryComments(entry?.id ?? '', {
    enabled: Boolean(entry?.id),
    currentUserId,
    contentQueryKey: ['directories', 'detail-by-slug', normalizedSlug],
  })

  if (detailQuery.isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <section className="mx-auto w-full max-w-7xl space-y-6 px-4 py-10 sm:px-6 lg:px-8">
          <Skeleton className="h-10 w-40" />
          <Skeleton className="h-40 w-full" />
          <div className="grid gap-4 md:grid-cols-3">
            {Array.from({ length: 6 }).map((_, index) => (
              <Skeleton key={`detail-skeleton-${index}`} className="h-28 w-full" />
            ))}
          </div>
        </section>
      </div>
    )
  }

  if (detailQuery.isError || !entry) {
    return (
      <div className="min-h-screen bg-background">
        <section className="mx-auto flex w-full max-w-3xl flex-col gap-4 px-4 py-16 sm:px-6">
          <Card className="border-border/60 bg-card/85">
            <CardHeader>
              <CardTitle>Recurso nao encontrado</CardTitle>
              <CardDescription>
                O recurso pedido nao esta disponivel no diretorio publico.
              </CardDescription>
            </CardHeader>
            <CardFooter>
              <Button asChild variant="outline">
                <Link to="/recursos">
                  <ArrowLeft className="h-4 w-4" />
                  Voltar ao diretorio
                </Link>
              </Button>
            </CardFooter>
          </Card>
        </section>
      </div>
    )
  }

  const publishedAt = formatDate(entry.publishedAt)
  const updatedAt = formatDate(entry.updatedAt)
  const relatedItems = relatedQuery.data?.items ?? []

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
          <Badge variant="outline">{verticalLabel[entry.verticalType] || 'Recurso'}</Badge>
          {entry.verificationStatus === 'verified' ? (
            <Badge variant="secondary">
              <ShieldCheck className="mr-1 h-3.5 w-3.5" />
              Verificado
            </Badge>
          ) : null}
          {entry.isSponsoredPlacement ? <Badge variant="outline">Patrocinado</Badge> : null}
        </div>

        <Card className="overflow-hidden border-border/60 bg-card/90">
          {entry.coverImage ? (
            <div className="h-44 w-full bg-muted sm:h-56">
              <img src={entry.coverImage} alt={entry.name} className="h-full w-full object-cover" />
            </div>
          ) : null}

          <CardHeader className="space-y-4">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="space-y-2">
                <CardTitle className="text-2xl">{entry.name}</CardTitle>
                <CardDescription className="text-sm">{entry.shortDescription}</CardDescription>
              </div>
              <div className="flex flex-wrap gap-2">
                {entry.website ? (
                  <Button asChild size="sm">
                    <a href={entry.website} target="_blank" rel="noreferrer noopener">
                      Site oficial
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  </Button>
                ) : null}
              </div>
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            <div className="grid gap-3 text-xs text-muted-foreground sm:grid-cols-2 lg:grid-cols-4">
              <div className="rounded-md border border-border/60 px-3 py-2">
                <div className="font-medium text-foreground">{formatCount(entry.views)}</div>
                <div>Views</div>
              </div>
              <div className="rounded-md border border-border/60 px-3 py-2">
                <div className="font-medium text-foreground">
                  {entry.ratingsCount > 0 ? formatRating(entry.averageRating) : '-'}
                </div>
                <div>Rating medio</div>
              </div>
              <div className="rounded-md border border-border/60 px-3 py-2">
                <div className="font-medium text-foreground">{formatCount(entry.ratingsCount)}</div>
                <div>Avaliacoes</div>
              </div>
              <div className="rounded-md border border-border/60 px-3 py-2">
                <div className="font-medium text-foreground">
                  {formatCount(entry.commentsCount)}
                </div>
                <div>Comentarios</div>
              </div>
            </div>

            <div className="grid gap-4 lg:grid-cols-2">
              <Card className="border-border/60 bg-background/70">
                <CardHeader>
                  <CardTitle className="text-base">Informacao geral</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm text-muted-foreground">
                  <p>
                    <span className="font-medium text-foreground">Vertical:</span>{' '}
                    {verticalLabel[entry.verticalType] || entry.verticalType}
                  </p>
                  <p>
                    <span className="font-medium text-foreground">Pais:</span>{' '}
                    {entry.country || 'Nao informado'}
                  </p>
                  <p>
                    <span className="font-medium text-foreground">Regiao:</span>{' '}
                    {entry.region || 'Nao informado'}
                  </p>
                  <p>
                    <span className="font-medium text-foreground">Publicado:</span>{' '}
                    {publishedAt || 'Nao disponivel'}
                  </p>
                  <p>
                    <span className="font-medium text-foreground">Atualizado:</span>{' '}
                    {updatedAt || 'Nao disponivel'}
                  </p>
                  {entry.canonicalUrl ? (
                    <p>
                      <span className="font-medium text-foreground">URL canonica:</span>{' '}
                      <a
                        href={entry.canonicalUrl}
                        target="_blank"
                        rel="noreferrer noopener"
                        className="text-primary underline-offset-4 hover:underline"
                      >
                        Abrir
                      </a>
                    </p>
                  ) : null}
                </CardContent>
              </Card>

              <Card className="border-border/60 bg-background/70">
                <CardHeader>
                  <CardTitle className="text-base">Regulacao e custo</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm text-muted-foreground">
                  <div>
                    <p className="font-medium text-foreground">Reguladores</p>
                    <p>
                      {entry.regulatedBy.length > 0 ? entry.regulatedBy.join(', ') : 'Sem dados.'}
                    </p>
                  </div>
                  <div>
                    <p className="font-medium text-foreground">Licencas</p>
                    <p>{entry.licenses.length > 0 ? entry.licenses.join(', ') : 'Sem dados.'}</p>
                  </div>
                  <div>
                    <p className="font-medium text-foreground">Pricing</p>
                    <p>{entry.pricing || 'Sem dados de pricing.'}</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {entry.description ? (
              <Card className="border-border/60 bg-background/70">
                <CardHeader>
                  <CardTitle className="text-base">Descricao</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{entry.description}</p>
                </CardContent>
              </Card>
            ) : null}

            <div className="grid gap-4 lg:grid-cols-2">
              {entry.pros.length > 0 ? (
                <Card className="border-border/60 bg-background/70">
                  <CardHeader>
                    <CardTitle className="text-base">Pontos fortes</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-1.5 text-sm text-muted-foreground">
                      {entry.pros.map((item) => (
                        <li key={item}>- {item}</li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              ) : null}

              {entry.cons.length > 0 ? (
                <Card className="border-border/60 bg-background/70">
                  <CardHeader>
                    <CardTitle className="text-base">Pontos fracos</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-1.5 text-sm text-muted-foreground">
                      {entry.cons.map((item) => (
                        <li key={item}>- {item}</li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              ) : null}
            </div>

            {entry.keyFeatures.length > 0 ? (
              <Card className="border-border/60 bg-background/70">
                <CardHeader>
                  <CardTitle className="text-base">Key features</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-wrap gap-2">
                  {entry.keyFeatures.map((item) => (
                    <Badge key={item} variant="outline">
                      {item}
                    </Badge>
                  ))}
                </CardContent>
              </Card>
            ) : null}

            {entry.categories.length > 0 || entry.tags.length > 0 ? (
              <Card className="border-border/60 bg-background/70">
                <CardHeader>
                  <CardTitle className="text-base">Categorias e tags</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {entry.categories.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {entry.categories.map((item) => (
                        <Badge key={`category-${item}`} variant="secondary">
                          {item}
                        </Badge>
                      ))}
                    </div>
                  ) : null}
                  {entry.tags.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {entry.tags.map((item) => (
                        <Badge key={`tag-${item}`} variant="outline">
                          #{item}
                        </Badge>
                      ))}
                    </div>
                  ) : null}
                </CardContent>
              </Card>
            ) : null}
          </CardContent>
        </Card>

        <section className="space-y-4">
          <RatingsSection
            targetType="directory_entry"
            targetId={entry.id}
            formTitle="Avaliar este recurso"
            sectionTitle="Avaliacoes e reviews"
            contentQueryKey={['directories', 'detail-by-slug', normalizedSlug]}
          />
        </section>

        <section className="space-y-4">
          {comments.error ? (
            <Card className="border-red-200 bg-red-50 text-red-800">
              <CardContent className="p-4 text-sm">
                Erro ao carregar comentarios: {getErrorMessage(comments.error)}
              </CardContent>
            </Card>
          ) : null}

          <CommentSection
            targetType="directory_entry"
            targetId={entry.id}
            currentUserId={currentUserId}
            response={comments.response}
            onSubmitComment={comments.submitComment}
            onReplyComment={comments.replyToComment}
            onEditComment={comments.editComment}
            onDeleteComment={comments.deleteComment}
            onLikeComment={comments.likeComment}
            onLoadMore={comments.loadMore}
            isLoading={comments.isLoading}
            sortBy={comments.sortBy}
            onSortChange={comments.setSortBy}
          />
        </section>

        <section className="space-y-4">
          <div className="space-y-1">
            <h2 className="text-xl font-semibold text-foreground">Conteudo relacionado</h2>
            <p className="text-sm text-muted-foreground">
              Itens editoriais associados a este recurso.
            </p>
          </div>

          {relatedQuery.isLoading ? (
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {Array.from({ length: 3 }).map((_, index) => (
                <Card key={`related-skeleton-${index}`}>
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

          {!relatedQuery.isLoading && relatedItems.length === 0 ? (
            <Card>
              <CardContent className="p-6 text-sm text-muted-foreground">
                Ainda nao existem itens relacionados para este recurso.
              </CardContent>
            </Card>
          ) : null}

          {!relatedQuery.isLoading && relatedItems.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {relatedItems.map((item) => (
                <Card key={item.id} className="border-border/60 bg-card/85">
                  <CardHeader className="space-y-3">
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge variant="outline">{typeLabel[item.type]}</Badge>
                      {item.isSponsored ? <Badge>Patrocinado</Badge> : null}
                    </div>
                    <CardTitle className="text-base leading-tight">{item.title}</CardTitle>
                    <CardDescription>{item.description || 'Sem descricao curta.'}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-2 text-xs text-muted-foreground">
                    <p>{formatCount(item.views)} views</p>
                    <p>Rating: {item.averageRating > 0 ? formatRating(item.averageRating) : '-'}</p>
                  </CardContent>
                  <CardFooter>
                    <Button asChild size="sm" variant="outline">
                      <Link to={getRelatedLink(item.type, item.slug, item.url)}>
                        Abrir conteudo
                        <ArrowRight className="h-4 w-4" />
                      </Link>
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : null}
        </section>
      </section>
    </div>
  )
}
