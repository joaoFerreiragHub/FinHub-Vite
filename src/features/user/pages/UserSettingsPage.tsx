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
} from '@/components/ui'
import { assistedSessionService } from '@/features/auth/services/assistedSessionService'
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

export default function UserSettingsPage() {
  const queryClient = useQueryClient()

  const pendingQuery = useQuery({
    queryKey: ['auth', 'assisted-sessions', 'pending'],
    queryFn: assistedSessionService.listPending,
  })

  const activeQuery = useQuery({
    queryKey: ['auth', 'assisted-sessions', 'active'],
    queryFn: assistedSessionService.listActive,
  })

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
          }}
          disabled={pendingQuery.isFetching || activeQuery.isFetching}
        >
          {pendingQuery.isFetching || activeQuery.isFetching ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <RefreshCcw className="h-4 w-4" />
          )}
          Atualizar
        </Button>
      </div>

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
