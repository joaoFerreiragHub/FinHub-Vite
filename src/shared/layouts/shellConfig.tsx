import type { LucideIcon } from 'lucide-react'
import {
  Activity,
  BarChart2,
  BookOpen,
  FolderKanban,
  Home,
  LayoutDashboard,
  Newspaper,
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
    'notifications',
    'creator_dashboard',
    'logout',
  ],
  [UserRole.BRAND_MANAGER]: [
    'profile',
    'markets',
    'tools',
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

export function ShellFooter() {
  return (
    <footer className="home-footer">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-10 lg:px-12 py-10 sm:py-12">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-8">
          <div className="col-span-2 sm:col-span-1">
            <span className="text-lg font-bold text-foreground">
              Fin<span className="text-primary">Hub</span>
            </span>
            <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
              A plataforma #1 de literacia financeira em Portugal.
            </p>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-foreground mb-3">Explorar</h4>
            <div className="flex flex-col gap-2">
              <a
                href="/creators"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Criadores
              </a>
              <a
                href="/hub/courses"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Cursos
              </a>
              <a
                href="/hub/conteudos"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Conteudos
              </a>
              <a
                href="/hub/books"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Livros
              </a>
            </div>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-foreground mb-3">Recursos</h4>
            <div className="flex flex-col gap-2">
              <a
                href="/mercados/recursos"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Corretoras
              </a>
              <a
                href="/noticias"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Noticias
              </a>
              <a
                href="/ferramentas"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Ferramentas
              </a>
            </div>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-foreground mb-3">Sobre</h4>
            <div className="flex flex-col gap-2">
              <a
                href="/sobre"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Quem somos
              </a>
              <a
                href="/contacto"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Contacto
              </a>
              <a
                href="/faq"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                FAQ
              </a>
              <a
                href="/precos"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Precos
              </a>
              <a
                href="/legal/termos"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Termos
              </a>
              <a
                href="/legal/privacidade"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Privacidade
              </a>
              <a
                href="/legal/cookies"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Cookies
              </a>
              <a
                href="/aviso-legal"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Aviso legal
              </a>
            </div>
          </div>
        </div>
        <div className="border-t border-border/30 mt-8 pt-6 text-center">
          <p className="text-xs text-muted-foreground">
            &copy; 2026 FinHub. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </footer>
  )
}
