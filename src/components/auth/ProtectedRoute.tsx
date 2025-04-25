// components/auth/ProtectedRoute.tsx

import { useEffect } from "react"
import { UserRole, useUserStore } from "../../stores/useUserStore"

interface Props {
  allowedRoles: UserRole[]
  children: React.ReactNode
}

export default function ProtectedRoute({ allowedRoles, children }: Props) {
  const { user, isAuthenticated, hydrated } = useUserStore()

useEffect(() => {
  console.log("✅ Hydrated:", hydrated, "Auth:", isAuthenticated, "User:", user)
  if (!hydrated) return

  if (!isAuthenticated) {
    window.location.href = "/login"
  } else if (user && !allowedRoles.includes(user.role)) {
    window.location.href = "/unauthorized"
  }
}, [hydrated, isAuthenticated, user, allowedRoles])

  // ✅ Mostrar loading até hidratar
    if (!hydrated) {
      return (
        <div className="flex items-center justify-center h-full">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
          <span className="ml-2 text-sm text-muted-foreground">A carregar...</span>
        </div>
      )
    }
  // ✅ Renderizar conteúdo seguro
  return <>{isAuthenticated && user && allowedRoles.includes(user.role) && children}</>
}
