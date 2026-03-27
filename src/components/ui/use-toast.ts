import { toast as toastify } from 'react-toastify'

type ToastVariant = 'default' | 'destructive'

interface ToastOptions {
  title: string
  variant?: ToastVariant
}

export function useToast() {
  return {
    toast: ({ title, variant = 'default' }: ToastOptions) => {
      if (variant === 'destructive') {
        toastify.error(title)
        return
      }

      toastify.success(title)
    },
  }
}
