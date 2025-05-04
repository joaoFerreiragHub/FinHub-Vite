import { useState, useEffect, useCallback } from "react"
import axios from "axios"
import { toast } from "react-toastify"
import { mockWelcomeVideos } from "../../../../../mock/mockWelcomeVideos"

import { VideoData, VideoType } from "../../../../../types/video"
import { useUserStore } from "../../../../../stores/useUserStore"

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
  const user = useUserStore((state) => state.user)
  const userId = user?.id ?? ""

  const [videoLink, setVideoLink] = useState("")
  const [currentVideo, setCurrentVideo] = useState<VideoData | null>(null)
  const [welcomeVideoVisible, setWelcomeVideoVisible] = useState(true)
  const [userVideos, setUserVideos] = useState<VideoData[]>([])
  const useMockData = import.meta.env.MODE === "development"

  const fetchVideoVisibility = useCallback(async () => {
    if (!userId) return
    try {
      const { data } = await axios.get(
        `${import.meta.env.VITE_API_URL}/users/${userId}/visibility`
      )
      setWelcomeVideoVisible(data?.welcomeVideo ?? true)
    } catch (error) {
      console.error("Erro ao buscar visibilidade:", error)
      toast.error("Erro ao carregar definição de visibilidade.")
    }
  }, [userId])

  // const fetchWelcomeVideo = useCallback(async () => {
  //   if (!userId || useMockData) return
  //   try {
  //     const { data } = await axios.get(
  //       `${import.meta.env.VITE_API_URL}/welcomeVideos/${userId}/mainVideo`
  //     )
  //     setCurrentVideo(data ?? null)
  //   } catch (error) {
  //     console.error("Erro ao carregar vídeo de boas-vindas:", error)
  //     toast.error("Erro ao carregar vídeo de boas-vindas.")
  //     setCurrentVideo(null)
  //   }
  // }, [userId, useMockData])

  const fetchUserVideos = useCallback(async () => {
    if (useMockData) {
      const filtered = mockWelcomeVideos.filter(v => v.videoType === videoType)

      setUserVideos(filtered)

      const selected = filtered.find(v => v.isSelected)
      if (selected) {
        setCurrentVideo(selected)
        setVideoLink(selected.videoLink)
      } else if (filtered.length > 0) {
        setCurrentVideo(filtered[0])
        setVideoLink(filtered[0].videoLink)
      } else {
        setCurrentVideo(null)
        setVideoLink("")
      }
      return
    }

    try {
      const { data } = await axios.get(
        `${import.meta.env.VITE_API_URL}/welcomeVideos/${userId}/userVideos`
      )
      const videos = Array.isArray(data) ? data : []
      const filtered = videos.filter(v => v.videoType === videoType)

      setUserVideos(filtered)

      const selected = filtered.find(v => v.isSelected)
      if (selected) {
        setCurrentVideo(selected)
        setVideoLink(selected.videoLink)
      } else if (filtered.length > 0) {
        setCurrentVideo(filtered[0])
        setVideoLink(filtered[0].videoLink)
      } else {
        setCurrentVideo(null)
        setVideoLink("")
      }
    } catch (error) {
      console.error("Erro ao carregar vídeos do utilizador:", error)
      toast.error("Erro ao carregar vídeos.")
      setUserVideos([])
    }
  }, [userId, videoType, useMockData])

  const toggleVideoVisibility = useCallback(async () => {
    if (!userId) return
    try {
      const newVisibility = !welcomeVideoVisible
      await axios.patch(`${import.meta.env.VITE_API_URL}/users/${userId}/visibility`, {
        contentVisibility: { welcomeVideo: newVisibility },
      })
      setWelcomeVideoVisible(newVisibility)
      toast.success("Visibilidade atualizada com sucesso.")
    } catch {
      toast.error("Erro ao atualizar visibilidade do vídeo.")
    }
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
