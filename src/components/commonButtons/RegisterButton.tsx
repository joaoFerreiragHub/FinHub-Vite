// src/components/commonButtons/RegisterButton.tsx
import { UserPlus } from 'lucide-react'
import { Button } from '../ui/button'

export const RegisterButton = (props: React.ComponentProps<typeof Button>) => (
  <Button variant="outline" {...props}>
    <UserPlus className="mr-2 h-4 w-4" />
    Criar Conta
  </Button>
)
