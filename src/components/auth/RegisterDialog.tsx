// src/components/auth/RegisterDialog.tsx
import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog'
import { Button } from '../ui/button'
import { UserPlus } from 'lucide-react'
import { cn } from '../../lib/utils'
import RegistrationFormRUsers from './RegistrationFormRUsers'
import RegistrationFormCreators from './RegistrationFormCreators'


const roles = [
  {
    key: 'RegularUser',
    label: 'Consumidor de Conteúdo',
    description: 'Quero aceder a cursos, artigos e eventos na plataforma.',
    image: './alunos.jpg',
  },
  {
    key: 'CreatorUser',
    label: 'Criador de Conteúdo',
    description: 'Quero publicar conteúdos e ganhar visibilidade.',
    image: './professor.jpg',
  },
]

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
  onRegister: (data: {
    role: 'RegularUser' | 'CreatorUser'
    email: string
    password: string
    username: string
  }) => void
}

export const RegisterDialog = ({ open, onOpenChange}: Props) => {
  const [step, setStep] = useState<'select' | 'form'>('select')
  const [role, setRole] = useState<'RegularUser' | 'CreatorUser' | null>(null)

  const handleRoleSelect = (selectedRole: 'RegularUser' | 'CreatorUser') => {
    setRole(selectedRole)
    setStep('form')
  }

  const handleBack = () => {
    setStep('select')
    setRole(null)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <UserPlus className="w-5 h-5" /> Criar Conta
          </DialogTitle>
        </DialogHeader>

        {step === 'select' && (
          <div className="grid gap-4 pt-2">
            <p className="text-sm text-muted-foreground">
              Que tipo de utilizador queres ser?
            </p>

            <div className="grid gap-4">
              {roles.map((r) => (
                <button
                  key={r.key}
                  onClick={() => handleRoleSelect(r.key as any)}
                  className={cn(
                    'group flex items-center gap-4 p-4 rounded-lg border bg-card transition hover:shadow-md hover:bg-muted/30',
                    r.key === role && 'ring-2 ring-primary border-primary'
                  )}
                >
                  <div className="shrink-0">
                    <img
                      src={r.image}
                      onError={(e) => (e.currentTarget.src = './placeholder-user.svg')}
                      alt={r.label}
                      className="w-14 h-14 object-cover rounded-md bg-muted"
                    />
                  </div>
                  <div className="text-left">
                    <p className="font-semibold text-base leading-tight">{r.label}</p>
                    <p className="text-sm text-muted-foreground leading-snug">{r.description}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

{step === 'form' && role === 'RegularUser' && (
<div className="pt-2 flex justify-center items-center">
  <div className="w-full max-w-lg">
    <RegistrationFormRUsers />
    <div className="mt-4">
      <Button variant="ghost" onClick={handleBack}>
        ← Voltar
      </Button>
    </div>
  </div>
</div>
)}


        {step === 'form' && role === 'CreatorUser' && (
          <div className="pt-2">
            <RegistrationFormCreators />
            <div className="flex justify-start mt-4">
              <Button variant="ghost" onClick={handleBack}>
                ← Voltar
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
