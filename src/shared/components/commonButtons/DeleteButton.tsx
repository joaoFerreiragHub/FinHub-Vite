import { Trash2 } from 'lucide-react'
import { Button } from '@/components/ui'

export const DeleteButton = (props: React.ComponentProps<typeof Button>) => (
  <Button variant="destructive" {...props}>
    <Trash2 className="mr-2 h-4 w-4" />
    Apagar
  </Button>
)
