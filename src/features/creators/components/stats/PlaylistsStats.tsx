// features/creators/components/marketing/estatisticas/PlaylistsStats.tsx

import { ListMusic, Clock, User, Video } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui'

const mockPlaylistStats = {
  total: 6,
  totalVideos: 28,
  mostPopular: {
    title: 'Começa a Investir do Zero',
    views: 1540,
  },
  latest: {
    title: 'Mindset Financeiro',
    createdAt: '2025-05-10',
  },
}

export default function PlaylistsStats() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-sm">
            <ListMusic className="w-4 h-4 text-blue-500" />
            Total de Playlists
          </CardTitle>
        </CardHeader>
        <CardContent className="text-2xl font-bold">{mockPlaylistStats.total}</CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-sm">
            <Video className="w-4 h-4 text-green-500" />
            Total de Vídeos
          </CardTitle>
        </CardHeader>
        <CardContent className="text-base">{mockPlaylistStats.totalVideos}</CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-sm">
            <User className="w-4 h-4 text-purple-500" />
            Playlist Mais Popular
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="font-medium">{mockPlaylistStats.mostPopular.title}</div>
          <div className="text-sm text-muted-foreground">
            {mockPlaylistStats.mostPopular.views} visualizações
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-sm">
            <Clock className="w-4 h-4 text-muted-foreground" />
            Última Playlist
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="font-medium">{mockPlaylistStats.latest.title}</div>
          <div className="text-sm text-muted-foreground">{mockPlaylistStats.latest.createdAt}</div>
        </CardContent>
      </Card>
    </div>
  )
}
