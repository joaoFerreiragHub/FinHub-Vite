// src/routes/premium/index.tsx

import { ProtectedRoute } from '@/shared/guards'
import { UserRole } from '@/features/auth/types'

export default function PremiumHome() {
  return (
    <ProtectedRoute allowedRoles={[UserRole.PREMIUM]}>
      <div className="p-4">
        <h1 className="text-3xl font-bold">Bem-vindo, utilizador Premium 👑</h1>
        <p className="mt-2 text-muted-foreground">
          Acesso total às tuas ferramentas, progresso e conteúdos.
        </p>
      </div>
    </ProtectedRoute>
  )
}
