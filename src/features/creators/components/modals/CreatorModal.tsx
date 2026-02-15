// src/features/creators/components/modals/CreatorModal.tsx

import type { Creator as CreatorType } from '@/features/creators/types/creator'
import { useEffect, useState } from 'react'
import { CreatorHeader } from './CreatorHeader'
import { CreatorCourses } from './CreatorCourses'
import { CreatorSocial } from './CreatorSocial'
import { CreatorRatings } from './CreatorRatings'
import { Dialog, DialogContent } from '@/components/ui'

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui'

import { AspectRatio } from '@/components/ui'
import { ReviewsDisplay } from '~/features/hub'

interface CreatorModalProps {
  open: boolean
  onClose: () => void
  creator: CreatorType
}

export function CreatorModal({ open, onClose, creator }: CreatorModalProps) {
  const [tab, setTab] = useState('geral')

  const extractVideoId = (url: string) => {
    try {
      const urlParams = new URLSearchParams(new URL(url).search)
      return urlParams.get('v')
    } catch {
      return null
    }
  }

  const videoId = extractVideoId(creator.welcomeVideo?.[0] || '')

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : 'auto'
    return () => {
      document.body.style.overflow = 'auto'
    }
  }, [open])

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl p-6 space-y-6">
        <div className="w-full max-w-4xl mx-auto">
          <CreatorHeader creator={creator} />
          <div className="mt-6">
            <Tabs value={tab} onValueChange={setTab} className="w-full">
              <TabsList className="mb-4">
                <TabsTrigger value="geral">Geral</TabsTrigger>
                <TabsTrigger value="avaliacao">Avaliação</TabsTrigger>
              </TabsList>

              <TabsContent value="geral">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    {videoId ? (
                      <AspectRatio ratio={16 / 9}>
                        <iframe
                          className="rounded-xl w-full h-full"
                          src={`https://www.youtube.com/embed/${videoId}`}
                          title="Vídeo de boas-vindas"
                          frameBorder="0"
                          allowFullScreen
                        />
                      </AspectRatio>
                    ) : (
                      <div className="text-muted-foreground italic">
                        Este criador ainda não tem vídeo disponível.
                      </div>
                    )}
                  </div>
                  <div className="flex flex-col gap-6">
                    <CreatorCourses courses={creator.courses} />
                    <CreatorSocial links={creator.socialMediaLinks} />
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="avaliacao">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="md:col-span-2">
                    <CreatorRatings creator={creator} />
                  </div>
                  <div>
                    <h4 className="font-semibold text-base mb-2">Opiniões</h4>
                    <ReviewsDisplay reviews={[]} />
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
