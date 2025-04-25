import adminRoutes from "../routes/admin"
import creatorRoutes from "../routes/creator"
import premiumRoutes from "../routes/premium"
import { regularRoutes } from "../routes/regular"
import visitorRoutes from "../routes/visitor"
import { UserRole } from "../stores/useUserStore"


export const getRoutesByRole = (role: UserRole) => {
  switch (role) {
    case "admin":
      return [ ...regularRoutes, ...premiumRoutes, ...creatorRoutes, ...adminRoutes]
    case "creator":
      return [ ...creatorRoutes]
    case "premium":
      return [ ...regularRoutes, ...premiumRoutes]
    case "regular":
      return [ ...regularRoutes]
    case "visitor":
    default:
      return visitorRoutes
  }
}
