import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigate } from 'react-router-dom'
import { Button, Input, Card, Label } from '@/components/ui'
import { ContentCategory } from '@/features/hub/types'
import { liveFormSchema, type LiveFormValues } from '@/features/hub/lives/schemas/liveFormSchema'
import type { LiveEvent, CreateLiveEventDto, UpdateLiveEventDto } from '@/features/hub/lives/types'
import { getErrorMessage } from '@/lib/api/client'

interface LiveFormCreateProps {
  live?: undefined
  onSubmit: (data: CreateLiveEventDto) => Promise<void>
  submitText?: string
  showDraftOption?: boolean
}

interface LiveFormEditProps {
  live: LiveEvent
  onSubmit: (data: UpdateLiveEventDto) => Promise<void>
  submitText?: string
  showDraftOption?: boolean
}

export type LiveFormProps = LiveFormCreateProps | LiveFormEditProps

export function LiveForm(props: LiveFormProps) {
  const { live } = props
  const submitText = props.submitText ?? (live ? 'Atualizar' : 'Criar Evento')
  const showDraftOption = props.showDraftOption ?? true
  const navigate = useNavigate()
  const [serverError, setServerError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const {
    register,
    handleSubmit: handleFormSubmit,
    formState: { errors },
    watch,
  } = useForm<LiveFormValues>({
    resolver: zodResolver(liveFormSchema),
    defaultValues: live
      ? {
          title: live.title,
          description: live.description,
          coverImage: live.coverImage || '',
          category: live.category,
          tags: live.tags.join(', '),
          eventType: live.eventType,
          startDate: live.startDate,
          endDate: live.endDate || '',
          startTime: live.startTime,
          endTime: live.endTime || '',
          timezone: live.timezone || 'Europe/Lisbon',
          address: live.address || '',
          meetingUrl: live.meetingUrl || '',
          maxAttendees: live.maxAttendees,
          registrationDeadline: live.registrationDeadline || '',
          price: live.price,
          currency: live.currency || 'EUR',
          requiredRole: live.requiredRole as 'visitor' | 'free' | 'premium',
          isPremium: live.isPremium,
          status: live.status as 'draft' | 'published',
        }
      : {
          status: 'draft',
          category: ContentCategory.PERSONAL_FINANCE,
          eventType: 'online',
          timezone: 'Europe/Lisbon',
          requiredRole: 'free',
          isPremium: false,
          price: 0,
          currency: 'EUR',
        },
  })

  const eventType = watch('eventType')
  const price = watch('price')

  const handleSubmit = async (data: LiveFormValues, isDraft = false) => {
    setServerError(null)
    setIsSubmitting(true)

    try {
      const tags = data.tags
        ? data.tags
            .split(',')
            .map((t) => t.trim())
            .filter(Boolean)
        : []

      if (live) {
        const updatePayload: UpdateLiveEventDto = {
          title: data.title,
          description: data.description,
          excerpt: data.excerpt || undefined,
          coverImage: data.coverImage || undefined,
          category: data.category,
          tags,
          eventType: data.eventType,
          startDate: data.startDate,
          endDate: data.endDate || undefined,
          startTime: data.startTime,
          endTime: data.endTime || undefined,
          timezone: data.timezone,
          address: data.address || undefined,
          meetingUrl: data.meetingUrl || undefined,
          maxAttendees: data.maxAttendees,
          registrationDeadline: data.registrationDeadline || undefined,
          price: data.price,
          currency: data.currency,
          requiredRole: data.requiredRole,
          isPremium: data.isPremium,
          status: isDraft ? 'draft' : data.status,
        }
        await props.onSubmit(updatePayload)
      } else {
        const createPayload: CreateLiveEventDto = {
          title: data.title,
          description: data.description,
          excerpt: data.excerpt || undefined,
          coverImage: data.coverImage || undefined,
          category: data.category,
          tags,
          eventType: data.eventType,
          startDate: data.startDate,
          endDate: data.endDate || undefined,
          startTime: data.startTime,
          endTime: data.endTime || undefined,
          timezone: data.timezone,
          address: data.address || undefined,
          meetingUrl: data.meetingUrl || undefined,
          maxAttendees: data.maxAttendees,
          registrationDeadline: data.registrationDeadline || undefined,
          price: data.price,
          currency: data.currency,
          requiredRole: data.requiredRole,
          isPremium: data.isPremium,
          status: isDraft ? 'draft' : data.status,
        }
        await props.onSubmit(createPayload)
      }
      navigate('/creators/dashboard/lives')
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
          placeholder="Ex: Workshop de Investimento em ETFs"
          {...register('title')}
        />
        {errors.title && <p className="text-sm text-red-600">{errors.title.message}</p>}
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Descricao *</label>
        <textarea
          rows={4}
          placeholder="Descreve o evento, o que vai ser abordado..."
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
            <option value={ContentCategory.STOCKS}>Acoes</option>
            <option value={ContentCategory.CRYPTO}>Crypto</option>
            <option value={ContentCategory.REAL_ESTATE}>Imobiliario</option>
            <option value={ContentCategory.BASICS}>Basico</option>
            <option value={ContentCategory.ADVANCED}>Avancado</option>
            <option value={ContentCategory.TRENDS}>Tendencias</option>
          </select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="tags">Tags (separadas por virgula)</Label>
          <Input id="tags" placeholder="workshop, investimento, ao vivo" {...register('tags')} />
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="space-y-2">
          <label className="text-sm font-medium">Tipo de Evento *</label>
          <select
            className="w-full rounded-lg border border-input bg-transparent px-3 py-2 text-sm"
            {...register('eventType')}
          >
            <option value="online">Online</option>
            <option value="presencial">Presencial</option>
            <option value="hybrid">Hibrido</option>
          </select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="startDate">Data de Inicio *</Label>
          <Input id="startDate" type="date" {...register('startDate')} />
          {errors.startDate && <p className="text-sm text-red-600">{errors.startDate.message}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="endDate">Data de Fim (opcional)</Label>
          <Input id="endDate" type="date" {...register('endDate')} />
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="space-y-2">
          <Label htmlFor="startTime">Hora de Inicio *</Label>
          <Input id="startTime" type="time" {...register('startTime')} />
          {errors.startTime && <p className="text-sm text-red-600">{errors.startTime.message}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="endTime">Hora de Fim (opcional)</Label>
          <Input id="endTime" type="time" {...register('endTime')} />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Fuso Horario</label>
          <select
            className="w-full rounded-lg border border-input bg-transparent px-3 py-2 text-sm"
            {...register('timezone')}
          >
            <option value="Europe/Lisbon">Portugal (Lisboa)</option>
            <option value="Europe/London">UK (Londres)</option>
            <option value="America/Sao_Paulo">Brasil (Sao Paulo)</option>
          </select>
        </div>
      </div>

      {(eventType === 'online' || eventType === 'hybrid') && (
        <div className="space-y-2">
          <Label htmlFor="meetingUrl">Link da Reuniao (Zoom, Meet, etc.)</Label>
          <Input
            id="meetingUrl"
            type="url"
            placeholder="https://zoom.us/j/..."
            {...register('meetingUrl')}
          />
          {errors.meetingUrl && <p className="text-sm text-red-600">{errors.meetingUrl.message}</p>}
        </div>
      )}

      {(eventType === 'presencial' || eventType === 'hybrid') && (
        <div className="space-y-2">
          <Label htmlFor="address">Morada do Evento</Label>
          <Input id="address" placeholder="Rua X, Lisboa" {...register('address')} />
        </div>
      )}

      <div className="grid gap-6 md:grid-cols-3">
        <div className="space-y-2">
          <Label htmlFor="maxAttendees">Capacidade Maxima</Label>
          <Input
            id="maxAttendees"
            type="number"
            min="0"
            placeholder="Ilimitado"
            {...register('maxAttendees')}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="registrationDeadline">Inscricoes ate</Label>
          <Input id="registrationDeadline" type="date" {...register('registrationDeadline')} />
        </div>

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
      </div>

      {price > 0 && (
        <div className="rounded-lg border border-blue-200 bg-blue-50 p-4 text-sm text-blue-800">
          Este evento sera vendido por {price}€
        </div>
      )}

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

        {showDraftOption && !live && (
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
          onClick={() => navigate('/creators/dashboard/lives')}
        >
          Cancelar
        </Button>
      </div>
    </form>
  )
}
