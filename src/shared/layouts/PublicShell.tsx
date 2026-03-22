import { useCallback, useEffect, useState } from 'react'
import { LogIn, Menu, UserPlus, X } from 'lucide-react'
import { Button, ToggleTheme } from '@/components/ui'
import { CookieConsentBanner } from '@/features/auth/components/CookieConsentBanner'
import { LoginDialog, RegisterDialog } from '@/features/auth/components/forms'
import { DEFAULT_COOKIE_CONSENT_VERSION } from '@/features/auth/services/cookieConsentStorage'
import { useAuthStore } from '@/features/auth/stores/useAuthStore'
import { MAIN_NAV_LINKS, ShellFooter, isMainNavActive } from './shellConfig'

const legalVersion = import.meta.env.VITE_LEGAL_VERSION || DEFAULT_COOKIE_CONSENT_VERSION

interface PublicShellProps {
  children: React.ReactNode
  currentPath: string
}

export function PublicShell({ children, currentPath }: PublicShellProps) {
  const [scrolled, setScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [loginOpen, setLoginOpen] = useState(false)
  const [registerOpen, setRegisterOpen] = useState(false)
  const { login, register } = useAuthStore()

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleLogin = useCallback(
    async (email: string, password: string) => {
      await login({ email: email.trim(), password })
      setLoginOpen(false)
    },
    [login],
  )

  const handleRegister = useCallback(
    async (data: {
      name: string
      username: string
      email: string
      password: string
      confirmPassword: string
      termsAccepted: boolean
      privacyAccepted: boolean
      financialDisclaimerAccepted: boolean
      cookieAnalytics: boolean
      cookieMarketing: boolean
      cookiePreferences: boolean
    }) => {
      await register({
        name: data.name.trim(),
        username: data.username.trim(),
        email: data.email.trim(),
        password: data.password,
        confirmPassword: data.confirmPassword,
        legalAcceptance: {
          termsAccepted: data.termsAccepted,
          privacyAccepted: data.privacyAccepted,
          financialDisclaimerAccepted: data.financialDisclaimerAccepted,
          version: legalVersion,
        },
        cookieConsent: {
          analytics: data.cookieAnalytics,
          marketing: data.cookieMarketing,
          preferences: data.cookiePreferences,
          version: legalVersion,
        },
      })
      setRegisterOpen(false)
    },
    [register],
  )

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className={`glass-header ${scrolled ? 'glass-header--scrolled' : ''}`}>
        <div className="flex items-center justify-between h-14 sm:h-16 px-4 sm:px-6 md:px-10 lg:px-12 max-w-[1920px] mx-auto">
          <a href="/" className="flex items-center gap-2 flex-shrink-0">
            <span className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
              Fin<span className="text-primary">Hub</span>
            </span>
          </a>

          <nav className="hidden md:flex items-center gap-1">
            {MAIN_NAV_LINKS.map((navLink) => (
              <a
                key={navLink.path}
                href={navLink.path}
                className={`px-3 lg:px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isMainNavActive(currentPath, navLink)
                    ? 'text-foreground bg-accent/60'
                    : 'text-muted-foreground hover:text-foreground hover:bg-accent/40'
                }`}
              >
                {navLink.label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-2 sm:gap-3">
            <ToggleTheme />

            <div className="hidden sm:flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setLoginOpen(true)}
                className="text-sm"
              >
                <LogIn className="h-4 w-4 mr-1.5" />
                Login
              </Button>
              <Button size="sm" onClick={() => setRegisterOpen(true)} className="text-sm">
                <UserPlus className="h-4 w-4 mr-1.5" />
                Registar
              </Button>
            </div>

            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setMobileMenuOpen((open) => !open)}
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden border-t border-border/30 bg-background/95 backdrop-blur-lg">
            <nav className="flex flex-col p-4 gap-1">
              {MAIN_NAV_LINKS.map((navLink) => {
                const Icon = navLink.icon
                return (
                  <a
                    key={navLink.path}
                    href={navLink.path}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                      isMainNavActive(currentPath, navLink)
                        ? 'text-foreground bg-accent'
                        : 'text-muted-foreground hover:text-foreground hover:bg-accent/50'
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    {navLink.label}
                  </a>
                )
              })}

              <div className="border-t border-border/30 mt-2 pt-2 flex flex-col gap-1">
                <Button
                  variant="ghost"
                  className="justify-start"
                  onClick={() => {
                    setLoginOpen(true)
                    setMobileMenuOpen(false)
                  }}
                >
                  <LogIn className="h-4 w-4 mr-2" />
                  Login
                </Button>
                <Button
                  className="justify-start"
                  onClick={() => {
                    setRegisterOpen(true)
                    setMobileMenuOpen(false)
                  }}
                >
                  <UserPlus className="h-4 w-4 mr-2" />
                  Criar Conta
                </Button>
              </div>
            </nav>
          </div>
        )}
      </header>

      <main>{children}</main>
      <ShellFooter />
      <CookieConsentBanner />

      <LoginDialog open={loginOpen} onOpenChange={setLoginOpen} onLogin={handleLogin} />
      <RegisterDialog
        open={registerOpen}
        onOpenChange={setRegisterOpen}
        onRegister={handleRegister}
      />
    </div>
  )
}
