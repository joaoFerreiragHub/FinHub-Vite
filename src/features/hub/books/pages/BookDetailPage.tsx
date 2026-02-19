import { useEffect } from 'react'
import { useParams, Navigate } from 'react-router-dom'
import { useBook } from '../hooks/useBooks'
import { bookService } from '../services/bookService'
import {
  ContentMeta,
  ContentActions,
  RatingsSection,
  CommentSection,
} from '@/features/hub/components'
import { usePermissions, usePaywall } from '@/features/auth'
import { isRoleAtLeast } from '@/lib/permissions/config'
import { Card, Button } from '@/components/ui'

/**
 * Pagina de detalhe do livro (publica)
 */
export function BookDetailPage() {
  const { slug } = useParams<{ slug: string }>()
  const { data: book, isLoading, error } = useBook(slug!)
  const { role } = usePermissions()
  const { PaywallComponent } = usePaywall()

  useEffect(() => {
    if (book?.id) {
      bookService.incrementView(book.id).catch(() => {})
    }
  }, [book?.id])

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    )
  }

  if (error || !book) {
    return <Navigate to="/hub/books" replace />
  }

  const hasAccess = isRoleAtLeast(role, book.requiredRole)

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="grid gap-8 lg:grid-cols-[1fr_350px]">
          {/* Main Content */}
          <div className="space-y-8">
            <header className="space-y-4">
              <div className="flex items-center gap-2">
                <span className="rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
                  Livro
                </span>
                {book.isPremium && (
                  <span className="rounded-full bg-yellow-100 px-3 py-1 text-sm font-medium text-yellow-800">
                    Premium
                  </span>
                )}
              </div>
              <h1 className="text-4xl font-bold leading-tight md:text-5xl">{book.title}</h1>
              <p className="text-xl text-muted-foreground">por {book.author}</p>
            </header>

            <div className="flex flex-wrap items-center gap-4">
              <ContentMeta content={book} showAvatar size="md" />
            </div>

            {book.genres.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {book.genres.map((genre) => (
                  <span key={genre} className="rounded-full bg-muted px-3 py-1 text-xs font-medium">
                    {genre}
                  </span>
                ))}
              </div>
            )}

            {book.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {book.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full bg-primary/5 px-3 py-1 text-xs font-medium text-primary"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}

            <ContentActions
              contentId={book.id}
              likeCount={book.likeCount}
              favoriteCount={book.favoriteCount}
              showLabels
            />

            <hr className="border-border" />

            {/* Book Content */}
            {hasAccess ? (
              <>
                {/* Summary */}
                <section className="space-y-4">
                  <h2 className="text-2xl font-bold">Resumo</h2>
                  <div className="prose prose-lg max-w-none dark:prose-invert">
                    <p>{book.description}</p>
                  </div>
                </section>

                {/* Key Phrases */}
                {book.keyPhrases && book.keyPhrases.length > 0 && (
                  <Card className="p-6">
                    <h2 className="mb-4 text-xl font-bold">Frases-Chave</h2>
                    <ul className="space-y-3">
                      {book.keyPhrases.map((phrase, i) => (
                        <li key={i} className="flex items-start gap-3 text-sm">
                          <span className="mt-0.5 text-primary">&ldquo;</span>
                          <span className="italic text-muted-foreground">{phrase}</span>
                        </li>
                      ))}
                    </ul>
                  </Card>
                )}
              </>
            ) : (
              <div className="space-y-6">
                {book.excerpt && (
                  <div className="prose prose-lg max-w-none dark:prose-invert">
                    <p>{book.excerpt}</p>
                  </div>
                )}
                <PaywallComponent
                  title="Conteudo Premium"
                  description={`Este livro requer plano ${book.requiredRole.toUpperCase()}. Faz upgrade para aceder.`}
                />
              </div>
            )}

            <hr className="border-border" />

            {/* Ratings */}
            {hasAccess && (
              <RatingsSection
                targetType="book"
                targetId={book.id}
                formTitle="Avaliar este livro"
                contentQueryKey={['book', slug]}
              />
            )}

            <hr className="border-border" />

            {/* Comments */}
            {hasAccess && book.commentsEnabled && (
              <section>
                <CommentSection
                  targetType={book.type}
                  targetId={book.id}
                  response={{
                    items: [],
                    total: book.commentCount,
                    limit: 10,
                    offset: 0,
                    hasMore: false,
                  }}
                  enabled={book.commentsEnabled}
                  onSubmitComment={async (content) => {
                    console.log('Submit comment:', content)
                  }}
                  onReplyComment={async (commentId, content) => {
                    console.log('Reply:', commentId, content)
                  }}
                  onEditComment={async (commentId, content) => {
                    console.log('Edit:', commentId, content)
                  }}
                  onDeleteComment={async (commentId) => {
                    console.log('Delete:', commentId)
                  }}
                  onLikeComment={async (commentId) => {
                    console.log('Like:', commentId)
                  }}
                />
              </section>
            )}
          </div>

          {/* Sidebar */}
          <aside className="space-y-6">
            <Card className="sticky top-6 overflow-hidden">
              {book.coverImage && (
                <img src={book.coverImage} alt={book.title} className="h-80 w-full object-cover" />
              )}

              <div className="space-y-4 p-6">
                {book.purchaseUrl && (
                  <a
                    href={book.purchaseUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block"
                  >
                    <Button className="w-full" size="lg">
                      Comprar Livro
                    </Button>
                  </a>
                )}

                {book.pdfUrl && hasAccess && (
                  <a href={book.pdfUrl} target="_blank" rel="noopener noreferrer" className="block">
                    <Button className="w-full" size="lg" variant="outline">
                      Download PDF
                    </Button>
                  </a>
                )}

                <div className="space-y-3 pt-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Autor</span>
                    <span className="font-medium">{book.author}</span>
                  </div>
                  {book.publisher && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Editora</span>
                      <span className="font-medium">{book.publisher}</span>
                    </div>
                  )}
                  {book.publishYear && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Ano</span>
                      <span className="font-medium">{book.publishYear}</span>
                    </div>
                  )}
                  {book.pages && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Paginas</span>
                      <span className="font-medium">{book.pages}</span>
                    </div>
                  )}
                  {book.isbn && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">ISBN</span>
                      <span className="font-medium text-xs">{book.isbn}</span>
                    </div>
                  )}
                  {book.averageRating > 0 && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Avaliacao</span>
                      <span className="font-medium">
                        {book.averageRating.toFixed(1)} ({book.ratingCount})
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </Card>
          </aside>
        </div>
      </div>
    </div>
  )
}
