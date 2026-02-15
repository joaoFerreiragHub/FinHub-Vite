// src/pages/index.page.tsx

import { ShowBooks } from '@/features/hub/books/components'
import { mockCreators } from '../features/creators/components/api/mockCreators'
import { CarouselCreators } from '../features/creators/components/carousel/CarouselCreators'
import SidebarLayout from '@/shared/layouts/SidebarLayout'
import {
  Button,
  Card,
  CardContent,
  Carousel,
  CarouselContent,
  CarouselItem,
  Separator,
} from '@/components/ui'

export function Page() {
  return (
    <SidebarLayout>
      {/* Hero Section */}
      <section className="text-center py-20 px-6 bg-gradient-to-br from-primary/10 to-background">
        <h2 className="text-4xl font-bold mb-4">
          Bem-vindo à plataforma #1 de literacia financeira em Portugal 🌟
        </h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Aprende a gerir o teu dinheiro, investir com confiança e atingir a tua liberdade
          financeira com ferramentas simples e conteúdo de valor.
        </p>
        <div className="mt-6">
          <Button size="lg">Começar agora</Button>
        </div>
      </section>

      {/* Bloco: Criadores em Destaque */}
      <section className="px-6 py-12 max-w-6xl mx-auto">
        <h3 className="text-2xl font-bold mb-2">🎯 Criadores em Destaque</h3>
        <p className="text-muted-foreground mb-4">Aprende com os melhores da comunidade.</p>

        <CarouselCreators creators={mockCreators} maxToShow={6} />

        <div className="text-center mt-4">
          <Button variant="link">Explora todos os criadores →</Button>
        </div>
      </section>

      {/* Bloco: Corretoras Populares */}
      <section className="px-6 py-12 max-w-6xl mx-auto">
        <h3 className="text-2xl font-bold mb-2">💼 Corretoras Populares</h3>
        <p className="text-muted-foreground mb-4">Compara e escolhe a melhor plataforma para ti.</p>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
          {/* BrokerCard - 3 corretoras */}
        </div>
        <div className="text-center mt-4">
          <Button variant="link">Ver todas as corretoras →</Button>
        </div>
      </section>

      {/* Bloco: Ferramentas da FinHub */}
      <section className="px-6 py-12 max-w-6xl mx-auto">
        <h3 className="text-2xl font-bold mb-2">🛠️ Ferramentas FinHub</h3>
        <p className="text-muted-foreground mb-4">
          Usa ferramentas práticas para melhorar a tua vida financeira.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {/* ToolCard - Simulador / Orçamento / Comparador */}
        </div>
        <div className="text-center mt-4">
          <Button variant="link">Explorar todas as ferramentas →</Button>
        </div>
      </section>

      {/* Bloco: Livros */}
      <section className="px-6 py-12 max-w-6xl mx-auto">
        <h3 className="text-2xl font-bold mb-2 text-center">📚 Livros</h3>
        <p className="text-muted-foreground mb-6 text-center">
          Descobre livros essenciais sobre dinheiro, mentalidade e liberdade financeira.
        </p>
        <ShowBooks />
      </section>

      {/* Bloco: Comunidades e Podcasts */}
      <section className="px-6 py-12 max-w-6xl mx-auto">
        <h3 className="text-2xl font-bold mb-2">📚 Comunidades & Podcasts</h3>
        <p className="text-muted-foreground mb-4">
          Descobre espaços onde se fala de dinheiro sem tabus.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* PodcastCard + CommunityCard */}
        </div>
        <div className="text-center mt-4">
          <Button variant="link">Ver mais recursos →</Button>
        </div>
      </section>

      {/* Bloco: Eventos Futuros */}
      <section className="px-6 py-12 max-w-4xl mx-auto">
        <h3 className="text-2xl font-bold mb-4 text-center">🗓️ Eventos a não perder</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* EventCard - mostrar 2 eventos */}
        </div>
        <div className="text-center mt-4">
          <Button variant="link">Ver todos os eventos →</Button>
        </div>
      </section>

      <Separator className="my-12" />

      {/* Carousel Section */}
      <section className="px-6 py-12 max-w-6xl mx-auto">
        <h3 className="text-2xl font-bold mb-6 text-center">Depoimentos de quem já usa ✨</h3>
        <Carousel>
          <CarouselContent className="flex gap-4">
            {[1, 2, 3].map((item) => (
              <CarouselItem key={item} className="min-w-[300px]">
                <Card>
                  <CardContent className="p-6">
                    <p className="text-sm text-muted-foreground italic">
                      "Com a FinHub finalmente percebi como organizar as minhas finanças. Recomendo
                      a toda a gente!"
                    </p>
                    <p className="text-xs mt-2 text-right">- Joana, utilizadora premium</p>
                  </CardContent>
                </Card>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      </section>

      {/* Footer */}
      <footer className="text-sm text-center text-muted-foreground py-12">
        &copy; 2025 FinHub. Todos os direitos reservados.
      </footer>
    </SidebarLayout>
  )
}

export default {
  Page,
}
