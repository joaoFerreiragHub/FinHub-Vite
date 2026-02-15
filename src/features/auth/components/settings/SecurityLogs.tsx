// components/settings/SecurityLogs.tsx
import { Card } from '@/components/ui'
import { ScrollArea } from '@/components/ui'

const logs = [
  { date: '2025-05-10', action: 'Alterou a palavra-passe', ip: '192.168.1.1' },
  { date: '2025-05-08', action: 'Tentativa de login falhada', ip: '85.245.33.12' },
  { date: '2025-05-06', action: '2FA ativado', ip: '192.168.1.1' },
  { date: '2025-05-05', action: 'Nova sessão iniciada', ip: '200.210.44.77' },
]

export default function SecurityLogs() {
  return (
    <div className="space-y-2">
      <h2 className="text-lg font-semibold">Logs de Segurança</h2>
      <p className="text-sm text-muted-foreground">
        Eventos recentes relacionados com a tua conta.
      </p>

      <ScrollArea className="max-h-60 border rounded p-2">
        <ul className="space-y-2">
          {logs.map((log, index) => (
            <Card key={index} className="p-3 text-sm">
              <div className="font-medium">{log.action}</div>
              <div className="text-xs text-muted-foreground">
                {log.date} · IP: {log.ip}
              </div>
            </Card>
          ))}
        </ul>
      </ScrollArea>
    </div>
  )
}
