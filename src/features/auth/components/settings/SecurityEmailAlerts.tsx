// components/settings/SecurityEmailAlerts.tsx
import { Switch } from '@/components/ui'
import { Label } from '@/components/ui'
import { useState } from 'react'

export default function SecurityEmailAlerts() {
  const [alerts, setAlerts] = useState({
    login: true,
    passwordChange: true,
    disable2FA: false,
  })

  const toggle = (key: keyof typeof alerts) => {
    setAlerts((prev) => ({ ...prev, [key]: !prev[key] }))
  }

  return (
    <div className="space-y-2">
      <h2 className="text-lg font-semibold">Notificações de Segurança por Email</h2>
      <p className="text-sm text-muted-foreground">
        Recebe alertas por email quando algo importante acontece.
      </p>

      <div className="space-y-3 mt-4">
        <div className="flex items-center justify-between">
          <Label>Login em novo dispositivo</Label>
          <Switch checked={alerts.login} onCheckedChange={() => toggle('login')} />
        </div>
        <div className="flex items-center justify-between">
          <Label>Alteração de palavra-passe ou email</Label>
          <Switch
            checked={alerts.passwordChange}
            onCheckedChange={() => toggle('passwordChange')}
          />
        </div>
        <div className="flex items-center justify-between">
          <Label>Desativação do 2FA</Label>
          <Switch checked={alerts.disable2FA} onCheckedChange={() => toggle('disable2FA')} />
        </div>
      </div>
    </div>
  )
}
