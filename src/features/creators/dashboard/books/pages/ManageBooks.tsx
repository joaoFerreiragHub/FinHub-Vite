import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Button, Card } from '@/components/ui'
import { DashboardLayout } from '@/shared/layouts'
import { useMyBooks, useDeleteBook, usePublishBook } from '@/features/hub/books/hooks/useBooks'
import { formatDistanceToNow } from 'date-fns'
import { ptBR } from 'date-fns/locale'

/**
 * Pagina de gestao de livros do creator
 */
export function ManageBooks() {
  const [filters, setFilters] = useState({
    status: undefined as 'draft' | 'published' | 'archived' | undefined,
    sortBy: 'recent' as 'recent' | 'popular' | 'rating',
  })

  const { data, isLoading, refetch } = useMyBooks(filters)
  const deleteBook = useDeleteBook()
  const publishBook = usePublishBook()

  const handleDelete = async (id: string) => {
    if (!confirm('Tens a certeza que queres eliminar este livro?')) return
    try {
      await deleteBook.mutateAsync(id)
    } catch {
      alert('Erro ao eliminar livro')
    }
  }

  const handlePublish = async (id: string) => {
    try {
      await publishBook.mutateAsync(id)
    } catch {
      alert('Erro ao publicar livro')
    }
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Gerir Livros</h1>
            <p className="mt-1 text-muted-foreground">Adiciona e gere recomendacoes de livros</p>
          </div>

          <Link to="/creators/dashboard/books/create">
            <Button variant="default" size="lg">
              + Adicionar Livro
            </Button>
          </Link>
        </div>

        <Card className="p-6">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium">Estado:</label>
              <select
                value={filters.status || ''}
                onChange={(e) =>
                  setFilters({
                    ...filters,
                    status: (e.target.value as 'draft' | 'published' | 'archived') || undefined,
                  })
                }
                className="rounded-lg border border-input bg-transparent px-3 py-1.5 text-sm"
              >
                <option value="">Todos</option>
                <option value="draft">Rascunhos</option>
                <option value="published">Publicados</option>
              </select>
            </div>

            <div className="flex items-center gap-2">
              <label className="text-sm font-medium">Ordenar:</label>
              <select
                value={filters.sortBy}
                onChange={(e) =>
                  setFilters({
                    ...filters,
                    sortBy: e.target.value as 'recent' | 'popular' | 'rating',
                  })
                }
                className="rounded-lg border border-input bg-transparent px-3 py-1.5 text-sm"
              >
                <option value="recent">Mais Recentes</option>
                <option value="popular">Mais Populares</option>
                <option value="rating">Melhor Avaliados</option>
              </select>
            </div>

            <Button variant="ghost" size="sm" onClick={() => refetch()}>
              Atualizar
            </Button>
          </div>
        </Card>

        {data && (
          <div className="grid gap-4 md:grid-cols-3">
            <Card className="p-6">
              <div className="text-2xl font-bold">{data.total}</div>
              <div className="text-sm text-muted-foreground">Total de Livros</div>
            </Card>
            <Card className="p-6">
              <div className="text-2xl font-bold">
                {data.items.filter((b) => b.status === 'published').length}
              </div>
              <div className="text-sm text-muted-foreground">Publicados</div>
            </Card>
            <Card className="p-6">
              <div className="text-2xl font-bold">
                {data.items.filter((b) => b.status === 'draft').length}
              </div>
              <div className="text-sm text-muted-foreground">Rascunhos</div>
            </Card>
          </div>
        )}

        {isLoading ? (
          <div className="flex justify-center py-12">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          </div>
        ) : data?.items.length === 0 ? (
          <Card className="p-8 text-center">
            <h3 className="mb-2 text-lg font-semibold">Nenhum livro ainda</h3>
            <p className="mb-4 text-sm text-muted-foreground">
              Começa a partilhar recomendacoes de livros com a tua audiencia
            </p>
            <Link to="/creators/dashboard/books/create">
              <Button variant="default">Adicionar Primeiro Livro</Button>
            </Link>
          </Card>
        ) : (
          <div className="space-y-4">
            {data?.items.map((book) => (
              <Card key={book.id} className="p-6 transition-shadow hover:shadow-md">
                <div className="flex items-start gap-4">
                  {book.coverImage && (
                    <img
                      src={book.coverImage}
                      alt={book.title}
                      className="h-32 w-24 rounded-lg object-cover"
                    />
                  )}

                  <div className="flex-1">
                    <div className="mb-2 flex items-start justify-between">
                      <div>
                        <h3 className="text-lg font-semibold">{book.title}</h3>
                        <p className="text-sm text-muted-foreground">por {book.author}</p>
                        <p className="mt-1 text-sm text-muted-foreground line-clamp-2">
                          {book.description}
                        </p>
                      </div>

                      <span
                        className={`rounded-full px-3 py-1 text-xs font-medium ${
                          book.status === 'published'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}
                      >
                        {book.status === 'published' ? 'Publicado' : 'Rascunho'}
                      </span>
                    </div>

                    <div className="mb-3 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                      {book.genres.length > 0 && <span>{book.genres.join(', ')}</span>}
                      <span>
                        {book.averageRating.toFixed(1)} ({book.ratingCount})
                      </span>
                      <span>{book.viewCount} visualizacoes</span>
                      <span>
                        {formatDistanceToNow(new Date(book.updatedAt), {
                          addSuffix: true,
                          locale: ptBR,
                        })}
                      </span>
                    </div>

                    <div className="flex gap-2">
                      <Link to={`/hub/books/${book.slug}`}>
                        <Button variant="ghost" size="sm">
                          Ver
                        </Button>
                      </Link>
                      <Link to={`/creators/dashboard/books/${book.id}/edit`}>
                        <Button variant="ghost" size="sm">
                          Editar
                        </Button>
                      </Link>
                      {book.status === 'draft' && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handlePublish(book.id)}
                          disabled={publishBook.isPending}
                        >
                          Publicar
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(book.id)}
                        disabled={deleteBook.isPending}
                        className="text-red-600 hover:text-red-700"
                      >
                        Eliminar
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
