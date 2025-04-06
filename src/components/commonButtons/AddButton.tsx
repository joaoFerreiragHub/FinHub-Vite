import { Plus } from 'lucide-react'
import { Button } from '../ui/button'

export const AddButton = (props: React.ComponentProps<typeof Button>) => (
  <Button variant="default" {...props}>
    <Plus className="mr-2 h-4 w-4" />
    Adicionar
  </Button>
)
