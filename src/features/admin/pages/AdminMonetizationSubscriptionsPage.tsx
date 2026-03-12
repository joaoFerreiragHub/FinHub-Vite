import { useMemo, useState } from 'react'
import { RefreshCw, ShieldCheck, ShieldOff, TimerReset } from 'lucide-react'
import { toast } from 'react-toastify'
import {
  Badge,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Input,
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
import { hasAdminScope } from '../lib/access'
import {
  useAdminSubscriptionByUser,
  useAdminSubscriptions,
  useExtendAdminSubscriptionTrial,
  useReactivateAdminSubscription,
  useRevokeAdminSubscriptionEntitlement,
} from '../hooks/useAdminSubscriptions'
import type {
  AdminSubscriptionBillingCycle,
  AdminSubscriptionHistoryEntry,
  AdminSubscriptionStatus,
} from '../types/adminSubscriptions'

interface AdminMonetizationSubscriptionsPageProps {
  embedded?: boolean
}

const toPositiveIntegerOrUndefined = (value: string): number | undefined => {
  const parsed = Number.parseInt(value, 10)
  if (!Number.isFinite(parsed) || parsed < 1) return undefined
  return parsed
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

const statusLabel: Record<AdminSubscriptionStatus, string> = {
  active: 'Ativa',
  trialing: 'Trial',
  past_due: 'Past due',
  canceled: 'Cancelada',
}

const historyActionLabel: Record<string, string> = {
  created: 'Criada',
  extend_trial: 'Trial estendido',
  revoke_entitlement: 'Entitlement revogado',
  reactivate: 'Subscricao reativada',
  status_change: 'Mudanca de estado',
  bootstrap_read: 'Bootstrap leitura',
  bootstrap_action: 'Bootstrap acao',
}

const isRecord = (value: unknown): value is Record<string, unknown> =>
  Boolean(value && typeof value === 'object' && !Array.isArray(value))

const summarizeSnapshot = (snapshot: Record<string, unknown> | null): string => {
  if (!snapshot) return '-'
  const status = typeof snapshot.status === 'string' ? snapshot.status : '-'
  const planCode = typeof snapshot.planCode === 'string' ? snapshot.planCode : '-'
  const entitlement = snapshot.entitlementActive === true ? 'ON' : 'OFF'
  const currentPeriodEnd =
    typeof snapshot.currentPeriodEnd === 'string'
      ? formatDateTime(snapshot.currentPeriodEnd)
      : '-'
  return `status=${status} | plan=${planCode} | entitlement=${entitlement} | periodEnd=${currentPeriodEnd}`
}

const mapHistoryActor = (entry: AdminSubscriptionHistoryEntry): string => {
  if (entry.changedBy?.name) return entry.changedBy.name
  if (entry.changedBy?.username) return entry.changedBy.username
  if (entry.changedBy?.email) return entry.changedBy.email
  if (entry.changedBy?.id) return entry.changedBy.id
  return 'sistema'
}

export default function AdminMonetizationSubscriptionsPage({
  embedded = false,
}: AdminMonetizationSubscriptionsPageProps) {
  const user = useAuthStore((state) => state.user)
  const canRead = hasAdminScope(user, 'admin.users.read')
  const canWrite = hasAdminScope(user, 'admin.users.write') && !user?.adminReadOnly

  const [statusFilter, setStatusFilter] = useState<'all' | AdminSubscriptionStatus>('all')
  const [planCodeFilter, setPlanCodeFilter] = useState('')
  const [searchFilter, setSearchFilter] = useState('')
  const [page, setPage] = useState(1)

  const [selectedUserId, setSelectedUserId] = useState<string | null>(null)
  const [reason, setReason] = useState('')
  const [note, setNote] = useState('')
  const [extendDays, setExtendDays] = useState('7')
  const [revokeNextStatus, setRevokeNextStatus] = useState<'past_due' | 'canceled'>('past_due')
  const [reactivatePeriodDays, setReactivatePeriodDays] = useState('30')
  const [reactivatePlanCode, setReactivatePlanCode] = useState('')
  const [reactivatePlanLabel, setReactivatePlanLabel] = useState('')
  const [reactivateBillingCycle, setReactivateBillingCycle] =
    useState<AdminSubscriptionBillingCycle>('monthly')

  const query = useMemo(
    () => ({
      page,
      limit: 20,
      status: statusFilter === 'all' ? undefined : statusFilter,
      planCode: planCodeFilter.trim() || undefined,
      search: searchFilter.trim() || undefined,
    }),
    [page, planCodeFilter, searchFilter, statusFilter],
  )

  const listQuery = useAdminSubscriptions(query, { enabled: canRead })
  const selectedSubscriptionQuery = useAdminSubscriptionByUser(selectedUserId, {
    enabled: canRead && Boolean(selectedUserId),
  })

  const extendTrialMutation = useExtendAdminSubscriptionTrial()
  const revokeEntitlementMutation = useRevokeAdminSubscriptionEntitlement()
  const reactivateMutation = useReactivateAdminSubscription()

  const isMutationPending =
    extendTrialMutation.isPending || revokeEntitlementMutation.isPending || reactivateMutation.isPending

  const selectedFromList =
    selectedUserId && listQuery.data
      ? listQuery.data.items.find((item) => item.user?.id === selectedUserId) ?? null
      : null
  const selectedSubscription = selectedSubscriptionQuery.data ?? selectedFromList ?? null
  const selectedSubscriptionHistory = useMemo(() => {
    const rows = selectedSubscription?.history ?? []
    return [...rows].sort((left, right) => {
      const leftTime = left.changedAt ? new Date(left.changedAt).getTime() : 0
      const rightTime = right.changedAt ? new Date(right.changedAt).getTime() : 0
      return rightTime - leftTime
    })
  }, [selectedSubscription?.history])

  const ensureActionContext = (): string | null => {
    if (!selectedUserId) {
      toast.error('Seleciona primeiro uma subscricao para gerir.')
      return null
    }
    const normalizedReason = reason.trim()
    if (!normalizedReason) {
      toast.error('Motivo obrigatorio para acao administrativa.')
      return null
    }
    return normalizedReason
  }

  const handleExtendTrial = async () => {
    const normalizedReason = ensureActionContext()
    if (!normalizedReason || !selectedUserId) return

    try {
      const response = await extendTrialMutation.mutateAsync({
        userId: selectedUserId,
        data: {
          reason: normalizedReason,
          note: note.trim() || undefined,
          days: toPositiveIntegerOrUndefined(extendDays),
        },
      })
      toast.success(response.message)
    } catch (error) {
      toast.error(getErrorMessage(error))
    }
  }

  const handleRevokeEntitlement = async () => {
    const normalizedReason = ensureActionContext()
    if (!normalizedReason || !selectedUserId) return

    try {
      const response = await revokeEntitlementMutation.mutateAsync({
        userId: selectedUserId,
        data: {
          reason: normalizedReason,
          note: note.trim() || undefined,
          nextStatus: revokeNextStatus,
        },
      })
      toast.success(response.message)
    } catch (error) {
      toast.error(getErrorMessage(error))
    }
  }

  const handleReactivate = async () => {
    const normalizedReason = ensureActionContext()
    if (!normalizedReason || !selectedUserId) return

    try {
      const response = await reactivateMutation.mutateAsync({
        userId: selectedUserId,
        data: {
          reason: normalizedReason,
          note: note.trim() || undefined,
          periodDays: toPositiveIntegerOrUndefined(reactivatePeriodDays),
          planCode: reactivatePlanCode.trim() || undefined,
          planLabel: reactivatePlanLabel.trim() || undefined,
          billingCycle: reactivateBillingCycle,
        },
      })
      toast.success(response.message)
    } catch (error) {
      toast.error(getErrorMessage(error))
    }
  }

  return (
    <div className={cn('space-y-6', embedded ? 'pt-2' : '')}>
      {!embedded ? (
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Monetizacao - Subscricoes</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Gestao operacional de trials, entitlement e reativacao de planos.
          </p>
        </div>
      ) : null}

      <div className="flex flex-wrap gap-2">
        <Button type="button" variant="outline" size="sm" asChild>
          <a href="/admin/monetizacao">Paywall</a>
        </Button>
        <Button type="button" size="sm" asChild>
          <a href="/admin/monetizacao/subscricoes">Subscricoes</a>
        </Button>
      </div>

      {!canRead ? (
        <Card className="border-amber-500/40 bg-amber-500/5">
          <CardContent className="pt-6 text-sm text-muted-foreground">
            Sem permissao para leitura de subscricoes (`admin.users.read`).
          </CardContent>
        </Card>
      ) : null}

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Resumo de subscricoes</CardTitle>
          <CardDescription>Visao agregada por estado e entitlement.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-3 sm:grid-cols-2 lg:grid-cols-6">
          <div className="rounded-md border border-border/70 p-3 text-sm">
            <p className="text-xs text-muted-foreground">Total</p>
            <p className="text-lg font-semibold">{listQuery.data?.summary.total ?? 0}</p>
          </div>
          <div className="rounded-md border border-border/70 p-3 text-sm">
            <p className="text-xs text-muted-foreground">Ativas</p>
            <p className="text-lg font-semibold">{listQuery.data?.summary.active ?? 0}</p>
          </div>
          <div className="rounded-md border border-border/70 p-3 text-sm">
            <p className="text-xs text-muted-foreground">Trial</p>
            <p className="text-lg font-semibold">{listQuery.data?.summary.trialing ?? 0}</p>
          </div>
          <div className="rounded-md border border-border/70 p-3 text-sm">
            <p className="text-xs text-muted-foreground">Past due</p>
            <p className="text-lg font-semibold">{listQuery.data?.summary.pastDue ?? 0}</p>
          </div>
          <div className="rounded-md border border-border/70 p-3 text-sm">
            <p className="text-xs text-muted-foreground">Canceladas</p>
            <p className="text-lg font-semibold">{listQuery.data?.summary.canceled ?? 0}</p>
          </div>
          <div className="rounded-md border border-border/70 p-3 text-sm">
            <p className="text-xs text-muted-foreground">Entitlement ativo</p>
            <p className="text-lg font-semibold">
              {listQuery.data?.summary.entitlementActive ?? 0}
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <CardTitle className="text-base">Subscricoes</CardTitle>
              <CardDescription>Seleciona uma subscricao para gerir a partir do detalhe.</CardDescription>
            </div>
            <Button
              type="button"
              variant="outline"
              onClick={() => listQuery.refetch().catch(() => undefined)}
              disabled={listQuery.isFetching}
            >
              <RefreshCw className={cn('h-4 w-4', listQuery.isFetching ? 'animate-spin' : '')} />
              Atualizar
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-3 sm:grid-cols-3">
            <Select
              value={statusFilter}
              onValueChange={(value) => {
                setStatusFilter(value as 'all' | AdminSubscriptionStatus)
                setPage(1)
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="active">Ativa</SelectItem>
                <SelectItem value="trialing">Trial</SelectItem>
                <SelectItem value="past_due">Past due</SelectItem>
                <SelectItem value="canceled">Cancelada</SelectItem>
              </SelectContent>
            </Select>

            <Input
              value={planCodeFilter}
              onChange={(event) => {
                setPlanCodeFilter(event.target.value)
                setPage(1)
              }}
              placeholder="planCode..."
            />

            <Input
              value={searchFilter}
              onChange={(event) => {
                setSearchFilter(event.target.value)
                setPage(1)
              }}
              placeholder="Pesquisar user/email..."
            />
          </div>

          {listQuery.isLoading ? (
            <div className="space-y-2">
              <div className="h-16 animate-pulse rounded-md bg-muted" />
              <div className="h-16 animate-pulse rounded-md bg-muted" />
            </div>
          ) : (listQuery.data?.items.length ?? 0) === 0 ? (
            <p className="rounded-md border border-dashed border-border p-4 text-sm text-muted-foreground">
              Sem subscricoes para os filtros selecionados.
            </p>
          ) : (
            <div className="space-y-2">
              {listQuery.data?.items.map((item) => (
                <div
                  key={item.id}
                  className={cn(
                    'rounded-md border border-border/70 p-3',
                    selectedUserId && item.user?.id === selectedUserId
                      ? 'border-primary/50 bg-primary/5'
                      : '',
                  )}
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div>
                      <p className="text-sm font-semibold">
                        {item.user?.name || item.user?.username || item.user?.email || item.id}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {item.user?.email ?? '-'} | {item.planLabel} ({item.planCode})
                      </p>
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge variant="outline">{statusLabel[item.status]}</Badge>
                      <Badge variant="outline">Derivado: {statusLabel[item.derivedStatus]}</Badge>
                      <Badge variant={item.entitlementActive ? 'secondary' : 'outline'}>
                        {item.entitlementActive ? 'Entitlement ON' : 'Entitlement OFF'}
                      </Badge>
                      <Button
                        type="button"
                        size="sm"
                        variant={item.user?.id === selectedUserId ? 'default' : 'outline'}
                        onClick={() => setSelectedUserId(item.user?.id ?? null)}
                      >
                        Gerir
                      </Button>
                    </div>
                  </div>
                  <p className="mt-2 text-xs text-muted-foreground">
                    Atualizada: {formatDateTime(item.updatedAt)} | Ciclo: {item.billingCycle}
                  </p>
                </div>
              ))}
            </div>
          )}

          <div className="flex items-center justify-between gap-2">
            <p className="text-xs text-muted-foreground">
              Pagina {listQuery.data?.pagination.page ?? 1} de {listQuery.data?.pagination.pages ?? 1}
            </p>
            <div className="flex gap-2">
              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={() => setPage((current) => Math.max(1, current - 1))}
                disabled={page <= 1}
              >
                Anterior
              </Button>
              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={() => setPage((current) => current + 1)}
                disabled={page >= (listQuery.data?.pagination.pages ?? 1)}
              >
                Seguinte
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Acoes na subscricao selecionada</CardTitle>
          <CardDescription>
            Motivo e obrigatorio para qualquer mutacao administrativa.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {selectedUserId ? (
            <div className="rounded-md border border-border/70 p-3 text-sm">
              <p className="font-semibold">
                {selectedSubscription?.user?.name ||
                  selectedSubscription?.user?.username ||
                  selectedSubscription?.user?.email ||
                  selectedUserId}
              </p>
              <p className="text-xs text-muted-foreground">
                Estado atual: {selectedSubscription ? statusLabel[selectedSubscription.status] : '-'} |
                trial ate {formatDateTime(selectedSubscription?.trialEndsAt ?? null)}
              </p>
            </div>
          ) : (
            <p className="rounded-md border border-dashed border-border p-4 text-sm text-muted-foreground">
              Seleciona uma subscricao na lista acima para gerir.
            </p>
          )}

          <div className="grid gap-3 sm:grid-cols-2">
            <Input
              value={reason}
              onChange={(event) => setReason(event.target.value)}
              placeholder="Motivo obrigatorio (x-admin-reason equivalente)"
            />
            <Textarea
              value={note}
              onChange={(event) => setNote(event.target.value)}
              placeholder="Nota opcional"
              rows={2}
            />
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            <Input
              type="number"
              min={1}
              value={extendDays}
              onChange={(event) => setExtendDays(event.target.value)}
              placeholder="Dias de trial"
            />
            <Button
              type="button"
              variant="outline"
              onClick={handleExtendTrial}
              disabled={!canWrite || isMutationPending || !selectedUserId}
            >
              <TimerReset className="h-4 w-4" />
              Estender trial
            </Button>
            <div />
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            <Select value={revokeNextStatus} onValueChange={(value) => setRevokeNextStatus(value as 'past_due' | 'canceled')}>
              <SelectTrigger>
                <SelectValue placeholder="nextStatus" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="past_due">past_due</SelectItem>
                <SelectItem value="canceled">canceled</SelectItem>
              </SelectContent>
            </Select>
            <Button
              type="button"
              variant="outline"
              onClick={handleRevokeEntitlement}
              disabled={!canWrite || isMutationPending || !selectedUserId}
            >
              <ShieldOff className="h-4 w-4" />
              Revogar entitlement
            </Button>
            <div />
          </div>

          <div className="grid gap-3 sm:grid-cols-4">
            <Input
              type="number"
              min={1}
              value={reactivatePeriodDays}
              onChange={(event) => setReactivatePeriodDays(event.target.value)}
              placeholder="Periodo (dias)"
            />
            <Input
              value={reactivatePlanCode}
              onChange={(event) => setReactivatePlanCode(event.target.value)}
              placeholder="planCode (opcional)"
            />
            <Input
              value={reactivatePlanLabel}
              onChange={(event) => setReactivatePlanLabel(event.target.value)}
              placeholder="planLabel (opcional)"
            />
            <Select
              value={reactivateBillingCycle}
              onValueChange={(value) => setReactivateBillingCycle(value as AdminSubscriptionBillingCycle)}
            >
              <SelectTrigger>
                <SelectValue placeholder="billingCycle" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="monthly">monthly</SelectItem>
                <SelectItem value="annual">annual</SelectItem>
                <SelectItem value="lifetime">lifetime</SelectItem>
                <SelectItem value="custom">custom</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button
            type="button"
            onClick={handleReactivate}
            disabled={!canWrite || isMutationPending || !selectedUserId}
          >
            <ShieldCheck className="h-4 w-4" />
            Reativar subscricao
          </Button>

          <div className="space-y-2 rounded-md border border-border/70 p-3">
            <p className="text-sm font-semibold">Timeline da subscricao</p>
            {selectedSubscriptionQuery.isFetching ? (
              <div className="space-y-2">
                <div className="h-16 animate-pulse rounded-md bg-muted" />
                <div className="h-16 animate-pulse rounded-md bg-muted" />
              </div>
            ) : selectedSubscriptionHistory.length === 0 ? (
              <p className="text-xs text-muted-foreground">
                Sem historico detalhado para esta subscricao.
              </p>
            ) : (
              <div className="space-y-2">
                {selectedSubscriptionHistory.map((entry, index) => (
                  <div
                    key={`${entry.version}-${entry.changedAt ?? index}`}
                    className="rounded-md border border-border/60 p-2 text-xs"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex flex-wrap items-center gap-2">
                        <Badge variant="outline">
                          {historyActionLabel[entry.action] ?? entry.action}
                        </Badge>
                        <span className="text-muted-foreground">v{entry.version}</span>
                      </div>
                      <span className="text-muted-foreground">
                        {formatDateTime(entry.changedAt)}
                      </span>
                    </div>
                    <p className="mt-1">
                      <span className="text-muted-foreground">Motivo:</span> {entry.reason || '-'}
                    </p>
                    {entry.note ? (
                      <p className="mt-0.5">
                        <span className="text-muted-foreground">Nota:</span> {entry.note}
                      </p>
                    ) : null}
                    <p className="mt-0.5">
                      <span className="text-muted-foreground">Ator:</span> {mapHistoryActor(entry)}
                    </p>
                    <p className="mt-0.5 text-muted-foreground">
                      Snapshot: {summarizeSnapshot(isRecord(entry.snapshot) ? entry.snapshot : null)}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

