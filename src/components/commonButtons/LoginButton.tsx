// src/components/commonButtons/LoginButton.tsx
import { LogIn } from 'lucide-react'
import { Button } from '../ui/button'

export const LoginButton = (props: React.ComponentProps<typeof Button>) => (
  <Button variant="secondary" {...props}>
    <LogIn className="mr-2 h-4 w-4" />
    Login
  </Button>
)
