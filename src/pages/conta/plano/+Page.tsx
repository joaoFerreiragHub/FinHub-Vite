import {
  Badge,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui'
import { useAuthStore } from '@/features/auth/stores/useAuthStore'
import { UserRole } from '@/features/auth/types'
import { Helmet } from '@/lib/helmet'
import { useToast } from '@/shared/hooks'
import { UserAccountShell } from '@/shared/layouts/UserAccountShell'

const formatSubscriptionDate = (dateValue?: string): string => {
  if (!dateValue) return 'data indisponivel'

  const date = new Date(dateValue)
  if (Number.isNaN(date.getTime())) return 'data indisponivel'

  return new Intl.DateTimeFormat('pt-PT', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  }).format(date)
}

export function Page() {
  const user = useAuthStore((state) => state.user)
  const { toastInfo } = useToast()
  const isPremium = user?.role === UserRole.PREMIUM

  return (
    <>
      <Helmet>
        <title>O meu plano | FinHub</title>
      </Helmet>

      <UserAccountShell>
        <div className="mx-auto max-w-4xl space-y-6">
          <div>
            <h1 className="text-2xl font-bold text-foreground">O meu plano</h1>
            <p className="text-sm text-muted-foreground">
              Consulta o teu plano atual e as opcoes de subscricao.
            </p>
          </div>

          {isPremium ? (
            <Card className="border-emerald-500/40">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Badge className="bg-emerald-600 text-white hover:bg-emerald-600">
                    Plano Premium
                  </Badge>
                </CardTitle>
                <CardDescription>
                  Subscrito desde {formatSubscriptionDate(user?.createdAt)}.
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-4">
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Cursos e conteudos exclusivos sem limites.</li>
                  <li>• Ferramentas avancadas (FIRE, analise de stocks e dashboards premium).</li>
                  <li>• Experiencia sem anuncios.</li>
                </ul>

                <Button
                  type="button"
                  variant="outline"
                  onClick={() => toastInfo('Em breve - contacta support@finhub.pt')}
                >
                  Gerir subscricao
                </Button>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Badge variant="secondary">Plano Free</Badge>
                </CardTitle>
                <CardDescription>
                  Atualmente estas no plano gratuito, com acesso limitado a funcionalidades premium.
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-4">
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Sem acesso a conteudo Premium.</li>
                  <li>• Sem FIRE completo e cenarios avancados.</li>
                  <li>• Funcionalidades premium de analise bloqueadas.</li>
                </ul>

                <a
                  href="/precos"
                  className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
                >
                  Upgrade para Premium - 9EUR/mes
                </a>
              </CardContent>
            </Card>
          )}
        </div>
      </UserAccountShell>
    </>
  )
}
