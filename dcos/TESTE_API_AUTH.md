# 🧪 Guia de Testes - API de Autenticação

**Data**: 2026-02-15
**Status**: ✅ **Fase 1 (Auth) Implementada**

---

## 📋 O Que Foi Implementado

### ✅ Ficheiros Criados

**Models**:
- `src/models/User.ts` - Modelo de utilizador com roles, bcrypt, validações

**Utils**:
- `src/utils/jwt.ts` - Funções para gerar e verificar tokens JWT
- `src/types/auth.ts` - Tipos e interfaces de autenticação

**Middlewares**:
- `src/middlewares/auth.ts` - Middleware de autenticação (authenticate, optionalAuth)
- `src/middlewares/roleGuard.ts` - Guards por role (requireRole, requireAdmin, requireCreator, requirePremium)

**Controllers**:
- `src/controllers/auth.controller.ts` - Lógica de register, login, refresh, me, logout

**Routes**:
- `src/routes/auth.routes.ts` - Endpoints de autenticação
- `src/routes/index.ts` - Atualizado com `/api/auth`

**Config**:
- `.env.example` - Variáveis de ambiente necessárias

---

## 🚀 Como Iniciar a API

### 1. Configurar Variáveis de Ambiente

Criar ficheiro `.env` na raiz da API (copiar de `.env.example`):

```env
PORT=5000
NODE_ENV=development

MONGODB_URI=mongodb://localhost:27017/finhub

JWT_SECRET=minha-chave-secreta-super-segura-32-caracteres-minimo
JWT_EXPIRES_IN=7d
JWT_REFRESH_SECRET=minha-refresh-secret-super-segura-32-caracteres
JWT_REFRESH_EXPIRES_IN=30d

FRONTEND_URL=http://localhost:3000
```

### 2. Verificar MongoDB

Garantir que MongoDB está a correr:
```bash
# Windows (se instalado como serviço)
net start MongoDB

# Ou com Docker
docker run -d -p 27017:27017 --name mongodb mongo:latest
```

### 3. Iniciar a API

```bash
cd C:\Users\User\Documents\GitHub\Riquinho\api\Front\API_finhub
yarn dev
```

Deverá ver:
```
✅ Ligado à base de dados MongoDB
🚀 Servidor a correr em http://localhost:5000
```

---

## 🧪 Testes com Postman/Insomnia/Thunder Client

### Endpoints Disponíveis

```
BASE_URL: http://localhost:5000/api
```

---

### 1. ✅ Verificar API

**Request**:
```
GET http://localhost:5000/api
```

**Response** (200 OK):
```json
{
  "message": "API FinHub está ativa ✅",
  "version": "1.0.0",
  "endpoints": {
    "auth": "/api/auth",
    "stocks": "/api/stocks",
    "ml": "/api/ml",
    "news": "/api/news"
  },
  "timestamp": "2026-02-15T..."
}
```

---

### 2. ✅ Register - Criar Conta

**Request**:
```
POST http://localhost:5000/api/auth/register
Content-Type: application/json

{
  "email": "criador@finhub.com",
  "password": "123456",
  "name": "João Criador",
  "username": "joaocriador",
  "role": "creator"
}
```

**Response** (201 Created):
```json
{
  "user": {
    "id": "65f1a2b3c4d5e6f7g8h9i0j1",
    "email": "criador@finhub.com",
    "name": "João Criador",
    "username": "joaocriador",
    "avatar": null,
    "role": "creator"
  },
  "tokens": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**Erros Possíveis**:
- `400`: Email ou username já em uso
- `400`: Campos obrigatórios faltando
- `500`: Erro no servidor

**Criar mais users para teste**:
```json
// Admin
{
  "email": "admin@finhub.com",
  "password": "admin123",
  "name": "Admin FinHub",
  "username": "admin",
  "role": "creator"  // Depois alterar manualmente no MongoDB para "admin"
}

// User Premium
{
  "email": "premium@finhub.com",
  "password": "premium123",
  "name": "User Premium",
  "username": "userpremium",
  "role": "free"  // Role: free por default
}

// User Free
{
  "email": "user@finhub.com",
  "password": "user123",
  "name": "User Free",
  "username": "usertest",
  "role": "free"
}
```

---

### 3. ✅ Login

**Request**:
```
POST http://localhost:5000/api/auth/login
Content-Type: application/json

{
  "email": "criador@finhub.com",
  "password": "123456"
}
```

**Response** (200 OK):
```json
{
  "user": {
    "id": "65f1a2b3c4d5e6f7g8h9i0j1",
    "email": "criador@finhub.com",
    "name": "João Criador",
    "username": "joaocriador",
    "avatar": null,
    "role": "creator"
  },
  "tokens": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**Erros**:
- `401`: Credenciais inválidas
- `400`: Email ou password faltando

---

### 4. ✅ Get Current User (Me)

**Request**:
```
GET http://localhost:5000/api/auth/me
Authorization: Bearer {accessToken}
```

**Response** (200 OK):
```json
{
  "user": {
    "id": "65f1a2b3c4d5e6f7g8h9i0j1",
    "email": "criador@finhub.com",
    "name": "João Criador",
    "username": "joaocriador",
    "avatar": null,
    "role": "creator",
    "bio": null,
    "socialLinks": null,
    "followers": 0,
    "following": 0,
    "createdAt": "2026-02-15T..."
  }
}
```

**Erros**:
- `401`: Token não fornecido
- `401`: Token inválido ou expirado

---

### 5. ✅ Refresh Token

**Request**:
```
POST http://localhost:5000/api/auth/refresh
Content-Type: application/json

{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Response** (200 OK):
```json
{
  "tokens": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**Erros**:
- `401`: Refresh token inválido ou expirado

---

### 6. ✅ Logout

**Request**:
```
POST http://localhost:5000/api/auth/logout
Authorization: Bearer {accessToken}
```

**Response** (200 OK):
```json
{
  "message": "Logout efetuado com sucesso."
}
```

---

## 🔧 Testar Middlewares de Role

### Exemplo: Criar endpoint protegido

Adicionar em qualquer controller (ex: `src/routes/test.routes.ts`):

```typescript
import { Router } from 'express'
import { authenticate } from '../middlewares/auth'
import { requireCreator, requireAdmin } from '../middlewares/roleGuard'
import { AuthRequest } from '../types/auth'

const router = Router()

// Apenas autenticados
router.get('/protected', authenticate, (req: AuthRequest, res) => {
  res.json({ message: 'Rota protegida acessada!', user: req.user?.username })
})

// Apenas creators
router.get('/creator-only', authenticate, requireCreator, (req: AuthRequest, res) => {
  res.json({ message: 'Apenas criadores podem ver isto!' })
})

// Apenas admins
router.get('/admin-only', authenticate, requireAdmin, (req: AuthRequest, res) => {
  res.json({ message: 'Apenas admins podem ver isto!' })
})

export default router
```

**Testar**:
```
# Com token de user FREE → 403 Forbidden
GET http://localhost:5000/api/test/creator-only
Authorization: Bearer {free_user_token}

# Com token de CREATOR → 200 OK
GET http://localhost:5000/api/test/creator-only
Authorization: Bearer {creator_token}
```

---

## 🛠️ Verificar no MongoDB

### Via Mongo Shell
```bash
mongosh

use finhub
db.users.find().pretty()
```

### Via MongoDB Compass
1. Conectar a `mongodb://localhost:27017`
2. Database: `finhub`
3. Collection: `users`

**Exemplo de user na BD**:
```json
{
  "_id": ObjectId("65f1a2b3c4d5e6f7g8h9i0j1"),
  "email": "criador@finhub.com",
  "password": "$2a$10$...", // hashed
  "name": "João Criador",
  "username": "joaocriador",
  "role": "creator",
  "followers": 0,
  "following": 0,
  "createdAt": ISODate("2026-02-15T..."),
  "updatedAt": ISODate("2026-02-15T...")
}
```

---

## 🐛 Troubleshooting

### Erro: "MONGODB_URI não definido no .env"
- Criar ficheiro `.env` na raiz da API
- Copiar variáveis de `.env.example`

### Erro: "MongoServerError: connect ECONNREFUSED"
- MongoDB não está a correr
- Iniciar MongoDB: `net start MongoDB` (Windows) ou `docker run mongo`

### Erro: "Email já está em uso"
- Email duplicado na tentativa de register
- Usar email diferente ou eliminar user da BD: `db.users.deleteOne({ email: "..." })`

### Erro: "Token inválido"
- Token expirou (7 dias por default)
- Fazer novo login ou usar refresh token
- Verificar se `JWT_SECRET` no `.env` é o mesmo usado para gerar o token

---

## ✅ Checklist de Validação

- [ ] API inicia sem erros
- [ ] Conexão ao MongoDB funciona
- [ ] Register cria novo user
- [ ] Password é hasheada (não aparece em plain text na BD)
- [ ] Login retorna tokens
- [ ] Access token funciona no endpoint `/me`
- [ ] Refresh token renova access token
- [ ] Middleware `authenticate` bloqueia requests sem token
- [ ] Middleware `requireCreator` bloqueia users free
- [ ] Middleware `requireAdmin` bloqueia non-admins
- [ ] Email duplicado é rejeitado
- [ ] Username duplicado é rejeitado
- [ ] Logout funciona

---

## 📊 Próximos Passos

### Fase 2: Content Types (Articles primeiro)
1. Criar modelo BaseContent
2. Criar modelo Article (extends BaseContent)
3. Criar article.controller.ts (CRUD)
4. Criar article.routes.ts
5. Testar CRUD de artigos com autenticação
6. Replicar para outros tipos (Videos, Courses, etc.)

### Integração Frontend
Depois de criar endpoints de conteúdo:
1. Atualizar `apiClient.ts` no frontend
2. Remover mocks
3. Conectar services com API real
4. Testar fluxo completo

---

**Status**: ✅ **FASE 1 COMPLETA - Sistema de Autenticação Funcional**
**Próximo**: Fase 2 - CRUD de Conteúdos (Articles como exemplo)
