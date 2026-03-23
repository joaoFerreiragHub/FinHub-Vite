import { useMemo, useState } from 'react'
import {
  Badge,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui'
import { AccountSettings } from '@/features/auth/components/settings'
import { useAuthStore } from '@/features/auth/stores/useAuthStore'
import { CreatorCardConfigPanel } from '@/features/creators/components/dashboard/CreatorCardConfigPanel'
import { CreatorProfileEditForm } from '@/features/creators/components/dashboard/CreatorProfileEditForm'
import { ProtectedRoute } from '@/shared/guards'
import { CreatorDashboardShell } from '@/shared/layouts'

const SOCIAL_PLATFORM_LABEL: Record<string, string> = {
  website: 'Website',
  twitter: 'Twitter/X',
  linkedin: 'LinkedIn',
  youtube: 'YouTube',
  instagram: 'Instagram',
}

function ConfiguracoesPage() {
  const user = useAuthStore((state) => state.user)
  const [editingPublicProfile, setEditingPublicProfile] = useState(false)

  const socialPreview = useMemo(() => {
    if (!user?.socialLinks) return []

    return Object.entries(user.socialLinks)
      .filter(([, url]) => typeof url === 'string' && url.trim().length > 0)
      .map(([platform, url]) => ({
        platform: SOCIAL_PLATFORM_LABEL[platform] ?? platform,
        url: String(url),
      }))
  }, [user?.socialLinks])

  const topicPreview = useMemo(
    () => (Array.isArray(user?.favoriteTopics) ? user.favoriteTopics : []),
    [user?.favoriteTopics],
  )

  return (
    <ProtectedRoute allowedRoles={['creator', 'admin']}>
      <CreatorDashboardShell>
        <div>
          <h1 className="text-2xl font-bold">Definicoes da Conta</h1>
          <p className="text-sm text-muted-foreground">
            Altera os teus dados, preferencias e definicoes de seguranca.
          </p>

          <div className="mt-8 space-y-8">
            <Card>
              <CardHeader>
                <CardTitle>Perfil Publico</CardTitle>
                <CardDescription>
                  Atualiza os dados publicos do teu perfil de creator (bio, redes e topicos).
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {!editingPublicProfile ? (
                  <div className="rounded-lg border border-border/60 bg-muted/20 p-4">
                    <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                      <div className="flex items-start gap-3">
                        {user?.avatar ? (
                          <img
                            src={user.avatar}
                            alt={user.name}
                            className="h-14 w-14 rounded-full object-cover"
                          />
                        ) : (
                          <span className="flex h-14 w-14 items-center justify-center rounded-full bg-primary text-lg font-semibold text-primary-foreground">
                            {user?.name?.charAt(0) ?? 'U'}
                          </span>
                        )}
                        <div>
                          <p className="text-base font-semibold">{user?.name ?? 'Sem nome'}</p>
                          <p className="text-sm text-muted-foreground">@{user?.username ?? '-'}</p>
                          <p className="mt-2 text-sm text-muted-foreground">
                            {user?.bio || 'Ainda sem bio publica.'}
                          </p>
                        </div>
                      </div>
                      <Button type="button" onClick={() => setEditingPublicProfile(true)}>
                        Editar
                      </Button>
                    </div>

                    <div className="mt-4 space-y-3">
                      <div>
                        <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                          Topicos
                        </p>
                        {topicPreview.length > 0 ? (
                          <div className="flex flex-wrap gap-2">
                            {topicPreview.map((topic) => (
                              <Badge key={topic} variant="outline">
                                {topic}
                              </Badge>
                            ))}
                          </div>
                        ) : (
                          <p className="text-sm text-muted-foreground">Sem topicos definidos.</p>
                        )}
                      </div>

                      <div>
                        <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                          Redes sociais
                        </p>
                        {socialPreview.length > 0 ? (
                          <div className="flex flex-wrap gap-2">
                            {socialPreview.map((item) => (
                              <a
                                key={`${item.platform}-${item.url}`}
                                href={item.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="rounded-full border border-border px-3 py-1 text-xs text-muted-foreground hover:text-foreground"
                              >
                                {item.platform}
                              </a>
                            ))}
                          </div>
                        ) : (
                          <p className="text-sm text-muted-foreground">
                            Sem redes sociais publicas.
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ) : (
                  <CreatorProfileEditForm
                    onCancel={() => setEditingPublicProfile(false)}
                    onSaved={() => setEditingPublicProfile(false)}
                  />
                )}
              </CardContent>
            </Card>

            <AccountSettings />
            <CreatorCardConfigPanel />
          </div>
        </div>
      </CreatorDashboardShell>
    </ProtectedRoute>
  )
}

export default {
  Page: ConfiguracoesPage,
}
