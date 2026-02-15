import React from 'react'
import { Card, CardContent } from '@/components/ui'
import { Announcement } from '@/features/creators/types/content'

type Props = {
  announcements?: Announcement[]
  maxAnnouncements?: number
}

const AnnouncementsSection: React.FC<Props> = ({ announcements = [], maxAnnouncements = 3 }) => {
  const sortedAnnouncements = [...announcements].sort(
    (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime(),
  )

  const latestAnnouncements = sortedAnnouncements.slice(0, maxAnnouncements)

  return (
    <section className="mt-8 space-y-6">
      <h2 className="text-2xl font-semibold text-primary">Anúncios</h2>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {latestAnnouncements.map((announcement) => (
          <Card key={announcement.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-4 space-y-2">
              <h3 className="text-lg font-semibold text-foreground">{announcement.title}</h3>
              <p className="text-sm text-muted-foreground">{announcement.body}</p>
              <p className="text-xs text-muted-foreground">
                Postado em:{' '}
                {new Date(announcement.publishedAt).toLocaleDateString('pt-PT', {
                  day: '2-digit',
                  month: '2-digit',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  )
}

export default AnnouncementsSection
