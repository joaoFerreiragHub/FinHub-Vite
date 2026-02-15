import { useSocialStore } from '@/features/social/stores/useSocialStore'
import { ContentType } from '@/features/hub/types'
import type { FollowedCreator, FavoriteItem } from '@/features/social/types'

const mockCreator: FollowedCreator = {
  creatorId: 'creator-1',
  username: 'pedro-santos',
  name: 'Pedro Santos',
  followedAt: '2025-01-01T00:00:00Z',
}

const mockFavorite: FavoriteItem = {
  contentId: 'article-1',
  contentType: ContentType.ARTICLE,
  title: 'Mock Article',
  favoritedAt: '2025-01-01T00:00:00Z',
}

beforeEach(() => {
  useSocialStore.setState({ following: [], favorites: [] })
})

describe('useSocialStore', () => {
  describe('following', () => {
    it('starts with empty following list', () => {
      expect(useSocialStore.getState().following).toEqual([])
    })

    it('follows a creator', () => {
      useSocialStore.getState().followCreator(mockCreator)
      expect(useSocialStore.getState().following).toHaveLength(1)
      expect(useSocialStore.getState().following[0]).toEqual(mockCreator)
    })

    it('does not duplicate follows', () => {
      useSocialStore.getState().followCreator(mockCreator)
      useSocialStore.getState().followCreator(mockCreator)
      expect(useSocialStore.getState().following).toHaveLength(1)
    })

    it('unfollows a creator', () => {
      useSocialStore.getState().followCreator(mockCreator)
      useSocialStore.getState().unfollowCreator('creator-1')
      expect(useSocialStore.getState().following).toHaveLength(0)
    })

    it('isFollowing returns true for followed creators', () => {
      useSocialStore.getState().followCreator(mockCreator)
      expect(useSocialStore.getState().isFollowing('creator-1')).toBe(true)
      expect(useSocialStore.getState().isFollowing('creator-999')).toBe(false)
    })

    it('handles multiple follows and unfollows', () => {
      const creator2: FollowedCreator = {
        ...mockCreator,
        creatorId: 'creator-2',
        username: 'ana-costa',
        name: 'Ana Costa',
      }

      useSocialStore.getState().followCreator(mockCreator)
      useSocialStore.getState().followCreator(creator2)
      expect(useSocialStore.getState().following).toHaveLength(2)

      useSocialStore.getState().unfollowCreator('creator-1')
      expect(useSocialStore.getState().following).toHaveLength(1)
      expect(useSocialStore.getState().isFollowing('creator-2')).toBe(true)
    })
  })

  describe('favorites', () => {
    it('starts with empty favorites list', () => {
      expect(useSocialStore.getState().favorites).toEqual([])
    })

    it('adds a favorite', () => {
      useSocialStore.getState().addFavorite(mockFavorite)
      expect(useSocialStore.getState().favorites).toHaveLength(1)
      expect(useSocialStore.getState().favorites[0]).toEqual(mockFavorite)
    })

    it('does not duplicate favorites', () => {
      useSocialStore.getState().addFavorite(mockFavorite)
      useSocialStore.getState().addFavorite(mockFavorite)
      expect(useSocialStore.getState().favorites).toHaveLength(1)
    })

    it('removes a favorite', () => {
      useSocialStore.getState().addFavorite(mockFavorite)
      useSocialStore.getState().removeFavorite('article-1')
      expect(useSocialStore.getState().favorites).toHaveLength(0)
    })

    it('isFavorited returns correct values', () => {
      useSocialStore.getState().addFavorite(mockFavorite)
      expect(useSocialStore.getState().isFavorited('article-1')).toBe(true)
      expect(useSocialStore.getState().isFavorited('article-999')).toBe(false)
    })

    it('adds new favorites to the beginning', () => {
      const fav2: FavoriteItem = {
        ...mockFavorite,
        contentId: 'course-1',
        contentType: ContentType.COURSE,
        title: 'Mock Course',
      }

      useSocialStore.getState().addFavorite(mockFavorite)
      useSocialStore.getState().addFavorite(fav2)
      expect(useSocialStore.getState().favorites[0].contentId).toBe('course-1')
    })

    it('getFavoritesByType filters correctly', () => {
      const courseFav: FavoriteItem = {
        contentId: 'course-1',
        contentType: ContentType.COURSE,
        title: 'Mock Course',
        favoritedAt: '2025-01-01T00:00:00Z',
      }
      const videoFav: FavoriteItem = {
        contentId: 'video-1',
        contentType: ContentType.VIDEO,
        title: 'Mock Video',
        favoritedAt: '2025-01-01T00:00:00Z',
      }

      useSocialStore.getState().addFavorite(mockFavorite) // article
      useSocialStore.getState().addFavorite(courseFav)
      useSocialStore.getState().addFavorite(videoFav)

      const articles = useSocialStore.getState().getFavoritesByType(ContentType.ARTICLE)
      expect(articles).toHaveLength(1)
      expect(articles[0].contentId).toBe('article-1')

      const courses = useSocialStore.getState().getFavoritesByType(ContentType.COURSE)
      expect(courses).toHaveLength(1)

      const books = useSocialStore.getState().getFavoritesByType(ContentType.BOOK)
      expect(books).toHaveLength(0)
    })
  })
})
