import { DashboardLayout } from '@/shared/layouts'
import { BookForm } from '../components/BookForm'
import { useCreateBook } from '@/features/hub/books/hooks/useBooks'
import { Card } from '@/components/ui'
import type { CreateBookDto } from '@/features/hub/books/types'

/**
 * Pagina de adicao de livro
 */
export function CreateBook() {
  const createBook = useCreateBook()

  const handleSubmit = async (data: CreateBookDto) => {
    await createBook.mutateAsync(data)
  }

  return (
    <DashboardLayout>
      <div className="mx-auto max-w-4xl space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Adicionar Novo Livro</h1>
          <p className="mt-1 text-muted-foreground">
            Partilha uma recomendacao de livro com a tua audiencia
          </p>
        </div>

        <Card className="p-8">
          <BookForm onSubmit={handleSubmit} submitText="Adicionar Livro" />
        </Card>

        <Card className="border-dashed bg-muted/30 p-6">
          <h3 className="mb-2 font-semibold">Dicas para uma boa recomendacao</h3>
          <ul className="space-y-1 text-sm text-muted-foreground">
            <li>- Escreve um resumo detalhado com a tua opiniao pessoal</li>
            <li>- Inclui frases-chave que marcaram a tua leitura</li>
            <li>- Adiciona o link de compra para facilitar o acesso</li>
            <li>- Usa uma imagem de capa de boa qualidade</li>
            <li>- Define generos relevantes para facilitar a pesquisa</li>
          </ul>
        </Card>
      </div>
    </DashboardLayout>
  )
}
