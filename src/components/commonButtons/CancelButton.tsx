import { X } from 'lucide-react'
import { Button } from '../ui/button'

export const CancelButton = (props: React.ComponentProps<typeof Button>) => (
  <Button variant="cancel" {...props}>
    <X className="mr-2 h-4 w-4" />
    Cancelar
  </Button>
)
