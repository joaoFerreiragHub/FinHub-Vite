import { UserRole } from '../stores/useUserStore'
import { LayoutDashboard, FileText, BarChart, Megaphone, Settings } from 'lucide-react'

export const creatorDashboardRouts = [
  {
    path: '/creators/dashboard',
    label: 'Painel do Criador',
    icon: LayoutDashboard,
    allowedRoles: ['creator', 'admin'] as UserRole[],
  },
  {
    label: 'Gerir Conteúdos',
    icon: FileText,
    allowedRoles: ['creator', 'admin'] as UserRole[],
    children: [
      {
        path: '/creators/conteudos/gerir',
        label: 'Todos os Conteúdos',
      },
      {
        path: '/creators/conteudos/anuncios',
        label: 'Gerir Anúncios',
      },
    {
        path: '/creators/conteudos/artigos',
        label: 'Gerir Artigos',
      },
      {
        path: '/creators/conteudos/videos',
        label: 'Gerir Vídeos',
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
    path: '/creators/publicidade',
    label: 'Gerir Publicidade',
    icon: Megaphone,
    allowedRoles: ['creator', 'admin'] as UserRole[],
  },
  {
    path: '/creators/configuracoes',
    label: 'Configurações',
    icon: Settings,
    allowedRoles: ['creator', 'admin'] as UserRole[],
  },
]
