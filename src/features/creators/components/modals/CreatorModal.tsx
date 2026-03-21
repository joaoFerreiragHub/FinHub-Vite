// src/features/creators/components/modals/CreatorModal.tsx

import type { Creator as CreatorType } from '@/features/creators/types/creator'
import { useEffect, useMemo, useState } from 'react'
import { CreatorHeader } from './CreatorHeader'
import { CreatorCourses } from './CreatorCourses'
import { CreatorSocial } from './CreatorSocial'
import { CreatorRatings } from './CreatorRatings'
import {
  AspectRatio,
  Badge,
  Dialog,
  DialogContent,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui'
import { ReviewsDisplay } from '~/features/hub'

type CreatorModalTab = 'geral' | 'cursos' | 'artigos' | 'avaliacao'

interface CreatorModalProps {
  open: boolean
  onClose: () => void
  creator: CreatorType
  previewMode?: boolean
}

const resolveCardConfigFlag = (value: boolean | undefined, fallback = true): boolean => {
  if (typeof value === 'boolean') return value
  return fallback
}

const extractVideoId = (url: string) => {
  if (!url) return null

  try {
    const parsedUrl = new URL(url)
    const host = parsedUrl.hostname.toLowerCase()

    if (host.includes('youtu.be')) {
      const fromPath = parsedUrl.pathname.replace('/', '').trim()
      return fromPath || null
    }

    const queryVideoId = parsedUrl.searchParams.get('v')
    if (queryVideoId) return queryVideoId

    const match = parsedUrl.pathname.match(/\/embed\/([^/?]+)/)
    if (match?.[1]) return match[1]

    return null
  } catch {
    return null
  }
}

export function CreatorModal({ open, onClose, creator, previewMode = false }: CreatorModalProps) {
  const [tab, setTab] = useState<CreatorModalTab>('geral')

  const cardConfig = creator.cardConfig
  const showWelcomeVideo = resolveCardConfigFlag(cardConfig?.showWelcomeVideo, true)
  const showBio = resolveCardConfigFlag(cardConfig?.showBio, true)
  const showCourses = resolveCardConfigFlag(cardConfig?.showCourses, true)
  const showArticles = resolveCardConfigFlag(cardConfig?.showArticles, true)
  const showWebsite = resolveCardConfigFlag(cardConfig?.showWebsite, true)
  const showSocialLinks = resolveCardConfigFlag(cardConfig?.showSocialLinks, true)
  const showRatings = resolveCardConfigFlag(cardConfig?.showRatings, true)

  const featuredContentIds = Array.isArray(cardConfig?.featuredContentIds)
    ? cardConfig?.featuredContentIds.slice(0, 3)
    : []

  const availableTabs = useMemo<CreatorModalTab[]>(() => {
    const tabs: CreatorModalTab[] = ['geral']
    if (showCourses) tabs.push('cursos')
    if (showArticles) tabs.push('artigos')
    if (showRatings) tabs.push('avaliacao')
    return tabs
  }, [showCourses, showArticles, showRatings])

  useEffect(() => {
    if (!availableTabs.includes(tab)) {
      setTab(availableTabs[0])
    }
  }, [availableTabs, tab])

  const websiteLink = useMemo(() => {
    if (typeof creator.website === 'string' && creator.website.trim().length > 0) {
      return creator.website.trim()
    }

    const socialWebsite = creator.socialMediaLinks?.find(
      (link) => link.platform.toLowerCase() === 'website',
    )

    return socialWebsite?.url
  }, [creator.socialMediaLinks, creator.website])

  const videoId = showWelcomeVideo ? extractVideoId(creator.welcomeVideo?.[0] || '') : null

  useEffect(() => {
    if (previewMode) return

    document.body.style.overflow = open ? 'hidden' : 'auto'
    return () => {
      document.body.style.overflow = 'auto'
    }
  }, [open, previewMode])

  const generalSectionsVisible =
    showWelcomeVideo ||
    (showBio && Boolean(creator.bio?.trim())) ||
    (showWebsite && Boolean(websiteLink)) ||
    (showSocialLinks && (creator.socialMediaLinks?.length ?? 0) > 0) ||
    featuredContentIds.length > 0

  const modalBody = (
    <div className="w-full max-w-4xl mx-auto">
      <CreatorHeader creator={creator} showRatings={showRatings} />
      <div className="mt-6">
        <Tabs
          value={tab}
          onValueChange={(nextValue) => setTab(nextValue as CreatorModalTab)}
          className="w-full"
        >
          <TabsList className="mb-4 flex flex-wrap gap-1">
            <TabsTrigger value="geral">Geral</TabsTrigger>
            {showCourses ? <TabsTrigger value="cursos">Cursos</TabsTrigger> : null}
            {showArticles ? <TabsTrigger value="artigos">Artigos</TabsTrigger> : null}
            {showRatings ? <TabsTrigger value="avaliacao">Avaliacao</TabsTrigger> : null}
          </TabsList>

          <TabsContent value="geral" className="space-y-4">
            {generalSectionsVisible ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  {showWelcomeVideo ? (
                    videoId ? (
                      <AspectRatio ratio={16 / 9}>
                        <iframe
                          className="rounded-xl w-full h-full"
                          src={`https://www.youtube.com/embed/${videoId}`}
                          title="Video de boas-vindas"
                          frameBorder="0"
                          allowFullScreen
                        />
                      </AspectRatio>
                    ) : (
                      <div className="text-muted-foreground italic text-sm">
                        Este criador ainda nao tem video de boas-vindas configurado.
                      </div>
                    )
                  ) : null}

                  {showBio && creator.bio?.trim() ? (
                    <div>
                      <h4 className="font-semibold text-base mb-2">Bio</h4>
                      <p className="text-sm text-muted-foreground">{creator.bio}</p>
                    </div>
                  ) : null}

                  {showWebsite && websiteLink ? (
                    <div>
                      <h4 className="font-semibold text-base mb-2">Website</h4>
                      <a
                        href={websiteLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-primary underline underline-offset-4"
                      >
                        {websiteLink}
                      </a>
                    </div>
                  ) : null}
                </div>

                <div className="space-y-4">
                  {showSocialLinks ? <CreatorSocial links={creator.socialMediaLinks} /> : null}

                  {featuredContentIds.length > 0 ? (
                    <div>
                      <h4 className="font-semibold text-base mb-2">Conteudo em destaque</h4>
                      <div className="flex flex-wrap gap-2">
                        {featuredContentIds.map((contentId) => (
                          <Badge key={contentId} variant="outline" className="font-mono text-xs">
                            {contentId}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  ) : null}
                </div>
              </div>
            ) : (
              <div className="text-sm text-muted-foreground italic">
                Nao existem secoes visiveis na tab Geral para esta configuracao.
              </div>
            )}
          </TabsContent>

          {showCourses ? (
            <TabsContent value="cursos">
              {creator.courses && creator.courses.length > 0 ? (
                <CreatorCourses courses={creator.courses} />
              ) : (
                <div className="text-sm text-muted-foreground italic">
                  Este criador ainda nao tem cursos publicados.
                </div>
              )}
            </TabsContent>
          ) : null}

          {showArticles ? (
            <TabsContent value="artigos">
              {creator.articles && creator.articles.length > 0 ? (
                <div className="space-y-2">
                  {creator.articles.map((article) => (
                    <a
                      key={article.articleId}
                      href={`/hub/articles/${encodeURIComponent(article.articleId)}`}
                      className="block rounded-lg border border-border/60 px-3 py-2 text-sm transition-colors hover:bg-muted/40"
                    >
                      <div className="font-medium">Artigo #{article.articleId.slice(0, 8)}</div>
                      <div className="text-xs text-muted-foreground">{article.timestamp}</div>
                    </a>
                  ))}
                </div>
              ) : (
                <div className="text-sm text-muted-foreground italic">
                  Este criador ainda nao tem artigos disponiveis.
                </div>
              )}
            </TabsContent>
          ) : null}

          {showRatings ? (
            <TabsContent value="avaliacao">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-2">
                  <CreatorRatings creator={creator} readOnly={previewMode} />
                </div>
                <div>
                  <h4 className="font-semibold text-base mb-2">Opinioes</h4>
                  <ReviewsDisplay reviews={[]} />
                </div>
              </div>
            </TabsContent>
          ) : null}
        </Tabs>
      </div>
    </div>
  )

  if (previewMode) {
    return (
      <div className="rounded-xl border border-border/60 bg-card/70 p-4 md:p-6">{modalBody}</div>
    )
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl p-6 space-y-6">{modalBody}</DialogContent>
    </Dialog>
  )
}
