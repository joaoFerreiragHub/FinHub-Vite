import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import type { FollowedCreator, FavoriteItem } from '../types'
import type { ContentType } from '@/features/hub/types'

interface SocialState {
  following: FollowedCreator[]
  favorites: FavoriteItem[]
}

interface SocialActions {
  followCreator: (creator: FollowedCreator) => void
  unfollowCreator: (creatorId: string) => void
  isFollowing: (creatorId: string) => boolean

  addFavorite: (item: FavoriteItem) => void
  removeFavorite: (contentId: string) => void
  isFavorited: (contentId: string) => boolean
  getFavoritesByType: (type: ContentType) => FavoriteItem[]
}

type SocialStore = SocialState & SocialActions

export const useSocialStore = create<SocialStore>()(
  persist(
    (set, get) => ({
      following: [],
      favorites: [],

      followCreator: (creator) => {
        const { following } = get()
        if (following.some((c) => c.creatorId === creator.creatorId)) return
        set({ following: [...following, creator] })
      },

      unfollowCreator: (creatorId) => {
        set((state) => ({
          following: state.following.filter((c) => c.creatorId !== creatorId),
        }))
      },

      isFollowing: (creatorId) => {
        return get().following.some((c) => c.creatorId === creatorId)
      },

      addFavorite: (item) => {
        const { favorites } = get()
        if (favorites.some((f) => f.contentId === item.contentId)) return
        set({ favorites: [item, ...favorites] })
      },

      removeFavorite: (contentId) => {
        set((state) => ({
          favorites: state.favorites.filter((f) => f.contentId !== contentId),
        }))
      },

      isFavorited: (contentId) => {
        return get().favorites.some((f) => f.contentId === contentId)
      },

      getFavoritesByType: (type) => {
        return get().favorites.filter((f) => f.contentType === type)
      },
    }),
    {
      name: 'social-storage',
      storage: createJSONStorage(() => localStorage),
    },
  ),
)
