import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigate } from 'react-router-dom'
import { Button, Input, Card, Label } from '@/components/ui'
import { ContentCategory } from '@/features/hub/types'
import {
  courseFormSchema,
  type CourseFormValues,
} from '@/features/hub/courses/schemas/courseFormSchema'
import type { Course, CreateCourseDto, UpdateCourseDto } from '@/features/hub/courses/types'
import { getErrorMessage } from '@/lib/api/client'

interface CourseFormCreateProps {
  course?: undefined
  onSubmit: (data: CreateCourseDto) => Promise<void>
  submitText?: string
  showDraftOption?: boolean
}

interface CourseFormEditProps {
  course: Course
  onSubmit: (data: UpdateCourseDto) => Promise<void>
  submitText?: string
  showDraftOption?: boolean
}

export type CourseFormProps = CourseFormCreateProps | CourseFormEditProps

export function CourseForm(props: CourseFormProps) {
  const { course } = props
  const submitText = props.submitText ?? (course ? 'Atualizar' : 'Criar Curso')
  const showDraftOption = props.showDraftOption ?? true
  const navigate = useNavigate()
  const [serverError, setServerError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const {
    register,
    handleSubmit: handleFormSubmit,
    formState: { errors },
    watch,
  } = useForm<CourseFormValues>({
    resolver: zodResolver(courseFormSchema),
    defaultValues: course
      ? {
          title: course.title,
          description: course.description,
          excerpt: course.excerpt,
          coverImage: course.coverImage || '',
          category: course.category,
          tags: course.tags.join(', '),
          price: course.price,
          discountPrice: course.discountPrice,
          currency: course.currency || 'EUR',
          level: course.level,
          language: course.language || 'pt',
          prerequisites: course.prerequisites?.join(', ') || '',
          learningOutcomes: course.learningOutcomes?.join(', ') || '',
          requiredRole: course.requiredRole as 'visitor' | 'free' | 'premium',
          isPremium: course.isPremium,
          status: course.status as 'draft' | 'published',
        }
      : {
          status: 'draft',
          category: ContentCategory.PERSONAL_FINANCE,
          requiredRole: 'free',
          isPremium: false,
          price: 0,
          currency: 'EUR',
          level: 'beginner',
          language: 'pt',
        },
  })

  const isPremium = watch('isPremium')
  const price = watch('price')

  const handleSubmit = async (data: CourseFormValues, isDraft = false) => {
    setServerError(null)
    setIsSubmitting(true)

    try {
      const tags = data.tags
        ? data.tags
            .split(',')
            .map((t) => t.trim())
            .filter(Boolean)
        : []

      const prerequisites = data.prerequisites
        ? data.prerequisites
            .split(',')
            .map((t) => t.trim())
            .filter(Boolean)
        : undefined

      const learningOutcomes = data.learningOutcomes
        ? data.learningOutcomes
            .split(',')
            .map((t) => t.trim())
            .filter(Boolean)
        : undefined

      if (course) {
        const updatePayload: UpdateCourseDto = {
          title: data.title,
          description: data.description,
          excerpt: data.excerpt || undefined,
          coverImage: data.coverImage || undefined,
          category: data.category,
          tags,
          price: data.price,
          discountPrice: data.discountPrice,
          level: data.level,
          requiredRole: data.requiredRole,
          isPremium: data.isPremium,
          status: isDraft ? 'draft' : data.status,
        }
        await props.onSubmit(updatePayload)
      } else {
        const createPayload: CreateCourseDto = {
          title: data.title,
          description: data.description,
          excerpt: data.excerpt || undefined,
          coverImage: data.coverImage || undefined,
          category: data.category,
          tags,
          price: data.price,
          currency: data.currency,
          discountPrice: data.discountPrice,
          level: data.level,
          language: data.language,
          prerequisites,
          learningOutcomes,
          requiredRole: data.requiredRole,
          isPremium: data.isPremium,
          status: isDraft ? 'draft' : data.status,
        }
        await props.onSubmit(createPayload)
      }
      navigate('/creators/dashboard/courses')
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

      <div className="space-y-2">
        <Label htmlFor="title">Titulo *</Label>
        <Input
          id="title"
          placeholder="Ex: Investir em ETFs para Iniciantes"
          {...register('title')}
        />
        {errors.title && <p className="text-sm text-red-600">{errors.title.message}</p>}
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Descricao *</label>
        <textarea
          rows={4}
          placeholder="Descreve o que o aluno vai aprender neste curso..."
          className="w-full rounded-lg border border-input bg-transparent px-3 py-2 text-sm"
          {...register('description')}
        />
        {errors.description && <p className="text-sm text-red-600">{errors.description.message}</p>}
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Resumo (opcional)</label>
        <textarea
          rows={2}
          placeholder="Resumo curto que aparece no card do curso..."
          className="w-full rounded-lg border border-input bg-transparent px-3 py-2 text-sm"
          {...register('excerpt')}
        />
        {errors.excerpt && <p className="text-sm text-red-600">{errors.excerpt.message}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="coverImage">Imagem de Capa (URL)</Label>
        <Input
          id="coverImage"
          type="url"
          placeholder="https://exemplo.com/imagem.jpg"
          {...register('coverImage')}
        />
        {errors.coverImage && <p className="text-sm text-red-600">{errors.coverImage.message}</p>}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-2">
          <label className="text-sm font-medium">Categoria *</label>
          <select
            className="w-full rounded-lg border border-input bg-transparent px-3 py-2 text-sm"
            {...register('category')}
          >
            <option value={ContentCategory.PERSONAL_FINANCE}>Financas Pessoais</option>
            <option value={ContentCategory.BUDGETING}>Orcamento</option>
            <option value={ContentCategory.SAVING}>Poupanca</option>
            <option value={ContentCategory.DEBT}>Dividas</option>
            <option value={ContentCategory.STOCKS}>Acoes</option>
            <option value={ContentCategory.CRYPTO}>Crypto</option>
            <option value={ContentCategory.REAL_ESTATE}>Imobiliario</option>
            <option value={ContentCategory.FUNDS}>Fundos</option>
            <option value={ContentCategory.BASICS}>Basico</option>
            <option value={ContentCategory.ADVANCED}>Avancado</option>
            <option value={ContentCategory.TRENDS}>Tendencias</option>
          </select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="tags">Tags (separadas por virgula)</Label>
          <Input id="tags" placeholder="investimento, ETFs, iniciantes" {...register('tags')} />
          {errors.tags && <p className="text-sm text-red-600">{errors.tags.message}</p>}
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="space-y-2">
          <Label htmlFor="price">Preco (EUR) *</Label>
          <Input
            id="price"
            type="number"
            step="0.01"
            min="0"
            placeholder="0"
            {...register('price')}
          />
          {errors.price && <p className="text-sm text-red-600">{errors.price.message}</p>}
          <p className="text-xs text-muted-foreground">0 = Gratuito</p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="discountPrice">Preco com Desconto (opcional)</Label>
          <Input
            id="discountPrice"
            type="number"
            step="0.01"
            min="0"
            placeholder=""
            {...register('discountPrice')}
          />
          {errors.discountPrice && (
            <p className="text-sm text-red-600">{errors.discountPrice.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Nivel *</label>
          <select
            className="w-full rounded-lg border border-input bg-transparent px-3 py-2 text-sm"
            {...register('level')}
          >
            <option value="beginner">Iniciante</option>
            <option value="intermediate">Intermedio</option>
            <option value="advanced">Avancado</option>
          </select>
        </div>
      </div>

      {price > 0 && (
        <div className="rounded-lg border border-blue-200 bg-blue-50 p-4 text-sm text-blue-800">
          Este curso sera vendido por {price}€
          {watch('discountPrice') ? ` (com desconto: ${watch('discountPrice')}€)` : ''}
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="prerequisites">Pre-requisitos (separados por virgula)</Label>
        <Input
          id="prerequisites"
          placeholder="Conhecimento basico de financas, Ter conta numa corretora"
          {...register('prerequisites')}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="learningOutcomes">Objectivos de Aprendizagem (separados por virgula)</Label>
        <Input
          id="learningOutcomes"
          placeholder="Investir em ETFs, Diversificar portfolio, Analisar custos"
          {...register('learningOutcomes')}
        />
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
          <label className="text-sm font-medium">Idioma</label>
          <select
            className="w-full rounded-lg border border-input bg-transparent px-3 py-2 text-sm"
            {...register('language')}
          >
            <option value="pt">Portugues</option>
            <option value="en">Ingles</option>
            <option value="es">Espanhol</option>
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
      </div>

      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id="isPremium"
          className="h-4 w-4 rounded border-gray-300"
          {...register('isPremium')}
        />
        <label htmlFor="isPremium" className="text-sm font-medium">
          Marcar como conteudo Premium
        </label>
      </div>

      {isPremium && (
        <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-4 text-sm text-yellow-800">
          Este curso sera visivel apenas para assinantes Premium
        </div>
      )}

      <div className="flex gap-3">
        <Button type="submit" variant="default" size="lg" isLoading={isSubmitting}>
          {submitText}
        </Button>

        {showDraftOption && !course && (
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
          onClick={() => navigate('/creators/dashboard/courses')}
        >
          Cancelar
        </Button>
      </div>
    </form>
  )
}
