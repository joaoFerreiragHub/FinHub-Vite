import { UserRole } from '@/features/auth/types'
import { Gem, TrendingUp, Settings2, Wrench } from 'lucide-react'

export const premiumRoutes = [
  {
    path: '/premium',
    label: 'Área Premium',
    icon: Gem,
    allowedRoles: ['premium'] as UserRole[],
  },
  {
    path: '/premium/evolucao',
    label: 'Evolução Pessoal',
    icon: TrendingUp,
    allowedRoles: ['premium'] as UserRole[],
  },
  {
    path: '/premium/ferramentas',
    label: 'Ferramentas Avançadas',
    icon: Wrench,
    allowedRoles: ['premium'] as UserRole[],
  },
  {
    path: '/configuracoes',
    label: 'Configurações',
    icon: Settings2,
    allowedRoles: ['premium'] as UserRole[],
  },
]

export default premiumRoutes
