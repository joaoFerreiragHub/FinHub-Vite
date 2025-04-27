import { useState } from 'react'
import * as z from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { Loader2 } from 'lucide-react'
import { Announcement } from '../../../../types/announcement'
import { useCreateAnnouncement, useEditAnnouncement } from './hooks/useAnnouncementsQuery'
import { toast } from 'react-toastify'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '../../../ui/card'
import { Input } from '../../../ui/input'
import { Textarea } from '../../../ui/textarea'
import { Button } from '../../../ui/button'

const formSchema = z.object({
  title: z.string().min(1, 'Título é obrigatório').max(100, 'Máximo 100 caracteres'),
  text: z
    .string()
    .min(1, 'Texto é obrigatório')
    .max(255, 'Máximo 255 caracteres')
    .refine((val) => !/<.*?>/.test(val), 'HTML não permitido'),
  type: z.enum(['inline', 'popup'], { errorMap: () => ({ message: 'Tipo de anúncio inválido' }) }),
  imageUrl: z.string().url('URL inválida').optional().or(z.literal('')), // 👈 NOVO campo opcional
})

type FormData = z.infer<typeof formSchema>

interface AnnouncementFormProps {
  initialData?: Announcement
  onSuccess: () => void
}

export default function AnnouncementForm({ initialData, onSuccess }: AnnouncementFormProps) {
  const [loading, setLoading] = useState(false)
  const createMutation = useCreateAnnouncement()
  const editMutation = useEditAnnouncement()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: initialData?.title || '',
      text: initialData?.text || '',
      type: initialData?.type || 'inline',
      imageUrl: initialData?.imageUrl || '', // 👈 Aqui
    },
  })

  const onSubmit = async (data: FormData) => {
    setLoading(true)
    try {
      if (initialData) {
        await editMutation.mutateAsync({ id: initialData.id, updatedData: data })
        toast.success('Anúncio atualizado com sucesso!')
      } else {
        await createMutation.mutateAsync({ ...data, creatorId: '123' })
        toast.success('Anúncio criado com sucesso!')
      }
      onSuccess()
    } catch {
      toast.error('Erro ao salvar o anúncio.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{initialData ? 'Editar Anúncio' : 'Novo Anúncio'}</CardTitle>
      </CardHeader>
      <form onSubmit={handleSubmit(onSubmit)}>
        <CardContent className="space-y-4">
          <Input placeholder="Título" {...register('title')} disabled={loading} />
          {errors.title && <p className="text-sm text-red-500">{errors.title.message}</p>}

          <Textarea
            placeholder="Texto do anúncio..."
            rows={4}
            {...register('text')}
            disabled={loading}
          />
          {errors.text && <p className="text-sm text-red-500">{errors.text.message}</p>}

          <div>
            <label className="block text-sm font-medium mb-1 text-foreground">
              Tipo de Anúncio
            </label>
            <select
              {...register('type')}
              disabled={loading}
              className="w-full border border-border rounded-md bg-background text-foreground px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="inline">Aviso (Inline)</option>
              <option value="popup">Pop-up (Destaque)</option>
            </select>
            {errors.type && <p className="text-sm text-red-500">{errors.type.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 text-foreground">
              Imagem (URL opcional)
            </label>
            <Input placeholder="https://..." {...register('imageUrl')} disabled={loading} />
            {errors.imageUrl && <p className="text-sm text-red-500">{errors.imageUrl.message}</p>}
          </div>
        </CardContent>
        <CardFooter className="flex justify-end">
          <Button type="submit" disabled={loading}>
            {loading && <Loader2 className="animate-spin w-4 h-4 mr-2" />}
            {initialData ? 'Guardar' : 'Anunciar'}
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}
