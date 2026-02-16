import { Link } from 'react-router-dom'

/**
 * Footer principal da aplicação
 * TODO: Expandir com links úteis, redes sociais, newsletter
 */
export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold">F</span>
              </div>
              <span className="text-lg font-bold text-white">FinHub</span>
            </div>
            <p className="text-sm text-gray-400">
              A plataforma de literacia financeira em português.
            </p>
          </div>

          {/* Links Úteis */}
          <div>
            <h3 className="font-semibold text-white mb-4">Explorar</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/explorar/artigos" className="hover:text-white">
                  Artigos
                </Link>
              </li>
              <li>
                <Link to="/explorar/videos" className="hover:text-white">
                  Vídeos
                </Link>
              </li>
              <li>
                <Link to="/explorar/cursos" className="hover:text-white">
                  Cursos
                </Link>
              </li>
              <li>
                <Link to="/criadores" className="hover:text-white">
                  Criadores
                </Link>
              </li>
            </ul>
          </div>

          {/* Recursos */}
          <div>
            <h3 className="font-semibold text-white mb-4">Recursos</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/recursos/corretoras" className="hover:text-white">
                  Corretoras
                </Link>
              </li>
              <li>
                <Link to="/recursos/plataformas" className="hover:text-white">
                  Plataformas
                </Link>
              </li>
              <li>
                <Link to="/aprender/glossario" className="hover:text-white">
                  Glossário
                </Link>
              </li>
              <li>
                <Link to="/aprender/noticias" className="hover:text-white">
                  Notícias
                </Link>
              </li>
            </ul>
          </div>

          {/* Sobre */}
          <div>
            <h3 className="font-semibold text-white mb-4">Sobre</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/sobre" className="hover:text-white">
                  Sobre o FinHub
                </Link>
              </li>
              <li>
                <Link to="/contacto" className="hover:text-white">
                  Contacto
                </Link>
              </li>
              <li>
                <Link to="/faq" className="hover:text-white">
                  FAQ
                </Link>
              </li>
              <li>
                <Link to="/termos" className="hover:text-white">
                  Termos de Uso
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm text-gray-400">
          <p>&copy; 2026 FinHub. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  )
}
