import { useParams, Navigate } from 'react-router-dom'
import { DashboardLayout } from '@/shared/layouts'
import { BookForm } from '../components/BookForm'
import { useBook, useUpdateBook } from '@/features/hub/books/hooks/useBooks'
import { Card } from '@/components/ui'
import type { UpdateBookDto } from '@/features/hub/books/types'

/**
 * Pagina de edicao de livro
 */
export function EditBook() {
  const { id } = useParams<{ id: string }>()
  const { data: book, isLoading, error } = useBook(id!)
  const updateBook = useUpdateBook()

  const handleSubmit = async (data: UpdateBookDto) => {
    if (!id) return
    await updateBook.mutateAsync({ id, data })
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

  if (error || !book) {
    return <Navigate to="/creators/dashboard/books" replace />
  }

  return (
    <DashboardLayout>
      <div className="mx-auto max-w-4xl space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Editar Livro</h1>
          <p className="mt-1 text-muted-foreground">
            A editar: <span className="font-medium">{book.title}</span>
          </p>
        </div>

        <Card className="p-8">
          <BookForm
            book={book}
            onSubmit={handleSubmit}
            submitText="Atualizar Livro"
            showDraftOption={false}
          />
        </Card>
      </div>
    </DashboardLayout>
  )
}
