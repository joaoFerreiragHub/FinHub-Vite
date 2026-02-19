import { useEffect } from 'react'
import { useParams, Navigate } from 'react-router-dom'
import { useArticle } from '../hooks/useArticles'
import { articleService } from '../services/articleService'
import {
  ContentMeta,
  ContentActions,
  RatingsSection,
  CommentSection,
} from '@/features/hub/components'
import { usePermissions, usePaywall } from '@/features/auth'
import { isRoleAtLeast } from '@/lib/permissions/config'

/**
 * Pagina de detalhe do artigo (publica)
 */
export function ArticleDetailPage() {
  const { slug } = useParams<{ slug: string }>()
  const { data: article, isLoading, error } = useArticle(slug!)
  const { role } = usePermissions()
  const { PaywallComponent } = usePaywall()

  useEffect(() => {
    if (article?.id) {
      articleService.incrementView(article.id).catch(() => {})
    }
  }, [article?.id])

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    )
  }

  if (error || !article) {
    return <Navigate to="/hub/articles" replace />
  }

  const hasAccess = isRoleAtLeast(role, article.requiredRole)

  return (
    <div className="min-h-screen bg-background">
      {article.coverImage && (
        <div className="relative h-96 overflow-hidden">
          <img
            src={article.coverImage}
            alt={article.title}
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
        </div>
      )}

      <div className="container mx-auto px-4 py-8">
        <div className="mx-auto max-w-4xl">
          <article className="space-y-6">
            <header className="space-y-4">
              <div className="flex items-center gap-2">
                <span className="rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
                  Artigo
                </span>
                {article.isPremium && (
                  <span className="rounded-full bg-yellow-100 px-3 py-1 text-sm font-medium text-yellow-800">
                    Premium
                  </span>
                )}
              </div>

              <h1 className="text-4xl font-bold leading-tight md:text-5xl">{article.title}</h1>
              <p className="text-xl text-muted-foreground">{article.description}</p>

              <div className="flex flex-wrap items-center gap-4">
                <ContentMeta content={article} showAvatar size="md" />
                {article.readTime && (
                  <span className="text-sm text-muted-foreground">
                    {article.readTime} min de leitura
                  </span>
                )}
              </div>

              {article.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {article.tags.map((tag) => (
                    <span key={tag} className="rounded-full bg-muted px-3 py-1 text-xs font-medium">
                      #{tag}
                    </span>
                  ))}
                </div>
              )}
            </header>

            <ContentActions
              contentId={article.id}
              likeCount={article.likeCount}
              favoriteCount={article.favoriteCount}
              showLabels
            />

            <hr className="border-border" />

            {hasAccess ? (
              <div
                className="prose prose-lg max-w-none dark:prose-invert"
                dangerouslySetInnerHTML={{ __html: article.content }}
              />
            ) : (
              <div className="space-y-6">
                {article.excerpt && (
                  <div className="prose prose-lg max-w-none dark:prose-invert">
                    <p>{article.excerpt}</p>
                  </div>
                )}
                <PaywallComponent
                  title="Conteudo Premium"
                  description={`Este artigo requer plano ${article.requiredRole.toUpperCase()}. Faz upgrade para continuar a ler.`}
                />
              </div>
            )}

            <hr className="border-border" />

            {hasAccess && (
              <RatingsSection
                targetType="article"
                targetId={article.id}
                formTitle="Avaliar este artigo"
                contentQueryKey={['article', slug]}
              />
            )}

            <hr className="border-border" />

            {hasAccess && article.commentsEnabled && (
              <section>
                <CommentSection
                  targetType={article.type}
                  targetId={article.id}
                  response={{
                    items: [],
                    total: article.commentCount,
                    limit: 10,
                    offset: 0,
                    hasMore: false,
                  }}
                  enabled={article.commentsEnabled}
                  onSubmitComment={async (content) => {
                    console.log('Submit comment:', content)
                  }}
                  onReplyComment={async (commentId, content) => {
                    console.log('Reply to comment:', commentId, content)
                  }}
                  onEditComment={async (commentId, content) => {
                    console.log('Edit comment:', commentId, content)
                  }}
                  onDeleteComment={async (commentId) => {
                    console.log('Delete comment:', commentId)
                  }}
                  onLikeComment={async (commentId) => {
                    console.log('Like comment:', commentId)
                  }}
                />
              </section>
            )}
          </article>
        </div>
      </div>
    </div>
  )
}
