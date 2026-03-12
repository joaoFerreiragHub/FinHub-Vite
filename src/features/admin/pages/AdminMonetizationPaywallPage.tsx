import { useMemo, useState } from 'react'
import { RefreshCw, ShieldCheck, ShieldOff } from 'lucide-react'
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
} from '@/components/ui'
import { useAuthStore } from '@/features/auth/stores/useAuthStore'
import { getErrorMessage } from '@/lib/api/client'
import { cn } from '@/lib/utils'
import { hasAdminScope } from '../lib/access'
import {
  useActivateAdminContentAccessPolicy,
  useAdminContentAccessPolicies,
  useDeactivateAdminContentAccessPolicy,
} from '../hooks/useAdminContentAccessPolicies'
import type {
  AdminContentAccessPolicyContentType,
  AdminContentAccessPolicyRequiredRole,
} from '../types/adminContentAccessPolicy'

const formatDateTime = (value: string | null): string => {
  if (!value) return '-'
  const parsed = new Date(value)
  if (Number.isNaN(parsed.getTime())) return '-'
  return new Intl.DateTimeFormat('pt-PT', {
    dateStyle: 'short',
    timeStyle: 'short',
  }).format(parsed)
}

const toFilterParam = <T extends string>(value: string): T | undefined =>
  value === 'all' ? undefined : (value as T)

interface AdminMonetizationPaywallPageProps {
  embedded?: boolean
}

export default function AdminMonetizationPaywallPage({
  embedded = false,
}: AdminMonetizationPaywallPageProps) {
  const user = useAuthStore((state) => state.user)
  const canRead = hasAdminScope(user, 'admin.content.read')
  const canWrite = hasAdminScope(user, 'admin.content.moderate') && !user?.adminReadOnly

  const [activeFilter, setActiveFilter] = useState<'all' | 'true' | 'false'>('all')
  const [requiredRoleFilter, setRequiredRoleFilter] = useState<
    'all' | AdminContentAccessPolicyRequiredRole
  >('all')
  const [contentTypeFilter, setContentTypeFilter] = useState<
    'all' | AdminContentAccessPolicyContentType
  >('all')
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)

  const query = useMemo(
    () => ({
      page,
      limit: 12,
      active: activeFilter === 'all' ? undefined : activeFilter === 'true',
      requiredRole: toFilterParam<AdminContentAccessPolicyRequiredRole>(requiredRoleFilter),
      contentType: toFilterParam<AdminContentAccessPolicyContentType>(contentTypeFilter),
      search: search.trim() || undefined,
    }),
    [activeFilter, contentTypeFilter, page, requiredRoleFilter, search],
  )

  const listQuery = useAdminContentAccessPolicies(query, { enabled: canRead })
  const activateMutation = useActivateAdminContentAccessPolicy()
  const deactivateMutation = useDeactivateAdminContentAccessPolicy()

  const isPending = activateMutation.isPending || deactivateMutation.isPending

  const togglePolicy = async (policyId: string, active: boolean) => {
    try {
      if (active) {
        const response = await deactivateMutation.mutateAsync({
          policyId,
          changeReason: 'deactivated_via_monetization_ui',
        })
        toast.success(response.message)
      } else {
        const response = await activateMutation.mutateAsync({
          policyId,
          changeReason: 'activated_via_monetization_ui',
        })
        toast.success(response.message)
      }
    } catch (error) {
      toast.error(getErrorMessage(error))
    }
  }

  return (
    <div className={cn('space-y-6', embedded ? 'pt-2' : '')}>
      {!embedded ? (
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Monetizacao · Paywall</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Gestao de policies de acesso premium por tipo de conteudo.
          </p>
        </div>
      ) : null}

      {!canRead ? (
        <Card className="border-amber-500/40 bg-amber-500/5">
          <CardContent className="pt-6 text-sm text-muted-foreground">
            Sem permissao para leitura de paywall (`admin.content.read`).
          </CardContent>
        </Card>
      ) : null}

      <Card>
        <CardHeader>
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <CardTitle className="text-base">Policies de acesso</CardTitle>
              <CardDescription>
                Filtra por estado, role requerida e tipo de conteudo.
              </CardDescription>
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
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <Select
              value={activeFilter}
              onValueChange={(value) => {
                setActiveFilter(value as 'all' | 'true' | 'false')
                setPage(1)
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="true">Ativo</SelectItem>
                <SelectItem value="false">Inativo</SelectItem>
              </SelectContent>
            </Select>

            <Select
              value={requiredRoleFilter}
              onValueChange={(value) => {
                setRequiredRoleFilter(value as 'all' | AdminContentAccessPolicyRequiredRole)
                setPage(1)
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Role requerida" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas as roles</SelectItem>
                <SelectItem value="premium">Premium</SelectItem>
                <SelectItem value="free">Free</SelectItem>
              </SelectContent>
            </Select>

            <Select
              value={contentTypeFilter}
              onValueChange={(value) => {
                setContentTypeFilter(value as 'all' | AdminContentAccessPolicyContentType)
                setPage(1)
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Tipo de conteudo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os tipos</SelectItem>
                <SelectItem value="article">Artigo</SelectItem>
                <SelectItem value="video">Video</SelectItem>
                <SelectItem value="course">Curso</SelectItem>
                <SelectItem value="live">Live</SelectItem>
                <SelectItem value="podcast">Podcast</SelectItem>
                <SelectItem value="book">Livro</SelectItem>
              </SelectContent>
            </Select>

            <Input
              value={search}
              onChange={(event) => {
                setSearch(event.target.value)
                setPage(1)
              }}
              placeholder="Pesquisar code/label..."
            />
          </div>

          {listQuery.isLoading ? (
            <div className="space-y-2">
              <div className="h-20 animate-pulse rounded-md bg-muted" />
              <div className="h-20 animate-pulse rounded-md bg-muted" />
            </div>
          ) : (listQuery.data?.items.length ?? 0) === 0 ? (
            <p className="rounded-md border border-dashed border-border p-4 text-sm text-muted-foreground">
              Sem policies para os filtros selecionados.
            </p>
          ) : (
            <div className="space-y-3">
              {listQuery.data?.items.map((policy) => (
                <div key={policy.id} className="rounded-md border border-border/70 p-3">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge variant={policy.active ? 'secondary' : 'outline'}>
                        {policy.active ? 'Ativa' : 'Inativa'}
                      </Badge>
                      <Badge variant="outline">{policy.access.requiredRole}</Badge>
                      <Badge variant="outline">Prioridade {policy.priority}</Badge>
                      <Badge variant="outline">v{policy.version}</Badge>
                    </div>
                    <span className="text-xs text-muted-foreground">
                      Atualizada: {formatDateTime(policy.updatedAt)}
                    </span>
                  </div>

                  <p className="mt-2 text-sm font-semibold">{policy.label}</p>
                  <p className="text-xs text-muted-foreground">{policy.code}</p>
                  {policy.description ? (
                    <p className="mt-1 text-sm text-muted-foreground">{policy.description}</p>
                  ) : null}

                  <div className="mt-2 flex flex-wrap gap-1">
                    {policy.match.contentTypes.map((contentType) => (
                      <Badge key={`${policy.id}-${contentType}`} variant="outline" className="text-[10px]">
                        {contentType}
                      </Badge>
                    ))}
                    {policy.match.featuredOnly ? (
                      <Badge variant="outline" className="text-[10px]">
                        featured-only
                      </Badge>
                    ) : null}
                  </div>

                  <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
                    <p className="text-xs text-muted-foreground">
                      Historico: {policy.historyCount} | Teaser:{' '}
                      {policy.access.teaserAllowed ? 'on' : 'off'}
                    </p>
                    <Button
                      type="button"
                      size="sm"
                      variant={policy.active ? 'outline' : 'default'}
                      onClick={() => togglePolicy(policy.id, policy.active)}
                      disabled={!canWrite || isPending}
                    >
                      {policy.active ? (
                        <>
                          <ShieldOff className="h-4 w-4" />
                          Desativar
                        </>
                      ) : (
                        <>
                          <ShieldCheck className="h-4 w-4" />
                          Ativar
                        </>
                      )}
                    </Button>
                  </div>
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
    </div>
  )
}

