import { UserRole } from '@/features/auth/types'
import { BarChart3, LayoutDashboard, Layers, ShieldCheck, Users, LifeBuoy } from 'lucide-react'

export const adminRoutes = [
  {
    path: '/admin',
    label: 'Admin Dashboard',
    icon: LayoutDashboard,
    allowedRoles: ['admin'] as UserRole[],
  },
  {
    path: '/admin/users',
    label: 'Utilizadores',
    icon: Users,
    allowedRoles: ['admin'] as UserRole[],
  },
  {
    path: '/admin/conteudo',
    label: 'Moderacao',
    icon: ShieldCheck,
    allowedRoles: ['admin'] as UserRole[],
  },
  {
    path: '/admin/suporte',
    label: 'Suporte assistido',
    icon: LifeBuoy,
    allowedRoles: ['admin'] as UserRole[],
  },
  {
    path: '/admin/recursos',
    label: 'Recursos',
    icon: Layers,
    allowedRoles: ['admin'] as UserRole[],
  },
  {
    path: '/admin/stats',
    label: 'Estatisticas',
    icon: BarChart3,
    allowedRoles: ['admin'] as UserRole[],
  },
]

export default adminRoutes
