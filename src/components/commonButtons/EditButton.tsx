import { Pencil } from 'lucide-react'
import { Button } from '../ui/button'

export const EditButton = (props: React.ComponentProps<typeof Button>) => (
  <Button variant="default" {...props}>
    <Pencil className="mr-2 h-4 w-4" />
    Editar
  </Button>
)
