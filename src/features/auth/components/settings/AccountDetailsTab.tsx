import { useRef, useState } from 'react'
import { Loader2 } from 'lucide-react'
import type { User } from '../../types'
import { authService } from '@/features/auth/services/authService'
import { Button } from '@/components/ui'
import { Input } from '@/components/ui'
import { Label } from '@/components/ui'
import { getErrorMessage } from '@/lib/api/client'

interface Props {
  user: User | null
  onChange: (data: Partial<User>) => void
  onSave: () => void
}

export default function AccountDetailsTab({ user, onChange, onSave }: Props) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false)
  const [avatarError, setAvatarError] = useState<string | null>(null)

  const handleAvatarFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return
    event.target.value = ''

    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp']
    if (!allowedTypes.includes(file.type)) {
      setAvatarError('Formato inválido. Usa JPEG, PNG ou WebP.')
      return
    }
    if (file.size > 5 * 1024 * 1024) {
      setAvatarError('O ficheiro é demasiado grande. Máximo 5 MB.')
      return
    }

    setAvatarError(null)
    setIsUploadingAvatar(true)
    try {
      const result = await authService.uploadAvatar(file)
      onChange({ avatar: result.avatar || result.avatarUrl })
    } catch (error) {
      setAvatarError(getErrorMessage(error))
    } finally {
      setIsUploadingAvatar(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          className="hidden"
          onChange={handleAvatarFileChange}
        />
        <div className="relative h-16 w-16 shrink-0">
          <img
            src={user?.avatar || '/placeholder-user.svg'}
            alt="Avatar"
            className="h-16 w-16 rounded-full object-cover"
          />
          {isUploadingAvatar && (
            <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black/40">
              <Loader2 className="h-5 w-5 animate-spin text-white" />
            </div>
          )}
        </div>
        <div className="flex flex-col gap-1">
          <Button
            type="button"
            variant="outline"
            disabled={isUploadingAvatar}
            onClick={() => fileInputRef.current?.click()}
          >
            {isUploadingAvatar ? 'A carregar...' : 'Alterar foto'}
          </Button>
          {avatarError && <p className="text-xs text-destructive">{avatarError}</p>}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="username">Username</Label>
          <Input
            id="username"
            value={user?.username || ''}
            onChange={(e) => onChange({ username: e.target.value })}
          />
        </div>
        <div>
          <Label htmlFor="name">Nome</Label>
          <Input
            id="name"
            value={user?.name || ''}
            onChange={(e) => onChange({ name: e.target.value })}
          />
        </div>
        <div>
          <Label htmlFor="lastName">Apelido</Label>
          <Input
            id="lastName"
            value={user?.lastName || ''}
            onChange={(e) => onChange({ lastName: e.target.value })}
          />
        </div>
        <div>
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={user?.email || ''}
            onChange={(e) => onChange({ email: e.target.value })}
          />
        </div>
      </div>

      <div>
        <Label htmlFor="bio">Bio</Label>
        <Input
          id="bio"
          value={user?.bio || ''}
          onChange={(e) => onChange({ bio: e.target.value })}
        />
      </div>

      <Button onClick={onSave}>Guardar Alterações</Button>
    </div>
  )
}
