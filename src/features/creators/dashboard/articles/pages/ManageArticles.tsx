import { useMemo, useState } from 'react'
import { PenSquare, RefreshCcw, Rocket, Trash2, Undo2 } from 'lucide-react'

import {
  Badge,
  Button,
  Card,
  CardContent,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui'
import {
  useDeleteArticle,
  useMyArticles,
  usePublishArticle,
  useUnpublishArticle,
} from '@/features/hub/articles/hooks/useArticles'
import type { Article } from '@/features/hub/articles/types'
import { getErrorMessage } from '@/lib/api/client'
import { DashboardLayout } from '@/shared/layouts'

type ArticleStatusFilter = 'all' | 'draft' | 'published'
type NumericCandidate = number | string | null | undefined
type ArticleWithLegacyFields = Article & {
  _id?: string
  views?: NumericCandidate
  ratingsCount?: NumericCandidate
}

const toFiniteNumber = (value: NumericCandidate): number | null => {
  if (typeof value === 'number' && Number.isFinite(value)) return value
  if (typeof value === 'string' && value.trim() !== '') {
    const parsed = Number(value)
    if (Number.isFinite(parsed)) return parsed
  }
  return null
}

const parseDateScore = (value?: string): number => {
  if (!value) return 0
  const parsed = Date.parse(value)
  return Number.isNaN(parsed) ? 0 : parsed
}

const getArticleId = (article: ArticleWithLegacyFields): string =>
  article.id || article._id || article.slug
const getArticleStatus = (article: ArticleWithLegacyFields): string => {
  if (typeof article.status === 'string') return article.status
  return article.isPublished ? 'published' : 'draft'
}
const isPublishedArticle = (article: ArticleWithLegacyFields): boolean =>
  getArticleStatus(article) === 'published' || article.isPublished === true
const getArticleViews = (article: ArticleWithLegacyFields): number =>
  toFiniteNumber(article.viewCount) ?? toFiniteNumber(article.views) ?? 0
const getArticleRatingCount = (article: ArticleWithLegacyFields): number =>
  toFiniteNumber(article.ratingCount) ?? toFiniteNumber(article.ratingsCount) ?? 0
const formatNumber = (value: number): string => value.toLocaleString('pt-PT')

const formatDate = (value?: string): string => {
  const parsed = parseDateScore(value)
  if (!parsed) return 'sem data'

  return new Intl.DateTimeFormat('pt-PT', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(new Date(parsed))
}

const statusBadgeClass = (status: string): string => {
  if (status === 'published') return 'border-emerald-500/40 bg-emerald-500/10 text-emerald-500'
  if (status === 'draft') return 'border-amber-500/40 bg-amber-500/10 text-amber-500'
  return 'border-slate-500/40 bg-slate-500/10 text-slate-500'
}

const statusLabel = (status: string): string => {
  if (status === 'published') return 'Publicado'
  if (status === 'draft') return 'Rascunho'
  return 'Outro'
}

/**
 * Pagina de gestao de artigos do creator
 * Tabela com filtros e acoes por linha.
 */
export function ManageArticles() {
  const [statusFilter, setStatusFilter] = useState<ArticleStatusFilter>('all')
  const [actionError, setActionError] = useState<string | null>(null)
  const [articleToDelete, setArticleToDelete] = useState<ArticleWithLegacyFields | null>(null)

  const filters = useMemo(
    () => ({
      status: statusFilter === 'all' ? undefined : statusFilter,
      sortBy: 'recent' as const,
      limit: 100,
    }),
    [statusFilter],
  )

  const { data, isLoading, refetch } = useMyArticles(filters)
  const deleteArticle = useDeleteArticle()
  const publishArticle = usePublishArticle()
  const unpublishArticle = useUnpublishArticle()

  const articles = useMemo(() => {
    const rows = data?.items ?? []
    const normalized = rows
      .map((entry) => entry as ArticleWithLegacyFields)
      .sort(
        (a, b) =>
          parseDateScore(b.updatedAt || b.publishedAt || b.createdAt) -
          parseDateScore(a.updatedAt || a.publishedAt || a.createdAt),
      )
    if (statusFilter === 'all') return normalized
    return normalized.filter((article) => getArticleStatus(article) === statusFilter)
  }, [data, statusFilter])

  const summary = useMemo(() => {
    const published = articles.filter(isPublishedArticle).length
    const drafts = articles.filter((article) => getArticleStatus(article) === 'draft').length
    const totalViews = articles.reduce((sum, article) => sum + getArticleViews(article), 0)

    return {
      total: data?.total ?? articles.length,
      published,
      drafts,
      totalViews,
    }
  }, [articles, data?.total])

  const isMutating =
    deleteArticle.isPending || publishArticle.isPending || unpublishArticle.isPending

  const handleTogglePublish = async (article: ArticleWithLegacyFields) => {
    setActionError(null)
    const articleId = getArticleId(article)

    try {
      if (isPublishedArticle(article)) {
        await unpublishArticle.mutateAsync(articleId)
      } else {
        await publishArticle.mutateAsync(articleId)
      }
    } catch (error) {
      setActionError(getErrorMessage(error))
    }
  }

  const handleDelete = async () => {
    if (!articleToDelete) return
    setActionError(null)

    try {
      await deleteArticle.mutateAsync(getArticleId(articleToDelete))
      setArticleToDelete(null)
    } catch (error) {
      setActionError(getErrorMessage(error))
    }
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Gestao de Artigos</h1>
            <p className="text-sm text-muted-foreground">
              Edita, publica, despublica e elimina artigos do teu dashboard.
            </p>
          </div>

          <Button asChild>
            <a href="/creators/dashboard/articles/create">
              <PenSquare className="h-4 w-4" />
              Criar artigo
            </a>
          </Button>
        </div>

        <Card className="border-border/60 bg-card/75">
          <CardContent className="flex flex-wrap items-center gap-3 p-4">
            <div className="flex items-center gap-2">
              <label htmlFor="articles-status-filter" className="text-sm font-medium">
                Estado:
              </label>
              <select
                id="articles-status-filter"
                value={statusFilter}
                onChange={(event) => setStatusFilter(event.target.value as ArticleStatusFilter)}
                className="rounded-md border border-input bg-background px-2 py-1 text-sm"
              >
                <option value="all">Todos</option>
                <option value="draft">Rascunho</option>
                <option value="published">Publicado</option>
              </select>
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={() => refetch()}
              disabled={isLoading || isMutating}
            >
              <RefreshCcw className="h-4 w-4" />
              Atualizar
            </Button>

            <div className="ml-auto flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
              <span className="tabular-nums">Total: {formatNumber(summary.total)}</span>
              <span className="tabular-nums">Publicados: {formatNumber(summary.published)}</span>
              <span className="tabular-nums">Rascunhos: {formatNumber(summary.drafts)}</span>
              <span className="tabular-nums">Views: {formatNumber(summary.totalViews)}</span>
            </div>
          </CardContent>
        </Card>

        {actionError ? (
          <Card className="border-red-500/40 bg-red-500/10">
            <CardContent className="py-3 text-sm text-red-400">{actionError}</CardContent>
          </Card>
        ) : null}

        <Card className="border-border/60 bg-card/75">
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Titulo</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Data</TableHead>
                  <TableHead className="text-right">Views</TableHead>
                  <TableHead className="text-right">Rating</TableHead>
                  <TableHead className="text-right">Acoes</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell
                      colSpan={6}
                      className="py-10 text-center text-sm text-muted-foreground"
                    >
                      A carregar artigos...
                    </TableCell>
                  </TableRow>
                ) : articles.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={6}
                      className="py-10 text-center text-sm text-muted-foreground"
                    >
                      Sem artigos para o filtro selecionado.
                    </TableCell>
                  </TableRow>
                ) : (
                  articles.map((article) => {
                    const status = getArticleStatus(article)
                    const articleId = getArticleId(article)
                    const isPublished = isPublishedArticle(article)

                    return (
                      <TableRow key={`creator-article-${articleId}`}>
                        <TableCell>
                          <div className="space-y-1">
                            <p className="font-medium">{article.title}</p>
                            {article.description ? (
                              <p className="line-clamp-1 text-xs text-muted-foreground">
                                {article.description}
                              </p>
                            ) : null}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className={statusBadgeClass(status)}>
                            {statusLabel(status)}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-xs text-muted-foreground">
                          {formatDate(
                            article.updatedAt || article.publishedAt || article.createdAt,
                          )}
                        </TableCell>
                        <TableCell className="text-right tabular-nums">
                          {formatNumber(getArticleViews(article))}
                        </TableCell>
                        <TableCell className="text-right tabular-nums">
                          {article.averageRating.toFixed(1)} (
                          {formatNumber(getArticleRatingCount(article))})
                        </TableCell>
                        <TableCell>
                          <div className="flex justify-end gap-1">
                            <Button variant="ghost" size="sm" asChild>
                              <a
                                href={`/creators/dashboard/articles/${encodeURIComponent(articleId)}/edit`}
                              >
                                Editar
                              </a>
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                void handleTogglePublish(article)
                              }}
                              disabled={isMutating}
                            >
                              {isPublished ? (
                                <Undo2 className="h-4 w-4" />
                              ) : (
                                <Rocket className="h-4 w-4" />
                              )}
                              {isPublished ? 'Despublicar' : 'Publicar'}
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setArticleToDelete(article)}
                              disabled={isMutating}
                              className="text-red-500 hover:text-red-600"
                            >
                              <Trash2 className="h-4 w-4" />
                              Eliminar
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    )
                  })
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Dialog
          open={Boolean(articleToDelete)}
          onOpenChange={(open) => !open && setArticleToDelete(null)}
        >
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Eliminar artigo</DialogTitle>
              <DialogDescription>
                Esta acao e irreversivel. O artigo{' '}
                <span className="font-semibold">{articleToDelete?.title ?? ''}</span> sera removido
                permanentemente.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setArticleToDelete(null)}
                disabled={deleteArticle.isPending}
              >
                Cancelar
              </Button>
              <Button
                variant="destructive"
                onClick={() => void handleDelete()}
                isLoading={deleteArticle.isPending}
              >
                Eliminar
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  )
}
