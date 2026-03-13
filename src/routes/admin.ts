import { UserRole } from '@/features/auth/types'
import {
  BarChart3,
  LayoutDashboard,
  Layers,
  ShieldAlert,
  ShieldCheck,
  Users,
  LifeBuoy,
  Newspaper,
  ClipboardList,
  FileSpreadsheet,
  Wallet,
  Megaphone,
  Settings2,
} from 'lucide-react'

export const adminRoutes = [
  {
    path: '/admin',
    label: 'Admin Dashboard',
    icon: LayoutDashboard,
    allowedRoles: ['admin'] as UserRole[],
  },
  {
    path: '/admin/users',
    label: 'Utilizadores',
    icon: Users,
    allowedRoles: ['admin'] as UserRole[],
  },
  {
    path: '/admin/creators',
    label: 'Creators',
    icon: ShieldAlert,
    allowedRoles: ['admin'] as UserRole[],
  },
  {
    path: '/admin/conteudo',
    label: 'Moderacao',
    icon: ShieldCheck,
    allowedRoles: ['admin'] as UserRole[],
  },
  {
    path: '/admin/editorial',
    label: 'Editorial CMS',
    icon: Newspaper,
    allowedRoles: ['admin'] as UserRole[],
  },
  {
    path: '/admin/suporte',
    label: 'Suporte assistido',
    icon: LifeBuoy,
    allowedRoles: ['admin'] as UserRole[],
  },
  {
    path: '/admin/recursos',
    label: 'Recursos',
    icon: Layers,
    allowedRoles: ['admin'] as UserRole[],
  },
  {
    path: '/admin/monetizacao',
    label: 'Monetizacao',
    icon: Wallet,
    allowedRoles: ['admin'] as UserRole[],
  },
  {
    path: '/admin/monetizacao/subscricoes',
    label: 'Monetizacao Subscricoes',
    icon: Wallet,
    allowedRoles: ['admin'] as UserRole[],
  },
  {
    path: '/admin/operacoes',
    label: 'Operacoes',
    icon: FileSpreadsheet,
    allowedRoles: ['admin'] as UserRole[],
  },
  {
    path: '/admin/operacoes/comunicacoes',
    label: 'Operacoes Comunicacoes',
    icon: Megaphone,
    allowedRoles: ['admin'] as UserRole[],
  },
  {
    path: '/admin/operacoes/anuncios',
    label: 'Operacoes Anuncios',
    icon: Megaphone,
    allowedRoles: ['admin'] as UserRole[],
  },
  {
    path: '/admin/operacoes/delegacoes',
    label: 'Operacoes Delegacoes',
    icon: ShieldCheck,
    allowedRoles: ['admin'] as UserRole[],
  },
  {
    path: '/admin/operacoes/integracoes',
    label: 'Operacoes Integracoes',
    icon: Settings2,
    allowedRoles: ['admin'] as UserRole[],
  },
  {
    path: '/admin/stats',
    label: 'Estatisticas',
    icon: BarChart3,
    allowedRoles: ['admin'] as UserRole[],
  },
  {
    path: '/admin/auditoria',
    label: 'Auditoria',
    icon: ClipboardList,
    allowedRoles: ['admin'] as UserRole[],
  },
]

export default adminRoutes
