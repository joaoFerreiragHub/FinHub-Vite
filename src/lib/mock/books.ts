// src/mock/books.ts

export const mockBooks = [
  {
    _id: 'book1',
    title: 'O Homem Mais Rico da Babilónia',
    author: 'George S. Clason',
    coverImage: 'https://m.media-amazon.com/images/I/81TR4j3QWDL._AC_UF1000,1000_QL80_.jpg',
    summary:
      'Princípios financeiros antigos que continuam a guiar milhões de pessoas para a independência financeira.',
    genres: ['Finanças Pessoais', 'Desenvolvimento Pessoal'],
    averageRating: 4.6,
    ratings: [
      { userId: { _id: 'user1' }, rating: 5 },
      { userId: { _id: 'user2' }, rating: 4 },
    ],
    reviews: [
      {
        userId: { _id: 'user1' },
        review: 'Excelente para quem quer começar a entender como gerir dinheiro.',
      },
      {
        userId: { _id: 'user2' },
        review: 'Simples e prático, mas repetitivo em alguns pontos.',
      },
    ],
  },
  {
    _id: 'book2',
    title: 'Pai Rico, Pai Pobre',
    author: 'Robert T. Kiyosaki',
    coverImage: 'https://m.media-amazon.com/images/I/81bsw6fnUiL._AC_UF1000,1000_QL80_.jpg',
    summary:
      'Descobre o que os ricos ensinam aos filhos sobre dinheiro — que os pobres e a classe média não sabem.',
    genres: ['Finanças', 'Educação Financeira'],
    averageRating: 4.2,
    ratings: [
      { userId: { _id: 'user3' }, rating: 4 },
      { userId: { _id: 'user4' }, rating: 4.5 },
    ],
    reviews: [
      {
        userId: { _id: 'user3' },
        review: 'Uma nova perspectiva sobre dinheiro e ativos.',
      },
    ],
  },
  {
    _id: 'book3',
    title: 'Liberdade Financeira',
    author: 'Tony Robbins',
    coverImage: 'https://m.media-amazon.com/images/I/81xU2oc4HXL._AC_UF1000,1000_QL80_.jpg',
    summary:
      'Estratégias práticas para alcançar a independência financeira baseadas em entrevistas com especialistas.',
    genres: ['Investimento', 'Finanças'],
    averageRating: 4.8,
    ratings: [{ userId: { _id: 'user5' }, rating: 5 }],
    reviews: [
      {
        userId: { _id: 'user5' },
        review: 'Transformador! Um guia completo com dicas acionáveis.',
      },
    ],
  },
  {
    _id: '41e8fc56-3644-46ef-a95f-623bffdc01be',
    title: 'Recusandae eveniet',
    author: 'Jaime Pires',
    coverImage: 'https://placehold.co/300x450?text=Livro',
    summary:
      'Assumenda possimus pariatur ad eius quisquam. Ducimus deleniti aliquid tempore. Aperiam suscipit voluptatem quae deserunt quas.',
    genres: ['Educação Financeira', 'Desenvolvimento Pessoal'],
    averageRating: 4.6,
    ratings: [{ userId: { _id: 'user1' }, rating: 4.5 }],
    reviews: [
      { userId: { _id: 'user2' }, review: 'Porro sequi iure facilis delectus explicabo.' },
      { userId: { _id: 'user3' }, review: 'Corrupti laudantium reprehenderit.' },
      { userId: { _id: 'user4' }, review: 'Nam impedit quia illo libero pariatur.' },
    ],
  },
  {
    _id: '6dc046c0-2f1b-4c06-897c-b877aa2991d9',
    title: 'Officia ex corporis deserunt',
    author: 'Valentina Guerreiro',
    coverImage: 'https://placehold.co/300x450?text=Livro',
    summary: 'Suscipit debitis minima odio quidem. Recusandae beatae maiores consequuntur odio.',
    genres: ['Desenvolvimento Pessoal', 'Economia Comportamental'],
    averageRating: 4.9,
    ratings: [
      { userId: { _id: 'user5' }, rating: 3.2 },
      { userId: { _id: 'user6' }, rating: 3.5 },
    ],
    reviews: [
      { userId: { _id: 'user7' }, review: 'Animi praesentium eius soluta pariatur.' },
      { userId: { _id: 'user8' }, review: 'Explicabo quis libero fugiat facere eos.' },
      { userId: { _id: 'user9' }, review: 'Vitae facilis voluptatum aliquam omnis.' },
    ],
  },
  {
    _id: 'e7f2089d-afd0-411b-98d2-dfdb90753993',
    title: 'Recusandae blanditiis corporis',
    author: 'Isaac do Matias',
    coverImage: 'https://placehold.co/300x450?text=Livro',
    summary: 'Nihil quia rem dolorem quaerat. Unde recusandae voluptates molestiae ipsam libero.',
    genres: ['Economia Comportamental', 'Finanças'],
    averageRating: 4.3,
    ratings: [{ userId: { _id: 'user10' }, rating: 3.9 }],
    reviews: [
      { userId: { _id: 'user11' }, review: 'Consequuntur enim numquam incidunt corrupti.' },
    ],
  },
  {
    _id: '8d3e6b88-9a8a-41e6-8103-c574a6f40376',
    title: 'Officiis ratione nostrum facilis',
    author: 'Ivo Lopes',
    coverImage: 'https://placehold.co/300x450?text=Livro',
    summary:
      'Maiores eos blanditiis veritatis. Vel incidunt consectetur explicabo atque beatae sequi.',
    genres: ['Educação Financeira', 'Finanças'],
    averageRating: 4.6,
    ratings: [{ userId: { _id: 'user12' }, rating: 4.1 }],
    reviews: [
      { userId: { _id: 'user13' }, review: 'Delectus labore quis accusantium fugiat.' },
      {
        userId: { _id: 'user14' },
        review: 'Quaerat dolores corrupti excepturi exercitationem voluptatum rerum.',
      },
    ],
  },
  {
    _id: '4f4d931d-b587-48fb-a0ea-ebebc020eac6',
    title: 'Quis nesciunt dicta nam architecto',
    author: 'Vítor Freitas',
    coverImage: 'https://placehold.co/300x450?text=Livro',
    summary: 'Consequuntur voluptate doloribus atque beatae ea. Labore quibusdam eos dicta.',
    genres: ['Economia Comportamental', 'Investimento'],
    averageRating: 4.5,
    ratings: [
      { userId: { _id: 'user15' }, rating: 3.7 },
      { userId: { _id: 'user16' }, rating: 4.8 },
    ],
    reviews: [{ userId: { _id: 'user17' }, review: 'Quos saepe sed porro.' }],
  },
]
