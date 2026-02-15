import { z } from 'zod'
import { ContentCategory } from '../../types'

export const liveFormSchema = z.object({
  title: z.string().min(1, 'Titulo e obrigatorio').max(200, 'Maximo 200 caracteres'),
  description: z.string().min(1, 'Descricao e obrigatoria').max(2000, 'Maximo 2000 caracteres'),
  excerpt: z.string().max(300, 'Maximo 300 caracteres').optional(),
  coverImage: z.string().url('URL invalida').optional().or(z.literal('')),
  category: z.nativeEnum(ContentCategory),
  tags: z.string().optional(),

  eventType: z.enum(['online', 'presencial', 'hybrid']),
  startDate: z.string().min(1, 'Data de inicio e obrigatoria'),
  endDate: z.string().optional(),
  startTime: z.string().min(1, 'Hora de inicio e obrigatoria'),
  endTime: z.string().optional(),
  timezone: z.string().default('Europe/Lisbon'),
  address: z.string().optional(),
  meetingUrl: z.string().url('URL invalida').optional().or(z.literal('')),
  maxAttendees: z.coerce.number().min(0).optional(),
  registrationDeadline: z.string().optional(),

  price: z.coerce.number().min(0, 'Preco nao pode ser negativo'),
  currency: z.string().default('EUR'),

  requiredRole: z.enum(['visitor', 'free', 'premium']).optional(),
  isPremium: z.boolean().optional(),
  status: z.enum(['draft', 'published']).optional(),
})

export type LiveFormValues = z.infer<typeof liveFormSchema>
