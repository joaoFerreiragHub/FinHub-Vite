import { Card } from '@/components/ui'
import { ArticleForm } from '../components/ArticleForm'
import { useArticleById, useUpdateArticle } from '@/features/hub/articles/hooks/useArticles'
import type { UpdateArticleDto } from '@/features/hub/articles/types'
import { CreatorDashboardShell } from '@/shared/layouts'

interface EditArticleProps {
  articleId?: string
}

const resolveArticleIdFromPathname = (): string => {
  if (typeof window === 'undefined') return ''

  const routeMatch = window.location.pathname.match(
    /^\/creators\/dashboard\/articles\/([^/?#]+)\/edit$/,
  )
  if (!routeMatch?.[1]) return ''

  return decodeURIComponent(routeMatch[1])
}

export function EditArticle({ articleId }: EditArticleProps) {
  const resolvedArticleId = articleId || resolveArticleIdFromPathname()
  const { data: article, isLoading, error } = useArticleById(resolvedArticleId)
  const updateArticle = useUpdateArticle()

  const handleSubmit = async (data: UpdateArticleDto) => {
    if (!resolvedArticleId) return
    await updateArticle.mutateAsync({ id: resolvedArticleId, data })
  }

  if (!resolvedArticleId) {
    return (
      <CreatorDashboardShell>
        <Card className="mx-auto max-w-2xl p-6">
          <h1 className="text-xl font-semibold">Artigo nao encontrado</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Nao foi possivel identificar o artigo para edicao.
          </p>
          <a
            href="/creators/dashboard/articles"
            className="mt-4 inline-block text-sm text-primary hover:underline"
          >
            Voltar para a lista de artigos
          </a>
        </Card>
      </CreatorDashboardShell>
    )
  }

  if (isLoading) {
    return (
      <CreatorDashboardShell>
        <div className="flex min-h-[400px] items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        </div>
      </CreatorDashboardShell>
    )
  }

  if (error || !article) {
    return (
      <CreatorDashboardShell>
        <Card className="mx-auto max-w-2xl p-6">
          <h1 className="text-xl font-semibold">Artigo indisponivel</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            O artigo que procuras nao existe ou nao pode ser carregado neste momento.
          </p>
          <a
            href="/creators/dashboard/articles"
            className="mt-4 inline-block text-sm text-primary hover:underline"
          >
            Voltar para a lista de artigos
          </a>
        </Card>
      </CreatorDashboardShell>
    )
  }

  return (
    <CreatorDashboardShell>
      <div className="mx-auto max-w-4xl space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Editar Artigo</h1>
          <p className="mt-1 text-muted-foreground">
            A editar: <span className="font-medium">{article.title}</span>
          </p>
        </div>

        <Card className="p-8">
          <ArticleForm
            article={article}
            onSubmit={handleSubmit}
            submitText="Atualizar Artigo"
            showDraftOption={false}
          />
        </Card>
      </div>
    </CreatorDashboardShell>
  )
}
