import { useState, useEffect, useCallback } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'
import { mockWelcomeVideos } from '@/lib/mock/mockWelcomeVideos'
import { VideoData, VideoType } from '@/features/hub/types/video'
import { useAuthStore } from '@/features/auth/stores/useAuthStore'
import {
  getCreatorContentVisibility,
  setCreatorContentVisibility,
} from '../../shared/creatorContentStorage'

interface UseWelcomeVideo {
  videoLink: string
  setVideoLink: (link: string) => void
  currentVideo: VideoData | null
  setCurrentVideo: (video: VideoData | null) => void
  welcomeVideoVisible: boolean
  toggleVideoVisibility: () => void
  userVideos: VideoData[]
  setUserVideos: (videos: VideoData[]) => void
  fetchUserVideos: () => void
  userId: string
}

export default function useWelcomeVideo(videoType: VideoType): UseWelcomeVideo {
  const { user } = useAuthStore()
  const userId = user?.id ?? ''

  const [videoLink, setVideoLink] = useState('')
  const [currentVideo, setCurrentVideo] = useState<VideoData | null>(null)
  const [welcomeVideoVisible, setWelcomeVideoVisible] = useState(true)
  const [userVideos, setUserVideos] = useState<VideoData[]>([])
  const useMockData = import.meta.env.MODE === 'development'

  const fetchVideoVisibility = useCallback(() => {
    if (!userId) return
    const visibility = getCreatorContentVisibility(userId)
    setWelcomeVideoVisible(visibility.welcomeVideo)
  }, [userId])

  const fetchUserVideos = useCallback(async () => {
    if (!userId && !useMockData) return

    if (useMockData) {
      const filtered = mockWelcomeVideos.filter((video) => video.videoType === videoType)
      setUserVideos(filtered)

      const selected = filtered.find((video) => video.isSelected)
      if (selected) {
        setCurrentVideo(selected)
        setVideoLink(selected.videoLink)
      } else if (filtered.length > 0) {
        setCurrentVideo(filtered[0])
        setVideoLink(filtered[0].videoLink)
      } else {
        setCurrentVideo(null)
        setVideoLink('')
      }
      return
    }

    try {
      const { data } = await axios.get(
        `${import.meta.env.VITE_API_URL}/welcomeVideos/${userId}/userVideos`,
      )
      const videos = Array.isArray(data) ? data : []
      const filtered = videos.filter((video) => video.videoType === videoType)

      setUserVideos(filtered)

      const selected = filtered.find((video) => video.isSelected)
      if (selected) {
        setCurrentVideo(selected)
        setVideoLink(selected.videoLink)
      } else if (filtered.length > 0) {
        setCurrentVideo(filtered[0])
        setVideoLink(filtered[0].videoLink)
      } else {
        setCurrentVideo(null)
        setVideoLink('')
      }
    } catch (error) {
      console.error('Erro ao carregar videos do utilizador:', error)
      toast.error('Erro ao carregar videos.')
      setUserVideos([])
    }
  }, [userId, videoType, useMockData])

  const toggleVideoVisibility = useCallback(() => {
    if (!userId) return
    const newVisibility = !welcomeVideoVisible
    setCreatorContentVisibility(userId, { welcomeVideo: newVisibility })
    setWelcomeVideoVisible(newVisibility)
    toast.success('Visibilidade atualizada com sucesso.')
  }, [userId, welcomeVideoVisible])

  useEffect(() => {
    fetchVideoVisibility()
    fetchUserVideos()
  }, [fetchVideoVisibility, fetchUserVideos])

  return {
    videoLink,
    setVideoLink,
    currentVideo,
    setCurrentVideo,
    welcomeVideoVisible,
    toggleVideoVisibility,
    userVideos,
    setUserVideos,
    fetchUserVideos,
    userId,
  }
}
