import type { LucideIcon } from 'lucide-react'
import {
  BarChart,
  BookOpen,
  Calendar,
  File,
  FileText,
  Film,
  House,
  LayoutDashboard,
  Megaphone,
  Mic,
  Play,
  Settings,
  Trophy,
  Video,
} from 'lucide-react'
import { UserRole } from '@/features/auth/types'

const CREATOR_ALLOWED_ROLES: UserRole[] = [UserRole.CREATOR, UserRole.ADMIN]

export type CreatorSidebarSectionId = 'principal' | 'conteudo' | 'comunicacao' | 'conta'

export interface CreatorSidebarItem {
  path: string
  label: string
  icon: LucideIcon
  allowedRoles: UserRole[]
  sectionId: CreatorSidebarSectionId
  exact?: boolean
  matchPaths?: string[]
  includeInRoleRoutes?: boolean
}

export interface CreatorSidebarSection {
  id: CreatorSidebarSectionId
  label: string
  items: CreatorSidebarItem[]
}

const principalSection: CreatorSidebarSection = {
  id: 'principal',
  label: 'Principal',
  items: [
    {
      path: '/creators/dashboard',
      label: 'Dashboard',
      icon: LayoutDashboard,
      allowedRoles: CREATOR_ALLOWED_ROLES,
      sectionId: 'principal',
      exact: true,
      matchPaths: ['/creators/dashboard', '/creators/dashboard/overview'],
    },
    {
      path: '/creators/estatisticas',
      label: 'Estatisticas',
      icon: BarChart,
      allowedRoles: CREATOR_ALLOWED_ROLES,
      sectionId: 'principal',
    },
    {
      path: '/creators/progresso',
      label: 'Progresso',
      icon: Trophy,
      allowedRoles: CREATOR_ALLOWED_ROLES,
      sectionId: 'principal',
    },
  ],
}

const contentSection: CreatorSidebarSection = {
  id: 'conteudo',
  label: 'Conteudo',
  items: [
    {
      path: '/creators/dashboard/articles',
      label: 'Artigos',
      icon: FileText,
      allowedRoles: CREATOR_ALLOWED_ROLES,
      sectionId: 'conteudo',
    },
    {
      path: '/creators/dashboard/videos',
      label: 'Videos',
      icon: Video,
      allowedRoles: CREATOR_ALLOWED_ROLES,
      sectionId: 'conteudo',
    },
    {
      path: '/creators/dashboard/courses',
      label: 'Cursos',
      icon: BookOpen,
      allowedRoles: CREATOR_ALLOWED_ROLES,
      sectionId: 'conteudo',
    },
    {
      path: '/creators/dashboard/lives',
      label: 'Lives/Eventos',
      icon: Calendar,
      allowedRoles: CREATOR_ALLOWED_ROLES,
      sectionId: 'conteudo',
    },
    {
      path: '/creators/dashboard/podcasts',
      label: 'Podcasts',
      icon: Mic,
      allowedRoles: CREATOR_ALLOWED_ROLES,
      sectionId: 'conteudo',
    },
    {
      path: '/creators/dashboard/books',
      label: 'Livros',
      icon: BookOpen,
      allowedRoles: CREATOR_ALLOWED_ROLES,
      sectionId: 'conteudo',
    },
    {
      path: '/creators/dashboard/playlists',
      label: 'Playlists',
      icon: FileText,
      allowedRoles: CREATOR_ALLOWED_ROLES,
      sectionId: 'conteudo',
    },
    {
      path: '/creators/dashboard/reels',
      label: 'Reels/Shorts',
      icon: Film,
      allowedRoles: CREATOR_ALLOWED_ROLES,
      sectionId: 'conteudo',
    },
    {
      path: '/creators/dashboard/files',
      label: 'Ficheiros',
      icon: File,
      allowedRoles: CREATOR_ALLOWED_ROLES,
      sectionId: 'conteudo',
    },
  ],
}

const communicationSection: CreatorSidebarSection = {
  id: 'comunicacao',
  label: 'Comunicacao',
  items: [
    {
      path: '/creators/dashboard/announcements',
      label: 'Anuncios',
      icon: Megaphone,
      allowedRoles: CREATOR_ALLOWED_ROLES,
      sectionId: 'comunicacao',
    },
    {
      path: '/creators/dashboard/welcome-videos',
      label: 'Videos Boas-Vindas',
      icon: Play,
      allowedRoles: CREATOR_ALLOWED_ROLES,
      sectionId: 'comunicacao',
    },
  ],
}

const accountSection: CreatorSidebarSection = {
  id: 'conta',
  label: 'Conta',
  items: [
    {
      path: '/creators/definicoes',
      label: 'Configuracoes',
      icon: Settings,
      allowedRoles: CREATOR_ALLOWED_ROLES,
      sectionId: 'conta',
    },
    {
      path: '/',
      label: 'Voltar ao site',
      icon: House,
      allowedRoles: CREATOR_ALLOWED_ROLES,
      sectionId: 'conta',
      exact: true,
      includeInRoleRoutes: false,
    },
  ],
}

export const creatorSidebarSections: CreatorSidebarSection[] = [
  principalSection,
  contentSection,
  communicationSection,
  accountSection,
]

export const allCreatorDashboardRoutes: CreatorSidebarItem[] = creatorSidebarSections.flatMap(
  (section) => section.items,
)

export const creatorRoutes = allCreatorDashboardRoutes.filter(
  (route) => route.sectionId !== 'conteudo' && route.includeInRoleRoutes !== false,
)

export const creatorContentRoutes = allCreatorDashboardRoutes.filter(
  (route) => route.sectionId === 'conteudo',
)

export default creatorRoutes
