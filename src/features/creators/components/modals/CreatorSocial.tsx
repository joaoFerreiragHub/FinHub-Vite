// src/features/creators/components/modals/CreatorSocial.tsx

import { SocialMediaLink } from '@/features/creators/types/creator'
import {
  FaInstagram,
  FaYoutube,
  FaTiktok,
  FaFacebook,
  FaTwitter,
  FaLinkedin,
  FaGlobe,
  FaLink,
} from 'react-icons/fa'

interface CreatorSocialProps {
  links: SocialMediaLink[]
}

const platformConfig: Record<string, { icon: typeof FaLink; label: string; color: string }> = {
  website: { icon: FaGlobe, label: 'Website', color: 'hover:text-emerald-400' },
  instagram: { icon: FaInstagram, label: 'Instagram', color: 'hover:text-pink-400' },
  youtube: { icon: FaYoutube, label: 'YouTube', color: 'hover:text-red-400' },
  tiktok: { icon: FaTiktok, label: 'TikTok', color: 'hover:text-foreground' },
  facebook: { icon: FaFacebook, label: 'Facebook', color: 'hover:text-blue-400' },
  twitter: { icon: FaTwitter, label: 'Twitter', color: 'hover:text-sky-400' },
  linkedin: { icon: FaLinkedin, label: 'LinkedIn', color: 'hover:text-blue-500' },
  other: { icon: FaLink, label: 'Link', color: 'hover:text-primary' },
}

export function CreatorSocial({ links }: CreatorSocialProps) {
  if (!links || links.length === 0) return null

  return (
    <div className="flex flex-wrap gap-2">
      {links.map((link, i) => {
        const key = link.platform.toLowerCase()
        const config = platformConfig[key] || platformConfig.other
        const Icon = config.icon

        return (
          <a
            key={i}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            title={config.label}
            className={`inline-flex items-center gap-2 rounded-lg border border-border/50 bg-muted/30 px-3 py-2 text-sm text-muted-foreground transition-all duration-200 hover:border-border hover:bg-muted/60 ${config.color}`}
          >
            <Icon size={16} />
            <span className="hidden sm:inline">{config.label}</span>
          </a>
        )
      })}
    </div>
  )
}
