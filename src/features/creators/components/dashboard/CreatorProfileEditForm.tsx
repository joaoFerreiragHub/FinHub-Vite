import { useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import { Loader2, Plus, Trash2 } from 'lucide-react'
import { Button, Input, Label, Textarea } from '@/components/ui'
import { authService } from '@/features/auth/services/authService'
import { useAuthStore } from '@/features/auth/stores/useAuthStore'
import type { User, UserSocialLinks } from '@/features/auth/types'
import { getErrorMessage } from '@/lib/api/client'
import { useToast } from '@/shared/hooks/use-toast'

type SocialPlatform = 'website' | 'twitter' | 'linkedin' | 'youtube' | 'instagram'

interface SocialRow {
  id: string
  platform: SocialPlatform
  url: string
}

interface ProfileFormState {
  name: string
  bio: string
  avatar: string
  welcomeVideoUrl: string
  topics: string[]
  socialRows: SocialRow[]
}

interface CreatorProfileEditFormProps {
  onCancel?: () => void
  onSaved?: () => void
}

const TOPIC_OPTIONS = [
  'Poupanca',
  'Investimento',
  'ETFs',
  'Acoes',
  'Imobiliario',
  'Cripto',
  'FIRE',
  'Financas Pessoais',
  'Outros',
] as const

const MAX_TOPICS = 5

const SOCIAL_PLATFORM_OPTIONS: Array<{ value: SocialPlatform; label: string }> = [
  { value: 'website', label: 'Website' },
  { value: 'twitter', label: 'Twitter/X' },
  { value: 'linkedin', label: 'LinkedIn' },
  { value: 'youtube', label: 'YouTube' },
  { value: 'instagram', label: 'Instagram' },
]

const createRowId = (): string => `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`

const buildSocialRows = (socialLinks?: UserSocialLinks): SocialRow[] => {
  if (!socialLinks) return []

  const rows: SocialRow[] = []

  if (socialLinks.website) {
    rows.push({ id: createRowId(), platform: 'website', url: socialLinks.website })
  }
  if (socialLinks.twitter) {
    rows.push({ id: createRowId(), platform: 'twitter', url: socialLinks.twitter })
  }
  if (socialLinks.linkedin) {
    rows.push({ id: createRowId(), platform: 'linkedin', url: socialLinks.linkedin })
  }
  if (socialLinks.youtube) {
    rows.push({ id: createRowId(), platform: 'youtube', url: socialLinks.youtube })
  }
  if (socialLinks.instagram) {
    rows.push({ id: createRowId(), platform: 'instagram', url: socialLinks.instagram })
  }

  return rows
}

const toInitialState = (user: User | null): ProfileFormState => ({
  name: user?.name ?? '',
  bio: user?.bio ?? '',
  avatar: user?.avatar ?? '',
  welcomeVideoUrl: user?.welcomeVideoUrl ?? '',
  topics: Array.isArray(user?.favoriteTopics) ? user.favoriteTopics.slice(0, MAX_TOPICS) : [],
  socialRows: buildSocialRows(user?.socialLinks),
})

const pickFirstUnusedPlatform = (rows: SocialRow[]): SocialPlatform => {
  const used = new Set(rows.map((row) => row.platform))
  const firstUnused = SOCIAL_PLATFORM_OPTIONS.find((option) => !used.has(option.value))
  return firstUnused?.value ?? 'website'
}

export function CreatorProfileEditForm({ onCancel, onSaved }: CreatorProfileEditFormProps) {
  const user = useAuthStore((state) => state.user)
  const updateUser = useAuthStore((state) => state.updateUser)
  const { toastError, toastSuccess, toastWarning } = useToast()

  const initialState = toInitialState(user)
  const [form, setForm] = useState<ProfileFormState>(initialState)

  const saveMutation = useMutation({
    mutationFn: async () => {
      const name = form.name.trim()
      const bio = form.bio.trim()
      const avatar = form.avatar.trim()
      const welcomeVideoUrl = form.welcomeVideoUrl.trim()
      const topics = Array.from(
        new Set(form.topics.map((topic) => topic.trim()).filter((topic) => topic.length > 0)),
      ).slice(0, MAX_TOPICS)

      if (!name) {
        throw new Error('O nome e obrigatorio.')
      }

      if (bio.length > 500) {
        throw new Error('A bio suporta no maximo 500 caracteres.')
      }

      const socialLinksPayload: {
        website: string | null
        twitter: string | null
        linkedin: string | null
        youtube: string | null
        instagram: string | null
      } = {
        website: null,
        twitter: null,
        linkedin: null,
        youtube: null,
        instagram: null,
      }

      for (const row of form.socialRows) {
        const normalizedUrl = row.url.trim()
        if (!normalizedUrl) continue
        socialLinksPayload[row.platform] = normalizedUrl
      }

      return authService.updateMyProfile({
        name,
        bio: bio.length > 0 ? bio : null,
        avatar: avatar.length > 0 ? avatar : null,
        welcomeVideoUrl: welcomeVideoUrl.length > 0 ? welcomeVideoUrl : null,
        topics,
        socialLinks: socialLinksPayload,
      })
    },
    onSuccess: (result) => {
      updateUser({
        name: result.user.name,
        bio: result.user.bio ?? undefined,
        avatar: result.user.avatar ?? undefined,
        welcomeVideoUrl: result.user.welcomeVideoUrl ?? undefined,
        socialLinks: result.user.socialLinks ?? undefined,
        favoriteTopics: result.user.favoriteTopics ?? [],
        updatedAt: result.user.updatedAt,
      })
      toastSuccess(result.message || 'Perfil publico atualizado com sucesso.')
      onSaved?.()
    },
    onError: (error) => {
      toastError(getErrorMessage(error))
    },
  })

  const toggleTopic = (topic: string) => {
    setForm((previous) => {
      const alreadySelected = previous.topics.includes(topic)
      if (alreadySelected) {
        return {
          ...previous,
          topics: previous.topics.filter((item) => item !== topic),
        }
      }

      if (previous.topics.length >= MAX_TOPICS) {
        toastWarning(`Podes selecionar no maximo ${MAX_TOPICS} topicos.`)
        return previous
      }

      return {
        ...previous,
        topics: [...previous.topics, topic],
      }
    })
  }

  const addSocialRow = () => {
    setForm((previous) => ({
      ...previous,
      socialRows: [
        ...previous.socialRows,
        {
          id: createRowId(),
          platform: pickFirstUnusedPlatform(previous.socialRows),
          url: '',
        },
      ],
    }))
  }

  const removeSocialRow = (rowId: string) => {
    setForm((previous) => ({
      ...previous,
      socialRows: previous.socialRows.filter((row) => row.id !== rowId),
    }))
  }

  const updateSocialRow = (rowId: string, patch: Partial<Omit<SocialRow, 'id'>>) => {
    setForm((previous) => ({
      ...previous,
      socialRows: previous.socialRows.map((row) =>
        row.id === rowId
          ? {
              ...row,
              ...patch,
            }
          : row,
      ),
    }))
  }

  const handleCancel = () => {
    setForm(initialState)
    onCancel?.()
  }

  const saveButtonLabel = saveMutation.isPending ? 'A guardar...' : 'Guardar'

  return (
    <div className="space-y-5 rounded-lg border border-border/60 bg-card/70 p-5">
      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <Label htmlFor="creator-profile-name">Nome *</Label>
          <Input
            id="creator-profile-name"
            value={form.name}
            onChange={(event) => setForm((previous) => ({ ...previous, name: event.target.value }))}
            placeholder="Nome publico"
          />
        </div>
        <div>
          <Label htmlFor="creator-profile-avatar">URL do Avatar</Label>
          <Input
            id="creator-profile-avatar"
            type="url"
            value={form.avatar}
            onChange={(event) =>
              setForm((previous) => ({ ...previous, avatar: event.target.value }))
            }
            placeholder="https://..."
          />
        </div>
      </div>

      <div>
        <Label htmlFor="creator-profile-bio">Bio (max 500)</Label>
        <Textarea
          id="creator-profile-bio"
          rows={4}
          maxLength={500}
          value={form.bio}
          onChange={(event) => setForm((previous) => ({ ...previous, bio: event.target.value }))}
          placeholder="Resumo publico do teu perfil"
        />
        <p className="mt-1 text-xs text-muted-foreground">{form.bio.length}/500</p>
      </div>

      <div>
        <Label htmlFor="creator-profile-welcome-video">Welcome Video URL</Label>
        <Input
          id="creator-profile-welcome-video"
          type="url"
          value={form.welcomeVideoUrl}
          onChange={(event) =>
            setForm((previous) => ({ ...previous, welcomeVideoUrl: event.target.value }))
          }
          placeholder="https://youtube.com/watch?v=..."
        />
      </div>

      <div>
        <Label>Topicos (max 5)</Label>
        <div className="mt-2 flex flex-wrap gap-2">
          {TOPIC_OPTIONS.map((topic) => {
            const selected = form.topics.includes(topic)
            return (
              <button
                key={topic}
                type="button"
                className={`rounded-full border px-3 py-1 text-xs transition-colors ${
                  selected
                    ? 'border-primary bg-primary text-primary-foreground'
                    : 'border-border bg-background text-muted-foreground hover:text-foreground'
                }`}
                onClick={() => toggleTopic(topic)}
              >
                {topic}
              </button>
            )
          })}
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between gap-3">
          <Label>Redes sociais</Label>
          <Button type="button" variant="outline" size="sm" onClick={addSocialRow}>
            <Plus className="mr-1 h-4 w-4" />
            Adicionar
          </Button>
        </div>

        {form.socialRows.length === 0 ? (
          <p className="text-sm text-muted-foreground">Sem redes configuradas.</p>
        ) : (
          <div className="space-y-2">
            {form.socialRows.map((row) => (
              <div key={row.id} className="grid gap-2 md:grid-cols-[180px_minmax(0,1fr)_auto]">
                <select
                  className="h-10 rounded-md border border-input bg-background px-3 text-sm"
                  value={row.platform}
                  onChange={(event) =>
                    updateSocialRow(row.id, { platform: event.target.value as SocialPlatform })
                  }
                >
                  {SOCIAL_PLATFORM_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                <Input
                  type="url"
                  placeholder="https://..."
                  value={row.url}
                  onChange={(event) => updateSocialRow(row.id, { url: event.target.value })}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => removeSocialRow(row.id)}
                  aria-label="Remover rede social"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="flex flex-wrap gap-2">
        <Button
          type="button"
          onClick={() => saveMutation.mutate()}
          disabled={saveMutation.isPending}
        >
          {saveMutation.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
          {saveButtonLabel}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={handleCancel}
          disabled={saveMutation.isPending}
        >
          Cancelar
        </Button>
      </div>
    </div>
  )
}

export default CreatorProfileEditForm
