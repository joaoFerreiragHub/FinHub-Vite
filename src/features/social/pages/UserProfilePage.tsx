import { useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui'
import { Skeleton } from '@/components/ui'
import { useAuthStore } from '@/features/auth/stores/useAuthStore'
import { UserProfileCard } from '../components/UserProfileCard'
import { ActivityFeedItem } from '../components/ActivityFeedItem'
import { FollowButton } from '../components/FollowButton'
import {
  useUserProfile,
  useMyProfile,
  useFavorites,
  useFollowing,
  useActivityFeed,
} from '../hooks/useSocial'

interface UserProfilePageProps {
  username?: string // If undefined, show own profile
}

export function UserProfilePage({ username }: UserProfilePageProps) {
  const { user } = useAuthStore()
  const isOwnProfile = !username || username === user?.username

  const myProfileQuery = useMyProfile()
  const otherProfileQuery = useUserProfile(username ?? '')

  const profileQuery = isOwnProfile ? myProfileQuery : otherProfileQuery
  const profile = profileQuery.data

  const [activeTab, setActiveTab] = useState('atividade')

  if (profileQuery.isLoading) {
    return (
      <div className="mx-auto max-w-4xl space-y-6 p-6">
        <Skeleton className="h-48 w-full rounded-xl" />
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-64 w-full rounded-xl" />
      </div>
    )
  }

  if (profileQuery.isError || !profile) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-bold">Perfil nao encontrado</h2>
          <p className="mt-2 text-muted-foreground">O utilizador que procuras nao existe.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6 p-6">
      <UserProfileCard profile={profile} />

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="atividade">Atividade</TabsTrigger>
          <TabsTrigger value="favoritos">Favoritos</TabsTrigger>
          <TabsTrigger value="seguindo">A Seguir</TabsTrigger>
        </TabsList>

        <TabsContent value="atividade" className="mt-4">
          <ActivityTab />
        </TabsContent>

        <TabsContent value="favoritos" className="mt-4">
          <FavoritesTab />
        </TabsContent>

        <TabsContent value="seguindo" className="mt-4">
          <FollowingTab />
        </TabsContent>
      </Tabs>
    </div>
  )
}

function ActivityTab() {
  const { data, isLoading } = useActivityFeed(false, 10)

  if (isLoading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-32 w-full rounded-lg" />
        ))}
      </div>
    )
  }

  if (!data || data.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-border p-8 text-center">
        <p className="text-muted-foreground">Sem atividade recente</p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {data.map((item) => (
        <ActivityFeedItem key={item.id} item={item} />
      ))}
    </div>
  )
}

function FavoritesTab() {
  const { data, isLoading } = useFavorites()

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-48 w-full rounded-lg" />
        ))}
      </div>
    )
  }

  if (!data || data.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-border p-8 text-center">
        <p className="text-muted-foreground">Ainda nao tens favoritos</p>
        <p className="mt-1 text-sm text-muted-foreground">
          Explora conteudos e guarda os que mais gostares.
        </p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {data.map((item) => (
        <div
          key={item.contentId}
          className="rounded-lg border border-border bg-card p-4 transition-colors hover:bg-accent"
        >
          {item.coverImage && (
            <img
              src={item.coverImage}
              alt=""
              className="mb-3 h-32 w-full rounded-md object-cover"
            />
          )}
          <h4 className="text-sm font-medium line-clamp-2">{item.title}</h4>
          <p className="mt-1 text-xs text-muted-foreground capitalize">
            {item.contentType} {item.creatorName && `por ${item.creatorName}`}
          </p>
        </div>
      ))}
    </div>
  )
}

function FollowingTab() {
  const { data, isLoading } = useFollowing()

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-24 w-full rounded-lg" />
        ))}
      </div>
    )
  }

  if (!data || data.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-border p-8 text-center">
        <p className="text-muted-foreground">Ainda nao segues ninguem</p>
        <p className="mt-1 text-sm text-muted-foreground">
          Descobre criadores na pagina de exploracao.
        </p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      {data.map((creator) => (
        <div
          key={creator.creatorId}
          className="flex items-center gap-4 rounded-lg border border-border bg-card p-4"
        >
          {creator.avatar ? (
            <img
              src={creator.avatar}
              alt={creator.name}
              className="h-12 w-12 rounded-full object-cover"
            />
          ) : (
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground font-medium">
              {creator.name.charAt(0)}
            </div>
          )}
          <div className="flex-1 min-w-0">
            <p className="font-medium">{creator.name}</p>
            <p className="text-xs text-muted-foreground">@{creator.username}</p>
            {creator.bio && (
              <p className="mt-0.5 text-xs text-muted-foreground line-clamp-1">{creator.bio}</p>
            )}
          </div>
          <FollowButton
            creatorId={creator.creatorId}
            creatorName={creator.name}
            creatorUsername={creator.username}
            creatorAvatar={creator.avatar}
            size="sm"
          />
        </div>
      ))}
    </div>
  )
}
