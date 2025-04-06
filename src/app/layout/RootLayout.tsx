import { Header } from '../../components/layout/Header'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex">
      <main className="flex-1">
        <Header />
        {children}
      </main>
    </div>
  )
}
