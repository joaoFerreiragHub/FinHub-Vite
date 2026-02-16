# 🎮 Fase 8: Sistema de Gamificação e Métricas de Impacto

**Data**: 2026-02-16
**Status**: 📝 **PLANEAMENTO**
**Objetivo**: Sistema completo de pontos, níveis, badges e rankings para incentivar contribuições

---

## 📋 Visão Geral

Sistema de **gamificação** para medir, recompensar e visualizar as contribuições de cada tipo de utilizador na plataforma FinHub.

**Inspiração**: Stack Overflow, Reddit, Duolingo

---

## 🎯 Componentes do Sistema

### 1. Sistema de Pontos (XP - Experience Points)

**Objetivo**: Quantificar o valor das contribuições.

#### Ações que Geram XP

**Para Creators:**
- Publicar artigo: +50 XP
- Publicar vídeo: +100 XP
- Publicar curso: +200 XP
- Publicar live/evento: +150 XP
- Publicar podcast: +75 XP
- Publicar book review: +60 XP
- Receber view: +1 XP
- Receber like: +5 XP
- Receber comentário: +10 XP
- Receber rating 5★: +20 XP
- Receber rating 4★: +10 XP
- Conteúdo destacado (featured): +100 XP bonus
- Novo seguidor: +15 XP

**Para Users (free/premium):**
- Dar rating: +2 XP
- Escrever comentário: +5 XP
- Receber like no comentário: +3 XP
- Seguir creator: +1 XP
- Favoritar conteúdo: +1 XP
- Login diário: +5 XP
- Streak de 7 dias: +50 XP bonus
- Streak de 30 dias: +200 XP bonus
- Primeiro comentário: +10 XP bonus
- Primeiro rating: +5 XP bonus

**Penalizações:**
- Comentário reportado e removido: -50 XP
- Rating spam detectado: -20 XP

---

### 2. Sistema de Níveis

**Progressão visual do utilizador.**

```
Nível 1: 🌱 Iniciante        (0-100 XP)
Nível 2: 🌿 Aprendiz         (100-300 XP)
Nível 3: 🍀 Entusiasta       (300-700 XP)
Nível 4: 🌳 Conhecedor       (700-1500 XP)
Nível 5: 🏆 Especialista     (1500-3000 XP)
Nível 6: 💎 Veterano         (3000-6000 XP)
Nível 7: 👑 Mestre           (6000-10000 XP)
Nível 8: ⭐ Lenda            (10000+ XP)
```

**Benefícios por Nível:**

**Nível 3+:**
- Badge verificado no perfil
- Acesso a analytics básicas

**Nível 5+:**
- Analytics detalhadas
- Possibilidade de ser featured
- Badge "Trusted" em reviews

**Nível 7+:**
- Destaque especial no perfil
- Prioridade em sugestões
- Acesso antecipado a features

**Nível 8:**
- Badge "Lenda" dourado
- Featured permanente
- Menção na página "Hall of Fame"

---

### 3. Sistema de Badges (Conquistas)

**Objetivo**: Recompensar marcos específicos e incentivar comportamentos.

#### Categorias de Badges

**🎬 Badges de Creator - Publicação**
- **"First Steps"** 🚀 - Publicar primeiro conteúdo
- **"Prolífico"** 📝 - 50+ conteúdos publicados
- **"Centúria"** 💯 - 100+ conteúdos publicados
- **"Multi-formato"** 🎭 - Publicar em 4+ formatos diferentes
- **"Consistente"** 📅 - Publicar por 12 meses consecutivos

**⭐ Badges de Creator - Qualidade**
- **"5 Estrelas"** ⭐ - Média 5★ em 10+ ratings
- **"Aclamado"** 🌟 - 100+ ratings com média 4.5+
- **"Editor's Choice"** 🏅 - 10+ conteúdos featured
- **"Best of Year"** 🏆 - Top 10 do ano

**👥 Badges de Creator - Audiência**
- **"Popular"** 📈 - 1000+ views num conteúdo
- **"Viral"** 🔥 - 10000+ views num conteúdo
- **"Influente"** 💬 - 1000+ seguidores
- **"Celebrity"** 🌟 - 10000+ seguidores
- **"Engajador"** 💭 - 500+ comentários nos conteúdos

**💬 Badges de User - Participação**
- **"Comentarista"** 💭 - 50+ comentários
- **"Super Critic"** ⭐ - 100+ ratings dados
- **"Curador"** ❤️ - 100+ favoritos
- **"Explorador"** 🔍 - Seguir 50+ creators
- **"Leal"** 🎯 - 100 dias consecutivos de login

**🏅 Badges de User - Qualidade**
- **"Helpful"** 👍 - 100+ likes em comentários
- **"Thoughtful"** 💡 - Comentário destacado (pinned) 10x
- **"Trusted Reviewer"** ✅ - 50+ ratings com reviews detalhadas

**🎓 Badges de Educação**
- **"Student"** 📚 - Completar 5 cursos
- **"Scholar"** 🎓 - Completar 20 cursos
- **"Bookworm"** 📖 - Ler 50+ artigos
- **"Podcast Fan"** 🎙️ - Ouvir 50+ podcasts

**💎 Badges Especiais (Raros)**
- **"Early Adopter"** 🚀 - Registar nos primeiros 100 users
- **"Beta Tester"** 🧪 - Participar no beta
- **"Bug Hunter"** 🐛 - Reportar bugs válidos
- **"Community Hero"** 🦸 - Contribuição excepcional
- **"FinHub Legend"** 👑 - Alcançar todos os badges principais

---

### 4. Métricas de Impacto

**Dashboard Analytics para cada tipo de utilizador.**

#### Para Creators

**Reach (Alcance):**
- Total de views (all-time)
- Unique viewers
- Views por conteúdo (média)
- Views por período (gráfico)

**Engagement (Envolvimento):**
- Engagement Rate: `(likes + comments + favorites) / views * 100`
- Comentários por conteúdo (média)
- Likes por conteúdo (média)
- Share rate (futuro)

**Growth (Crescimento):**
- Novos seguidores (por período)
- Growth rate mensal
- Tendência (crescendo/estável/decrescendo)

**Quality (Qualidade):**
- Média de ratings (all-time)
- Quality Score: `averageRating * sqrt(ratingsCount)`
- Distribuição de ratings (5★, 4★, etc.)
- % de conteúdos featured

**Consistency (Consistência):**
- Frequência de publicação (posts/mês)
- Streak de publicação (dias consecutivos)
- Formatos utilizados

**Top Content:**
- Top 5 conteúdos por views
- Top 5 por engagement
- Top 5 por ratings

#### Para Users

**Participation (Participação):**
- Comentários feitos
- Ratings dados
- Conteúdos favoritados
- Creators seguidos

**Quality (Qualidade dos Comentários):**
- Likes recebidos em comentários
- Comentários destacados (pinned)
- Respostas geradas

**Exploration (Exploração):**
- Variedade de creators seguidos
- Variedade de categorias consumidas
- Novos creators descobertos

**Loyalty (Lealdade):**
- Dias na plataforma
- Login streak (dias consecutivos)
- Frequência de visitas

**Social Impact:**
- Respostas geradas nos comentários
- Discussões iniciadas
- Helpfulness score (likes/comment)

#### Para Admins

**Curation:**
- Brands adicionadas
- Conteúdos featured
- Categorização feita

**Moderation:**
- Comentários moderados
- Conteúdos revistos
- Reports resolvidos

**Community Health:**
- Rating médio da plataforma
- Engagement rate geral
- Growth rate de utilizadores

---

### 5. Leaderboards (Rankings)

**Rankings periódicos para criar competição saudável.**

#### Tipos de Leaderboards

**🏆 Top Creators (Mensal/Anual):**
- **Por XP Total** - Maior pontuação geral
- **Por Engagement** - Maior taxa de engagement
- **Por Qualidade** - Melhor quality score
- **Por Crescimento** - Maior % de crescimento
- **Rising Stars** - Creators novos com melhor performance

**💬 Top Commenters (Mensal/Anual):**
- **Por Volume** - Mais comentários
- **Por Qualidade** - Mais likes em comentários
- **Most Helpful** - Comentários mais úteis

**⭐ Top Reviewers (Mensal/Anual):**
- **Por Volume** - Mais ratings dados
- **Most Trusted** - Reviews mais detalhadas e úteis

**🔥 Trending (Semanal):**
- **Conteúdos em Alta** - Mais views esta semana
- **Creators em Alta** - Maior crescimento esta semana
- **Discussões em Alta** - Posts com mais comentários

#### Estrutura de Ranking

```typescript
{
  period: 'weekly' | 'monthly' | 'yearly' | 'all-time',
  periodDate: Date,
  category: 'creators' | 'commenters' | 'reviewers' | 'trending',
  rankings: [
    {
      rank: 1,
      userId: ObjectId,
      user: { name, username, avatar },
      score: 12543,
      metrics: {
        totalXP: 12543,
        contentsPublished: 45,
        totalViews: 234567,
        engagementRate: 12.5,
        // ...
      }
    }
  ]
}
```

---

### 6. Sistema de Incentivos

**Recompensas tangíveis baseadas em performance.**

#### Recompensas para Top Performers

**Top 10 Mensal (Creators):**
- Featured automático por 1 mês
- Badge "Top 10" no perfil
- Destaque na homepage
- +500 XP bonus

**Top 3 Anual (Creators):**
- Featured permanente por 1 ano
- Badge especial "Best of 2026"
- Entrevista destacada
- +5000 XP bonus
- Possível monetização prioritária (futuro)

**Top Commenters/Reviewers:**
- Badge "Trusted Voice"
- Comentários destacados
- Acesso premium temporário

**Hall of Fame:**
- Página dedicada aos "Legends"
- Users nível 8 ou Top 3 de vários anos

---

## 🗂️ Implementação Técnica

### Novos Models

#### 1. UserStats
```typescript
{
  userId: ObjectId,
  totalXP: number,
  level: number,
  currentLevelXP: number,    // XP no nível atual
  nextLevelXP: number,        // XP necessário para próximo nível
  badges: string[],           // Array de badge codes

  activityStreak: number,     // Dias consecutivos de login
  lastActivity: Date,

  metrics: {
    // Creator metrics
    contentsPublished: number,
    totalViews: number,
    totalLikes: number,
    totalComments: number,
    totalFavorites: number,
    totalRatingsReceived: number,
    averageRating: number,
    followersCount: number,

    // User metrics
    commentsGiven: number,
    ratingsGiven: number,
    favoritesGiven: number,
    followingCount: number,
    commentLikesReceived: number,

    // Calculated
    engagementRate: number,
    qualityScore: number
  },

  createdAt: Date,
  updatedAt: Date
}
```

#### 2. ActivityLog
```typescript
{
  userId: ObjectId,
  action: string,           // 'publish_content', 'give_rating', 'comment', etc.
  targetType?: string,      // 'article', 'video', etc.
  targetId?: ObjectId,
  xpEarned: number,
  metadata?: Object,        // Dados extras
  timestamp: Date
}
```

#### 3. Badge
```typescript
{
  code: string,             // 'first-content', 'popular', etc.
  name: string,
  description: string,
  icon: string,
  category: string,         // 'creator', 'user', 'special'
  tier: 'bronze' | 'silver' | 'gold' | 'platinum',

  requirements: {
    type: 'count' | 'threshold' | 'streak' | 'special',
    metric: string,         // 'contentsPublished', 'totalViews', etc.
    value: number,
    condition?: string      // Condição extra se necessário
  },

  xpReward: number,         // XP ao desbloquear
  isSecret: boolean,        // Badge secreto (surpresa)

  createdAt: Date
}
```

#### 4. Leaderboard
```typescript
{
  period: 'weekly' | 'monthly' | 'yearly' | 'all-time',
  periodDate: Date,         // Ex: 2026-02-01 (primeiro dia do período)
  category: string,         // 'creators', 'commenters', 'reviewers'

  rankings: [{
    rank: number,
    userId: ObjectId,
    score: number,
    metrics: Object
  }],

  generatedAt: Date,
  expiresAt: Date
}
```

---

## 🌐 Endpoints Necessários

### User Stats
```
GET    /api/stats/me                    - Minhas estatísticas
GET    /api/stats/:userId               - Stats de outro user (público)
GET    /api/stats/me/progress           - Progresso para próximo nível
```

### Badges
```
GET    /api/badges                      - Todos os badges disponíveis
GET    /api/badges/me                   - Meus badges desbloqueados
GET    /api/badges/:userId              - Badges de outro user
```

### Leaderboards
```
GET    /api/leaderboard/:category       - Ranking por categoria
Query: ?period=monthly&limit=100

GET    /api/leaderboard/me              - Minha posição nos rankings
```

### Activity
```
GET    /api/activity/me                 - Meu histórico de atividades
Query: ?page=1&limit=50

POST   /api/activity/log                - Log de atividade (interno)
```

---

## 🎨 Frontend Components

### Novos Componentes

**Stats Card:**
- Nível atual + barra de progresso
- XP atual / XP para próximo nível
- Badges em destaque (últimos 3 desbloqueados)

**Level Badge:**
- Ícone do nível
- Tooltip com info

**Badges Gallery:**
- Grid de todos os badges
- Desbloqueados (coloridos) vs Bloqueados (cinza)
- Tooltip com requisitos

**Progress Bar:**
- Barra visual de XP
- Animação ao ganhar XP

**Leaderboard Table:**
- Ranking com posição, user, score
- Highlight do user logado
- Filtros por período/categoria

**Activity Feed:**
- Timeline de atividades recentes
- "Ganhou 50 XP por publicar artigo"
- "Desbloqueou badge 'Popular'"

**Impact Dashboard (Creators):**
- Charts de views, engagement
- Métricas comparativas
- Top content

---

## 🔄 Integração com Sistemas Existentes

### Quando um Creator publica conteúdo:
```typescript
// Após criar Article/Video/etc.
await activityService.logActivity(userId, 'publish_content', {
  contentType: 'article',
  contentId,
  xpEarned: 50
})

await userStatsService.addXP(userId, 50)
await userStatsService.checkBadgeUnlock(userId, 'first-content')
```

### Quando um User dá rating:
```typescript
// Após criar Rating
await activityService.logActivity(userId, 'give_rating', {
  targetType,
  targetId,
  rating,
  xpEarned: 2
})

await userStatsService.addXP(userId, 2)
await userStatsService.incrementMetric(userId, 'ratingsGiven')
```

### Quando um conteúdo recebe view:
```typescript
// Após incrementar views
const creator = await getContentCreator(contentId)
await userStatsService.addXP(creator._id, 1)
```

---

## 📊 Cálculos Importantes

### Quality Score
```typescript
qualityScore = averageRating * Math.sqrt(ratingsCount)

// Exemplo:
// User A: 5★ média, 10 ratings → 5 * sqrt(10) = 15.8
// User B: 4★ média, 100 ratings → 4 * sqrt(100) = 40
// User B tem score maior (volume compensa)
```

### Engagement Rate
```typescript
engagementRate = ((likes + comments + favorites) / views) * 100

// Exemplo:
// 1000 views, 50 likes, 20 comments, 10 favorites
// (50 + 20 + 10) / 1000 * 100 = 8%
```

### Level Progression
```typescript
// XP necessário para cada nível (progressão exponencial)
function getXPForLevel(level: number): number {
  const base = 100
  const multiplier = 2
  return Math.floor(base * Math.pow(multiplier, level - 1))
}

// Nível 1→2: 100 XP
// Nível 2→3: 200 XP
// Nível 3→4: 400 XP
// Nível 4→5: 800 XP
// ...
```

---

## 🚀 Roadmap de Implementação

### Fase 8.1: Foundation
- [ ] Criar models (UserStats, ActivityLog, Badge, Leaderboard)
- [ ] Criar services base
- [ ] Endpoints de stats

### Fase 8.2: XP System
- [ ] Sistema de log de atividades
- [ ] Cálculo e atribuição de XP
- [ ] Sistema de níveis
- [ ] Progress bar

### Fase 8.3: Badges
- [ ] Definir todos os badges
- [ ] Sistema de verificação de requisitos
- [ ] Unlock automático
- [ ] Badge gallery

### Fase 8.4: Leaderboards
- [ ] Cálculo periódico de rankings
- [ ] Endpoints de leaderboard
- [ ] UI de rankings

### Fase 8.5: Dashboard
- [ ] Impact dashboard para creators
- [ ] Analytics detalhadas
- [ ] Gráficos e visualizações

---

**Status**: 📝 **PLANEAMENTO COMPLETO**
**Próximo**: Aguardar aprovação para implementação após prioridades front-end
