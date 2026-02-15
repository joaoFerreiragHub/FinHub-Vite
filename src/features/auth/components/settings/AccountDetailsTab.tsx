// src/components/.../AccountDetailsTab.tsx

import type { User } from '../../types'
import { Button } from '@/components/ui'
import { Input } from '@/components/ui'
import { Label } from '@/components/ui'

interface Props {
  user: User | null
  onChange: (data: Partial<User>) => void
  onSave: () => void
}

export default function AccountDetailsTab({ user, onChange, onSave }: Props) {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <img
          src={user?.avatar || '/default-avatar.png'}
          alt="Avatar"
          className="w-16 h-16 rounded-full"
        />
        <Button variant="outline">Alterar Imagem</Button>
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
