import adminRoutes from '@/routes/admin'
import creatorRoutes, { creatorContentRoutes } from '@/routes/creator'
import premiumRoutes from '@/routes/premium'
import regularRoutes from '@/routes/regular'
import visitorRoutes from '@/routes/visitor'
import { UserRole } from '@/features/auth/types'

export const getRoutesByRole = (role: UserRole | 'visitor') => {
  switch (role) {
    case UserRole.ADMIN:
      return [
        ...regularRoutes,
        ...premiumRoutes,
        ...creatorRoutes,
        ...creatorContentRoutes,
        ...adminRoutes,
      ]
    case UserRole.CREATOR:
      return [...regularRoutes, ...creatorRoutes, ...creatorContentRoutes]
    case UserRole.PREMIUM:
      return [...regularRoutes, ...premiumRoutes]
    case UserRole.BRAND_MANAGER:
    case UserRole.FREE:
      return [...regularRoutes]
    case UserRole.VISITOR:
    case 'visitor':
    default:
      return visitorRoutes
  }
}
