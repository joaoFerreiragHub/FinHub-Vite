import { Navigate, useParams } from '@/lib/reactRouterDomCompat'
import { Card } from '@/components/ui'
import { ArticleForm } from '@/features/creators/dashboard/articles/components/ArticleForm'
import { useArticleById, useUpdateArticle } from '@/features/hub/articles/hooks/useArticles'
import type { UpdateArticleDto } from '@/features/hub/articles/types'

export default function EditArticlePage() {
  const { id } = useParams<{ id: string }>()
  const articleId = id ?? ''
  const { data: article, isLoading, error } = useArticleById(articleId)
  const updateArticle = useUpdateArticle()

  const handleSubmit = async (data: UpdateArticleDto) => {
    if (!articleId) return
    await updateArticle.mutateAsync({ id: articleId, data })
  }

  if (!articleId) {
    return <Navigate to="/dashboard/conteudo" replace />
  }

  if (isLoading) {
    return (
      <div className="flex min-h-[320px] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    )
  }

  if (error || !article) {
    return <Navigate to="/dashboard/conteudo" replace />
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <header>
        <h1 className="text-2xl font-semibold tracking-tight">Editar artigo</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          A editar: <span className="font-medium">{article.title}</span>
        </p>
      </header>

      <Card className="p-6 sm:p-8">
        <ArticleForm
          article={article}
          onSubmit={handleSubmit}
          submitText="Atualizar artigo"
          showDraftOption={false}
          redirectTo="/dashboard/conteudo"
        />
      </Card>
    </div>
  )
}
