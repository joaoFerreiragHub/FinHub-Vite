import { useCallback, useEffect, useMemo, useRef, useState, type ElementType } from 'react'
import {
  BarChart3,
  ClipboardList,
  Layers,
  LifeBuoy,
  Newspaper,
  Radar,
  Search,
  Shield,
  ShieldCheck,
  Users,
  FileSpreadsheet,
} from 'lucide-react'
import { useLocation, useNavigate } from '@/lib/reactRouterDomCompat'
import {
  Button,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandShortcut,
} from '@/components/ui'
import { useAuthStore } from '@/features/auth/stores/useAuthStore'
import { getAccessibleAdminModules, type AdminModuleConfig } from '@/features/admin/lib/access'
import {
  getAdminShortcutForModule,
  isTypingEventTarget,
  resolveAdminShortcutPath,
} from '@/features/admin/lib/keyboardShortcuts'
import { cn } from '@/lib/utils'

const GO_SHORTCUT_ARM_TIMEOUT_MS = 1200

const MODULE_ICONS: Record<AdminModuleConfig['key'], ElementType> = {
  dashboard: BarChart3,
  users: Users,
  creators: Radar,
  content: ShieldCheck,
  editorial: Newspaper,
  support: LifeBuoy,
  brands: Layers,
  operations: FileSpreadsheet,
  audit: ClipboardList,
  stats: BarChart3,
}

interface AdminCommandPaletteProps {
  className?: string
}

export default function AdminCommandPalette({ className }: AdminCommandPaletteProps) {
  const [open, setOpen] = useState(false)
  const goShortcutArmedRef = useRef(false)
  const goShortcutTimerRef = useRef<number | null>(null)
  const navigate = useNavigate()
  const location = useLocation()
  const user = useAuthStore((state) => state.user)

  const modules = useMemo(() => getAccessibleAdminModules(user), [user])

  const clearGoShortcutTimer = useCallback(() => {
    if (goShortcutTimerRef.current !== null) {
      window.clearTimeout(goShortcutTimerRef.current)
      goShortcutTimerRef.current = null
    }
  }, [])

  const resetGoShortcut = useCallback(() => {
    goShortcutArmedRef.current = false
    clearGoShortcutTimer()
  }, [clearGoShortcutTimer])

  const armGoShortcut = useCallback(() => {
    goShortcutArmedRef.current = true
    clearGoShortcutTimer()
    goShortcutTimerRef.current = window.setTimeout(() => {
      goShortcutArmedRef.current = false
      goShortcutTimerRef.current = null
    }, GO_SHORTCUT_ARM_TIMEOUT_MS)
  }, [clearGoShortcutTimer])

  useEffect(() => {
    setOpen(false)
    resetGoShortcut()
  }, [location.pathname, resetGoShortcut])

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      const key = event.key.toLowerCase()

      if ((event.ctrlKey || event.metaKey) && key === 'k') {
        event.preventDefault()
        setOpen(true)
        resetGoShortcut()
        return
      }

      if (open) return
      if (isTypingEventTarget(event.target)) return
      if (event.ctrlKey || event.metaKey || event.altKey || event.shiftKey) return

      if (goShortcutArmedRef.current) {
        const nextPath = resolveAdminShortcutPath(user, key)
        resetGoShortcut()
        if (!nextPath) return

        event.preventDefault()
        if (nextPath !== location.pathname) {
          navigate(nextPath)
        }
        return
      }

      if (key === 'g') {
        event.preventDefault()
        armGoShortcut()
      }
    }

    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [armGoShortcut, location.pathname, navigate, open, resetGoShortcut, user])

  useEffect(() => {
    return () => {
      clearGoShortcutTimer()
    }
  }, [clearGoShortcutTimer])

  const navigateToPath = useCallback(
    (path: string) => {
      setOpen(false)
      resetGoShortcut()
      if (path !== location.pathname) {
        navigate(path)
      }
    },
    [location.pathname, navigate, resetGoShortcut],
  )

  return (
    <>
      <div className={cn('flex flex-wrap items-center justify-end gap-2', className)}>
        <Button variant="outline" size="sm" className="h-9 gap-2" onClick={() => setOpen(true)}>
          <Search className="h-4 w-4 text-muted-foreground" />
          <span className="hidden sm:inline">Command palette</span>
          <kbd className="rounded border border-border bg-muted px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground">
            Ctrl+K
          </kbd>
        </Button>
        <span className="hidden text-[11px] text-muted-foreground lg:inline">
          Navegacao rapida: <strong className="font-semibold text-foreground">G + tecla</strong>
        </span>
      </div>

      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Navegar pelos modulos admin..." />
        <CommandList>
          <CommandEmpty>Sem comandos disponiveis para os escopos atuais.</CommandEmpty>
          <CommandGroup heading="Modulos admin">
            {modules.map((moduleConfig) => {
              const Icon = MODULE_ICONS[moduleConfig.key] ?? Shield
              const shortcut = getAdminShortcutForModule(moduleConfig.key).toUpperCase()

              return (
                <CommandItem
                  key={moduleConfig.key}
                  value={`${moduleConfig.label} ${moduleConfig.path}`}
                  onSelect={() => navigateToPath(moduleConfig.path)}
                >
                  <Icon className="h-4 w-4 text-muted-foreground" />
                  <span className="flex-1">{moduleConfig.label}</span>
                  <CommandShortcut>{`G ${shortcut}`}</CommandShortcut>
                </CommandItem>
              )
            })}
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  )
}
