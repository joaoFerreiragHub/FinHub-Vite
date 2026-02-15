import { useState } from 'react'
import React from 'react'
import { Input } from '@/components/ui'
import { Label } from '@/components/ui'
import { Button } from '@/components/ui'
import { FaTwitter } from 'react-icons/fa'
import { FaGlobe } from 'react-icons/fa'
import { SiInstagram, SiYoutube, SiLinkedin, SiTiktok, SiFacebook, SiThreads } from 'react-icons/si'
import { Trash2 } from 'lucide-react'

const socialIcons: Record<string, React.ReactElement> = {
  instagram: <SiInstagram className="h-4 w-4" />,
  youtube: <SiYoutube className="h-4 w-4" />,
  twitter: <FaTwitter className="h-4 w-4" />,
  linkedin: <SiLinkedin className="h-4 w-4" />,
  tiktok: <SiTiktok className="h-4 w-4" />,
  facebook: <SiFacebook className="h-4 w-4" />,
  threads: <SiThreads className="h-4 w-4" />,
  default: <FaGlobe className="h-4 w-4" />,
}

const availablePlatforms = [
  'Instagram',
  'YouTube',
  'TikTok',
  'LinkedIn',
  'X',
  'Facebook',
  'Threads',
  'Outros',
]

function getIconForPlatform(platform: string) {
  const key = platform.toLowerCase()
  if (key.includes('instagram')) return socialIcons.instagram
  if (key.includes('youtube')) return socialIcons.youtube
  if (key.includes('twitter') || key === 'x') return socialIcons.twitter
  if (key.includes('linkedin')) return socialIcons.linkedin
  if (key.includes('tiktok')) return socialIcons.tiktok
  if (key.includes('facebook')) return socialIcons.facebook
  if (key.includes('threads')) return socialIcons.threads
  return socialIcons.default
}

export default function StepSocialLinks() {
  const [platform, setPlatform] = useState('Instagram')
  const [url, setUrl] = useState('')
  const [links, setLinks] = useState<{ platform: string; url: string }[]>([])

  const addLink = () => {
    if (!url.trim()) return
    setLinks([...links, { platform, url }])
    setUrl('')
  }

  const removeLink = (index: number) => {
    const updated = [...links]
    updated.splice(index, 1)
    setLinks(updated)
  }

  return (
    <div className="space-y-4">
      <Label className="block">Redes Sociais</Label>

      <div className="flex gap-2 items-center">
        <select
          className="border rounded px-2 py-1 text-sm"
          value={platform}
          onChange={(e) => setPlatform(e.target.value)}
        >
          {availablePlatforms.map((p) => (
            <option key={p} value={p}>
              {p}
            </option>
          ))}
        </select>

        <Input
          placeholder="Link para a tua rede"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
        />
        <Button type="button" onClick={addLink}>
          Adicionar
        </Button>
      </div>

      <ul className="space-y-2">
        {links.map((link, index) => (
          <li
            key={index}
            className="flex items-center justify-between border rounded px-4 py-2 gap-2 bg-muted"
          >
            <div className="flex items-center gap-2">
              {getIconForPlatform(link.platform)}
              <span className="text-sm font-medium">{link.platform}</span>
            </div>

            <a
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-blue-600 underline truncate max-w-[50%]"
            >
              {link.url}
            </a>

            <Button variant="ghost" size="icon" onClick={() => removeLink(index)}>
              <Trash2 className="w-4 h-4 text-red-500" />
            </Button>
          </li>
        ))}
      </ul>
    </div>
  )
}
