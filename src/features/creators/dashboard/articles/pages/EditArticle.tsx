import { useParams, Navigate } from 'react-router-dom'
import { DashboardLayout } from '@/shared/layouts'
import { ArticleForm } from '../components/ArticleForm'
import { useArticle, useUpdateArticle } from '@/features/hub/articles/hooks/useArticles'
import { Card } from '@/shared/ui'
import type { UpdateArticleDto } from '@/features/hub/articles/types'

/**
 * Página de edição de artigo
 */
export function EditArticle() {
  const { id } = useParams<{ id: string }>()
  const { data: article, isLoading, error } = useArticle(id!)
  const updateArticle = useUpdateArticle()

  const handleSubmit = async (data: UpdateArticleDto) => {
    if (!id) return
    await updateArticle.mutateAsync({ id, data })
  }

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex min-h-[400px] items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        </div>
      </DashboardLayout>
    )
  }

  if (error || !article) {
    return <Navigate to="/creators/dashboard/artigos" replace />
  }

  return (
    <DashboardLayout>
      <div className="mx-auto max-w-4xl space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold">Editar Artigo</h1>
          <p className="mt-1 text-muted-foreground">
            A editar: <span className="font-medium">{article.title}</span>
          </p>
        </div>

        {/* Form */}
        <Card padding="lg">
          <ArticleForm
            article={article}
            onSubmit={handleSubmit}
            submitText="Atualizar Artigo"
            showDraftOption={false}
          />
        </Card>
      </div>
    </DashboardLayout>
  )
}
