import { Link } from 'react-router-dom'

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
                <Link
                  to="/explorar/tudo"
                  className="text-muted-foreground transition-colors hover:text-foreground"
                >
                  Tudo
                </Link>
              </li>
              <li>
                <Link
                  to="/explorar/artigos"
                  className="text-muted-foreground transition-colors hover:text-foreground"
                >
                  Artigos
                </Link>
              </li>
              <li>
                <Link
                  to="/explorar/videos"
                  className="text-muted-foreground transition-colors hover:text-foreground"
                >
                  Videos
                </Link>
              </li>
              <li>
                <Link
                  to="/explorar/cursos"
                  className="text-muted-foreground transition-colors hover:text-foreground"
                >
                  Cursos
                </Link>
              </li>
              <li>
                <Link
                  to="/criadores"
                  className="text-muted-foreground transition-colors hover:text-foreground"
                >
                  Criadores
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="mb-3 text-sm font-semibold text-foreground">Recursos</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  to="/recursos/corretoras"
                  className="text-muted-foreground transition-colors hover:text-foreground"
                >
                  Corretoras
                </Link>
              </li>
              <li>
                <Link
                  to="/recursos/plataformas"
                  className="text-muted-foreground transition-colors hover:text-foreground"
                >
                  Plataformas
                </Link>
              </li>
              <li>
                <Link
                  to="/recursos/apps"
                  className="text-muted-foreground transition-colors hover:text-foreground"
                >
                  Apps
                </Link>
              </li>
              <li>
                <Link
                  to="/recursos/sites"
                  className="text-muted-foreground transition-colors hover:text-foreground"
                >
                  Sites
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="mb-3 text-sm font-semibold text-foreground">Informacao</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  to="/sobre"
                  className="text-muted-foreground transition-colors hover:text-foreground"
                >
                  Sobre
                </Link>
              </li>
              <li>
                <Link
                  to="/contacto"
                  className="text-muted-foreground transition-colors hover:text-foreground"
                >
                  Contacto
                </Link>
              </li>
              <li>
                <Link
                  to="/faq"
                  className="text-muted-foreground transition-colors hover:text-foreground"
                >
                  FAQ
                </Link>
              </li>
              <li>
                <Link
                  to="/termos"
                  className="text-muted-foreground transition-colors hover:text-foreground"
                >
                  Termos
                </Link>
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
