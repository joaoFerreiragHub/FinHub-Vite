import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigate } from 'react-router-dom'
import { Button, Input, Card, Label } from '@/components/ui'
import { ContentCategory } from '@/features/hub/types'
import { bookFormSchema, type BookFormValues } from '@/features/hub/books/schemas/bookFormSchema'
import type { Book, CreateBookDto, UpdateBookDto } from '@/features/hub/books/types'
import { getErrorMessage } from '@/lib/api/client'

interface BookFormCreateProps {
  book?: undefined
  onSubmit: (data: CreateBookDto) => Promise<void>
  submitText?: string
  showDraftOption?: boolean
}

interface BookFormEditProps {
  book: Book
  onSubmit: (data: UpdateBookDto) => Promise<void>
  submitText?: string
  showDraftOption?: boolean
}

export type BookFormProps = BookFormCreateProps | BookFormEditProps

export function BookForm(props: BookFormProps) {
  const { book } = props
  const submitText = props.submitText ?? (book ? 'Atualizar' : 'Adicionar Livro')
  const showDraftOption = props.showDraftOption ?? true
  const navigate = useNavigate()
  const [serverError, setServerError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const {
    register,
    handleSubmit: handleFormSubmit,
    formState: { errors },
  } = useForm<BookFormValues>({
    resolver: zodResolver(bookFormSchema),
    defaultValues: book
      ? {
          title: book.title,
          description: book.description,
          excerpt: book.excerpt,
          coverImage: book.coverImage || '',
          category: book.category,
          tags: book.tags.join(', '),
          author: book.author,
          isbn: book.isbn || '',
          publisher: book.publisher || '',
          publishYear: book.publishYear,
          pages: book.pages,
          genres: book.genres.join(', '),
          keyPhrases: book.keyPhrases?.join('\n') || '',
          purchaseUrl: book.purchaseUrl || '',
          pdfUrl: book.pdfUrl || '',
          requiredRole: book.requiredRole as 'visitor' | 'free' | 'premium',
          isPremium: book.isPremium,
          status: book.status as 'draft' | 'published',
        }
      : {
          status: 'draft',
          category: ContentCategory.PERSONAL_FINANCE,
          requiredRole: 'visitor',
          isPremium: false,
        },
  })

  const handleSubmit = async (data: BookFormValues, isDraft = false) => {
    setServerError(null)
    setIsSubmitting(true)

    try {
      const tags = data.tags
        ? data.tags
            .split(',')
            .map((t) => t.trim())
            .filter(Boolean)
        : []
      const genres = data.genres
        ? data.genres
            .split(',')
            .map((t) => t.trim())
            .filter(Boolean)
        : []
      const keyPhrases = data.keyPhrases
        ? data.keyPhrases
            .split('\n')
            .map((t) => t.trim())
            .filter(Boolean)
        : undefined

      if (book) {
        const updatePayload: UpdateBookDto = {
          title: data.title,
          description: data.description,
          excerpt: data.excerpt || undefined,
          coverImage: data.coverImage || undefined,
          category: data.category,
          tags,
          author: data.author,
          isbn: data.isbn || undefined,
          publisher: data.publisher || undefined,
          publishYear: data.publishYear,
          pages: data.pages,
          genres,
          keyPhrases,
          purchaseUrl: data.purchaseUrl || undefined,
          pdfUrl: data.pdfUrl || undefined,
          requiredRole: data.requiredRole,
          isPremium: data.isPremium,
          status: isDraft ? 'draft' : data.status,
        }
        await props.onSubmit(updatePayload)
      } else {
        const createPayload: CreateBookDto = {
          title: data.title,
          description: data.description,
          excerpt: data.excerpt || undefined,
          coverImage: data.coverImage || undefined,
          category: data.category,
          tags,
          author: data.author,
          isbn: data.isbn || undefined,
          publisher: data.publisher || undefined,
          publishYear: data.publishYear,
          pages: data.pages,
          genres,
          keyPhrases,
          purchaseUrl: data.purchaseUrl || undefined,
          pdfUrl: data.pdfUrl || undefined,
          requiredRole: data.requiredRole,
          isPremium: data.isPremium,
          status: isDraft ? 'draft' : data.status,
        }
        await props.onSubmit(createPayload)
      }
      navigate('/creators/dashboard/books')
    } catch (error) {
      setServerError(getErrorMessage(error))
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleFormSubmit((data) => handleSubmit(data, false))} className="space-y-6">
      {serverError && (
        <Card className="border-red-500 bg-red-50 p-4">
          <p className="text-sm text-red-800">
            <strong>Erro:</strong> {serverError}
          </p>
        </Card>
      )}

      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="title">Titulo do Livro *</Label>
          <Input
            id="title"
            placeholder="Ex: O Homem Mais Rico da Babilonia"
            {...register('title')}
          />
          {errors.title && <p className="text-sm text-red-600">{errors.title.message}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="author">Autor do Livro *</Label>
          <Input id="author" placeholder="Ex: George S. Clason" {...register('author')} />
          {errors.author && <p className="text-sm text-red-600">{errors.author.message}</p>}
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Resumo / Descricao *</label>
        <textarea
          rows={5}
          placeholder="Resumo detalhado do livro e porque o recomendas..."
          className="w-full rounded-lg border border-input bg-transparent px-3 py-2 text-sm"
          {...register('description')}
        />
        {errors.description && <p className="text-sm text-red-600">{errors.description.message}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="coverImage">Imagem de Capa (URL)</Label>
        <Input
          id="coverImage"
          type="url"
          placeholder="https://exemplo.com/capa.jpg"
          {...register('coverImage')}
        />
        {errors.coverImage && <p className="text-sm text-red-600">{errors.coverImage.message}</p>}
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="space-y-2">
          <label className="text-sm font-medium">Categoria *</label>
          <select
            className="w-full rounded-lg border border-input bg-transparent px-3 py-2 text-sm"
            {...register('category')}
          >
            <option value={ContentCategory.PERSONAL_FINANCE}>Financas Pessoais</option>
            <option value={ContentCategory.STOCKS}>Acoes</option>
            <option value={ContentCategory.CRYPTO}>Crypto</option>
            <option value={ContentCategory.BASICS}>Basico</option>
            <option value={ContentCategory.ADVANCED}>Avancado</option>
          </select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="tags">Tags (separadas por virgula)</Label>
          <Input id="tags" placeholder="financas, investimento" {...register('tags')} />
        </div>

        <div className="space-y-2">
          <Label htmlFor="genres">Generos (separados por virgula)</Label>
          <Input
            id="genres"
            placeholder="Financas, Desenvolvimento Pessoal"
            {...register('genres')}
          />
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-4">
        <div className="space-y-2">
          <Label htmlFor="isbn">ISBN</Label>
          <Input id="isbn" placeholder="978-..." {...register('isbn')} />
        </div>

        <div className="space-y-2">
          <Label htmlFor="publisher">Editora</Label>
          <Input id="publisher" placeholder="Ex: Presenca" {...register('publisher')} />
        </div>

        <div className="space-y-2">
          <Label htmlFor="publishYear">Ano de Publicacao</Label>
          <Input
            id="publishYear"
            type="number"
            min="1800"
            max="2100"
            {...register('publishYear')}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="pages">Numero de Paginas</Label>
          <Input id="pages" type="number" min="1" {...register('pages')} />
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Frases-Chave (uma por linha)</label>
        <textarea
          rows={4}
          placeholder="Uma frase marcante do livro por linha..."
          className="w-full rounded-lg border border-input bg-transparent px-3 py-2 text-sm"
          {...register('keyPhrases')}
        />
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="purchaseUrl">Link de Compra</Label>
          <Input
            id="purchaseUrl"
            type="url"
            placeholder="https://amazon.pt/..."
            {...register('purchaseUrl')}
          />
          {errors.purchaseUrl && (
            <p className="text-sm text-red-600">{errors.purchaseUrl.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="pdfUrl">PDF URL (se disponivel)</Label>
          <Input
            id="pdfUrl"
            type="url"
            placeholder="https://exemplo.com/livro.pdf"
            {...register('pdfUrl')}
          />
          {errors.pdfUrl && <p className="text-sm text-red-600">{errors.pdfUrl.message}</p>}
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="space-y-2">
          <label className="text-sm font-medium">Nivel de Acesso</label>
          <select
            className="w-full rounded-lg border border-input bg-transparent px-3 py-2 text-sm"
            {...register('requiredRole')}
          >
            <option value="visitor">Visitante (Todos)</option>
            <option value="free">Gratuito (Conta necessaria)</option>
            <option value="premium">Premium (Assinantes)</option>
          </select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Estado</label>
          <select
            className="w-full rounded-lg border border-input bg-transparent px-3 py-2 text-sm"
            {...register('status')}
          >
            <option value="draft">Rascunho</option>
            <option value="published">Publicado</option>
          </select>
        </div>

        <div className="flex items-center gap-2 pt-7">
          <input
            type="checkbox"
            id="isPremium"
            className="h-4 w-4 rounded border-gray-300"
            {...register('isPremium')}
          />
          <label htmlFor="isPremium" className="text-sm font-medium">
            Premium
          </label>
        </div>
      </div>

      <div className="flex gap-3">
        <Button type="submit" variant="default" size="lg" isLoading={isSubmitting}>
          {submitText}
        </Button>

        {showDraftOption && !book && (
          <Button
            type="button"
            variant="outline"
            size="lg"
            onClick={handleFormSubmit((data) => handleSubmit(data, true))}
            disabled={isSubmitting}
          >
            Guardar Rascunho
          </Button>
        )}

        <Button
          type="button"
          variant="ghost"
          size="lg"
          onClick={() => navigate('/creators/dashboard/books')}
        >
          Cancelar
        </Button>
      </div>
    </form>
  )
}
