// src/components/auth/LoginDialog.tsx
import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog'
import { Input } from '../ui/input'
import { Label } from '../ui/label'
import { Button } from '../ui/button'
import { LogIn } from 'lucide-react'

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
  onLogin: (email: string, password: string) => Promise<void>
}

export const LoginDialog = ({ open, onOpenChange, onLogin }: Props) => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const validateForm = () => {
    if (!email || !password) {
      setError('Preenche todos os campos.')
      return false
    }
    if (!/^[\w-.]+@[\w-]+\.[a-z]{2,}$/i.test(email)) {
      setError('Email inválido.')
      return false
    }
    return true
  }

  const handleSubmit = async () => {
    setError('')
    if (!validateForm()) return

    setLoading(true)
    try {
      await onLogin(email, password)
      onOpenChange(false)
    } catch {
      setError('Credenciais inválidas.')
    } finally {
      setLoading(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSubmit()
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <LogIn className="w-5 h-5" />
            Entrar na Plataforma
          </DialogTitle>
        </DialogHeader>

        <div className="grid gap-4 pt-2">
          {error && (
            <div className="text-sm text-destructive border border-destructive rounded p-2 bg-destructive/10">
              {error}
            </div>
          )}

          <div className="grid gap-1">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="teu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
              onKeyDown={handleKeyDown}
              autoComplete="email"
            />
          </div>

          <div className="grid gap-1">
            <Label htmlFor="password">Palavra-passe</Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
              onKeyDown={handleKeyDown}
              autoComplete="current-password"
            />
          </div>

          <Button type="button" onClick={handleSubmit} disabled={loading}>
            {loading ? 'A Entrar...' : 'Entrar'}
          </Button>

          <p className="text-sm text-muted-foreground text-center hover:underline cursor-pointer">
            Esqueceste a palavra-passe?
          </p>
        </div>
      </DialogContent>
    </Dialog>
  )
}
