import { useEffect, useMemo, useState } from 'react'
import { AlertTriangle, Shield, ShieldOff } from 'lucide-react'
import { toast } from 'react-toastify'
import {
  Badge,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Checkbox,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  Input,
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Textarea,
} from '@/components/ui'
import { useAuthStore } from '@/features/auth/stores/useAuthStore'
import { getErrorMessage } from '@/lib/api/client'
import { cn } from '@/lib/utils'
import {
  useCreateAdminScopeDelegation,
  useAdminScopeDelegations,
  useRevokeAdminScopeDelegation,
} from '../hooks/useAdminScopeDelegation'
import { useAdminUsers } from '../hooks/useAdminUsers'
import { ADMIN_SCOPES, hasAdminScope } from '../lib/access'
import type {
  AdminScopeDelegationItem,
  AdminScopeDelegationListQuery,
  AdminScopeDelegationStatus,
} from '../types/adminScopeDelegation'

interface AdminScopeDelegationsPageProps {
  embedded?: boolean
}

const STATUS_LABEL: Record<AdminScopeDelegationStatus, string> = {
  active: 'Ativa',
  expired: 'Expirada',
  revoked: 'Revogada',
}

const statusBadgeVariant = (
  status: AdminScopeDelegationStatus,
): 'secondary' | 'outline' | 'destructive' => {
  if (status === 'revoked') return 'destructive'
  if (status === 'expired') return 'outline'
  return 'secondary'
}

const toDateTimeLocal = (date: Date): string => {
  const pad = (value: number) => String(value).padStart(2, '0')
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`
}

const formatDateTime = (value: string | null): string => {
  if (!value) return '-'
  const parsed = new Date(value)
  if (Number.isNaN(parsed.getTime())) return '-'
  return new Intl.DateTimeFormat('pt-PT', {
    dateStyle: 'short',
    timeStyle: 'short',
  }).format(parsed)
}

const describeScope = (scope: string): string => scope.replace('admin.', '').replaceAll('.', ' > ')

export default function AdminScopeDelegationsPage({ embedded = false }: AdminScopeDelegationsPageProps) {
  const user = useAuthStore((state) => state.user)
  const canRead = hasAdminScope(user, 'admin.users.read')
  const canWrite = hasAdminScope(user, 'admin.users.write') && !user?.adminReadOnly

  const [userSearch, setUserSearch] = useState('')
  const [selectedAdminId, setSelectedAdminId] = useState<string | null>(null)

  const [statusFilter, setStatusFilter] = useState<'all' | AdminScopeDelegationStatus>('all')
  const [scopeFilter, setScopeFilter] = useState<'all' | string>('all')
  const [page, setPage] = useState(1)

  const [selectedScopes, setSelectedScopes] = useState<string[]>([])
  const [expiresAtInput, setExpiresAtInput] = useState(() =>
    toDateTimeLocal(new Date(Date.now() + 8 * 60 * 60 * 1000)),
  )
  const [createReason, setCreateReason] = useState('')
  const [createNote, setCreateNote] = useState('')

  const [revokeTarget, setRevokeTarget] = useState<AdminScopeDelegationItem | null>(null)
  const [revokeReason, setRevokeReason] = useState('')
  const [revokeNote, setRevokeNote] = useState('')

  const adminsQuery = useAdminUsers(
    {
      role: 'admin',
      search: userSearch.trim() || undefined,
      page: 1,
      limit: 50,
      sortBy: 'email',
      sortOrder: 'asc',
    },
    { enabled: canRead },
  )

  const selectedAdmin = useMemo(
    () => adminsQuery.data?.items.find((item) => item.id === selectedAdminId) ?? null,
    [adminsQuery.data?.items, selectedAdminId],
  )

  useEffect(() => {
    if (!adminsQuery.data?.items?.length) {
      setSelectedAdminId(null)
      return
    }
    if (!selectedAdminId) {
      setSelectedAdminId(adminsQuery.data.items[0]?.id ?? null)
      return
    }
    const stillVisible = adminsQuery.data.items.some((item) => item.id === selectedAdminId)
    if (!stillVisible) {
      setSelectedAdminId(adminsQuery.data.items[0]?.id ?? null)
    }
  }, [adminsQuery.data?.items, selectedAdminId])

  const listQuery = useMemo<AdminScopeDelegationListQuery>(
    () => ({
      page,
      limit: 12,
      status: statusFilter === 'all' ? undefined : statusFilter,
      scope: scopeFilter === 'all' ? undefined : scopeFilter,
    }),
    [page, scopeFilter, statusFilter],
  )

  const delegationsQuery = useAdminScopeDelegations(selectedAdminId, listQuery, {
    enabled: canRead && Boolean(selectedAdminId),
  })

  const createDelegationMutation = useCreateAdminScopeDelegation()
  const revokeDelegationMutation = useRevokeAdminScopeDelegation()

  const toggleScope = (scope: string, checked: boolean) => {
    setSelectedScopes((current) => {
      if (checked) {
        if (current.includes(scope)) return current
        return [...current, scope]
      }
      return current.filter((item) => item !== scope)
    })
  }

  const handleCreateDelegation = async () => {
    if (!canWrite || !selectedAdminId) return
    if (selectedScopes.length === 0) {
      toast.error('Seleciona pelo menos um scope para delegar.')
      return
    }
    if (!createReason.trim()) {
      toast.error('Motivo obrigatorio para criar delegacao.')
      return
    }

    const parsedExpiry = new Date(expiresAtInput)
    if (Number.isNaN(parsedExpiry.getTime()) || parsedExpiry.getTime() <= Date.now()) {
      toast.error('Escolhe uma expiracao futura valida.')
      return
    }

    try {
      const result = await createDelegationMutation.mutateAsync({
        userId: selectedAdminId,
        payload: {
          scopes: selectedScopes,
          expiresAt: parsedExpiry.toISOString(),
          reason: createReason.trim(),
          note: createNote.trim() || undefined,
        },
      })

      toast.success(
        `${result.message} (${result.summary.delegationsAffected}/${result.summary.scopesRequested})`,
      )
      setCreateReason('')
      setCreateNote('')
    } catch (error) {
      toast.error(getErrorMessage(error))
    }
  }

  const openRevokeDialog = (item: AdminScopeDelegationItem) => {
    setRevokeTarget(item)
    setRevokeReason('')
    setRevokeNote('')
  }

  const handleRevokeDelegation = async () => {
    if (!canWrite || !selectedAdminId || !revokeTarget) return
    if (!revokeReason.trim()) {
      toast.error('Motivo obrigatorio para revogar delegacao.')
      return
    }

    try {
      const result = await revokeDelegationMutation.mutateAsync({
        userId: selectedAdminId,
        delegationId: revokeTarget.id,
        payload: {
          reason: revokeReason.trim(),
          note: revokeNote.trim() || undefined,
        },
      })

      toast.success(result.message)
      setRevokeTarget(null)
      setRevokeReason('')
      setRevokeNote('')
    } catch (error) {
      toast.error(getErrorMessage(error))
    }
  }

  return (
    <div className={cn('space-y-6', embedded ? 'pt-2' : '')}>
      {!embedded ? (
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold tracking-tight">Delegacoes temporarias</h1>
          <p className="text-sm text-muted-foreground">
            Cobertura operacional entre admins com expiracao automatica e trilha de auditoria.
          </p>
        </div>
      ) : null}

      <div className="flex flex-wrap gap-2">
        <Button type="button" variant="outline" size="sm" asChild>
          <a href="/admin/operacoes">Bulk import</a>
        </Button>
        <Button type="button" variant="outline" size="sm" asChild>
          <a href="/admin/operacoes/comunicacoes">Comunicacoes</a>
        </Button>
        <Button type="button" variant="outline" size="sm" asChild>
          <a href="/admin/operacoes/anuncios">Anuncios</a>
        </Button>
        <Button type="button" size="sm" asChild>
          <a href="/admin/operacoes/delegacoes">Delegacoes</a>
        </Button>
      </div>

      {!canRead ? (
        <Card className="border-amber-500/40 bg-amber-500/5">
          <CardContent className="pt-6 text-sm text-muted-foreground">
            Sem permissao para leitura de delegacoes (`admin.users.read`).
          </CardContent>
        </Card>
      ) : null}

      {canRead ? (
        <>
          <div className="grid gap-4 xl:grid-cols-[320px,1fr]">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Admin alvo</CardTitle>
                <CardDescription>Seleciona o admin para gerir delegacoes temporarias.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-2">
                  <Label htmlFor="delegation-admin-search">Pesquisar admin</Label>
                  <Input
                    id="delegation-admin-search"
                    placeholder="nome, username ou email"
                    value={userSearch}
                    onChange={(event) => setUserSearch(event.target.value)}
                  />
                </div>

                <div className="max-h-64 space-y-2 overflow-y-auto rounded border border-border/70 p-2">
                  {(adminsQuery.data?.items ?? []).map((adminUser) => {
                    const isSelected = adminUser.id === selectedAdminId
                    return (
                      <button
                        key={adminUser.id}
                        type="button"
                        className={cn(
                          'w-full rounded border px-3 py-2 text-left text-xs transition-colors',
                          isSelected
                            ? 'border-primary/60 bg-primary/10'
                            : 'border-border/70 hover:border-primary/40',
                        )}
                        onClick={() => {
                          setSelectedAdminId(adminUser.id)
                          setPage(1)
                        }}
                      >
                        <p className="font-medium">{adminUser.name || adminUser.username || adminUser.email}</p>
                        <p className="mt-0.5 text-muted-foreground">{adminUser.email}</p>
                        <div className="mt-1 flex flex-wrap gap-1">
                          <Badge variant="outline">{adminUser.role}</Badge>
                          {adminUser.adminReadOnly ? <Badge variant="secondary">read-only</Badge> : null}
                        </div>
                      </button>
                    )
                  })}

                  {!adminsQuery.isLoading && (adminsQuery.data?.items?.length ?? 0) === 0 ? (
                    <p className="px-2 py-3 text-xs text-muted-foreground">
                      Nenhum admin encontrado com o filtro atual.
                    </p>
                  ) : null}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Nova delegacao</CardTitle>
                <CardDescription>
                  {selectedAdmin
                    ? `Delegar scopes para ${selectedAdmin.name || selectedAdmin.username || selectedAdmin.email}.`
                    : 'Seleciona um admin alvo para delegar scopes.'}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-3 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="delegation-expires-at">Expira em</Label>
                    <Input
                      id="delegation-expires-at"
                      type="datetime-local"
                      value={expiresAtInput}
                      onChange={(event) => setExpiresAtInput(event.target.value)}
                      disabled={!canWrite || !selectedAdminId}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="delegation-create-reason">Motivo</Label>
                    <Input
                      id="delegation-create-reason"
                      value={createReason}
                      onChange={(event) => setCreateReason(event.target.value)}
                      placeholder="Cobertura de turno de moderacao"
                      disabled={!canWrite || !selectedAdminId}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="delegation-create-note">Nota (opcional)</Label>
                  <Textarea
                    id="delegation-create-note"
                    rows={2}
                    value={createNote}
                    onChange={(event) => setCreateNote(event.target.value)}
                    placeholder="Contexto operacional para auditoria."
                    disabled={!canWrite || !selectedAdminId}
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label>Scopes a delegar</Label>
                    <Badge variant="outline">{selectedScopes.length} selecionados</Badge>
                  </div>
                  <div className="max-h-56 overflow-y-auto rounded border border-border/70 p-3">
                    <div className="grid gap-2 sm:grid-cols-2">
                      {ADMIN_SCOPES.map((scope) => (
                        <label key={scope} className="flex items-start gap-2 text-xs text-muted-foreground">
                          <Checkbox
                            checked={selectedScopes.includes(scope)}
                            disabled={!canWrite || !selectedAdminId}
                            onCheckedChange={(checked) => toggleScope(scope, checked === true)}
                          />
                          <span>
                            <span className="font-medium text-foreground">{scope}</span>
                            <span className="mt-0.5 block">{describeScope(scope)}</span>
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <Button
                    type="button"
                    onClick={() => {
                      const allSelected = selectedScopes.length === ADMIN_SCOPES.length
                      setSelectedScopes(allSelected ? [] : [...ADMIN_SCOPES])
                    }}
                    variant="outline"
                    size="sm"
                    disabled={!canWrite || !selectedAdminId}
                  >
                    {selectedScopes.length === ADMIN_SCOPES.length
                      ? 'Limpar selecao'
                      : 'Selecionar todos'}
                  </Button>
                  <Button
                    type="button"
                    onClick={handleCreateDelegation}
                    disabled={!canWrite || !selectedAdminId || createDelegationMutation.isPending}
                  >
                    <Shield className="h-4 w-4" />
                    Criar delegacao
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Delegacoes por admin</CardTitle>
              <CardDescription>
                Total: {delegationsQuery.data?.pagination.total ?? 0} | Pagina{' '}
                {delegationsQuery.data?.pagination.page ?? 1}/{delegationsQuery.data?.pagination.pages ?? 1}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
                <div className="space-y-2">
                  <Label>Status</Label>
                  <Select
                    value={statusFilter}
                    onValueChange={(value) => {
                      setStatusFilter(value as typeof statusFilter)
                      setPage(1)
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos</SelectItem>
                      <SelectItem value="active">Ativas</SelectItem>
                      <SelectItem value="expired">Expiradas</SelectItem>
                      <SelectItem value="revoked">Revogadas</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Scope</Label>
                  <Select
                    value={scopeFilter}
                    onValueChange={(value) => {
                      setScopeFilter(value)
                      setPage(1)
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos os scopes</SelectItem>
                      {ADMIN_SCOPES.map((scope) => (
                        <SelectItem key={scope} value={scope}>
                          {scope}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                {(delegationsQuery.data?.items ?? []).map((item) => (
                  <div
                    key={item.id}
                    className="rounded-lg border border-border/70 bg-card/70 px-3 py-3 text-sm"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <Badge variant={statusBadgeVariant(item.status)}>{STATUS_LABEL[item.status]}</Badge>
                        <span className="font-medium">{item.scope}</span>
                      </div>
                      {item.status === 'active' ? (
                        <Button
                          type="button"
                          size="sm"
                          variant="outline"
                          disabled={!canWrite}
                          onClick={() => openRevokeDialog(item)}
                        >
                          <ShieldOff className="h-4 w-4" />
                          Revogar
                        </Button>
                      ) : null}
                    </div>
                    <div className="mt-2 grid gap-1 text-xs text-muted-foreground md:grid-cols-2">
                      <p>Expira: {formatDateTime(item.expiresAt)}</p>
                      <p>Iniciada: {formatDateTime(item.startsAt)}</p>
                      <p>Delegada por: {item.delegatedBy?.email ?? item.delegatedBy?.name ?? '-'}</p>
                      <p>Motivo: {item.reason || '-'}</p>
                      {item.revokedAt ? <p>Revogada: {formatDateTime(item.revokedAt)}</p> : null}
                      {item.revokeReason ? <p>Motivo revogacao: {item.revokeReason}</p> : null}
                    </div>
                  </div>
                ))}

                {!delegationsQuery.isLoading && (delegationsQuery.data?.items?.length ?? 0) === 0 ? (
                  <div className="rounded-md border border-dashed border-border/70 px-3 py-4 text-sm text-muted-foreground">
                    Sem delegacoes para os filtros atuais.
                  </div>
                ) : null}
              </div>

              <div className="flex items-center justify-between">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  disabled={page <= 1}
                  onClick={() => setPage((current) => Math.max(1, current - 1))}
                >
                  Pagina anterior
                </Button>
                <p className="text-xs text-muted-foreground">
                  Pagina {delegationsQuery.data?.pagination.page ?? page} de{' '}
                  {delegationsQuery.data?.pagination.pages ?? 1}
                </p>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  disabled={page >= (delegationsQuery.data?.pagination.pages ?? 1)}
                  onClick={() => setPage((current) => current + 1)}
                >
                  Pagina seguinte
                </Button>
              </div>
            </CardContent>
          </Card>
        </>
      ) : null}

      <Dialog open={Boolean(revokeTarget)} onOpenChange={(open) => !open && setRevokeTarget(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Revogar delegacao</DialogTitle>
            <DialogDescription>
              {revokeTarget ? (
                <>
                  Scope <strong>{revokeTarget.scope}</strong> para{' '}
                  <strong>{selectedAdmin?.email ?? selectedAdmin?.name ?? 'admin alvo'}</strong>.
                </>
              ) : null}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3">
            <div className="space-y-2">
              <Label htmlFor="revoke-reason">Motivo</Label>
              <Input
                id="revoke-reason"
                value={revokeReason}
                onChange={(event) => setRevokeReason(event.target.value)}
                placeholder="Fim da cobertura temporaria"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="revoke-note">Nota (opcional)</Label>
              <Textarea
                id="revoke-note"
                rows={3}
                value={revokeNote}
                onChange={(event) => setRevokeNote(event.target.value)}
                placeholder="Contexto adicional para auditoria."
              />
            </div>

            {!canWrite ? (
              <div className="rounded border border-amber-500/40 bg-amber-500/5 p-2 text-xs text-amber-700">
                <AlertTriangle className="mr-1 inline h-3 w-3" />
                Sem permissao de escrita para revogar delegacoes.
              </div>
            ) : null}
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setRevokeTarget(null)}>
              Cancelar
            </Button>
            <Button
              type="button"
              variant="destructive"
              onClick={handleRevokeDelegation}
              disabled={!canWrite || revokeDelegationMutation.isPending}
            >
              Revogar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
