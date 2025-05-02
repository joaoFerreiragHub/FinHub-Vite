import { useEffect } from "react"
import { UserRole, useUserStore } from "../../stores/useUserStore"

interface Props {
  allowedRoles: UserRole[]
  children: React.ReactNode
}

export default function ProtectedRoute({ allowedRoles, children }: Props) {
  const { user, isAuthenticated, hydrated } = useUserStore()
  const isDevelopment = process.env.NODE_ENV === 'development'

  useEffect(() => {
    console.log("✅ Hydrated:", hydrated, "Auth:", isAuthenticated, "User:", user)

    // Só redireciona em produção ou quando realmente hidratado em dev
    if (!hydrated && isDevelopment) return

    if (!isAuthenticated) {
      console.log("Redirecionando para login...")
      window.location.href = "/login"
    } else if (user && !allowedRoles.includes(user.role)) {
      console.log("Redirecionando para unauthorized...")
      window.location.href = "/unauthorized"
    }
  }, [hydrated, isAuthenticated, user, allowedRoles])

  // Em desenvolvimento, podemos mostrar o conteúdo mesmo sem hidratação completa
  if (!hydrated && !isDevelopment) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
        <span className="ml-2 text-sm text-muted-foreground">A carregar...</span>
      </div>
    )
  }

  // Em desenvolvimento, podemos ser mais permissivos
  if (isDevelopment) {
    return <>{children}</>
  }

  // Em produção, verificar rigorosamente
  return <>{isAuthenticated && user && allowedRoles.includes(user.role) && children}</>
}
