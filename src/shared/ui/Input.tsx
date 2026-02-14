import { forwardRef, type InputHTMLAttributes } from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils/cn'

const inputVariants = cva(
  'flex w-full rounded-lg border bg-transparent px-3 py-2 text-sm transition-all duration-200 file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
  {
    variants: {
      variant: {
        default: 'border-input focus:ring-primary',
        error: 'border-red-500 focus:ring-red-500',
        success: 'border-green-500 focus:ring-green-500',
      },
      inputSize: {
        sm: 'h-9 text-sm',
        default: 'h-10',
        lg: 'h-11 text-base',
      },
    },
    defaultVariants: {
      variant: 'default',
      inputSize: 'default',
    },
  }
)

export interface InputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'>,
    VariantProps<typeof inputVariants> {
  /**
   * Mensagem de erro a ser exibida abaixo do input
   */
  error?: string
  /**
   * Label do input
   */
  label?: string
  /**
   * Texto auxiliar abaixo do input
   */
  helperText?: string
}

/**
 * Input component com validação e estados
 *
 * @example
 * <Input
 *   label="Email"
 *   type="email"
 *   error="Email inválido"
 *   helperText="Digite seu melhor email"
 * />
 */
export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      variant,
      inputSize,
      type = 'text',
      error,
      label,
      helperText,
      id,
      ...props
    },
    ref
  ) => {
    const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`
    const finalVariant = error ? 'error' : variant

    return (
      <div className="w-full space-y-2">
        {label && (
          <label
            htmlFor={inputId}
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            {label}
          </label>
        )}
        <input
          id={inputId}
          type={type}
          className={cn(inputVariants({ variant: finalVariant, inputSize, className }))}
          ref={ref}
          aria-invalid={!!error}
          aria-describedby={error ? `${inputId}-error` : helperText ? `${inputId}-helper` : undefined}
          {...props}
        />
        {error && (
          <p id={`${inputId}-error`} className="text-sm text-red-600">
            {error}
          </p>
        )}
        {helperText && !error && (
          <p id={`${inputId}-helper`} className="text-sm text-muted-foreground">
            {helperText}
          </p>
        )}
      </div>
    )
  }
)

Input.displayName = 'Input'
