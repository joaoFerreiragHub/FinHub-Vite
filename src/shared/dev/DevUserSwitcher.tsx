import { useState } from 'react'
import { useAuthStore } from '@/features/auth/stores/useAuthStore'
import { UserRole } from '@/features/auth/types'

/**
 * Dev Tool: Switcher de roles para desenvolvimento
 *
 * Permite alternar entre diferentes tipos de usuário facilmente
 * durante o desenvolvimento sem precisar fazer logout/login.
 *
 * Só aparece em modo desenvolvimento (import.meta.env.DEV)
 */
export function DevUserSwitcher() {
  const [isOpen, setIsOpen] = useState(false)
  const { user, switchDevRole } = useAuthStore()

  // Só renderiza em desenvolvimento
  if (!import.meta.env.DEV) {
    return null
  }

  const roles = [
    { value: UserRole.VISITOR, label: '👤 Visitor', color: 'bg-gray-500' },
    { value: UserRole.FREE, label: '🆓 Free User', color: 'bg-blue-500' },
    { value: UserRole.PREMIUM, label: '⭐ Premium', color: 'bg-amber-500' },
    { value: UserRole.CREATOR, label: '✍️ Creator', color: 'bg-purple-500' },
    { value: UserRole.ADMIN, label: '👑 Admin', color: 'bg-red-500' },
  ]

  const currentRole = user?.role || UserRole.VISITOR
  const currentRoleData = roles.find((r) => r.value === currentRole)

  return (
    <div className="fixed bottom-4 right-4 z-[9999]">
      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white shadow-xl hover:bg-slate-800 transition-colors border-2 border-yellow-400"
        title="Dev: Trocar Role"
      >
        <span className="text-lg">🔧</span>
        <span>{currentRoleData?.label || 'Dev Tools'}</span>
        <span className="text-xs opacity-75">▼</span>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-[9998]"
            onClick={() => setIsOpen(false)}
          />

          {/* Menu */}
          <div className="absolute bottom-full right-0 mb-2 w-64 rounded-lg border-2 border-yellow-400 bg-slate-900 shadow-2xl z-[9999]">
            {/* Header */}
            <div className="border-b border-slate-700 px-4 py-3">
              <div className="flex items-center gap-2">
                <span className="text-xl">🔧</span>
                <div className="flex-1">
                  <h3 className="text-sm font-bold text-white">Dev Tools</h3>
                  <p className="text-xs text-slate-400">Trocar tipo de usuário</p>
                </div>
              </div>
            </div>

            {/* Role Options */}
            <div className="p-2 space-y-1">
              {roles.map((role) => {
                const isActive = currentRole === role.value
                return (
                  <button
                    key={role.value}
                    onClick={() => {
                      switchDevRole(role.value)
                      setIsOpen(false)
                    }}
                    className={`
                      w-full flex items-center gap-3 rounded-md px-3 py-2 text-left text-sm
                      transition-colors
                      ${
                        isActive
                          ? 'bg-slate-700 text-white font-medium'
                          : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                      }
                    `}
                  >
                    <span className={`h-2 w-2 rounded-full ${role.color}`} />
                    <span className="flex-1">{role.label}</span>
                    {isActive && <span className="text-green-400">✓</span>}
                  </button>
                )
              })}
            </div>

            {/* Footer Info */}
            <div className="border-t border-slate-700 px-4 py-2">
              <p className="text-xs text-slate-500">
                Apenas visível em DEV mode
              </p>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
