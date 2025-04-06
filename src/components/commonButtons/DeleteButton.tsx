import { Trash2 } from 'lucide-react'
import { Button } from '../ui/button'

export const DeleteButton = (props: React.ComponentProps<typeof Button>) => (
  <Button variant="danger" {...props}>
    <Trash2 className="mr-2 h-4 w-4" />
    Apagar
  </Button>
)
