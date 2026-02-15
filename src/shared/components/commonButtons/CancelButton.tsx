import { X } from 'lucide-react'
import { Button } from '@/components/ui'

export const CancelButton = (props: React.ComponentProps<typeof Button>) => (
  <Button variant="outline" {...props}>
    <X className="mr-2 h-4 w-4" />
    Cancelar
  </Button>
)
