// src/features/creators/components/modals/CreatorSocial.tsx
import { SocialMediaLink } from '@/features/creators/types/creator'
import {
  FaInstagram,
  FaYoutube,
  FaTiktok,
  FaFacebook,
  FaTwitter,
  FaLinkedin,
  FaLink,
} from 'react-icons/fa'

interface CreatorSocialProps {
  links: SocialMediaLink[]
}

const iconMap = {
  Instagram: FaInstagram,
  Youtube: FaYoutube,
  Tiktok: FaTiktok,
  Facebook: FaFacebook,
  Twitter: FaTwitter,
  LinkedIn: FaLinkedin,
  Other: FaLink,
}

export function CreatorSocial({ links }: CreatorSocialProps) {
  if (!links || links.length === 0) return null

  return (
    <div>
      <h4 className="font-semibold text-base mb-2">Redes Sociais</h4>
      <div className="flex gap-3 flex-wrap">
        {links.map((link, i) => {
          const Icon = iconMap[link.platform as keyof typeof iconMap] || FaLink
          return (
            <a
              key={i}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 bg-muted rounded-full hover:bg-muted/70 transition"
            >
              <Icon size={20} />
            </a>
          )
        })}
      </div>
    </div>
  )
}
