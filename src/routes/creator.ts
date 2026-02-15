import { UserRole } from '@/features/auth/types'
import {
  LayoutDashboard,
  BarChart,
  Settings,
  Trophy,
  FileText,
  Video,
  BookOpen,
  Calendar,
  Mic,
  File,
  List,
  Film,
  Megaphone,
  Play,
} from 'lucide-react'

/**
 * Rotas principais de navegação para criadores
 * Aparecem na sidebar do DashboardLayout
 */
export const creatorRoutes = [
  {
    path: '/creators/dashboard',
    label: 'Dashboard',
    icon: LayoutDashboard,
    allowedRoles: ['creator', 'admin'] as UserRole[],
  },
  {
    path: '/creators/estatisticas',
    label: 'Estatisticas',
    icon: BarChart,
    allowedRoles: ['creator', 'admin'] as UserRole[],
  },
  {
    path: '/creators/progresso',
    label: 'Progresso',
    icon: Trophy,
    allowedRoles: ['creator', 'admin'] as UserRole[],
  },
  {
    path: '/creators/definicoes',
    label: 'Configuracoes',
    icon: Settings,
    allowedRoles: ['creator', 'admin'] as UserRole[],
  },
]

/**
 * Rotas de gestão de conteúdo
 * Usadas no dashboard para navegação interna entre tipos de conteúdo
 */
export const creatorContentRoutes = [
  {
    path: '/creators/dashboard/articles',
    label: 'Artigos',
    icon: FileText,
    allowedRoles: ['creator', 'admin'] as UserRole[],
  },
  {
    path: '/creators/dashboard/videos',
    label: 'Videos',
    icon: Video,
    allowedRoles: ['creator', 'admin'] as UserRole[],
  },
  {
    path: '/creators/dashboard/courses',
    label: 'Cursos',
    icon: BookOpen,
    allowedRoles: ['creator', 'admin'] as UserRole[],
  },
  {
    path: '/creators/dashboard/lives',
    label: 'Eventos/Lives',
    icon: Calendar,
    allowedRoles: ['creator', 'admin'] as UserRole[],
  },
  {
    path: '/creators/dashboard/podcasts',
    label: 'Podcasts',
    icon: Mic,
    allowedRoles: ['creator', 'admin'] as UserRole[],
  },
  {
    path: '/creators/dashboard/books',
    label: 'Livros',
    icon: BookOpen,
    allowedRoles: ['creator', 'admin'] as UserRole[],
  },
  {
    path: '/creators/dashboard/playlists',
    label: 'Playlists',
    icon: List,
    allowedRoles: ['creator', 'admin'] as UserRole[],
  },
  {
    path: '/creators/dashboard/reels',
    label: 'Reels/Shorts',
    icon: Film,
    allowedRoles: ['creator', 'admin'] as UserRole[],
  },
  {
    path: '/creators/dashboard/announcements',
    label: 'Anuncios',
    icon: Megaphone,
    allowedRoles: ['creator', 'admin'] as UserRole[],
  },
  {
    path: '/creators/dashboard/files',
    label: 'Ficheiros',
    icon: File,
    allowedRoles: ['creator', 'admin'] as UserRole[],
  },
  {
    path: '/creators/dashboard/welcome-videos',
    label: 'Videos de Boas-Vindas',
    icon: Play,
    allowedRoles: ['creator', 'admin'] as UserRole[],
  },
  {
    path: '/creators/dashboard/overview',
    label: 'Resumo Geral',
    icon: LayoutDashboard,
    allowedRoles: ['creator', 'admin'] as UserRole[],
  },
]

export default creatorRoutes
