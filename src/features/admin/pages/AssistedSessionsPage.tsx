import { useMemo, useState } from 'react'
import { Loader2, Play, RefreshCcw, ShieldCheck, ShieldX } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import {
  Badge,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Textarea,
} from '@/components/ui'
import { useAuthStore } from '@/features/auth/stores/useAuthStore'
import { getErrorMessage } from '@/lib/api/client'
import { useAdminUsers } from '../hooks/useAdminUsers'
import {
  useAdminAssistedSessionHistory,
  useAdminAssistedSessions,
  useRequestAdminAssistedSession,
  useRevokeAdminAssistedSession,
  useStartAdminAssistedSession,
} from '../hooks/useAdminAssistedSessions'
import {
  clearAssistedSessionAdminBackup,
  saveAssistedSessionAdminBackup,
} from '../services/assistedSessionRuntime'
import { AssistedSessionRecord, AssistedSessionStatus } from '../types/assistedSessions'

const formatDateTime = (value: string | null): string => {
  if (!value) return '-'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return '-'
  return new Intl.DateTimeFormat('pt-PT', {
    dateStyle: 'short',
    timeStyle: 'short',
  }).format(date)
}

const STATUS_LABEL: Record<AssistedSessionStatus, string> = {
  pending: 'Pendente',
  approved: 'Aprovada',
  active: 'Ativa',
  declined: 'Recusada',
  revoked: 'Revogada',
  expired: 'Expirada',
}

const statusBadgeVariant = (
  status: AssistedSessionStatus,
): 'default' | 'secondary' | 'outline' | 'destructive' => {
  if (status === 'active') return 'default'
  if (status === 'approved') return 'secondary'
  if (status === 'pending') return 'outline'
  if (status === 'declined' || status === 'revoked' || status === 'expired') return 'destructive'
  return 'outline'
}

interface RevokeDialogState {
  session: AssistedSessionRecord
}

export default function AssistedSessionsPage() {
  const navigate = useNavigate()

  const authUser = useAuthStore((state) => state.user)
  const accessToken = useAuthStore((state) => state.accessToken)
  const refreshToken = useAuthStore((state) => state.refreshToken)
  const setUser = useAuthStore((state) => state.setUser)

  const [statusFilter, setStatusFilter] = useState<'all' | AssistedSessionStatus>('all')
  const [page, setPage] = useState(1)

  const [targetUserId, setTargetUserId] = useState('')
  const [reason, setReason] = useState('Apoio tecnico solicitado pelo utilizador.')
  const [note, setNote] = useState('')
  const [consentTtlMinutes, setConsentTtlMinutes] = useState('15')
  const [sessionTtlMinutes, setSessionTtlMinutes] = useState('15')

  const [historySessionId, setHistorySessionId] = useState<string | null>(null)
  const [historyPage, setHistoryPage] = useState(1)
  const [revokeDialog, setRevokeDialog] = useState<RevokeDialogState | null>(null)
  const [revokeReason, setRevokeReason] = useState(
    'Encerramento administrativo da sessao assistida.',
  )

  const sessionsQuery = useAdminAssistedSessions({
    status: statusFilter === 'all' ? undefined : statusFilter,
    page,
    limit: 20,
  })

  const usersQuery = useAdminUsers({
    accountStatus: 'active',
    page: 1,
    limit: 100,
    sortBy: 'lastActiveAt',
    sortOrder: 'desc',
  })

  const historyQuery = useAdminAssistedSessionHistory(historySessionId, historyPage, 20)

  const requestMutation = useRequestAdminAssistedSession()
  const startMutation = useStartAdminAssistedSession()
  const revokeMutation = useRevokeAdminAssistedSession()

  const activeUsers = useMemo(
    () => (usersQuery.data?.items ?? []).filter((user) => user.role !== 'admin'),
    [usersQuery.data?.items],
  )

  const sessions = sessionsQuery.data?.items ?? []
  const pagination = sessionsQuery.data?.pagination

  const canCreateRequest =
    targetUserId.trim().length > 0 &&
    reason.trim().length > 0 &&
    !requestMutation.isPending &&
    !startMutation.isPending

  const handleCreateRequest = async () => {
    try {
      const consentTtl = Number.parseInt(consentTtlMinutes, 10)
      const sessionTtl = Number.parseInt(sessionTtlMinutes, 10)

      const response = await requestMutation.mutateAsync({
        targetUserId,
        reason: reason.trim(),
        note: note.trim() || undefined,
        consentTtlMinutes: Number.isFinite(consentTtl) ? consentTtl : undefined,
        sessionTtlMinutes: Number.isFinite(sessionTtl) ? sessionTtl : undefined,
      })

      toast.success(response.message)
      setNote('')
    } catch (error) {
      toast.error(getErrorMessage(error))
    }
  }

  const handleStartSession = async (session: AssistedSessionRecord) => {
    if (!authUser || !accessToken || !refreshToken) {
      toast.error('Sessao admin invalida. Faz login novamente.')
      return
    }

    try {
      const response = await startMutation.mutateAsync(session.id)

      saveAssistedSessionAdminBackup({
        user: authUser,
        tokens: { accessToken, refreshToken },
        assistedSessionId: response.session.id,
        createdAt: new Date().toISOString(),
      })

      setUser(response.actingUser, response.tokens.accessToken, response.tokens.refreshToken)
      toast.success('Sessao assistida ativa. Escopo minimo: leitura apenas.')
      navigate('/conta')
    } catch (error) {
      clearAssistedSessionAdminBackup()
      toast.error(getErrorMessage(error))
    }
  }

  const handleRevoke = async () => {
    if (!revokeDialog) return
    const reasonText = revokeReason.trim()
    if (!reasonText) {
      toast.error('Motivo obrigatorio para revogar.')
      return
    }

    try {
      const response = await revokeMutation.mutateAsync({
        sessionId: revokeDialog.session.id,
        payload: { reason: reasonText },
      })
      toast.success(response.message)
      setRevokeDialog(null)
      setRevokeReason('Encerramento administrativo da sessao assistida.')
    } catch (error) {
      toast.error(getErrorMessage(error))
    }
  }

  const openHistory = (sessionId: string) => {
    setHistorySessionId(sessionId)
    setHistoryPage(1)
  }

  const closeHistory = () => {
    setHistorySessionId(null)
    setHistoryPage(1)
  }

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight">Acesso assistido</h1>
        <p className="text-sm text-muted-foreground">
          Sessao delegada temporaria com consentimento explicito, escopo minimo e auditoria de todas
          as requisicoes.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Novo pedido de assistencia</CardTitle>
          <CardDescription>
            O utilizador alvo precisa aprovar explicitamente antes do inicio da sessao.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label>Utilizador alvo</Label>
            <Select value={targetUserId} onValueChange={setTargetUserId}>
              <SelectTrigger>
                <SelectValue placeholder="Selecionar utilizador" />
              </SelectTrigger>
              <SelectContent>
                {activeUsers.map((user) => (
                  <SelectItem key={user.id} value={user.id}>
                    {user.name} (@{user.username})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">
              Apenas contas ativas e nao-admin ficam elegiveis para sessao assistida.
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="assisted-reason">Motivo</Label>
            <Input
              id="assisted-reason"
              value={reason}
              onChange={(event) => setReason(event.target.value)}
              placeholder="Contexto do pedido de suporte."
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="assisted-note">Nota adicional (opcional)</Label>
            <Textarea
              id="assisted-note"
              rows={3}
              value={note}
              onChange={(event) => setNote(event.target.value)}
              placeholder="Detalhes operacionais para auditoria."
            />
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="consent-ttl">TTL de consentimento (min)</Label>
              <Input
                id="consent-ttl"
                type="number"
                min={5}
                max={30}
                value={consentTtlMinutes}
                onChange={(event) => setConsentTtlMinutes(event.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="session-ttl">Duracao da sessao (min)</Label>
              <Input
                id="session-ttl"
                type="number"
                min={5}
                max={30}
                value={sessionTtlMinutes}
                onChange={(event) => setSessionTtlMinutes(event.target.value)}
              />
            </div>
          </div>

          <div className="md:col-span-2 flex flex-wrap gap-2">
            <Button onClick={handleCreateRequest} disabled={!canCreateRequest}>
              {requestMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
              Criar pedido
            </Button>
            <Button
              type="button"
              variant="ghost"
              onClick={() => {
                sessionsQuery.refetch()
                usersQuery.refetch()
              }}
              disabled={sessionsQuery.isFetching || usersQuery.isFetching}
            >
              {sessionsQuery.isFetching || usersQuery.isFetching ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <RefreshCcw className="h-4 w-4" />
              )}
              Atualizar
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Sessoes assistidas</CardTitle>
          <CardDescription>
            Acompanhar estado, iniciar apos consentimento e revogar imediatamente.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap items-center gap-3">
            <Label className="text-sm">Estado</Label>
            <Select
              value={statusFilter}
              onValueChange={(value) => {
                setStatusFilter(value as 'all' | AssistedSessionStatus)
                setPage(1)
              }}
            >
              <SelectTrigger className="w-[220px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="pending">Pendentes</SelectItem>
                <SelectItem value="approved">Aprovadas</SelectItem>
                <SelectItem value="active">Ativas</SelectItem>
                <SelectItem value="declined">Recusadas</SelectItem>
                <SelectItem value="revoked">Revogadas</SelectItem>
                <SelectItem value="expired">Expiradas</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {sessionsQuery.isLoading ? (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" />A carregar sessoes...
            </div>
          ) : sessionsQuery.isError ? (
            <div className="rounded-md border border-destructive/40 bg-destructive/5 p-3 text-sm text-destructive">
              {getErrorMessage(sessionsQuery.error)}
            </div>
          ) : sessions.length === 0 ? (
            <div className="rounded-md border border-dashed border-border p-6 text-center text-sm text-muted-foreground">
              Sem sessoes assistidas para este filtro.
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Utilizador</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Consentimento</TableHead>
                  <TableHead>Expira</TableHead>
                  <TableHead className="w-[320px]">Acoes</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sessions.map((session) => {
                  const canStart = session.status === 'approved' || session.status === 'active'
                  const canRevoke =
                    session.status === 'pending' ||
                    session.status === 'approved' ||
                    session.status === 'active'

                  return (
                    <TableRow key={session.id}>
                      <TableCell>
                        <div className="space-y-1">
                          <p className="text-sm font-medium">
                            {session.targetUser?.name ?? 'Utilizador'}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            @{session.targetUser?.username ?? '-'}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {session.targetUser?.email ?? ''}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={statusBadgeVariant(session.status)}>
                          {STATUS_LABEL[session.status]}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground">
                        {formatDateTime(session.consentExpiresAt)}
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground">
                        {formatDateTime(session.sessionExpiresAt)}
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-2">
                          <Button
                            type="button"
                            size="sm"
                            variant="outline"
                            disabled={!canStart || startMutation.isPending}
                            onClick={() => handleStartSession(session)}
                          >
                            <Play className="h-4 w-4" />
                            Iniciar
                          </Button>
                          <Button
                            type="button"
                            size="sm"
                            variant="outline"
                            disabled={!canRevoke || revokeMutation.isPending}
                            onClick={() => {
                              setRevokeDialog({ session })
                              setRevokeReason('Encerramento administrativo da sessao assistida.')
                            }}
                          >
                            <ShieldX className="h-4 w-4" />
                            Revogar
                          </Button>
                          <Button
                            type="button"
                            size="sm"
                            variant="ghost"
                            onClick={() => openHistory(session.id)}
                          >
                            Historico
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          )}

          {pagination && pagination.pages > 1 && (
            <div className="flex items-center justify-between border-t border-border pt-3">
              <p className="text-xs text-muted-foreground">
                Pagina {pagination.page} de {pagination.pages}
              </p>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  disabled={pagination.page <= 1}
                  onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                >
                  Anterior
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  disabled={pagination.page >= pagination.pages}
                  onClick={() => setPage((prev) => Math.min(prev + 1, pagination.pages))}
                >
                  Seguinte
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog
        open={Boolean(historySessionId)}
        onOpenChange={(open) => (!open ? closeHistory() : null)}
      >
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Historico detalhado de sessao assistida</DialogTitle>
            <DialogDescription>
              Cada request executado em modo assistido e registado com outcome e metadados.
            </DialogDescription>
          </DialogHeader>

          {historyQuery.isLoading ? (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" />A carregar historico...
            </div>
          ) : historyQuery.isError ? (
            <div className="rounded-md border border-destructive/40 bg-destructive/5 p-3 text-sm text-destructive">
              {getErrorMessage(historyQuery.error)}
            </div>
          ) : (historyQuery.data?.items.length ?? 0) === 0 ? (
            <div className="rounded-md border border-dashed border-border p-6 text-center text-sm text-muted-foreground">
              Sem eventos registados para esta sessao.
            </div>
          ) : (
            <div className="space-y-3">
              {historyQuery.data?.items.map((event) => (
                <div key={event.id} className="rounded-md border border-border/70 p-3">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">
                        {event.method} {event.path}
                      </Badge>
                      <Badge variant={event.outcome === 'success' ? 'secondary' : 'destructive'}>
                        {event.outcome}
                      </Badge>
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {formatDateTime(event.createdAt)}
                    </span>
                  </div>
                  <p className="mt-2 text-xs text-muted-foreground">
                    status {event.statusCode} • request-id {event.requestId ?? '-'}
                  </p>
                </div>
              ))}
            </div>
          )}

          {historyQuery.data?.pagination && historyQuery.data.pagination.pages > 1 && (
            <div className="flex items-center justify-between border-t border-border pt-3">
              <p className="text-xs text-muted-foreground">
                Pagina {historyQuery.data.pagination.page} de {historyQuery.data.pagination.pages}
              </p>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  disabled={historyQuery.data.pagination.page <= 1}
                  onClick={() => setHistoryPage((prev) => Math.max(prev - 1, 1))}
                >
                  Anterior
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  disabled={historyQuery.data.pagination.page >= historyQuery.data.pagination.pages}
                  onClick={() =>
                    setHistoryPage((prev) =>
                      Math.min(prev + 1, historyQuery.data!.pagination.pages),
                    )
                  }
                >
                  Seguinte
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Dialog
        open={Boolean(revokeDialog)}
        onOpenChange={(open) => (!open ? setRevokeDialog(null) : null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Revogar sessao assistida</DialogTitle>
            <DialogDescription>
              A revogacao e imediata e encerra o acesso assistido em curso.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            <div className="rounded-md border border-border/70 bg-muted/20 p-3 text-sm">
              <p className="font-medium">
                {revokeDialog?.session.targetUser?.name ?? 'Utilizador'}
              </p>
              <p className="text-xs text-muted-foreground">
                @{revokeDialog?.session.targetUser?.username ?? '-'}
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="revoke-reason">Motivo</Label>
              <Input
                id="revoke-reason"
                value={revokeReason}
                onChange={(event) => setRevokeReason(event.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setRevokeDialog(null)}>
              Cancelar
            </Button>
            <Button
              type="button"
              variant="destructive"
              onClick={handleRevoke}
              disabled={revokeMutation.isPending}
            >
              {revokeMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
              Revogar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Card className="border-primary/30 bg-primary/5">
        <CardContent className="flex items-start gap-3 pt-6">
          <ShieldCheck className="mt-0.5 h-4 w-4 text-primary" />
          <div className="space-y-1 text-sm text-muted-foreground">
            <p className="font-medium text-foreground">Guardrails ativos</p>
            <p>
              1) sem consentimento valido nao inicia, 2) TTL curto (5-30min), 3) escopo read-only,
              4) auditoria por request.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
