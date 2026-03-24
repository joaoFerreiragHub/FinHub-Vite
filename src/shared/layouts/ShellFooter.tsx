export function ShellFooter() {
  return (
    <footer className="home-footer">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-10 lg:px-12 py-10 sm:py-12">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-8">
          <div className="col-span-2 sm:col-span-1">
            <span className="text-lg font-bold text-foreground">
              Fin<span className="text-primary">Hub</span>
            </span>
            <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
              A plataforma #1 de literacia financeira em Portugal.
            </p>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-foreground mb-3">Explorar</h4>
            <div className="flex flex-col gap-2">
              <a
                href="/creators"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Criadores
              </a>
              <a
                href="/hub/courses"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Cursos
              </a>
              <a
                href="/hub/conteudos"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Conteudos
              </a>
              <a
                href="/hub/books"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Livros
              </a>
            </div>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-foreground mb-3">Recursos</h4>
            <div className="flex flex-col gap-2">
              <a
                href="/mercados/recursos"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Corretoras
              </a>
              <a
                href="/noticias"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Noticias
              </a>
              <a
                href="/ferramentas"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Ferramentas
              </a>
            </div>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-foreground mb-3">Sobre</h4>
            <div className="flex flex-col gap-2">
              <a
                href="/sobre"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Quem somos
              </a>
              <a
                href="/contacto"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Contacto
              </a>
              <a
                href="/faq"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                FAQ
              </a>
              <a
                href="/precos"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Precos
              </a>
              <a
                href="/legal/termos"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Termos
              </a>
              <a
                href="/legal/privacidade"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Privacidade
              </a>
              <a
                href="/legal/cookies"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Cookies
              </a>
              <a
                href="/aviso-legal"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Aviso legal
              </a>
            </div>
          </div>
        </div>
        <div className="border-t border-border/30 mt-8 pt-6 text-center">
          <p className="text-xs text-muted-foreground">
            &copy; 2026 FinHub. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </footer>
  )
}
