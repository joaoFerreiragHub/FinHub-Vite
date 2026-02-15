import { UserRole } from '@/features/auth/types'
import type { LucideIcon } from 'lucide-react'

// Ainda nao existem paginas dedicadas a /premium no filesystem routing.
// Mantemos vazio para evitar links quebrados na sidebar.
export const premiumRoutes: Array<{
  path: string
  label: string
  icon: LucideIcon
  allowedRoles: UserRole[]
}> = []

export default premiumRoutes
