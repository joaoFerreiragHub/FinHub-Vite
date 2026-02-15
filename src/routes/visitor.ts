import { UserRole } from '@/features/auth/types'
import { Home, Search, Wrench, UserPlus, LogIn } from 'lucide-react'

export const visitorRoutes = [
  {
    path: '/',
    label: 'Início',
    icon: Home,
    allowedRoles: ['visitor', 'regular', 'premium', 'creator', 'admin'] as UserRole[],
  },
  {
    path: '/explorar',
    label: 'Explorar Conteúdos',
    icon: Search,
    allowedRoles: ['visitor', 'regular', 'premium', 'creator', 'admin'] as UserRole[],
  },
  {
    path: '/tools',
    label: 'Ferramentas Públicas',
    icon: Wrench,
    allowedRoles: ['regular', 'premium', 'creator', 'admin'] as UserRole[],
    isBlurredFor: ['visitor'] as UserRole[],
  },
  {
    path: '/registar',
    label: 'Criar Conta',
    icon: UserPlus,
    allowedRoles: ['visitor'] as UserRole[],
  },
  {
    path: '/login',
    label: 'Entrar',
    icon: LogIn,
    allowedRoles: ['visitor'] as UserRole[],
  },
]

export default visitorRoutes
