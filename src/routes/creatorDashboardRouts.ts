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
        path: '/creators/conteudos/resumo',
        label: 'Todos os Conteúdos',
      },
      {
        path: '/creators/conteudos/anuncios',
        label: 'Gerir Anúncios',
      },
      {
        path: '/creators/conteudos/reels',
        label: 'Gerir Reels',
      },
      {
        path: '/creators/conteudos/artigos',
        label: 'Gerir Artigos',
      },
      {
        path: '/creators/conteudos/courses',
        label: 'Gerir Cursos',
      },
      {
        path: '/creators/conteudos/podcasts',
        label: 'Gerir Podcasts',
      },
      {
        path: '/creators/conteudos/welcomeVideos',
        label: 'Gerir Vídeos de Apresentação',
      },
      {
        path: '/creators/conteudos/lives',
        label: 'Gerir Lives',
      },
      {
        path: '/creators/conteudos/files',
        label: 'Gerir Ficheiros',
      },
      {
        path: '/creators/conteudos/playlists',
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
