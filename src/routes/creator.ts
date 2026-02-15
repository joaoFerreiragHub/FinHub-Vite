import { UserRole } from '@/features/auth/types'
import { LayoutDashboard, FileText, BarChart, Megaphone } from 'lucide-react'

export const creatorRoutes = [
  {
    path: '/creators/dashboard',
    label: 'Painel do Criador',
    icon: LayoutDashboard,
    allowedRoles: ['creator', 'admin'] as UserRole[],
  },
  {
    path: '/conteudos/gerir',
    label: 'Gerir Conteúdos',
    icon: FileText,
    allowedRoles: ['creator', 'admin'] as UserRole[],
  },
  {
    path: '/estatisticas',
    label: 'Estatísticas dos Conteúdos',
    icon: BarChart,
    allowedRoles: ['creator', 'admin'] as UserRole[],
  },
  {
    path: '/publicidade',
    label: 'Gerir Publicidade',
    icon: Megaphone,
    allowedRoles: ['creator', 'admin'] as UserRole[],
  },
]

export default creatorRoutes
