import { z } from 'zod'
import { ContentCategory } from '../../types'

export const bookFormSchema = z.object({
  title: z.string().min(1, 'Titulo e obrigatorio').max(200, 'Maximo 200 caracteres'),
  description: z
    .string()
    .min(1, 'Descricao/resumo e obrigatoria')
    .max(5000, 'Maximo 5000 caracteres'),
  excerpt: z.string().max(300, 'Maximo 300 caracteres').optional(),
  coverImage: z.string().url('URL invalida').optional().or(z.literal('')),
  category: z.nativeEnum(ContentCategory),
  tags: z.string().optional(),

  author: z.string().min(1, 'Autor e obrigatorio'),
  isbn: z.string().optional(),
  publisher: z.string().optional(),
  publishYear: z.coerce.number().min(1800).max(2100).optional(),
  pages: z.coerce.number().min(1).optional(),
  genres: z.string().optional(),
  keyPhrases: z.string().optional(),
  purchaseUrl: z.string().url('URL invalida').optional().or(z.literal('')),
  pdfUrl: z.string().url('URL invalida').optional().or(z.literal('')),

  requiredRole: z.enum(['visitor', 'free', 'premium']).optional(),
  isPremium: z.boolean().optional(),
  status: z.enum(['draft', 'published']).optional(),
})

export type BookFormValues = z.infer<typeof bookFormSchema>
