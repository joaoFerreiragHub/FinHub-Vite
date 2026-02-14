import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/shared/ui'
import { type ContentType } from '../../types'
import { getErrorMessage } from '@/lib/api'
import { cn } from '@/lib/utils/cn'

const commentFormSchema = z.object({
  content: z
    .string()
    .min(1, 'Comentário é obrigatório')
    .min(3, 'Mínimo 3 caracteres')
    .max(2000, 'Máximo 2000 caracteres'),
})

type CommentFormData = z.infer<typeof commentFormSchema>

export interface CommentFormProps {
  /**
   * Tipo e ID do conteúdo alvo
   */
  targetType: ContentType
  targetId: string
  /**
   * ID do comentário pai (se for reply)
   */
  parentCommentId?: string
  /**
   * Conteúdo inicial (para edição)
   */
  initialContent?: string
  /**
   * Callback ao submeter
   */
  onSubmit: (content: string) => Promise<void>
  /**
   * Callback ao cancelar
   */
  onCancel?: () => void
  /**
   * Placeholder customizado
   */
  placeholder?: string
  /**
   * Modo compacto (para replies)
   */
  compact?: boolean
}

/**
 * Formulário para criar/editar comentário
 *
 * @example
 * <CommentForm
 *   targetType={ContentType.ARTICLE}
 *   targetId="123"
 *   onSubmit={handleSubmit}
 * />
 */
export function CommentForm({
  parentCommentId,
  initialContent,
  onSubmit,
  onCancel,
  placeholder = 'Escreva um comentário...',
  compact = false,
}: CommentFormProps) {
  const [serverError, setServerError] = useState<string | null>(null)

  const {
    register,
    handleSubmit: handleFormSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<CommentFormData>({
    resolver: zodResolver(commentFormSchema),
    defaultValues: {
      content: initialContent || '',
    },
  })

  const handleSubmit = async (data: CommentFormData) => {
    setServerError(null)

    try {
      await onSubmit(data.content)
      reset() // Limpar form após sucesso
    } catch (error) {
      setServerError(getErrorMessage(error))
    }
  }

  return (
    <form onSubmit={handleFormSubmit(handleSubmit)} className="space-y-3">
      {serverError && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-800">
          {serverError}
        </div>
      )}

      <div className="space-y-2">
        <textarea
          rows={compact ? 2 : 3}
          placeholder={placeholder}
          className={cn(
            'w-full rounded-lg border border-input bg-transparent px-3 py-2 text-sm transition-all duration-200 placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2',
            errors.content && 'border-red-500'
          )}
          {...register('content')}
        />
        {errors.content && (
          <p className="text-sm text-red-600">{errors.content.message}</p>
        )}
      </div>

      <div className="flex gap-2">
        <Button
          type="submit"
          variant="default"
          size={compact ? 'sm' : 'default'}
          isLoading={isSubmitting}
        >
          {parentCommentId ? 'Responder' : initialContent ? 'Atualizar' : 'Comentar'}
        </Button>

        {onCancel && (
          <Button
            type="button"
            variant="ghost"
            size={compact ? 'sm' : 'default'}
            onClick={onCancel}
          >
            Cancelar
          </Button>
        )}
      </div>
    </form>
  )
}
