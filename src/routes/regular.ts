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
  FolderKanban,
  Video,
  GraduationCap,
  Calendar,
  Mic,
  BookOpenCheck,
} from 'lucide-react'

const REGULAR_ALLOWED_ROLES = [
  'free',
  'premium',
  'creator',
  'brand_manager',
  'admin',
] as UserRole[]

export const regularRoutes = [
  {
    path: '/',
    label: 'Home',
    icon: Home,
    allowedRoles: REGULAR_ALLOWED_ROLES,
  },
  {
    path: '/creators',
    label: 'Educadores',
    icon: BookOpen,
    allowedRoles: REGULAR_ALLOWED_ROLES,
  },
  {
    path: '/noticias',
    label: 'Noticias',
    icon: Newspaper,
    allowedRoles: REGULAR_ALLOWED_ROLES,
  },
  {
    path: '/stocks',
    label: 'Acoes',
    icon: TrendingUp,
    allowedRoles: REGULAR_ALLOWED_ROLES,
  },
  {
    path: '/hub/conteudos',
    label: 'Conteudos',
    icon: FolderKanban,
    allowedRoles: REGULAR_ALLOWED_ROLES,
  },
  {
    path: '/hub/videos',
    label: 'Videos',
    icon: Video,
    allowedRoles: REGULAR_ALLOWED_ROLES,
  },
  {
    path: '/hub/courses',
    label: 'Cursos',
    icon: GraduationCap,
    allowedRoles: REGULAR_ALLOWED_ROLES,
  },
  {
    path: '/hub/lives',
    label: 'Eventos',
    icon: Calendar,
    allowedRoles: REGULAR_ALLOWED_ROLES,
  },
  {
    path: '/hub/podcasts',
    label: 'Podcasts',
    icon: Mic,
    allowedRoles: REGULAR_ALLOWED_ROLES,
  },
  {
    path: '/hub/books',
    label: 'Livros',
    icon: BookOpenCheck,
    allowedRoles: REGULAR_ALLOWED_ROLES,
  },
  {
    path: '/perfil',
    label: 'Perfil',
    icon: User,
    allowedRoles: REGULAR_ALLOWED_ROLES,
  },
  {
    path: '/feed',
    label: 'Feed',
    icon: Rss,
    allowedRoles: REGULAR_ALLOWED_ROLES,
  },
  {
    path: '/favoritos',
    label: 'Favoritos',
    icon: Bookmark,
    allowedRoles: REGULAR_ALLOWED_ROLES,
  },
  {
    path: '/seguindo',
    label: 'A Seguir',
    icon: Users,
    allowedRoles: REGULAR_ALLOWED_ROLES,
  },
  {
    path: '/notificacoes',
    label: 'Notificacoes',
    icon: Bell,
    allowedRoles: REGULAR_ALLOWED_ROLES,
  },
  {
    path: '/pesquisar',
    label: 'Pesquisar',
    icon: Search,
    allowedRoles: REGULAR_ALLOWED_ROLES,
  },
]

export default regularRoutes
