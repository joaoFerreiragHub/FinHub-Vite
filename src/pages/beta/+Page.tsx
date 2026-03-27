// Garante que urlPathname é serializado para o cliente (necessário para shouldBypassShellLayout)
export const passToClient = ['urlPathname']

export default function BetaPage() {
  return (
    <main className="min-h-screen bg-[#09090B]">
      <div className="flex min-h-screen flex-col items-center justify-center px-6">
        <div className="w-full max-w-[480px]">
          <div className="flex flex-col items-center">
            <p className="text-3xl font-bold text-[#6366F1]">FinHub</p>

            <span className="mt-6 inline-flex items-center rounded-full bg-indigo-500/10 px-3 py-1 text-xs font-medium text-indigo-400 ring-1 ring-inset ring-indigo-500/20">
              Beta Fechado
            </span>

            <h1 className="mt-6 text-center text-2xl font-semibold tracking-tight text-white">
              A plataforma portuguesa de literacia financeira
            </h1>

            <p className="mt-3 text-center text-sm text-zinc-400">
              Estamos em fase de beta fechado. Se recebeste um convite, podes criar conta. Caso
              contrario, entra com a tua conta existente.
            </p>

            <div className="mt-8 flex w-full max-w-xs flex-col gap-3">
              <a
                href="/login"
                className="inline-flex w-full items-center justify-center rounded-md bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-indigo-500"
              >
                Entrar na minha conta
              </a>
              <a
                href="/registar"
                className="inline-flex w-full items-center justify-center rounded-md border border-zinc-700 bg-transparent px-4 py-2.5 text-sm font-medium text-zinc-300 transition-colors hover:bg-zinc-800"
              >
                Criar conta com convite
              </a>
            </div>

            <p className="mt-12 text-center text-xs text-zinc-600">&copy; 2026 FinHub</p>
          </div>
        </div>
      </div>
    </main>
  )
}
