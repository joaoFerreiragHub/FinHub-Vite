import { Button } from '@/components/ui'

export type AdminOperationsNavKey =
  | 'bulk_import'
  | 'communications'
  | 'ads'
  | 'delegations'
  | 'integrations'

interface AdminOperationsNavProps {
  active: AdminOperationsNavKey
}

const NAV_ITEMS: Array<{ key: AdminOperationsNavKey; label: string; href: string }> = [
  { key: 'bulk_import', label: 'Bulk import', href: '/admin/operacoes' },
  { key: 'communications', label: 'Comunicacoes', href: '/admin/operacoes/comunicacoes' },
  { key: 'ads', label: 'Anuncios', href: '/admin/operacoes/anuncios' },
  { key: 'delegations', label: 'Delegacoes', href: '/admin/operacoes/delegacoes' },
  { key: 'integrations', label: 'Integracoes', href: '/admin/operacoes/integracoes' },
]

export function AdminOperationsNav({ active }: AdminOperationsNavProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {NAV_ITEMS.map((item) => (
        <Button
          key={item.key}
          type="button"
          size="sm"
          variant={active === item.key ? 'default' : 'outline'}
          asChild
        >
          <a href={item.href}>{item.label}</a>
        </Button>
      ))}
    </div>
  )
}
