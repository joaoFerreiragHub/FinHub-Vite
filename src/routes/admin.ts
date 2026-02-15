import { UserRole } from '@/features/auth/types'
import type { LucideIcon } from 'lucide-react'

// Ainda nao existem paginas /admin/* no filesystem routing.
// Mantemos vazio para evitar navegacao para 404.
export const adminRoutes: Array<{
  path: string
  label: string
  icon: LucideIcon
  allowedRoles: UserRole[]
}> = []

export default adminRoutes
