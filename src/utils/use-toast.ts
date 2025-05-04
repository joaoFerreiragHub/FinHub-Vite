// utils/use-toast.ts
import { toast } from "react-toastify"

export function useToast() {
  return {
    toastSuccess: (message: string) => toast.success(message),
    toastError: (message: string) => toast.error(message),
    toastInfo: (message: string) => toast.info(message),
    toastWarning: (message: string) => toast.warning(message),
  }
}
