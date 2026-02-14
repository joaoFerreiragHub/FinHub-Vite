// src/routes/premium/index.tsx

import ProtectedRoute from '@/shared/guards';


export default function PremiumHome() {
  return (
    <ProtectedRoute allowedRoles={["premium"]}>
      <div className="p-4">
        <h1 className="text-3xl font-bold">Bem-vindo, utilizador Premium 👑</h1>
        <p className="mt-2 text-muted-foreground">Acesso total às tuas ferramentas, progresso e conteúdos.</p>
      </div>
    </ProtectedRoute>
  )
}
