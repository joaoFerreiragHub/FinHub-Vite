import React, { useEffect, useState } from 'react'
import axios from 'axios'

import { Bell, UserPlus, Users } from 'lucide-react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faYoutube,
  faFacebook,
  faInstagram,
  faSpotify,
  faTiktok,
  faTwitter,
  faTelegram,
  IconDefinition,
} from '@fortawesome/free-brands-svg-icons'

import { RatingDisplay } from '../../ratings/RatingDisplay'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../../ui/dialog'
import { Button } from '../../ui/button'
import { CreatorFull, SocialMediaLink } from '../../../types/creator'

const socialMediaIcons: Record<string, IconDefinition> = {
  youtube: faYoutube,
  facebook: faFacebook,
  instagram: faInstagram,
  spotify: faSpotify,
  tiktok: faTiktok,
  twitter: faTwitter,
  telegram: faTelegram,
}

interface Props {
  creatorData: CreatorFull
  averageCreatorRating: number
  userRating: number
  user: {
    id: string
    role: 'visitor' | 'RegularUser' | 'CreatorUser' | string
  }
  submitRating: () => void
}

const CreatorProfile: React.FC<Props> = ({
  creatorData,
  averageCreatorRating,
  userRating,
  user,
}) => {
  const [isFollowing, setIsFollowing] = useState(false)
  const [followerCount, setFollowerCount] = useState(creatorData.followers?.length || 0)
  const [dialogVisible, setDialogVisible] = useState(false)
  const [visitorDialogVisible, setVisitorDialogVisible] = useState(false)

  const isOwnProfile = user?.id === creatorData?._id
  const isRegularUser = user?.role === 'RegularUser'

  useEffect(() => {
    if (creatorData?._id && user && !isOwnProfile && isRegularUser) {
      checkIfFollowing()
    }
  }, [creatorData?._id, user])

  const checkIfFollowing = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/socialRouter/isFollowing/${user.id}/${creatorData.username}`
      )
      setIsFollowing(response.data.isFollowing)
    } catch (error) {
      console.error('Erro ao verificar se segue:', error)
    }
  }

  const handleFollowClick = async () => {
    if (!isRegularUser) {
      setVisitorDialogVisible(true)
      return
    }

    const action = isFollowing ? 'unfollow' : 'follow'

    try {
      await axios.post(
        `${import.meta.env.VITE_API_URL}/socialRouter/${action}/${user.id}/${creatorData._id}`
      )
      setIsFollowing((prev) => !prev)
      setFollowerCount((prev) => (isFollowing ? prev - 1 : prev + 1))
    } catch (error) {
      console.error('Erro ao seguir:', error)
    }
  }

  const renderSocialMediaIcons = (links: SocialMediaLink[] = []) => {
    return links
      .filter((link) => socialMediaIcons[link.platform])
      .map((link, index) => (
        <a
          key={index}
          href={link.url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary hover:text-primary/80"
        >
          <FontAwesomeIcon icon={socialMediaIcons[link.platform]} className="text-xl" />
        </a>
      ))
  }

  return (
    <div className="bg-background border rounded-xl shadow-md p-6">
      <div className="flex flex-col md:flex-row gap-6 items-center md:items-start">
        <div className="flex flex-col items-center gap-4">
          <img
            src={creatorData.profilePictureUrl || '/default-avatar.png'}
            alt={creatorData.username}
            className="w-32 h-32 rounded-full object-cover border"
          />
          <div className="text-center">
            {!isOwnProfile && isRegularUser && (
              <>
                <p className="text-sm text-muted-foreground">A tua Avaliação</p>
                <RatingDisplay rating={userRating} />
              </>
            )}
            <div className="mt-3">
              <p className="text-sm text-muted-foreground">Avaliação Média</p>
              <RatingDisplay rating={averageCreatorRating} />
            </div>
          </div>
        </div>

        <div className="flex-1 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">{creatorData.username}</h2>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Users className="w-5 h-5" />
              <span>{followerCount}</span>
            </div>
          </div>

          <p className="text-sm text-muted-foreground">{creatorData.bio}</p>
          <p className="text-sm text-muted-foreground">
            <strong>Contacto:</strong> {creatorData.email}
          </p>

          {!isOwnProfile && isRegularUser && (
            <div className="flex gap-3">
              <Button
                variant={isFollowing ? 'outline' : 'default'}
                onClick={handleFollowClick}
              >
                <UserPlus className="mr-2 h-4 w-4" />
                {isFollowing ? 'A Seguir' : 'Seguir'}
              </Button>
              <Button variant="secondary" onClick={() => setDialogVisible(true)}>
                <Bell className="mr-2 h-4 w-4" />
                Notificações
              </Button>
            </div>
          )}

          <div className="flex gap-3 mt-4">
            {renderSocialMediaIcons(creatorData.socialMediaLinks)}
          </div>
        </div>
      </div>

      <Dialog open={dialogVisible} onOpenChange={setDialogVisible}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Notificações</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">Preferências de notificações aqui.</p>
        </DialogContent>
      </Dialog>

      <Dialog open={visitorDialogVisible} onOpenChange={setVisitorDialogVisible}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Acesso Restrito</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground mb-4">
            Para seguir ou ativar notificações, faz login na tua conta.
          </p>
          <div className="flex justify-center gap-4">
            <Button onClick={() => window.location.href = '/login'}>Login</Button>
            <Button variant="secondary" onClick={() => setVisitorDialogVisible(false)}>
              Cancelar
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default CreatorProfile
