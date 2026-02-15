import { Check } from 'lucide-react'
import { Button } from '@/components/ui'

export const SaveButton = (props: React.ComponentProps<typeof Button>) => (
  <Button variant="default" {...props}>
    <Check className="mr-2 h-4 w-4" />
    Guardar
  </Button>
)
