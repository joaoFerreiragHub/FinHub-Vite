import { Check } from 'lucide-react'
import { Button } from '../ui/button'

export const SaveButton = (props: React.ComponentProps<typeof Button>) => (
  <Button variant="success" {...props}>
    <Check className="mr-2 h-4 w-4" />
    Guardar
  </Button>
)
