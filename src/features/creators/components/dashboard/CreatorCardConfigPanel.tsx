import { useEffect, useMemo, useState } from 'react'
import { useMutation, useQuery } from '@tanstack/react-query'
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
  Switch,
} from '@/components/ui'
import { authService } from '@/features/auth/services/authService'
import { useAuthStore } from '@/features/auth/stores/useAuthStore'
import type { UserCreatorCardConfig } from '@/features/auth/types'
import { CreatorModal } from '@/features/creators/components/modals/CreatorModal'
import {
  fetchCreatorContentByType,
  type PublicCreatorContentItem,
} from '@/features/creators/services/publicCreatorsService'
import type { Creator } from '@/features/creators/types/creator'
import { getErrorMessage } from '@/lib/api/client'
import { useToast } from '@/shared/hooks/use-toast'

type ConfigToggleKey =
  | 'showWelcomeVideo'
  | 'showBio'
  | 'showCourses'
  | 'showArticles'
  | 'showProducts'
  | 'showWebsite'
  | 'showSocialLinks'
  | 'showRatings'

interface ContentOption {
  id: string
  title: string
  type: 'article' | 'course'
  href: string
}

const TOGGLE_OPTIONS: Array<{
  key: ConfigToggleKey
  label: string
  description: string
}> = [
  {
    key: 'showWelcomeVideo',
    label: 'Video de boas-vindas',
    description: 'Mostra ou esconde o video de apresentacao no modal.',
  },
  {
    key: 'showBio',
    label: 'Bio',
    description: 'Exibe a biografia resumida do criador.',
  },
  {
    key: 'showCourses',
    label: 'Cursos',
    description: 'Ativa a tab de cursos no cartao de visita.',
  },
  {
    key: 'showArticles',
    label: 'Artigos',
    description: 'Ativa a tab de artigos no cartao de visita.',
  },
  {
    key: 'showProducts',
    label: 'Produtos',
    description: 'Reserva para produtos futuros do creator.',
  },
  {
    key: 'showWebsite',
    label: 'Website',
    description: 'Mostra o link para website pessoal/profissional.',
  },
  {
    key: 'showSocialLinks',
    label: 'Redes sociais',
    description: 'Mostra links de redes sociais do criador.',
  },
  {
    key: 'showRatings',
    label: 'Avaliacoes',
    description: 'Ativa a tab de avaliacoes e feedback.',
  },
]

const buildInitialCardConfig = (
  currentConfig: UserCreatorCardConfig | undefined,
  hasWelcomeVideo: boolean,
): UserCreatorCardConfig => ({
  showWelcomeVideo: currentConfig?.showWelcomeVideo ?? hasWelcomeVideo,
  showBio: currentConfig?.showBio ?? true,
  showCourses: currentConfig?.showCourses ?? true,
  showArticles: currentConfig?.showArticles ?? true,
  showProducts: currentConfig?.showProducts ?? false,
  showWebsite: currentConfig?.showWebsite ?? true,
  showSocialLinks: currentConfig?.showSocialLinks ?? true,
  showRatings: currentConfig?.showRatings ?? true,
  featuredContentIds: Array.isArray(currentConfig?.featuredContentIds)
    ? currentConfig?.featuredContentIds.slice(0, 3)
    : [],
})

const toContentOptions = (
  items: PublicCreatorContentItem[],
  type: 'article' | 'course',
): ContentOption[] => {
  return items.map((item) => ({
    id: item.id,
    title: item.title,
    type,
    href: item.href,
  }))
}

const toCreatorSocialLinks = (socialLinks: {
  website?: string
  twitter?: string
  linkedin?: string
  instagram?: string
  youtube?: string
}) => {
  const links: Creator['socialMediaLinks'] = []

  if (socialLinks.website) {
    links.push({ platform: 'website', url: socialLinks.website })
  }
  if (socialLinks.twitter) {
    links.push({ platform: 'Twitter', url: socialLinks.twitter })
  }
  if (socialLinks.linkedin) {
    links.push({ platform: 'LinkedIn', url: socialLinks.linkedin })
  }
  if (socialLinks.instagram) {
    links.push({ platform: 'Instagram', url: socialLinks.instagram })
  }
  if (socialLinks.youtube) {
    links.push({ platform: 'YouTube', url: socialLinks.youtube })
  }

  return links
}

export function CreatorCardConfigPanel() {
  const user = useAuthStore((state) => state.user)
  const updateUser = useAuthStore((state) => state.updateUser)
  const { toastError, toastSuccess, toastWarning } = useToast()

  const hasWelcomeVideo = Boolean(user?.welcomeVideoUrl?.trim())
  const [cardConfig, setCardConfig] = useState<UserCreatorCardConfig>(() =>
    buildInitialCardConfig(user?.cardConfig, hasWelcomeVideo),
  )
  const [search, setSearch] = useState('')

  useEffect(() => {
    setCardConfig(buildInitialCardConfig(user?.cardConfig, hasWelcomeVideo))
  }, [user?.cardConfig, hasWelcomeVideo])

  const creatorId = user?.id ?? ''
  const articlesQuery = useQuery({
    queryKey: ['creator-card-config', 'articles', creatorId],
    queryFn: async () => fetchCreatorContentByType(creatorId, 'article', 50),
    enabled: Boolean(creatorId),
    staleTime: 60_000,
  })

  const coursesQuery = useQuery({
    queryKey: ['creator-card-config', 'courses', creatorId],
    queryFn: async () => fetchCreatorContentByType(creatorId, 'course', 50),
    enabled: Boolean(creatorId),
    staleTime: 60_000,
  })

  const featuredOptions = useMemo(() => {
    const options = [
      ...toContentOptions(articlesQuery.data?.items ?? [], 'article'),
      ...toContentOptions(coursesQuery.data?.items ?? [], 'course'),
    ]

    const deduped = new Map<string, ContentOption>()
    for (const option of options) {
      if (!deduped.has(option.id)) {
        deduped.set(option.id, option)
      }
    }

    return Array.from(deduped.values())
  }, [articlesQuery.data?.items, coursesQuery.data?.items])

  const selectedFeaturedIds = useMemo(
    () => cardConfig.featuredContentIds ?? [],
    [cardConfig.featuredContentIds],
  )

  const selectedFeaturedOptions = useMemo(() => {
    const optionMap = new Map(featuredOptions.map((option) => [option.id, option]))

    return selectedFeaturedIds.map((id) => {
      const existing = optionMap.get(id)
      if (existing) return existing

      return {
        id,
        title: id,
        type: 'article' as const,
        href: `/hub/articles/${encodeURIComponent(id)}`,
      }
    })
  }, [featuredOptions, selectedFeaturedIds])

  const filteredOptions = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase()
    if (!normalizedSearch) return featuredOptions

    return featuredOptions.filter((option) => {
      return (
        option.title.toLowerCase().includes(normalizedSearch) ||
        option.id.toLowerCase().includes(normalizedSearch)
      )
    })
  }, [featuredOptions, search])

  const saveMutation = useMutation({
    mutationFn: () => authService.updateMyProfile({ cardConfig }),
    onSuccess: (response) => {
      updateUser({
        cardConfig: response.user.cardConfig ?? undefined,
        welcomeVideoUrl: response.user.welcomeVideoUrl ?? undefined,
      })
      toastSuccess(response.message || 'Cartao de visita atualizado com sucesso.')
    },
    onError: (error) => {
      toastError(getErrorMessage(error))
    },
  })

  const toggleConfigFlag = (key: ConfigToggleKey, checked: boolean) => {
    setCardConfig((previous) => ({
      ...previous,
      [key]: checked,
    }))
  }

  const toggleFeaturedContent = (contentId: string) => {
    const current = cardConfig.featuredContentIds ?? []
    const isSelected = current.includes(contentId)

    if (!isSelected && current.length >= 3) {
      toastWarning('So podes selecionar ate 3 conteudos em destaque.')
      return
    }

    setCardConfig((previous) => {
      const previousSelection = previous.featuredContentIds ?? []
      if (previousSelection.includes(contentId)) {
        return {
          ...previous,
          featuredContentIds: previousSelection.filter((id) => id !== contentId),
        }
      }

      return {
        ...previous,
        featuredContentIds: [...previousSelection, contentId],
      }
    })
  }

  const previewCreator = useMemo<Creator | null>(() => {
    if (!user) return null

    const fallbackName = user.name?.trim() || user.username
    const [firstname, ...lastnameParts] = fallbackName.split(/\s+/)
    const lastname = lastnameParts.join(' ')

    const previewCourses = selectedFeaturedOptions
      .filter((option) => option.type === 'course')
      .map((option) => ({
        coursesId: option.id,
        courseName: option.title,
        bannerImage: '/placeholder-course.jpg',
        purchaseLink: option.href,
        timestamp: new Date().toISOString(),
      }))

    const previewArticles = selectedFeaturedOptions
      .filter((option) => option.type === 'article')
      .map((option) => ({
        articleId: option.id,
        timestamp: new Date().toISOString(),
      }))

    return {
      _id: user.id,
      username: user.username,
      email: user.email,
      firstname,
      lastname,
      role: user.role,
      isPremium: user.role === 'premium',
      topics: user.favoriteTopics ?? ['Financas'],
      termsAccepted: true,
      termsOfServiceAgreement: true,
      contentLicenseAgreement: true,
      paymentTermsAgreement: true,
      bio: user.bio,
      website: user.socialLinks?.website,
      cardConfig,
      socialMediaLinks: toCreatorSocialLinks(user.socialLinks ?? {}),
      followers: [],
      famous: [],
      content: [],
      averageRating: 4.4,
      welcomeVideo: user.welcomeVideoUrl ? [user.welcomeVideoUrl] : undefined,
      courses: previewCourses,
      articles: previewArticles,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    }
  }, [cardConfig, selectedFeaturedOptions, user])

  if (!user) {
    return null
  }

  const hasContentLoading = articlesQuery.isLoading || coursesQuery.isLoading
  const hasContentError = articlesQuery.isError || coursesQuery.isError

  return (
    <section className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Cartao de Visita</CardTitle>
          <CardDescription>
            Configura o que aparece no modal publico do teu perfil de creator.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2">
            {TOGGLE_OPTIONS.map((option) => (
              <div
                key={option.key}
                className="rounded-lg border border-border/60 p-3 transition-colors hover:bg-muted/30"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <Label htmlFor={`creator-card-config-${option.key}`}>{option.label}</Label>
                    <p className="mt-1 text-xs text-muted-foreground">{option.description}</p>
                  </div>
                  <Switch
                    id={`creator-card-config-${option.key}`}
                    checked={Boolean(cardConfig[option.key])}
                    onCheckedChange={(checked) => toggleConfigFlag(option.key, checked)}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="space-y-3">
            <div>
              <Label htmlFor="featured-content-search">Conteudo em destaque (maximo 3)</Label>
              <p className="text-xs text-muted-foreground">
                Pesquisa artigos e cursos para destacar no cartao de visita.
              </p>
            </div>

            <Input
              id="featured-content-search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Pesquisar por titulo ou ID..."
            />

            {hasContentLoading ? (
              <p className="text-sm text-muted-foreground">A carregar conteudos...</p>
            ) : hasContentError ? (
              <p className="text-sm text-destructive">
                Nao foi possivel carregar os conteudos para destaque.
              </p>
            ) : filteredOptions.length === 0 ? (
              <p className="text-sm text-muted-foreground">Sem resultados para a pesquisa atual.</p>
            ) : (
              <div className="max-h-56 overflow-y-auto rounded-lg border border-border/60">
                {filteredOptions.map((option) => {
                  const selected = selectedFeaturedIds.includes(option.id)

                  return (
                    <button
                      key={option.id}
                      type="button"
                      className="flex w-full items-center justify-between gap-3 border-b border-border/50 px-3 py-2 text-left text-sm last:border-b-0 hover:bg-muted/30"
                      onClick={() => toggleFeaturedContent(option.id)}
                    >
                      <div>
                        <p className="font-medium">{option.title}</p>
                        <p className="text-xs text-muted-foreground">{option.id}</p>
                      </div>
                      <Badge variant={selected ? 'default' : 'outline'}>
                        {option.type === 'article' ? 'Artigo' : 'Curso'}
                      </Badge>
                    </button>
                  )
                })}
              </div>
            )}

            <div className="flex flex-wrap gap-2">
              {selectedFeaturedOptions.map((option) => (
                <Badge key={`selected-${option.id}`} variant="secondary" className="gap-2">
                  {option.title}
                  <button
                    type="button"
                    className="text-xs"
                    onClick={() => toggleFeaturedContent(option.id)}
                    aria-label={`Remover ${option.title}`}
                  >
                    x
                  </button>
                </Badge>
              ))}
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <Button
              type="button"
              onClick={() => saveMutation.mutate()}
              disabled={saveMutation.isPending}
            >
              {saveMutation.isPending ? 'A guardar...' : 'Guardar configuracao'}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() =>
                setCardConfig(buildInitialCardConfig(user.cardConfig, hasWelcomeVideo))
              }
              disabled={saveMutation.isPending}
            >
              Repor valores atuais
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Preview ao vivo</CardTitle>
          <CardDescription>
            Visualizacao em modo leitura de como o modal publico vai aparecer.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {previewCreator ? (
            <CreatorModal open={true} onClose={() => {}} creator={previewCreator} previewMode />
          ) : null}
        </CardContent>
      </Card>
    </section>
  )
}

export default CreatorCardConfigPanel
