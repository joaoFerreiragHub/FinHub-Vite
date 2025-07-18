// src/mock/mockCourses.ts
import { Course } from "../types/course"

export const mockCourses: Course[] = [
  {
    _id: "c1",
    courseName: "Introdução aos ETFs",
    description: "Aprende como funcionam os ETFs e como investir com segurança a longo prazo.",
    price: 29.99,
    topic: "ETFs",
    bannerImage: "https://source.unsplash.com/random/800x600?etfs",
    purchaseLink: "https://exemplo.com/curso-etfs",
    status: "published",
    views: 0,
  },
  {
    _id: "c2",
    courseName: "Ações de Crescimento",
    description: "Descobre como identificar empresas com elevado potencial de valorização.",
    price: 49.99,
    topic: "Ações",
    bannerImage: "https://source.unsplash.com/random/800x600?stocks",
    purchaseLink: "https://exemplo.com/curso-acoes",
    status: "published",
    views: 0,
  },
  {
    _id: "c3",
    courseName: "REITs e Investimento Imobiliário",
    description: "Investe em imóveis de forma acessível com REITs e fundos imobiliários.",
    price: 39.99,
    topic: "REITs",
    bannerImage: "https://source.unsplash.com/random/800x600?real-estate",
    purchaseLink: "https://exemplo.com/curso-reits",
    status: "published",
    views: 10,
  },
  {
    _id: "c4",
    courseName: "Fundamentos das Criptomoedas",
    description: "Conhece os riscos, oportunidades e estratégias para investir em cripto.",
    price: 59.99,
    topic: "Cripto Moedas",
    bannerImage: "https://source.unsplash.com/random/800x600?crypto",
    purchaseLink: "https://exemplo.com/curso-cripto",
    status: "published",
    views: 5,
  },
  {
    _id: "c5",
    courseName: "Finanças Pessoais para Iniciantes",
    description: "Organiza o teu orçamento, define objetivos e começa a poupar de verdade.",
    price: 19.99,
    topic: "Finanças Pessoais",
    bannerImage: "https://source.unsplash.com/random/800x600?money",
    purchaseLink: "https://exemplo.com/curso-financas",
    status: "published",
    views: 100,
  },
]
