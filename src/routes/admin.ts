import { UserRole } from '@/features/auth/types'
import { Shield, Users, FileText, BarChart } from 'lucide-react'

export const adminRoutes = [
  {
    path: '/admin/dashboard',
    label: 'Admin Panel',
    icon: Shield,
    allowedRoles: ['admin'] as UserRole[],
  },
  {
    path: '/admin/utilizadores',
    label: 'Gestão de Utilizadores',
    icon: Users,
    allowedRoles: ['admin'] as UserRole[],
  },
  {
    path: '/admin/conteudos',
    label: 'Moderador de Conteúdos',
    icon: FileText,
    allowedRoles: ['admin'] as UserRole[],
  },
  {
    path: '/admin/estatisticas',
    label: 'Estatísticas da Plataforma',
    icon: BarChart,
    allowedRoles: ['admin'] as UserRole[],
  },
]

export default adminRoutes
