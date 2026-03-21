// src/features/creators/components/modals/CreatorModal.tsx

import type { Creator as CreatorType } from '@/features/creators/types/creator'
import { useEffect, useMemo, useState } from 'react'
import { Globe, Play } from 'lucide-react'
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

/** Pretty-print a URL into a clean domain string */
const prettifyUrl = (url: string): string => {
  try {
    const parsed = new URL(url)
    return parsed.hostname.replace(/^www\./, '')
  } catch {
    return url
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

  const hasBio = showBio && Boolean(creator.bio?.trim())
  const hasWebsite = showWebsite && Boolean(websiteLink)
  const hasSocial = showSocialLinks && (creator.socialMediaLinks?.length ?? 0) > 0

  const generalSectionsVisible =
    showWelcomeVideo || hasBio || hasWebsite || hasSocial || featuredContentIds.length > 0

  /* ── Tab label mapping ─────────────────────────────────────────── */
  const tabLabels: Record<CreatorModalTab, string> = {
    geral: 'Geral',
    cursos: 'Cursos',
    artigos: 'Artigos',
    avaliacao: 'Avaliação',
  }

  const modalBody = (
    <div className="w-full max-w-4xl mx-auto space-y-5">
      {/* Header card */}
      <CreatorHeader creator={creator} showRatings={showRatings} />

      {/* Tabs */}
      <Tabs
        value={tab}
        onValueChange={(nextValue) => setTab(nextValue as CreatorModalTab)}
        className="w-full"
      >
        <TabsList className="w-full justify-start gap-1 rounded-lg bg-muted/40 p-1">
          {availableTabs.map((tabKey) => (
            <TabsTrigger
              key={tabKey}
              value={tabKey}
              className="rounded-md px-4 py-2 text-sm font-medium transition-all data-[state=active]:bg-background data-[state=active]:shadow-sm"
            >
              {tabLabels[tabKey]}
            </TabsTrigger>
          ))}
        </TabsList>

        {/* ── TAB: Geral ──────────────────────────────────────────── */}
        <TabsContent value="geral" className="mt-5">
          {generalSectionsVisible ? (
            <div className="space-y-5">
              {/* Video + Bio row */}
              {showWelcomeVideo || hasBio ? (
                <div className="grid grid-cols-1 md:grid-cols-5 gap-5">
                  {/* Video – left, 3 cols */}
                  {showWelcomeVideo ? (
                    <div className="md:col-span-3">
                      {videoId ? (
                        <div className="overflow-hidden rounded-xl border border-border/40 shadow-sm">
                          <AspectRatio ratio={16 / 9}>
                            <iframe
                              className="h-full w-full"
                              src={`https://www.youtube.com/embed/${videoId}?rel=0`}
                              title="Video de boas-vindas"
                              frameBorder="0"
                              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                              allowFullScreen
                            />
                          </AspectRatio>
                        </div>
                      ) : (
                        <div className="flex items-center justify-center rounded-xl border border-dashed border-border/60 bg-muted/20 py-12">
                          <div className="text-center text-muted-foreground">
                            <Play size={28} className="mx-auto mb-2 opacity-40" />
                            <p className="text-sm">Video de boas-vindas em breve</p>
                          </div>
                        </div>
                      )}
                    </div>
                  ) : null}

                  {/* Bio – right, 2 cols (or full if no video) */}
                  {hasBio ? (
                    <div className={showWelcomeVideo ? 'md:col-span-2' : 'md:col-span-5'}>
                      <div className="rounded-xl border border-border/40 bg-muted/20 p-4 h-full">
                        <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                          Sobre
                        </h4>
                        <p className="text-sm leading-relaxed text-foreground/90">{creator.bio}</p>
                      </div>
                    </div>
                  ) : null}
                </div>
              ) : null}

              {/* Website + Social row */}
              {hasWebsite || hasSocial ? (
                <div className="rounded-xl border border-border/40 bg-muted/10 p-4">
                  <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                    {/* Website pill */}
                    {hasWebsite && websiteLink ? (
                      <a
                        href={websiteLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 rounded-lg border border-border/50 bg-background px-3 py-2 text-sm text-muted-foreground transition-all hover:border-primary/40 hover:text-primary"
                      >
                        <Globe size={15} />
                        <span>{prettifyUrl(websiteLink)}</span>
                      </a>
                    ) : null}

                    {/* Social icons */}
                    {hasSocial ? (
                      <div className="flex-1">
                        <CreatorSocial links={creator.socialMediaLinks} />
                      </div>
                    ) : null}
                  </div>
                </div>
              ) : null}

              {/* Featured content */}
              {featuredContentIds.length > 0 ? (
                <div>
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                    Conteúdo em destaque
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {featuredContentIds.map((contentId) => (
                      <Badge
                        key={contentId}
                        variant="secondary"
                        className="font-mono text-xs px-3 py-1"
                      >
                        {contentId}
                      </Badge>
                    ))}
                  </div>
                </div>
              ) : null}
            </div>
          ) : (
            <div className="flex items-center justify-center rounded-xl border border-dashed border-border/60 bg-muted/10 py-12">
              <p className="text-sm text-muted-foreground">
                Este criador ainda não configurou o seu cartão de visita.
              </p>
            </div>
          )}
        </TabsContent>

        {/* ── TAB: Cursos ─────────────────────────────────────────── */}
        {showCourses ? (
          <TabsContent value="cursos" className="mt-5">
            {creator.courses && creator.courses.length > 0 ? (
              <CreatorCourses courses={creator.courses} />
            ) : (
              <div className="flex items-center justify-center rounded-xl border border-dashed border-border/60 bg-muted/10 py-12">
                <p className="text-sm text-muted-foreground">Ainda sem cursos publicados.</p>
              </div>
            )}
          </TabsContent>
        ) : null}

        {/* ── TAB: Artigos ────────────────────────────────────────── */}
        {showArticles ? (
          <TabsContent value="artigos" className="mt-5">
            {creator.articles && creator.articles.length > 0 ? (
              <div className="space-y-2">
                {creator.articles.map((article) => (
                  <a
                    key={article.articleId}
                    href={`/hub/articles/${encodeURIComponent(article.articleId)}`}
                    className="group flex items-center gap-3 rounded-xl border border-border/50 bg-card px-4 py-3 transition-all hover:border-border hover:shadow-sm"
                  >
                    <div className="min-w-0 flex-1">
                      <div className="text-sm font-medium group-hover:text-primary transition-colors">
                        Artigo #{article.articleId.slice(0, 8)}
                      </div>
                      {article.timestamp ? (
                        <div className="text-xs text-muted-foreground mt-0.5">
                          {article.timestamp}
                        </div>
                      ) : null}
                    </div>
                  </a>
                ))}
              </div>
            ) : (
              <div className="flex items-center justify-center rounded-xl border border-dashed border-border/60 bg-muted/10 py-12">
                <p className="text-sm text-muted-foreground">Ainda sem artigos publicados.</p>
              </div>
            )}
          </TabsContent>
        ) : null}

        {/* ── TAB: Avaliação ──────────────────────────────────────── */}
        {showRatings ? (
          <TabsContent value="avaliacao" className="mt-5">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-2">
                <CreatorRatings creator={creator} readOnly={previewMode} />
              </div>
              <div>
                <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
                  Opiniões
                </h4>
                <ReviewsDisplay reviews={[]} />
              </div>
            </div>
          </TabsContent>
        ) : null}
      </Tabs>
    </div>
  )

  if (previewMode) {
    return (
      <div className="rounded-xl border border-border/60 bg-card/70 p-4 md:p-6">{modalBody}</div>
    )
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto p-6">
        {modalBody}
      </DialogContent>
    </Dialog>
  )
}
