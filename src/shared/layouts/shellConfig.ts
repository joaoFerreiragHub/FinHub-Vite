import type { LucideIcon } from 'lucide-react'
import {
  Activity,
  BarChart2,
  BookOpen,
  FolderKanban,
  Home,
  LayoutDashboard,
  Newspaper,
  Users,
  Wrench,
} from 'lucide-react'
import { UserRole } from '@/features/auth/types'

export type MainNavLink = {
  label: string
  icon: LucideIcon
  path: string
  matchPaths?: string[]
}

export type UserMenuItem = {
  key:
    | 'account'
    | 'profile'
    | 'feed'
    | 'markets'
    | 'tools'
    | 'favorites'
    | 'following'
    | 'comunidade'
    | 'notifications'
    | 'creator_dashboard'
    | 'brand_portal'
    | 'admin_panel'
    | 'logout'
  label: string
  href?: string
  icon?: LucideIcon
  isAction?: boolean
}

export const MAIN_NAV_LINKS: MainNavLink[] = [
  { label: 'Home', icon: Home, path: '/' },
  { label: 'Educadores', icon: BookOpen, path: '/creators' },
  { label: 'Conteudos', icon: FolderKanban, path: '/hub/conteudos' },
  { label: 'Noticias', icon: Newspaper, path: '/noticias' },
]

const AUTHENTICATED_MAIN_NAV_LINKS: MainNavLink[] = [
  { label: 'Feed', icon: Activity, path: '/feed', matchPaths: ['/feed'] },
  { label: 'Comunidade', icon: Users, path: '/comunidade', matchPaths: ['/comunidade'] },
]

const ROLE_MENU_KEYS: Record<UserRole, UserMenuItem['key'][]> = {
  [UserRole.VISITOR]: [],
  [UserRole.FREE]: [
    'account',
    'profile',
    'feed',
    'markets',
    'tools',
    'favorites',
    'following',
    'comunidade',
    'notifications',
    'logout',
  ],
  [UserRole.PREMIUM]: [
    'account',
    'profile',
    'feed',
    'markets',
    'tools',
    'favorites',
    'following',
    'comunidade',
    'notifications',
    'logout',
  ],
  [UserRole.CREATOR]: [
    'profile',
    'feed',
    'markets',
    'tools',
    'favorites',
    'following',
    'comunidade',
    'notifications',
    'creator_dashboard',
    'logout',
  ],
  [UserRole.BRAND_MANAGER]: [
    'profile',
    'markets',
    'tools',
    'comunidade',
    'notifications',
    'brand_portal',
    'logout',
  ],
  [UserRole.ADMIN]: [
    'profile',
    'feed',
    'markets',
    'tools',
    'favorites',
    'following',
    'comunidade',
    'notifications',
    'creator_dashboard',
    'brand_portal',
    'admin_panel',
    'logout',
  ],
}

const MENU_ITEM_DEFINITIONS: Record<UserMenuItem['key'], Omit<UserMenuItem, 'key'>> = {
  account: { label: 'A minha conta', href: '/conta', icon: LayoutDashboard },
  profile: { label: 'Perfil', href: '/perfil' },
  feed: { label: 'Feed', href: '/feed' },
  markets: { label: 'Portfolio & Mercados', href: '/mercados', icon: BarChart2 },
  tools: { label: 'Ferramentas', href: '/ferramentas', icon: Wrench },
  favorites: { label: 'Favoritos', href: '/favoritos' },
  following: { label: 'A Seguir', href: '/seguindo' },
  comunidade: { label: 'Comunidade', href: '/comunidade', icon: Users },
  notifications: { label: 'Notificacoes', href: '/notificacoes' },
  creator_dashboard: { label: 'Creator Dashboard', href: '/creators/dashboard' },
  brand_portal: { label: 'Brand Portal', href: '/marcas/portal' },
  admin_panel: { label: 'Admin Panel', href: '/admin' },
  logout: { label: 'Logout', isAction: true },
}

export function getUserMenuItems(role: UserRole): UserMenuItem[] {
  return ROLE_MENU_KEYS[role].map((menuKey) => ({
    key: menuKey,
    ...MENU_ITEM_DEFINITIONS[menuKey],
  }))
}

export function getMainNavLinks(role: UserRole): MainNavLink[] {
  if (role === UserRole.VISITOR) {
    return MAIN_NAV_LINKS
  }

  return [...MAIN_NAV_LINKS, ...AUTHENTICATED_MAIN_NAV_LINKS]
}

export function isMainNavActive(currentPath: string, navLink: MainNavLink) {
  const patterns = navLink.matchPaths ?? [navLink.path]

  if (patterns.includes('/')) {
    return currentPath === '/'
  }

  return patterns.some(
    (pathPattern) => currentPath === pathPattern || currentPath.startsWith(`${pathPattern}/`),
  )
}
