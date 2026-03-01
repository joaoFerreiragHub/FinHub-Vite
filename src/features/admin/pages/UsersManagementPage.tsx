import { useMemo, useState } from 'react'
import {
  Ban,
  FileText,
  Loader2,
  LogOut,
  RefreshCcw,
  Search,
  ShieldAlert,
  SlidersHorizontal,
  Sparkles,
} from 'lucide-react'
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
import {
  useAddAdminUserNote,
  useAdminUserTrustProfile,
  useAdminUserHistory,
  useAdminUsers,
  useApplyAdminCreatorControls,
  useBanAdminUser,
  useForceLogoutAdminUser,
  useSuspendAdminUser,
  useUnbanAdminUser,
} from '../hooks/useAdminUsers'
import {
  CreatorControlsSummary,
  RiskLevelBadge,
  TrustRecommendationBadge,
  TrustReasonList,
  TrustScoreBar,
  TRUST_RECOMMENDATION_LABEL,
} from '../components/RiskSignals'
import type {
  AdminCreatorControlAction,
  AdminUserAccountStatus,
  AdminUserListQuery,
  AdminUserRecord,
  AdminUserRole,
} from '../types/adminUsers'

type RoleFilter = AdminUserRole | 'all'
type StatusFilter = AdminUserAccountStatus | 'all'
type ReadOnlyFilter = 'all' | 'yes' | 'no'
type UserActionKind = 'suspend' | 'ban' | 'unban' | 'force-logout' | 'note'
type CreatorControlDialogState = {
  user: AdminUserRecord
}

interface FilterState {
  search: string
  role: RoleFilter
  status: StatusFilter
  adminReadOnly: ReadOnlyFilter
  activeSinceDays: string
}

interface UserActionDialogState {
  kind: UserActionKind
  user: AdminUserRecord
}

interface CurrentAdminMeta {
  id?: string
  adminReadOnly?: boolean
  adminScopes?: string[]
}

interface UsersManagementPageProps {
  embedded?: boolean
}

const PAGE_SIZE = 20

const INITIAL_FILTERS: FilterState = {
  search: '',
  role: 'all',
  status: 'all',
  adminReadOnly: 'all',
  activeSinceDays: '',
}

const ACTION_COPY: Record<
  UserActionKind,
  { title: string; description: string; confirmLabel: string; reasonPlaceholder: string }
> = {
  suspend: {
    title: 'Suspender utilizador',
    description: 'A conta fica impedida de fazer login ate ser reativada.',
    confirmLabel: 'Confirmar suspensao',
    reasonPlaceholder: 'Ex: violacao temporaria das regras',
  },
  ban: {
    title: 'Banir utilizador',
    description: 'A conta fica bloqueada e sem acesso ate nova decisao administrativa.',
    confirmLabel: 'Confirmar ban',
    reasonPlaceholder: 'Ex: fraude, spam recorrente ou abuso grave',
  },
  unban: {
    title: 'Reativar utilizador',
    description: 'A conta regressa ao estado ativo e pode voltar a iniciar sessao.',
    confirmLabel: 'Confirmar reativacao',
    reasonPlaceholder: 'Ex: revisao concluida e conta considerada apta',
  },
  'force-logout': {
    title: 'Forcar logout global',
    description: 'Todas as sessoes ativas do utilizador serao revogadas de imediato.',
    confirmLabel: 'Aplicar force logout',
    reasonPlaceholder: 'Ex: suspeita de compromisso de sessao',
  },
  note: {
    title: 'Adicionar nota interna',
    description: 'A nota fica registada no historico administrativo do utilizador.',
    confirmLabel: 'Guardar nota',
    reasonPlaceholder: 'Ex: contexto operacional',
  },
}

const DEFAULT_ACTION_REASON: Record<UserActionKind, string> = {
  suspend: 'Suspensao preventiva',
  ban: 'Ban por violacao grave de politicas',
  unban: 'Reavaliacao concluida',
  'force-logout': 'Revogacao administrativa de sessao',
  note: 'Nota interna',
}

const DOUBLE_CONFIRM_TOKEN = 'CONFIRMAR'
const DESTRUCTIVE_USER_ACTIONS: UserActionKind[] = ['suspend', 'ban', 'force-logout']

const STATUS_LABEL: Record<AdminUserAccountStatus, string> = {
  active: 'Ativo',
  suspended: 'Suspenso',
  banned: 'Banido',
}

const ROLE_LABEL: Record<AdminUserRole, string> = {
  visitor: 'Visitor',
  free: 'Free',
  premium: 'Premium',
  creator: 'Creator',
  admin: 'Admin',
}

const MODERATION_ACTION_LABEL = {
  status_change: 'Mudanca de estado',
  force_logout: 'Force logout',
  internal_note: 'Nota interna',
  creator_control: 'Controlo creator',
} as const

const CREATOR_CONTROL_ACTION_LABEL: Record<AdminCreatorControlAction, string> = {
  set_cooldown: 'Aplicar cooldown',
  clear_cooldown: 'Limpar cooldown',
  block_creation: 'Bloquear criacao',
  unblock_creation: 'Desbloquear criacao',
  block_publishing: 'Bloquear publicacao',
  unblock_publishing: 'Desbloquear publicacao',
  suspend_creator_ops: 'Suspender operacao',
  restore_creator_ops: 'Restaurar operacao',
}

const CREATOR_CONTROL_REASON_DEFAULT: Record<AdminCreatorControlAction, string> = {
  set_cooldown: 'Cooldown operacional preventivo',
  clear_cooldown: 'Cooldown limpo apos revisao',
  block_creation: 'Criacao bloqueada por risco operacional',
  unblock_creation: 'Criacao restaurada apos revisao',
  block_publishing: 'Publicacao bloqueada por risco de moderacao',
  unblock_publishing: 'Publicacao restaurada apos revisao',
  suspend_creator_ops: 'Suspensao operacional do creator por risco elevado',
  restore_creator_ops: 'Operacao do creator restaurada apos revisao',
}

const formatDateTime = (value: string | null): string => {
  if (!value) return '-'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return '-'
  return new Intl.DateTimeFormat('pt-PT', {
    dateStyle: 'short',
    timeStyle: 'short',
  }).format(date)
}

const getStatusBadgeVariant = (
  status: AdminUserAccountStatus,
): 'secondary' | 'outline' | 'destructive' => {
  if (status === 'active') return 'secondary'
  if (status === 'suspended') return 'outline'
  return 'destructive'
}

const toQueryFilters = (filters: FilterState, page: number): AdminUserListQuery => {
  const query: AdminUserListQuery = {
    page,
    limit: PAGE_SIZE,
    sortBy: 'updatedAt',
    sortOrder: 'desc',
  }

  if (filters.search.trim().length > 0) query.search = filters.search.trim()
  if (filters.role !== 'all') query.role = filters.role
  if (filters.status !== 'all') query.accountStatus = filters.status
  if (filters.adminReadOnly === 'yes') query.adminReadOnly = true
  if (filters.adminReadOnly === 'no') query.adminReadOnly = false

  const activeSinceDays = Number.parseInt(filters.activeSinceDays, 10)
  if (Number.isFinite(activeSinceDays) && activeSinceDays > 0) {
    query.activeSinceDays = activeSinceDays
  }

  return query
}

const isDestructiveAction = (kind: UserActionKind): boolean =>
  DESTRUCTIVE_USER_ACTIONS.includes(kind)

const getImpactSummary = (kind: UserActionKind, user: AdminUserRecord): string[] => {
  if (kind === 'suspend') {
    return [
      `A conta de @${user.username} passa para estado "suspended".`,
      'Login e refresh token ficam bloqueados ate nova acao administrativa.',
      'Evento de moderacao e auditoria admin serao registados com motivo.',
    ]
  }

  if (kind === 'ban') {
    return [
      `A conta de @${user.username} passa para estado "banned".`,
      'Utilizador deixa de ter acesso a qualquer sessao ativa ou futura.',
      'Acao critica com historico permanente em auditoria administrativa.',
    ]
  }

  if (kind === 'force-logout') {
    return [
      `Todas as sessoes ativas de @${user.username} serao invalidadas.`,
      'Nova autenticacao passa a exigir login completo no cliente.',
      'A acao fica auditada para rastreabilidade operacional.',
    ]
  }

  if (kind === 'unban') {
    return [
      `A conta de @${user.username} regressa ao estado "active".`,
      'Login volta a estar permitido apos a reavaliacao.',
      'O historico da reversao fica guardado para compliance.',
    ]
  }

  return [
    `Nota interna associada ao utilizador @${user.username}.`,
    'Registo visivel no historico de moderacao para contexto futuro.',
    'Nao altera estado da conta nem sessoes ativas.',
  ]
}

export default function UsersManagementPage({ embedded = false }: UsersManagementPageProps) {
  const [filters, setFilters] = useState<FilterState>(INITIAL_FILTERS)
  const [queryFilters, setQueryFilters] = useState<FilterState>(INITIAL_FILTERS)
  const [page, setPage] = useState(1)

  const [actionDialog, setActionDialog] = useState<UserActionDialogState | null>(null)
  const [actionReason, setActionReason] = useState('')
  const [actionNote, setActionNote] = useState('')
  const [actionConfirmText, setActionConfirmText] = useState('')

  const [historyUser, setHistoryUser] = useState<AdminUserRecord | null>(null)
  const [historyPage, setHistoryPage] = useState(1)
  const [trustProfileUser, setTrustProfileUser] = useState<AdminUserRecord | null>(null)
  const [creatorControlDialog, setCreatorControlDialog] =
    useState<CreatorControlDialogState | null>(null)
  const [creatorControlAction, setCreatorControlAction] =
    useState<AdminCreatorControlAction>('set_cooldown')
  const [creatorControlReason, setCreatorControlReason] = useState(
    CREATOR_CONTROL_REASON_DEFAULT.set_cooldown,
  )
  const [creatorControlNote, setCreatorControlNote] = useState('')
  const [creatorControlCooldownHours, setCreatorControlCooldownHours] = useState('24')

  const rawAuthUser = useAuthStore((state) => state.user)
  const authUser = (rawAuthUser as unknown as CurrentAdminMeta | null) ?? null

  const canWriteUsers = useMemo(() => {
    if (!authUser) return false
    if (authUser.adminReadOnly) return false
    if (!Array.isArray(authUser.adminScopes) || authUser.adminScopes.length === 0) return true
    return authUser.adminScopes.includes('admin.users.write')
  }, [authUser])

  const userListQuery = useMemo(() => toQueryFilters(queryFilters, page), [queryFilters, page])
  const usersQuery = useAdminUsers(userListQuery)
  const historyQuery = useAdminUserHistory(historyUser?.id ?? null, historyPage, 10)
  const trustProfileQuery = useAdminUserTrustProfile(
    trustProfileUser?.role === 'creator' ? trustProfileUser.id : null,
  )

  const suspendMutation = useSuspendAdminUser()
  const banMutation = useBanAdminUser()
  const unbanMutation = useUnbanAdminUser()
  const forceLogoutMutation = useForceLogoutAdminUser()
  const addNoteMutation = useAddAdminUserNote()
  const creatorControlsMutation = useApplyAdminCreatorControls()

  const pagination = usersQuery.data?.pagination
  const users = usersQuery.data?.items ?? []
  const creatorUsers = users.filter((item) => item.role === 'creator')

  const activeCountInPage = users.filter((item) => item.accountStatus === 'active').length
  const blockedCountInPage = users.filter((item) => item.accountStatus !== 'active').length
  const highRiskCreatorsInPage = creatorUsers.filter(
    (item) =>
      item.trustSignals?.riskLevel === 'high' || item.trustSignals?.riskLevel === 'critical',
  ).length
  const creatorsWithActiveControlsInPage = creatorUsers.filter(
    (item) =>
      item.creatorControls.creationBlocked ||
      item.creatorControls.publishingBlocked ||
      Boolean(item.creatorControls.cooldownUntil),
  ).length
  const creatorsNeedingInterventionInPage = creatorUsers.filter(
    (item) =>
      item.trustSignals?.recommendedAction === 'set_cooldown' ||
      item.trustSignals?.recommendedAction === 'block_publishing' ||
      item.trustSignals?.recommendedAction === 'suspend_creator_ops',
  ).length

  const isActionPending =
    suspendMutation.isPending ||
    banMutation.isPending ||
    unbanMutation.isPending ||
    forceLogoutMutation.isPending ||
    addNoteMutation.isPending
  const isCreatorControlPending = creatorControlsMutation.isPending
  const requiresDoubleConfirm = actionDialog ? isDestructiveAction(actionDialog.kind) : false
  const isDoubleConfirmValid =
    !requiresDoubleConfirm || actionConfirmText.trim().toUpperCase() === DOUBLE_CONFIRM_TOKEN

  const applyFilters = () => {
    setQueryFilters(filters)
    setPage(1)
  }

  const clearFilters = () => {
    setFilters(INITIAL_FILTERS)
    setQueryFilters(INITIAL_FILTERS)
    setPage(1)
  }

  const openActionDialog = (kind: UserActionKind, user: AdminUserRecord) => {
    setActionDialog({ kind, user })
    setActionReason(DEFAULT_ACTION_REASON[kind])
    setActionNote('')
    setActionConfirmText('')
  }

  const openCreatorControlDialog = (user: AdminUserRecord) => {
    const suggestedAction =
      user.trustSignals?.recommendedAction === 'set_cooldown' ||
      user.trustSignals?.recommendedAction === 'block_publishing' ||
      user.trustSignals?.recommendedAction === 'suspend_creator_ops'
        ? user.trustSignals.recommendedAction
        : 'set_cooldown'

    setCreatorControlDialog({ user })
    setCreatorControlAction(suggestedAction)
    setCreatorControlReason(CREATOR_CONTROL_REASON_DEFAULT[suggestedAction])
    setCreatorControlNote('')
    setCreatorControlCooldownHours('24')
  }

  const closeActionDialog = (force = false) => {
    if (!force && isActionPending) return
    setActionDialog(null)
    setActionReason('')
    setActionNote('')
    setActionConfirmText('')
  }

  const closeHistoryDialog = () => {
    setHistoryUser(null)
    setHistoryPage(1)
  }

  const closeTrustProfileDialog = () => {
    setTrustProfileUser(null)
  }

  const closeCreatorControlDialog = (force = false) => {
    if (!force && isCreatorControlPending) return
    setCreatorControlDialog(null)
    setCreatorControlAction('set_cooldown')
    setCreatorControlReason(CREATOR_CONTROL_REASON_DEFAULT.set_cooldown)
    setCreatorControlNote('')
    setCreatorControlCooldownHours('24')
  }

  const handleActionSubmit = async () => {
    if (!actionDialog) return

    const reason = actionReason.trim()
    if (!reason) {
      toast.error('Motivo obrigatorio para executar a acao.')
      return
    }
    if (!isDoubleConfirmValid) {
      toast.error(`Escreve "${DOUBLE_CONFIRM_TOKEN}" para confirmar esta acao critica.`)
      return
    }

    const targetUserId = actionDialog.user.id

    try {
      if (actionDialog.kind === 'note') {
        const note = actionNote.trim()
        if (!note) {
          toast.error('A nota nao pode estar vazia.')
          return
        }

        const result = await addNoteMutation.mutateAsync({
          userId: targetUserId,
          payload: {
            reason,
            note,
          },
        })
        toast.success(result.message)
      } else if (actionDialog.kind === 'suspend') {
        const result = await suspendMutation.mutateAsync({
          userId: targetUserId,
          payload: { reason, note: actionNote.trim() || undefined },
        })
        toast.success(result.message)
      } else if (actionDialog.kind === 'ban') {
        const result = await banMutation.mutateAsync({
          userId: targetUserId,
          payload: { reason, note: actionNote.trim() || undefined },
        })
        toast.success(result.message)
      } else if (actionDialog.kind === 'unban') {
        const result = await unbanMutation.mutateAsync({
          userId: targetUserId,
          payload: { reason, note: actionNote.trim() || undefined },
        })
        toast.success(result.message)
      } else if (actionDialog.kind === 'force-logout') {
        const result = await forceLogoutMutation.mutateAsync({
          userId: targetUserId,
          payload: { reason, note: actionNote.trim() || undefined },
        })
        toast.success(result.message)
      }

      closeActionDialog(true)
    } catch (error) {
      toast.error(getErrorMessage(error))
    }
  }

  const handleCreatorControlSubmit = async () => {
    if (!creatorControlDialog) return

    const reason = creatorControlReason.trim()
    if (!reason) {
      toast.error('Motivo obrigatorio para controlos do creator.')
      return
    }

    const payload: {
      action: AdminCreatorControlAction
      reason: string
      note?: string
      cooldownHours?: number
    } = {
      action: creatorControlAction,
      reason,
      note: creatorControlNote.trim() || undefined,
    }

    if (creatorControlAction === 'set_cooldown') {
      const cooldownHours = Number.parseInt(creatorControlCooldownHours, 10)
      if (!Number.isFinite(cooldownHours) || cooldownHours <= 0) {
        toast.error('Cooldown hours deve ser maior que zero.')
        return
      }
      payload.cooldownHours = cooldownHours
    }

    try {
      const result = await creatorControlsMutation.mutateAsync({
        userId: creatorControlDialog.user.id,
        payload,
      })
      toast.success(result.message)
      closeCreatorControlDialog(true)
    } catch (error) {
      toast.error(getErrorMessage(error))
    }
  }

  return (
    <div className="space-y-6">
      {embedded ? (
        <div className="space-y-1">
          <h2 className="text-xl font-semibold tracking-tight">Gestao de utilizadores</h2>
          <p className="text-sm text-muted-foreground">
            Operacoes de estado de conta, revogacao de sessao e historico auditavel.
          </p>
        </div>
      ) : (
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold tracking-tight">Gestao de utilizadores</h1>
          <p className="text-sm text-muted-foreground">
            Operacoes administrativas de estado de conta, revogacao de sessao e historico de
            moderacao.
          </p>
        </div>
      )}

      {!canWriteUsers && (
        <Card className="border-yellow-500/40 bg-yellow-500/5">
          <CardContent className="flex items-start gap-3 pt-6">
            <ShieldAlert className="mt-0.5 h-4 w-4 text-yellow-600" />
            <p className="text-sm text-muted-foreground">
              Perfil atual sem permissao de escrita em utilizadores. Podes consultar dados e
              historico, mas acoes de sancao ficam bloqueadas.
            </p>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total de utilizadores</CardDescription>
            <CardTitle className="text-2xl">{pagination?.total ?? 0}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">Resultado global do filtro aplicado.</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Ativos na pagina</CardDescription>
            <CardTitle className="text-2xl">{activeCountInPage}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">Contas atualmente operacionais.</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Bloqueados na pagina</CardDescription>
            <CardTitle className="text-2xl">{blockedCountInPage}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">Suspensos + banidos no conjunto atual.</p>
          </CardContent>
        </Card>
        <Card className="border-sky-500/20 bg-sky-500/5">
          <CardHeader className="pb-2">
            <CardDescription>Creators high/critical</CardDescription>
            <CardTitle className="text-2xl">{highRiskCreatorsInPage}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">
              Creators nesta pagina com score operacional degradado.
            </p>
          </CardContent>
        </Card>
        <Card className="border-amber-500/20 bg-amber-500/5">
          <CardHeader className="pb-2">
            <CardDescription>Com barreiras ativas</CardDescription>
            <CardTitle className="text-2xl">{creatorsWithActiveControlsInPage}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">
              Creators com cooldown ou bloqueios operacionais ativos.
            </p>
          </CardContent>
        </Card>
        <Card className="border-red-500/20 bg-red-500/5">
          <CardHeader className="pb-2">
            <CardDescription>Intervencao sugerida</CardDescription>
            <CardTitle className="text-2xl">{creatorsNeedingInterventionInPage}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">
              Trust signals a recomendar cooldown, bloqueio ou suspensao.
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Pesquisa e filtros</CardTitle>
          <CardDescription>
            Refina por role, estado da conta, admin read-only e atividade recente.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-3 md:grid-cols-2 xl:grid-cols-6">
          <div className="xl:col-span-2">
            <Label htmlFor="admin-users-search">Pesquisa</Label>
            <div className="mt-1 flex items-center gap-2">
              <Input
                id="admin-users-search"
                placeholder="Nome, username ou email"
                value={filters.search}
                onChange={(event) =>
                  setFilters((prev) => ({ ...prev, search: event.target.value }))
                }
                onKeyDown={(event) => {
                  if (event.key === 'Enter') {
                    event.preventDefault()
                    applyFilters()
                  }
                }}
              />
              <Button type="button" variant="outline" onClick={applyFilters}>
                <Search className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div>
            <Label>Role</Label>
            <Select
              value={filters.role}
              onValueChange={(value) =>
                setFilters((prev) => ({ ...prev, role: value as RoleFilter }))
              }
            >
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="Todos" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="visitor">Visitor</SelectItem>
                <SelectItem value="free">Free</SelectItem>
                <SelectItem value="premium">Premium</SelectItem>
                <SelectItem value="creator">Creator</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Estado</Label>
            <Select
              value={filters.status}
              onValueChange={(value) =>
                setFilters((prev) => ({ ...prev, status: value as StatusFilter }))
              }
            >
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="Todos" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="active">Ativo</SelectItem>
                <SelectItem value="suspended">Suspenso</SelectItem>
                <SelectItem value="banned">Banido</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Admin read-only</Label>
            <Select
              value={filters.adminReadOnly}
              onValueChange={(value) =>
                setFilters((prev) => ({ ...prev, adminReadOnly: value as ReadOnlyFilter }))
              }
            >
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="Todos" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="yes">Sim</SelectItem>
                <SelectItem value="no">Nao</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="admin-users-active-since">Atividade em dias</Label>
            <Input
              id="admin-users-active-since"
              type="number"
              min={1}
              value={filters.activeSinceDays}
              onChange={(event) =>
                setFilters((prev) => ({ ...prev, activeSinceDays: event.target.value }))
              }
              className="mt-1"
              placeholder="Ex: 30"
            />
          </div>

          <div className="md:col-span-2 xl:col-span-6 flex flex-wrap gap-2">
            <Button type="button" onClick={applyFilters}>
              Aplicar filtros
            </Button>
            <Button type="button" variant="outline" onClick={clearFilters}>
              Limpar
            </Button>
            <Button
              type="button"
              variant="ghost"
              onClick={() => usersQuery.refetch()}
              disabled={usersQuery.isFetching}
            >
              {usersQuery.isFetching ? (
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
          <CardTitle>Lista operacional</CardTitle>
          <CardDescription>
            Fluxo recomendado: localizar utilizador, executar acao com motivo, validar historico.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {usersQuery.isLoading ? (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" />A carregar utilizadores...
            </div>
          ) : usersQuery.isError ? (
            <div className="rounded-md border border-destructive/40 bg-destructive/5 p-4">
              <p className="text-sm text-destructive">{getErrorMessage(usersQuery.error)}</p>
            </div>
          ) : users.length === 0 ? (
            <div className="rounded-md border border-dashed border-border p-8 text-center">
              <p className="text-sm text-muted-foreground">
                Sem utilizadores para os filtros selecionados.
              </p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Utilizador</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Risco creator</TableHead>
                  <TableHead>Atividade</TableHead>
                  <TableHead className="w-[420px]">Acoes</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((user) => {
                  const canActOnUser =
                    canWriteUsers && user.role !== 'admin' && authUser?.id !== user.id
                  const isBlocked = user.accountStatus !== 'active'

                  return (
                    <TableRow key={user.id}>
                      <TableCell>
                        <div className="space-y-1">
                          <p className="text-sm font-medium">{user.name}</p>
                          <p className="text-xs text-muted-foreground">@{user.username}</p>
                          <p className="text-xs text-muted-foreground">{user.email}</p>
                          {user.role === 'admin' ? (
                            <p className="text-[11px] text-muted-foreground">
                              {user.adminReadOnly ? 'Admin read-only' : 'Admin write'} ·{' '}
                              {user.adminScopes.length} scopes
                            </p>
                          ) : null}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-2">
                          <Badge variant={getStatusBadgeVariant(user.accountStatus)}>
                            {STATUS_LABEL[user.accountStatus]}
                          </Badge>
                          <Badge variant="outline">{ROLE_LABEL[user.role]}</Badge>
                        </div>
                      </TableCell>
                      <TableCell>
                        {user.role === 'creator' ? (
                          <div className="space-y-2">
                            {user.trustSignals ? (
                              <>
                                <div className="flex flex-wrap gap-1.5">
                                  <RiskLevelBadge
                                    riskLevel={user.trustSignals.riskLevel}
                                    score={user.trustSignals.trustScore}
                                  />
                                  <TrustRecommendationBadge
                                    action={user.trustSignals.recommendedAction}
                                  />
                                </div>
                                <TrustScoreBar value={user.trustSignals.trustScore} compact />
                                <CreatorControlsSummary controls={user.creatorControls} dense />
                                <p className="text-xs text-muted-foreground">
                                  {user.trustSignals.reasons[0] ??
                                    'Sem sinais de risco relevantes.'}
                                </p>
                              </>
                            ) : (
                              <span className="text-xs text-muted-foreground">
                                Sem trust profile calculado.
                              </span>
                            )}
                          </div>
                        ) : (
                          <div className="space-y-1 text-xs text-muted-foreground">
                            <p>
                              {user.role === 'admin' ? 'Perfil administrativo' : 'Nao aplicavel'}
                            </p>
                            {user.role === 'admin' ? (
                              <p>{user.adminReadOnly ? 'Read-only' : 'Write'} sem trust score</p>
                            ) : null}
                          </div>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1 text-xs text-muted-foreground">
                          <p>Ultimo login: {formatDateTime(user.lastLoginAt)}</p>
                          <p>Ultima atividade: {formatDateTime(user.lastActiveAt)}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-2">
                          {user.role === 'creator' ? (
                            <Button
                              type="button"
                              size="sm"
                              variant="outline"
                              onClick={() => setTrustProfileUser(user)}
                            >
                              <Sparkles className="h-4 w-4" />
                              Risco
                            </Button>
                          ) : null}

                          {user.role === 'creator' ? (
                            <Button
                              type="button"
                              size="sm"
                              variant="outline"
                              disabled={!canWriteUsers}
                              onClick={() => openCreatorControlDialog(user)}
                            >
                              <SlidersHorizontal className="h-4 w-4" />
                              Controlo creator
                            </Button>
                          ) : null}

                          {isBlocked ? (
                            <Button
                              type="button"
                              size="sm"
                              variant="outline"
                              disabled={!canActOnUser}
                              onClick={() => openActionDialog('unban', user)}
                            >
                              Reativar
                            </Button>
                          ) : (
                            <>
                              <Button
                                type="button"
                                size="sm"
                                variant="outline"
                                disabled={!canActOnUser}
                                onClick={() => openActionDialog('suspend', user)}
                              >
                                <ShieldAlert className="h-4 w-4" />
                                Suspender
                              </Button>
                              <Button
                                type="button"
                                size="sm"
                                variant="destructive"
                                disabled={!canActOnUser}
                                onClick={() => openActionDialog('ban', user)}
                              >
                                <Ban className="h-4 w-4" />
                                Banir
                              </Button>
                            </>
                          )}

                          <Button
                            type="button"
                            size="sm"
                            variant="outline"
                            disabled={!canActOnUser}
                            onClick={() => openActionDialog('force-logout', user)}
                          >
                            <LogOut className="h-4 w-4" />
                            Force logout
                          </Button>

                          <Button
                            type="button"
                            size="sm"
                            variant="outline"
                            disabled={!canWriteUsers}
                            onClick={() => openActionDialog('note', user)}
                          >
                            <FileText className="h-4 w-4" />
                            Nota
                          </Button>

                          <Button
                            type="button"
                            size="sm"
                            variant="ghost"
                            onClick={() => {
                              setHistoryUser(user)
                              setHistoryPage(1)
                            }}
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
            <div className="flex items-center justify-between border-t border-border pt-4">
              <p className="text-sm text-muted-foreground">
                Pagina {pagination.page} de {pagination.pages}
              </p>
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  disabled={pagination.page <= 1}
                  onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                >
                  Anterior
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
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
        open={Boolean(actionDialog)}
        onOpenChange={(open) => (!open ? closeActionDialog() : null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {actionDialog ? ACTION_COPY[actionDialog.kind].title : 'Acao admin'}
            </DialogTitle>
            <DialogDescription>
              {actionDialog ? ACTION_COPY[actionDialog.kind].description : ''}
            </DialogDescription>
          </DialogHeader>

          {actionDialog && (
            <div className="space-y-4">
              <div className="rounded-md border border-border/70 bg-muted/20 p-3 text-sm">
                <p className="font-medium">{actionDialog.user.name}</p>
                <p className="text-xs text-muted-foreground">
                  @{actionDialog.user.username} • {actionDialog.user.email}
                </p>
              </div>

              <div className="rounded-md border border-border/70 bg-muted/20 p-3">
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Resumo de impacto
                </p>
                <ul className="mt-2 space-y-1 text-xs text-muted-foreground">
                  {getImpactSummary(actionDialog.kind, actionDialog.user).map((line) => (
                    <li key={line}>{line}</li>
                  ))}
                </ul>
              </div>

              <div className="space-y-2">
                <Label htmlFor="admin-action-reason">Motivo</Label>
                <Input
                  id="admin-action-reason"
                  value={actionReason}
                  onChange={(event) => setActionReason(event.target.value)}
                  placeholder={ACTION_COPY[actionDialog.kind].reasonPlaceholder}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="admin-action-note">
                  {actionDialog.kind === 'note'
                    ? 'Nota (obrigatoria)'
                    : 'Nota adicional (opcional)'}
                </Label>
                <Textarea
                  id="admin-action-note"
                  value={actionNote}
                  onChange={(event) => setActionNote(event.target.value)}
                  rows={4}
                  placeholder="Detalhes operacionais para auditoria interna."
                />
              </div>

              {requiresDoubleConfirm ? (
                <div className="space-y-2">
                  <Label htmlFor="admin-action-confirm">
                    Confirmacao dupla (escreve {DOUBLE_CONFIRM_TOKEN})
                  </Label>
                  <Input
                    id="admin-action-confirm"
                    value={actionConfirmText}
                    onChange={(event) => setActionConfirmText(event.target.value)}
                    placeholder={DOUBLE_CONFIRM_TOKEN}
                  />
                </div>
              ) : null}
            </div>
          )}

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={closeActionDialog}
              disabled={isActionPending}
            >
              Cancelar
            </Button>
            <Button
              type="button"
              onClick={handleActionSubmit}
              disabled={isActionPending || !actionDialog || !isDoubleConfirmValid}
            >
              {isActionPending ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
              {actionDialog ? ACTION_COPY[actionDialog.kind].confirmLabel : 'Confirmar'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog
        open={Boolean(historyUser)}
        onOpenChange={(open) => (!open ? closeHistoryDialog() : null)}
      >
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              Historico de moderacao
              {historyUser ? ` - ${historyUser.username}` : ''}
            </DialogTitle>
            <DialogDescription>Eventos auditados para este utilizador.</DialogDescription>
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
              Sem eventos de moderacao registados.
            </div>
          ) : (
            <div className="space-y-3">
              {historyQuery.data?.items.map((event) => (
                <div key={event.id} className="rounded-md border border-border/70 p-3">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <Badge variant="outline">{MODERATION_ACTION_LABEL[event.action]}</Badge>
                    <span className="text-xs text-muted-foreground">
                      {formatDateTime(event.createdAt)}
                    </span>
                  </div>
                  <p className="mt-2 text-sm">{event.reason}</p>
                  {event.note && (
                    <p className="mt-1 text-xs text-muted-foreground">Nota: {event.note}</p>
                  )}
                  <p className="mt-1 text-xs text-muted-foreground">
                    Estado: {event.fromStatus ? STATUS_LABEL[event.fromStatus] : '-'}
                    {' -> '}
                    {event.toStatus ? STATUS_LABEL[event.toStatus] : '-'}
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Autor:{' '}
                    {event.actor?.name || event.actor?.username || event.actor?.email || 'N/A'}
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
                  type="button"
                  size="sm"
                  variant="outline"
                  disabled={historyQuery.data.pagination.page <= 1}
                  onClick={() => setHistoryPage((prev) => Math.max(prev - 1, 1))}
                >
                  Anterior
                </Button>
                <Button
                  type="button"
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
        open={Boolean(trustProfileUser)}
        onOpenChange={(open) => (!open ? closeTrustProfileDialog() : null)}
      >
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>
              Trust profile
              {trustProfileUser ? ` - ${trustProfileUser.username}` : ''}
            </DialogTitle>
            <DialogDescription>
              Sintese operacional pronta para UX: score, risco, recomendacao e barreiras ativas.
            </DialogDescription>
          </DialogHeader>

          {trustProfileQuery.isLoading ? (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" />A carregar trust profile...
            </div>
          ) : trustProfileQuery.isError ? (
            <div className="rounded-md border border-destructive/40 bg-destructive/5 p-3 text-sm text-destructive">
              {getErrorMessage(trustProfileQuery.error)}
            </div>
          ) : trustProfileQuery.data ? (
            <div className="space-y-4">
              <div className="rounded-xl border border-border/70 bg-gradient-to-r from-slate-50 via-white to-sky-50 p-4 dark:from-slate-950 dark:via-slate-950 dark:to-slate-900">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="space-y-2">
                    <p className="text-sm font-semibold">
                      {trustProfileQuery.data.user.name} · @{trustProfileQuery.data.user.username}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {trustProfileQuery.data.trustSignals ? (
                        <>
                          <RiskLevelBadge
                            riskLevel={trustProfileQuery.data.trustSignals.riskLevel}
                            score={trustProfileQuery.data.trustSignals.trustScore}
                          />
                          <TrustRecommendationBadge
                            action={trustProfileQuery.data.trustSignals.recommendedAction}
                          />
                        </>
                      ) : (
                        <Badge variant="secondary">Sem trust signals</Badge>
                      )}
                    </div>
                  </div>
                  <div className="w-full max-w-xs">
                    <TrustScoreBar value={trustProfileQuery.data.trustSignals?.trustScore ?? 100} />
                  </div>
                </div>
              </div>

              <div className="grid gap-3 md:grid-cols-5">
                <Card>
                  <CardHeader className="pb-2">
                    <CardDescription>Reports abertos</CardDescription>
                    <CardTitle className="text-2xl">
                      {trustProfileQuery.data.trustSignals?.summary.openReports ?? 0}
                    </CardTitle>
                  </CardHeader>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardDescription>Targets criticos</CardDescription>
                    <CardTitle className="text-2xl">
                      {trustProfileQuery.data.trustSignals?.summary.criticalTargets ?? 0}
                    </CardTitle>
                  </CardHeader>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardDescription>Ocultos/restritos</CardDescription>
                    <CardTitle className="text-2xl">
                      {(trustProfileQuery.data.trustSignals?.summary.hiddenItems ?? 0) +
                        (trustProfileQuery.data.trustSignals?.summary.restrictedItems ?? 0)}
                    </CardTitle>
                  </CardHeader>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardDescription>Creator controls 30d</CardDescription>
                    <CardTitle className="text-2xl">
                      {trustProfileQuery.data.trustSignals?.summary
                        .recentCreatorControlActions30d ?? 0}
                    </CardTitle>
                  </CardHeader>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardDescription>False positives 30d</CardDescription>
                    <CardTitle className="text-2xl">
                      {trustProfileQuery.data.trustSignals?.summary.falsePositiveEvents30d ?? 0}
                    </CardTitle>
                  </CardHeader>
                </Card>
              </div>

              <div className="grid gap-4 md:grid-cols-[1.2fr_0.8fr]">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Razoes e sinais</CardTitle>
                    <CardDescription>
                      Texto curto para triagem e renderizacao direta no frontend.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <TrustReasonList
                      trustSignals={trustProfileQuery.data.trustSignals}
                      maxItems={6}
                    />
                    <div className="flex flex-wrap gap-1.5">
                      {(trustProfileQuery.data.trustSignals?.flags ?? []).map((flag) => (
                        <Badge key={flag} variant="outline">
                          {flag}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Barreiras ativas</CardTitle>
                    <CardDescription>Estado operacional atual do creator.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <CreatorControlsSummary
                      controls={trustProfileQuery.data.user.creatorControls}
                    />
                    <div className="space-y-1 text-xs text-muted-foreground">
                      <p>
                        Atualizado:{' '}
                        {formatDateTime(trustProfileQuery.data.user.creatorControls.updatedAt)}
                      </p>
                      <p>
                        Cooldown ate:{' '}
                        {formatDateTime(trustProfileQuery.data.user.creatorControls.cooldownUntil)}
                      </p>
                      <p>
                        Recomendacao:{' '}
                        {
                          TRUST_RECOMMENDATION_LABEL[
                            trustProfileQuery.data.trustSignals?.recommendedAction ?? 'none'
                          ]
                        }
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          ) : (
            <div className="rounded-md border border-dashed border-border p-6 text-center text-sm text-muted-foreground">
              Sem trust profile disponivel.
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Dialog
        open={Boolean(creatorControlDialog)}
        onOpenChange={(open) => (!open ? closeCreatorControlDialog() : null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              Controlos do creator
              {creatorControlDialog ? ` - ${creatorControlDialog.user.username}` : ''}
            </DialogTitle>
            <DialogDescription>
              Aplica barreiras operacionais sem suspender a conta completa.
            </DialogDescription>
          </DialogHeader>

          {creatorControlDialog ? (
            <div className="space-y-4">
              <div className="rounded-md border border-border/70 bg-muted/20 p-3">
                <div className="flex flex-wrap gap-2">
                  {creatorControlDialog.user.trustSignals ? (
                    <>
                      <RiskLevelBadge
                        riskLevel={creatorControlDialog.user.trustSignals.riskLevel}
                        score={creatorControlDialog.user.trustSignals.trustScore}
                      />
                      <TrustRecommendationBadge
                        action={creatorControlDialog.user.trustSignals.recommendedAction}
                      />
                    </>
                  ) : (
                    <Badge variant="secondary">Sem trust signals</Badge>
                  )}
                </div>
                <div className="mt-3">
                  <CreatorControlsSummary controls={creatorControlDialog.user.creatorControls} />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Acao</Label>
                <Select
                  value={creatorControlAction}
                  onValueChange={(value) => {
                    const nextAction = value as AdminCreatorControlAction
                    setCreatorControlAction(nextAction)
                    setCreatorControlReason(CREATOR_CONTROL_REASON_DEFAULT[nextAction])
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleciona a acao" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(CREATOR_CONTROL_ACTION_LABEL).map(([value, label]) => (
                      <SelectItem key={value} value={value}>
                        {label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {creatorControlAction === 'set_cooldown' ? (
                <div className="space-y-2">
                  <Label htmlFor="creator-cooldown-hours">Cooldown (horas)</Label>
                  <Input
                    id="creator-cooldown-hours"
                    type="number"
                    min={1}
                    value={creatorControlCooldownHours}
                    onChange={(event) => setCreatorControlCooldownHours(event.target.value)}
                  />
                </div>
              ) : null}

              <div className="space-y-2">
                <Label htmlFor="creator-control-reason">Motivo</Label>
                <Input
                  id="creator-control-reason"
                  value={creatorControlReason}
                  onChange={(event) => setCreatorControlReason(event.target.value)}
                  placeholder="Motivo operacional"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="creator-control-note">Nota operacional (opcional)</Label>
                <Textarea
                  id="creator-control-note"
                  rows={4}
                  value={creatorControlNote}
                  onChange={(event) => setCreatorControlNote(event.target.value)}
                  placeholder="Contexto adicional para historico e auditoria."
                />
              </div>
            </div>
          ) : null}

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => closeCreatorControlDialog()}
              disabled={isCreatorControlPending}
            >
              Cancelar
            </Button>
            <Button
              type="button"
              onClick={handleCreatorControlSubmit}
              disabled={isCreatorControlPending || !creatorControlDialog}
            >
              {isCreatorControlPending ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
              Aplicar controlo
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
