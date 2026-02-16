# 🧪 Guia de Testes - API Articles

**Data**: 2026-02-15
**Status**: ✅ **Fase 2 (Articles) Implementada**

---

## 📋 Endpoints Disponíveis

```
BASE_URL: http://localhost:5000/api/articles
```

---

## 🔓 Rotas Públicas

### 1. Listar Artigos (com filtros)

**Request**:
```
GET http://localhost:5000/api/articles

# Com filtros
GET http://localhost:5000/api/articles?category=finance&isPremium=false&page=1&limit=10&sort=popular

# Pesquisa
GET http://localhost:5000/api/articles?search=bitcoin&category=crypto
```

**Query Parameters**:
- `category` - Filtrar por categoria (finance, investing, crypto, etc.)
- `isPremium` - true/false - Apenas conteúdo premium/free
- `isFeatured` - true/false - Apenas destacados
- `tags` - Lista separada por vírgulas (ex: bitcoin,ethereum)
- `search` - Pesquisa no título e descrição
- `page` - Número da página (default: 1)
- `limit` - Items por página (default: 20, max: 100)
- `sort` - Ordenação: `recent` (default), `popular`, `rating`, `title`

**Response** (200 OK):
```json
{
  "articles": [
    {
      "_id": "65f...",
      "title": "Como Investir em Crypto em 2026",
      "slug": "como-investir-em-crypto-em-2026",
      "description": "Guia completo para iniciantes...",
      "content": "<p>Conteúdo HTML...</p>",
      "contentType": "article",
      "category": "crypto",
      "tags": ["bitcoin", "ethereum", "investing"],
      "coverImage": "https://...",
      "isPremium": false,
      "isFeatured": true,
      "status": "published",
      "publishedAt": "2026-02-15T...",
      "creator": {
        "_id": "65f...",
        "name": "João Criador",
        "username": "joaocriador",
        "avatar": "https://..."
      },
      "views": 1543,
      "likes": 89,
      "favorites": 34,
      "commentsCount": 12,
      "averageRating": 4.5,
      "ratingsCount": 23,
      "readingTime": 5,
      "wordCount": 987,
      "createdAt": "2026-02-15T...",
      "updatedAt": "2026-02-15T..."
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 45,
    "pages": 5
  }
}
```

---

### 2. Obter Artigo por Slug

**Request**:
```
GET http://localhost:5000/api/articles/como-investir-em-crypto-em-2026
```

**Response** (200 OK):
```json
{
  "_id": "65f...",
  "title": "Como Investir em Crypto em 2026",
  "slug": "como-investir-em-crypto-em-2026",
  "description": "Guia completo para iniciantes...",
  "content": "<p>Conteúdo completo HTML...</p>",
  "contentType": "article",
  "category": "crypto",
  "tags": ["bitcoin", "ethereum", "investing"],
  "coverImage": "https://...",
  "isPremium": false,
  "isFeatured": true,
  "status": "published",
  "publishedAt": "2026-02-15T...",
  "creator": {
    "_id": "65f...",
    "name": "João Criador",
    "username": "joaocriador",
    "avatar": "https://...",
    "bio": "Especialista em crypto..."
  },
  "views": 1544,
  "likes": 89,
  "favorites": 34,
  "commentsCount": 12,
  "averageRating": 4.5,
  "ratingsCount": 23,
  "readingTime": 5,
  "wordCount": 987,
  "createdAt": "2026-02-15T...",
  "updatedAt": "2026-02-15T..."
}
```

**Erros**:
- `404`: Artigo não encontrado

**Nota**: Views são incrementadas automaticamente.

---

## 🔒 Rotas Protegidas (Creator Dashboard)

### 3. Criar Artigo

**Request**:
```
POST http://localhost:5000/api/articles
Authorization: Bearer {accessToken}
Content-Type: application/json

{
  "title": "Meu Primeiro Artigo",
  "description": "Descrição curta do artigo...",
  "content": "<h1>Título</h1><p>Conteúdo...</p>",
  "category": "finance",
  "tags": ["investing", "stocks"],
  "coverImage": "https://example.com/image.jpg",
  "isPremium": false,
  "status": "draft"
}
```

**Campos Obrigatórios**:
- `title` (max 200 chars)
- `description` (max 500 chars)
- `content`
- `category`

**Campos Opcionais**:
- `tags` (array, max 10)
- `coverImage` (URL)
- `isPremium` (default: false)
- `status` (draft | published, default: draft)

**Response** (201 Created):
```json
{
  "_id": "65f...",
  "title": "Meu Primeiro Artigo",
  "slug": "meu-primeiro-artigo",
  "description": "Descrição curta do artigo...",
  "content": "<h1>Título</h1><p>Conteúdo...</p>",
  "contentType": "article",
  "category": "finance",
  "tags": ["investing", "stocks"],
  "coverImage": "https://example.com/image.jpg",
  "isPremium": false,
  "status": "draft",
  "creator": "65f...",
  "views": 0,
  "likes": 0,
  "favorites": 0,
  "commentsCount": 0,
  "averageRating": 0,
  "ratingsCount": 0,
  "readingTime": 1,
  "wordCount": 234,
  "createdAt": "2026-02-15T...",
  "updatedAt": "2026-02-15T..."
}
```

**Erros**:
- `401`: Não autenticado
- `403`: Role insuficiente (precisa ser creator/admin)
- `400`: Campos obrigatórios faltando

---

### 4. Atualizar Artigo

**Request**:
```
PATCH http://localhost:5000/api/articles/{id}
Authorization: Bearer {accessToken}
Content-Type: application/json

{
  "title": "Título Atualizado",
  "description": "Nova descrição...",
  "tags": ["crypto", "bitcoin", "ethereum"]
}
```

**Response** (200 OK):
```json
{
  // Artigo atualizado completo
}
```

**Erros**:
- `401`: Não autenticado
- `403`: Não és o owner deste artigo
- `404`: Artigo não encontrado

---

### 5. Eliminar Artigo

**Request**:
```
DELETE http://localhost:5000/api/articles/{id}
Authorization: Bearer {accessToken}
```

**Response** (200 OK):
```json
{
  "message": "Artigo eliminado com sucesso"
}
```

**Erros**:
- `401`: Não autenticado
- `403`: Não és o owner (exceto admin)
- `404`: Artigo não encontrado

---

### 6. Publicar Artigo

**Request**:
```
PATCH http://localhost:5000/api/articles/{id}/publish
Authorization: Bearer {accessToken}
```

**Response** (200 OK):
```json
{
  // Artigo com status='published' e publishedAt=now
}
```

**Erros**:
- `401`: Não autenticado
- `403`: Não és o owner
- `404`: Artigo não encontrado

---

### 7. Listar Meus Artigos

**Request**:
```
GET http://localhost:5000/api/articles/my
Authorization: Bearer {accessToken}

# Com paginação e ordenação
GET http://localhost:5000/api/articles/my?page=1&limit=10&sort=views
```

**Query Parameters**:
- `page` - Número da página (default: 1)
- `limit` - Items por página (default: 20)
- `sort` - Ordenação: `createdAt` (default), `title`, `views`

**Response** (200 OK):
```json
{
  "articles": [
    // Array de artigos do creator
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 15,
    "pages": 2
  }
}
```

---

### 8. Estatísticas dos Meus Artigos

**Request**:
```
GET http://localhost:5000/api/articles/stats
Authorization: Bearer {accessToken}
```

**Response** (200 OK):
```json
{
  "total": 15,
  "published": 10,
  "drafts": 5,
  "totalViews": 12543,
  "totalLikes": 456,
  "averageRating": 4.3
}
```

---

## 💙 Rotas de Interação (Auth Required)

### 9. Like/Unlike Artigo

**Request**:
```
POST http://localhost:5000/api/articles/{id}/like
Authorization: Bearer {accessToken}
Content-Type: application/json

{
  "increment": true
}
```

**Body**:
- `increment: true` - Dar like
- `increment: false` - Remover like

**Response** (200 OK):
```json
{
  // Artigo atualizado com likes incrementado/decrementado
}
```

---

### 10. Favorite/Unfavorite Artigo

**Request**:
```
POST http://localhost:5000/api/articles/{id}/favorite
Authorization: Bearer {accessToken}
Content-Type: application/json

{
  "increment": true
}
```

**Body**:
- `increment: true` - Adicionar aos favoritos
- `increment: false` - Remover dos favoritos

**Response** (200 OK):
```json
{
  // Artigo atualizado com favorites incrementado/decrementado
}
```

---

## 🧪 Cenários de Teste Completos

### Fluxo 1: Creator Cria e Publica Artigo

```bash
# 1. Login como creator
POST /api/auth/login
{
  "email": "criador@finhub.com",
  "password": "123456"
}
# Guardar accessToken

# 2. Criar artigo em draft
POST /api/articles
Authorization: Bearer {token}
{
  "title": "Investir em 2026",
  "description": "Guia completo...",
  "content": "<p>Conteúdo...</p>",
  "category": "investing",
  "tags": ["stocks", "investing"]
}
# Guardar article._id

# 3. Atualizar artigo
PATCH /api/articles/{id}
Authorization: Bearer {token}
{
  "coverImage": "https://example.com/cover.jpg"
}

# 4. Publicar artigo
PATCH /api/articles/{id}/publish
Authorization: Bearer {token}

# 5. Ver estatísticas
GET /api/articles/stats
Authorization: Bearer {token}
```

---

### Fluxo 2: User Lê e Interage com Artigo

```bash
# 1. Listar artigos públicos
GET /api/articles?category=investing&sort=popular

# 2. Abrir artigo (views incrementadas)
GET /api/articles/investir-em-2026

# 3. Login como user
POST /api/auth/login

# 4. Dar like
POST /api/articles/{id}/like
Authorization: Bearer {token}
{
  "increment": true
}

# 5. Adicionar aos favoritos
POST /api/articles/{id}/favorite
Authorization: Bearer {token}
{
  "increment": true
}
```

---

### Fluxo 3: Filtros e Pesquisa

```bash
# Artigos de crypto
GET /api/articles?category=crypto

# Artigos premium
GET /api/articles?isPremium=true

# Artigos destacados
GET /api/articles?isFeatured=true

# Pesquisar por "bitcoin"
GET /api/articles?search=bitcoin

# Combinar filtros
GET /api/articles?category=crypto&tags=bitcoin,ethereum&sort=rating&limit=5

# Ordenar por rating
GET /api/articles?sort=rating

# Ordenar por views
GET /api/articles?sort=popular
```

---

## 🔍 Validações e Features

### Slug Automático
- Gerado automaticamente a partir do título
- Único (adiciona sufixo numérico se duplicado)
- URL-friendly (lowercase, sem acentos, hífens)

**Exemplos**:
- "Meu Artigo" → `meu-artigo`
- "Investir em Ações!" → `investir-em-acoes`
- "Bitcoin 2026?" → `bitcoin-2026`
- Duplicado: "Meu Artigo" → `meu-artigo-1`

### Reading Time Automático
- Calculado baseado no wordCount
- 200 palavras/minuto
- Arredondado para cima

### Word Count Automático
- Conta palavras do content (remove HTML tags)
- Atualizado sempre que content muda

### PublishedAt
- Definido automaticamente quando status muda para 'published'
- Apenas na primeira vez

---

## ✅ Checklist de Testes

### CRUD Básico
- [ ] Criar artigo como creator
- [ ] Criar artigo como admin
- [ ] Criar artigo como free user (deve falhar - 403)
- [ ] Atualizar próprio artigo
- [ ] Atualizar artigo de outro (deve falhar - 403)
- [ ] Admin pode atualizar artigo de qualquer um
- [ ] Eliminar próprio artigo
- [ ] Eliminar artigo de outro (deve falhar - 403)
- [ ] Admin pode eliminar artigo de qualquer um

### Publicação
- [ ] Criar artigo em draft
- [ ] Publicar artigo (status muda, publishedAt definido)
- [ ] publishedAt não muda em updates subsequentes

### Listagem Pública
- [ ] Listar apenas artigos published
- [ ] Filtrar por categoria
- [ ] Filtrar por isPremium
- [ ] Filtrar por isFeatured
- [ ] Filtrar por tags
- [ ] Pesquisar no título/descrição
- [ ] Ordenar por recent
- [ ] Ordenar por popular (views)
- [ ] Ordenar por rating
- [ ] Paginação funciona

### Dashboard Creator
- [ ] Listar meus artigos (todos os status)
- [ ] Ver estatísticas corretas
- [ ] Paginação funciona

### Interação
- [ ] Like incrementa contador
- [ ] Unlike decrementa contador
- [ ] Favorite incrementa contador
- [ ] Unfavorite decrementa contador
- [ ] Views incrementadas ao abrir artigo

### Validações
- [ ] Slug gerado automaticamente
- [ ] Slug único (sufixo numérico)
- [ ] Reading time calculado
- [ ] Word count calculado
- [ ] Título max 200 chars
- [ ] Descrição max 500 chars
- [ ] Max 10 tags
- [ ] Categoria obrigatória
- [ ] Conteúdo obrigatório

---

## 📊 Dados de Teste

### Criar Vários Artigos para Teste

```json
// Artigo 1 - Finance
{
  "title": "Como Começar a Investir em 2026",
  "description": "Guia prático para iniciantes no mundo dos investimentos",
  "content": "<h1>Introdução</h1><p>Investir pode parecer complexo...</p>",
  "category": "finance",
  "tags": ["investing", "beginner", "stocks"],
  "isPremium": false,
  "status": "published"
}

// Artigo 2 - Crypto (Premium)
{
  "title": "Análise Técnica de Bitcoin: Tendências 2026",
  "description": "Análise profunda dos padrões de mercado do Bitcoin",
  "content": "<h1>Análise</h1><p>O Bitcoin apresenta...</p>",
  "category": "crypto",
  "tags": ["bitcoin", "analysis", "technical"],
  "isPremium": true,
  "status": "published"
}

// Artigo 3 - Trading (Draft)
{
  "title": "Estratégias de Day Trading",
  "description": "Técnicas avançadas para traders profissionais",
  "content": "<h1>Estratégias</h1><p>Day trading requer...</p>",
  "category": "trading",
  "tags": ["daytrading", "advanced", "strategies"],
  "isPremium": true,
  "status": "draft"
}
```

---

**Status**: ✅ **FASE 2 COMPLETA - CRUD de Articles Funcional**
**Próximo**: Testar endpoints + Replicar para outros tipos (Videos, Courses, etc.)
