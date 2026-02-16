import { UserRole } from '@/features/auth/types'
import { LayoutDashboard, FileText, BarChart, Megaphone, Settings } from 'lucide-react'

export const creatorDashboardRouts = [
  {
    path: '/creators/dashboard',
    label: 'Painel do Criador',
    icon: LayoutDashboard,
    allowedRoles: ['creator', 'admin'] as UserRole[],
  },
  {
    path: '/creators/progresso',
    label: 'Progresso',
    icon: LayoutDashboard,
    allowedRoles: ['creator', 'admin'] as UserRole[],
  },
  {
    label: 'Gerir Conteúdos',
    icon: FileText,
    allowedRoles: ['creator', 'admin'] as UserRole[],
    children: [
      {
        path: '/creators/dashboard/overview',
        label: 'Todos os Conteúdos',
      },
      {
        path: '/creators/dashboard/announcements',
        label: 'Gerir Anúncios',
      },
      {
        path: '/creators/dashboard/reels',
        label: 'Gerir Reels',
      },
      {
        path: '/creators/dashboard/articles',
        label: 'Gerir Artigos',
      },
      {
        path: '/creators/dashboard/courses',
        label: 'Gerir Cursos',
      },
      {
        path: '/creators/dashboard/podcasts',
        label: 'Gerir Podcasts',
      },
      {
        path: '/creators/dashboard/welcome-videos',
        label: 'Gerir Vídeos de Apresentação',
      },
      {
        path: '/creators/dashboard/lives',
        label: 'Gerir Lives',
      },
      {
        path: '/creators/dashboard/files',
        label: 'Gerir Ficheiros',
      },
      {
        path: '/creators/dashboard/playlists',
        label: 'Gerir Playlists',
      },
    ],
  },
  {
    path: '/creators/estatisticas',
    label: 'Estatísticas dos Conteúdos',
    icon: BarChart,
    allowedRoles: ['creator', 'admin'] as UserRole[],
  },
  {
    path: '/creators/anuncios',
    label: 'Gerir Publicidade',
    icon: Megaphone,
    allowedRoles: ['creator', 'admin'] as UserRole[],
  },
  {
    path: '/creators/definicoes',
    label: 'Configurações',
    icon: Settings,
    allowedRoles: ['creator', 'admin'] as UserRole[],
  },
]
