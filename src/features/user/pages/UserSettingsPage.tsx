import { useMemo, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Loader2, RefreshCcw, ShieldCheck, ShieldX } from 'lucide-react'
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
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Textarea,
} from '@/components/ui'
import { useAuthStore } from '@/features/auth/stores/useAuthStore'
import { UserRole } from '@/features/auth/types'
import { assistedSessionService } from '@/features/auth/services/assistedSessionService'
import {
  useCancelMyEditorialClaim,
  useCreateMyEditorialClaim,
  useMyEditorialClaims,
} from '@/features/user/hooks/useEditorialClaims'
import type {
  EditorialClaimStatus,
  EditorialClaimTargetType,
} from '@/features/user/services/editorialClaimsService'
import { getErrorMessage } from '@/lib/api/client'

const formatDateTime = (value: string | null): string => {
  if (!value) return '-'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return '-'
  return new Intl.DateTimeFormat('pt-PT', {
    dateStyle: 'short',
    timeStyle: 'short',
  }).format(date)
}

const CLAIM_STATUS_LABEL: Record<EditorialClaimStatus, string> = {
  pending: 'Pendente',
  approved: 'Aprovado',
  rejected: 'Rejeitado',
  cancelled: 'Cancelado',
}

const CLAIM_TARGET_LABEL: Record<EditorialClaimTargetType, string> = {
  article: 'Artigo',
  video: 'Video',
  course: 'Curso',
  live: 'Live',
  podcast: 'Podcast',
  book: 'Livro',
  directory_entry: 'Diretorio',
}

const DEFAULT_CLAIM_FORM: {
  targetType: EditorialClaimTargetType
  targetId: string
  reason: string
  note: string
  evidenceLinks: string
} = {
  targetType: 'directory_entry',
  targetId: '',
  reason: '',
  note: '',
  evidenceLinks: '',
}

const parseEvidenceLinks = (value: string): string[] =>
  value
    .split(/\r?\n|,/)
    .map((item) => item.trim())
    .filter((item) => item.length > 0)

export default function UserSettingsPage() {
  const queryClient = useQueryClient()
  const authUser = useAuthStore((state) => state.user)
  const canManageClaims = authUser?.role === UserRole.CREATOR || authUser?.role === UserRole.ADMIN

  const [claimStatus, setClaimStatus] = useState<EditorialClaimStatus | 'all'>('all')
  const [claimPage, setClaimPage] = useState(1)
  const [claimForm, setClaimForm] = useState(DEFAULT_CLAIM_FORM)

  const pendingQuery = useQuery({
    queryKey: ['auth', 'assisted-sessions', 'pending'],
    queryFn: assistedSessionService.listPending,
  })

  const activeQuery = useQuery({
    queryKey: ['auth', 'assisted-sessions', 'active'],
    queryFn: assistedSessionService.listActive,
  })

  const claimQuery = useMemo(() => {
    const query: {
      page: number
      limit: number
      status?: EditorialClaimStatus
    } = {
      page: claimPage,
      limit: 8,
    }

    if (claimStatus !== 'all') {
      query.status = claimStatus
    }

    return query
  }, [claimPage, claimStatus])

  const claimsQuery = useMyEditorialClaims(claimQuery, { enabled: canManageClaims })
  const createClaimMutation = useCreateMyEditorialClaim()
  const cancelClaimMutation = useCancelMyEditorialClaim()

  const consentMutation = useMutation({
    mutationFn: ({ sessionId, decision }: { sessionId: string; decision: 'approve' | 'decline' }) =>
      assistedSessionService.respondConsent(sessionId, { decision }),
    onSuccess: (result) => {
      toast.success(result.message)
      queryClient.invalidateQueries({ queryKey: ['auth', 'assisted-sessions'] })
    },
    onError: (error) => {
      toast.error(getErrorMessage(error))
    },
  })

  const revokeMutation = useMutation({
    mutationFn: (sessionId: string) =>
      assistedSessionService.revoke(sessionId, { reason: 'Revogado pelo utilizador.' }),
    onSuccess: (result) => {
      toast.success(result.message)
      queryClient.invalidateQueries({ queryKey: ['auth', 'assisted-sessions'] })
    },
    onError: (error) => {
      toast.error(getErrorMessage(error))
    },
  })

  const isLoading = pendingQuery.isLoading || activeQuery.isLoading

  const submitClaim = async () => {
    try {
      await createClaimMutation.mutateAsync({
        targetType: claimForm.targetType,
        targetId: claimForm.targetId,
        reason: claimForm.reason,
        note: claimForm.note,
        evidenceLinks: parseEvidenceLinks(claimForm.evidenceLinks),
      })
      toast.success('Claim enviado com sucesso.')
      setClaimForm((prev) => ({ ...DEFAULT_CLAIM_FORM, targetType: prev.targetType }))
      setClaimPage(1)
    } catch (error) {
      toast.error(getErrorMessage(error))
    }
  }

  const cancelClaim = async (claimId: string) => {
    try {
      await cancelClaimMutation.mutateAsync({
        claimId,
        input: {
          note: 'Cancelado pelo creator.',
        },
      })
      toast.success('Claim cancelado com sucesso.')
    } catch (error) {
      toast.error(getErrorMessage(error))
    }
  }

  return (
    <div className="mx-auto w-full max-w-5xl space-y-6 px-4 py-6 sm:px-6">
      <div className="space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight">Configuracoes da conta</h1>
        <p className="text-sm text-muted-foreground">
          Centro de consentimento para sessoes assistidas de suporte.
        </p>
      </div>

      <div className="flex gap-2">
        <Button
          type="button"
          variant="outline"
          onClick={() => {
            pendingQuery.refetch()
            activeQuery.refetch()
            if (canManageClaims) claimsQuery.refetch()
          }}
          disabled={
            pendingQuery.isFetching ||
            activeQuery.isFetching ||
            (canManageClaims && claimsQuery.isFetching)
          }
        >
          {pendingQuery.isFetching || activeQuery.isFetching || claimsQuery.isFetching ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <RefreshCcw className="h-4 w-4" />
          )}
          Atualizar
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Claims editoriais</CardTitle>
          <CardDescription>
            Fluxo de claim para ownership de ativos editoriais (conteudos e diretorios claimable).
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {!canManageClaims ? (
            <div className="rounded-md border border-dashed border-border p-6 text-center text-sm text-muted-foreground">
              Disponivel apenas para perfis creator/admin.
            </div>
          ) : (
            <>
              <div className="grid gap-3 md:grid-cols-2">
                <div>
                  <Label>Tipo alvo</Label>
                  <Select
                    value={claimForm.targetType}
                    onValueChange={(value) =>
                      setClaimForm((prev) => ({
                        ...prev,
                        targetType: value as EditorialClaimTargetType,
                      }))
                    }
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="directory_entry">Diretorio</SelectItem>
                      <SelectItem value="article">Artigo</SelectItem>
                      <SelectItem value="video">Video</SelectItem>
                      <SelectItem value="course">Curso</SelectItem>
                      <SelectItem value="live">Live</SelectItem>
                      <SelectItem value="podcast">Podcast</SelectItem>
                      <SelectItem value="book">Livro</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="claim-target-id">Target ID</Label>
                  <Input
                    id="claim-target-id"
                    value={claimForm.targetId}
                    onChange={(event) =>
                      setClaimForm((prev) => ({ ...prev, targetId: event.target.value }))
                    }
                    placeholder="ObjectId do ativo alvo"
                  />
                </div>
                <div className="md:col-span-2">
                  <Label htmlFor="claim-reason">Motivo</Label>
                  <Input
                    id="claim-reason"
                    value={claimForm.reason}
                    onChange={(event) =>
                      setClaimForm((prev) => ({ ...prev, reason: event.target.value }))
                    }
                    placeholder="Porque este recurso deve ser transferido para ti"
                  />
                </div>
                <div className="md:col-span-2">
                  <Label htmlFor="claim-note">Nota (opcional)</Label>
                  <Textarea
                    id="claim-note"
                    value={claimForm.note}
                    onChange={(event) =>
                      setClaimForm((prev) => ({ ...prev, note: event.target.value }))
                    }
                    rows={2}
                  />
                </div>
                <div className="md:col-span-2">
                  <Label htmlFor="claim-evidence">Evidencias (opcional, URL por linha)</Label>
                  <Textarea
                    id="claim-evidence"
                    value={claimForm.evidenceLinks}
                    onChange={(event) =>
                      setClaimForm((prev) => ({ ...prev, evidenceLinks: event.target.value }))
                    }
                    rows={2}
                    placeholder="https://site.com/prova-1"
                  />
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                <Button onClick={submitClaim} disabled={createClaimMutation.isPending}>
                  {createClaimMutation.isPending ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <ShieldCheck className="h-4 w-4" />
                  )}
                  Enviar claim
                </Button>

                <Select
                  value={claimStatus}
                  onValueChange={(value) => {
                    setClaimStatus(value as EditorialClaimStatus | 'all')
                    setClaimPage(1)
                  }}
                >
                  <SelectTrigger className="w-52">
                    <SelectValue placeholder="Estado" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos os estados</SelectItem>
                    <SelectItem value="pending">Pendentes</SelectItem>
                    <SelectItem value="approved">Aprovados</SelectItem>
                    <SelectItem value="rejected">Rejeitados</SelectItem>
                    <SelectItem value="cancelled">Cancelados</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {claimsQuery.isLoading ? (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Loader2 className="h-4 w-4 animate-spin" />A carregar claims...
                </div>
              ) : claimsQuery.isError ? (
                <div className="rounded-md border border-destructive/40 bg-destructive/5 p-3 text-sm text-destructive">
                  {getErrorMessage(claimsQuery.error)}
                </div>
              ) : (claimsQuery.data?.items.length ?? 0) === 0 ? (
                <div className="rounded-md border border-dashed border-border p-6 text-center text-sm text-muted-foreground">
                  Sem claims para os filtros atuais.
                </div>
              ) : (
                <div className="space-y-3">
                  {claimsQuery.data?.items.map((claim) => (
                    <div key={claim.id} className="rounded-md border border-border/70 p-3">
                      <div className="flex flex-wrap items-start justify-between gap-2">
                        <div className="space-y-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <Badge variant="outline">{CLAIM_TARGET_LABEL[claim.targetType]}</Badge>
                            <Badge
                              variant={
                                claim.status === 'approved'
                                  ? 'secondary'
                                  : claim.status === 'rejected'
                                    ? 'destructive'
                                    : 'outline'
                              }
                            >
                              {CLAIM_STATUS_LABEL[claim.status]}
                            </Badge>
                            <Badge variant="outline">ID: {claim.targetId}</Badge>
                          </div>
                          <p className="text-sm">{claim.reason}</p>
                          <p className="text-xs text-muted-foreground">
                            Pedido: {formatDateTime(claim.createdAt)} | Revisao:{' '}
                            {formatDateTime(claim.reviewedAt)}
                          </p>
                        </div>

                        {claim.status === 'pending' ? (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => cancelClaim(claim.id)}
                            disabled={cancelClaimMutation.isPending}
                          >
                            <ShieldX className="h-4 w-4" />
                            Cancelar
                          </Button>
                        ) : null}
                      </div>
                    </div>
                  ))}

                  {(claimsQuery.data?.pagination.pages ?? 1) > 1 ? (
                    <div className="flex items-center justify-between border-t border-border pt-2">
                      <p className="text-xs text-muted-foreground">
                        Pagina {claimsQuery.data?.pagination.page} de{' '}
                        {claimsQuery.data?.pagination.pages}
                      </p>
                      <div className="flex gap-2">
                        <Button
                          type="button"
                          size="sm"
                          variant="outline"
                          onClick={() => setClaimPage((prev) => Math.max(1, prev - 1))}
                          disabled={(claimsQuery.data?.pagination.page ?? 1) <= 1}
                        >
                          Anterior
                        </Button>
                        <Button
                          type="button"
                          size="sm"
                          variant="outline"
                          onClick={() =>
                            setClaimPage((prev) =>
                              Math.min(claimsQuery.data?.pagination.pages ?? prev, prev + 1),
                            )
                          }
                          disabled={
                            (claimsQuery.data?.pagination.page ?? 1) >=
                            (claimsQuery.data?.pagination.pages ?? 1)
                          }
                        >
                          Seguinte
                        </Button>
                      </div>
                    </div>
                  ) : null}
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Pedidos pendentes</CardTitle>
          <CardDescription>
            Sem aprovacao explicita nao existe sessao assistida. Aprovacao valida por tempo curto.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {isLoading ? (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" />A carregar pedidos...
            </div>
          ) : pendingQuery.isError ? (
            <div className="rounded-md border border-destructive/40 bg-destructive/5 p-3 text-sm text-destructive">
              {getErrorMessage(pendingQuery.error)}
            </div>
          ) : (pendingQuery.data?.items.length ?? 0) === 0 ? (
            <div className="rounded-md border border-dashed border-border p-6 text-center text-sm text-muted-foreground">
              Sem pedidos pendentes.
            </div>
          ) : (
            pendingQuery.data?.items.map((session) => (
              <div key={session.id} className="rounded-md border border-border/70 p-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="space-y-1">
                    <p className="text-sm font-medium">
                      Pedido de @{session.adminUser?.username ?? 'admin'}
                    </p>
                    <p className="text-xs text-muted-foreground">{session.reason}</p>
                    <p className="text-xs text-muted-foreground">
                      Expira em: {formatDateTime(session.consentExpiresAt)}
                    </p>
                  </div>
                  <Badge variant="outline">Pendente</Badge>
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  <Button
                    size="sm"
                    onClick={() =>
                      consentMutation.mutate({ sessionId: session.id, decision: 'approve' })
                    }
                    disabled={consentMutation.isPending}
                  >
                    <ShieldCheck className="h-4 w-4" />
                    Aprovar
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() =>
                      consentMutation.mutate({ sessionId: session.id, decision: 'decline' })
                    }
                    disabled={consentMutation.isPending}
                  >
                    <ShieldX className="h-4 w-4" />
                    Recusar
                  </Button>
                </div>
              </div>
            ))
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Sessoes assistidas ativas</CardTitle>
          <CardDescription>
            Sessao ativa mostra acesso de suporte em modo leitura. Podes revogar imediatamente.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {activeQuery.isError ? (
            <div className="rounded-md border border-destructive/40 bg-destructive/5 p-3 text-sm text-destructive">
              {getErrorMessage(activeQuery.error)}
            </div>
          ) : (activeQuery.data?.items.length ?? 0) === 0 ? (
            <div className="rounded-md border border-dashed border-border p-6 text-center text-sm text-muted-foreground">
              Sem sessoes assistidas ativas.
            </div>
          ) : (
            activeQuery.data?.items.map((session) => (
              <div key={session.id} className="rounded-md border border-border/70 p-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="space-y-1">
                    <p className="text-sm font-medium">
                      Sessao ativa com @{session.adminUser?.username ?? 'admin'}
                    </p>
                    <p className="text-xs text-muted-foreground">{session.reason}</p>
                    <p className="text-xs text-muted-foreground">
                      Expira em: {formatDateTime(session.sessionExpiresAt)}
                    </p>
                  </div>
                  <Badge variant="secondary">Ativa</Badge>
                </div>
                <div className="mt-3">
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => revokeMutation.mutate(session.id)}
                    disabled={revokeMutation.isPending}
                  >
                    <ShieldX className="h-4 w-4" />
                    Revogar agora
                  </Button>
                </div>
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  )
}
