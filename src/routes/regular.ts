import { UserRole } from '@/features/auth/types'
import {
  Home,
  BookOpen,
  Newspaper,
  TrendingUp,
  User,
  Rss,
  Bookmark,
  Users,
  Bell,
  Search,
  FileText,
  Video,
  GraduationCap,
  Calendar,
  Mic,
  BookOpenCheck,
} from 'lucide-react'

export const regularRoutes = [
  {
    path: '/',
    label: 'Home',
    icon: Home,
    allowedRoles: ['free', 'premium', 'creator', 'admin'] as UserRole[],
  },
  {
    path: '/creators',
    label: 'Educadores',
    icon: BookOpen,
    allowedRoles: ['free', 'premium', 'creator', 'admin'] as UserRole[],
  },
  {
    path: '/noticias',
    label: 'Noticias',
    icon: Newspaper,
    allowedRoles: ['free', 'premium', 'creator', 'admin'] as UserRole[],
  },
  {
    path: '/stocks',
    label: 'Acoes',
    icon: TrendingUp,
    allowedRoles: ['free', 'premium', 'creator', 'admin'] as UserRole[],
  },
  {
    path: '/hub/articles',
    label: 'Artigos',
    icon: FileText,
    allowedRoles: ['free', 'premium', 'creator', 'admin'] as UserRole[],
  },
  {
    path: '/hub/videos',
    label: 'Videos',
    icon: Video,
    allowedRoles: ['free', 'premium', 'creator', 'admin'] as UserRole[],
  },
  {
    path: '/hub/courses',
    label: 'Cursos',
    icon: GraduationCap,
    allowedRoles: ['free', 'premium', 'creator', 'admin'] as UserRole[],
  },
  {
    path: '/hub/lives',
    label: 'Eventos',
    icon: Calendar,
    allowedRoles: ['free', 'premium', 'creator', 'admin'] as UserRole[],
  },
  {
    path: '/hub/podcasts',
    label: 'Podcasts',
    icon: Mic,
    allowedRoles: ['free', 'premium', 'creator', 'admin'] as UserRole[],
  },
  {
    path: '/hub/books',
    label: 'Livros',
    icon: BookOpenCheck,
    allowedRoles: ['free', 'premium', 'creator', 'admin'] as UserRole[],
  },
  {
    path: '/perfil',
    label: 'Perfil',
    icon: User,
    allowedRoles: ['free', 'premium', 'creator', 'admin'] as UserRole[],
  },
  {
    path: '/feed',
    label: 'Feed',
    icon: Rss,
    allowedRoles: ['free', 'premium', 'creator', 'admin'] as UserRole[],
  },
  {
    path: '/favoritos',
    label: 'Favoritos',
    icon: Bookmark,
    allowedRoles: ['free', 'premium', 'creator', 'admin'] as UserRole[],
  },
  {
    path: '/seguindo',
    label: 'A Seguir',
    icon: Users,
    allowedRoles: ['free', 'premium', 'creator', 'admin'] as UserRole[],
  },
  {
    path: '/notificacoes',
    label: 'Notificacoes',
    icon: Bell,
    allowedRoles: ['free', 'premium', 'creator', 'admin'] as UserRole[],
  },
  {
    path: '/pesquisar',
    label: 'Pesquisar',
    icon: Search,
    allowedRoles: ['free', 'premium', 'creator', 'admin'] as UserRole[],
  },
]

export default regularRoutes
