const linkClass = 'text-muted-foreground transition-colors hover:text-foreground'

export default function Footer() {
  return (
    <footer className="mt-12 border-t border-border bg-muted/20">
      <div className="mx-auto w-full max-w-[1600px] px-4 py-10 sm:px-6 lg:px-10">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          <div className="col-span-2 md:col-span-1">
            <div className="mb-4 flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <span className="text-sm font-bold">F</span>
              </div>
              <span className="text-lg font-semibold">
                Fin<span className="text-primary">Hub</span>
              </span>
            </div>
            <p className="text-sm text-muted-foreground">
              Plataforma de literacia financeira com foco em navegacao simples e conteudo pratico.
            </p>
          </div>

          <div>
            <h3 className="mb-3 text-sm font-semibold text-foreground">Explorar</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="/hub/conteudos" className={linkClass}>
                  Tudo
                </a>
              </li>
              <li>
                <a href="/hub/conteudos/artigos" className={linkClass}>
                  Artigos
                </a>
              </li>
              <li>
                <a href="/hub/conteudos/videos" className={linkClass}>
                  Videos
                </a>
              </li>
              <li>
                <a href="/hub/conteudos/cursos" className={linkClass}>
                  Cursos
                </a>
              </li>
              <li>
                <a href="/creators" className={linkClass}>
                  Criadores
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="mb-3 text-sm font-semibold text-foreground">Recursos</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="/recursos/corretoras" className={linkClass}>
                  Corretoras
                </a>
              </li>
              <li>
                <a href="/recursos/plataformas" className={linkClass}>
                  Plataformas
                </a>
              </li>
              <li>
                <a href="/recursos/apps" className={linkClass}>
                  Apps
                </a>
              </li>
              <li>
                <a href="/recursos/sites" className={linkClass}>
                  Sites
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="mb-3 text-sm font-semibold text-foreground">Informacao</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="/sobre" className={linkClass}>
                  Sobre
                </a>
              </li>
              <li>
                <a href="/contacto" className={linkClass}>
                  Contacto
                </a>
              </li>
              <li>
                <a href="/faq" className={linkClass}>
                  FAQ
                </a>
              </li>
              <li>
                <a href="/legal/termos" className={linkClass}>
                  Termos
                </a>
              </li>
              <li>
                <a href="/legal/privacidade" className={linkClass}>
                  Privacidade
                </a>
              </li>
              <li>
                <a href="/legal/cookies" className={linkClass}>
                  Cookies
                </a>
              </li>
              <li>
                <a href="/aviso-legal" className={linkClass}>
                  Aviso legal
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 border-t border-border pt-6 text-center text-xs text-muted-foreground">
          <p>&copy; 2026 FinHub. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  )
}
