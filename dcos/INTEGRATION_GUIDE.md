# 🔌 Guia de Integração Frontend ↔ Backend

## ✅ Integração Completa

O frontend está **100% integrado** com a API real. Não há mais mock data!

## 🎯 O que foi feito

### 1. **API Client** ([src/lib/api/client.ts](src/lib/api/client.ts))
- ✅ Configurado para `http://localhost:5000/api`
- ✅ Auto-inject de access token em todas as requests
- ✅ Auto-refresh de tokens expirados
- ✅ Error handling global
- ✅ Request/Response interceptors

### 2. **Authentication Service** ([src/features/auth/services/authService.ts](src/features/auth/services/authService.ts))
- ✅ Login/Register com API real
- ✅ Token refresh automático
- ✅ Logout com invalidação de tokens
- ✅ Password reset flow
- ✅ Email verification

### 3. **Auth Store** ([src/features/auth/stores/useAuthStore.ts](src/features/auth/stores/useAuthStore.ts))
- ✅ Atualizado para usar estrutura de tokens do backend (`tokens: { accessToken, refreshToken }`)
- ✅ Mock user **DESABILITADO** - apenas dados reais
- ✅ Persist no localStorage
- ✅ Auto-hidratação ao carregar

### 4. **Content Services** - TODOS atualizados
- ✅ [articleService.ts](src/features/hub/articles/services/articleService.ts) - Artigos
- ✅ [videoService.ts](src/features/hub/videos/services/videoService.ts) - Vídeos
- ✅ [courseService.ts](src/features/hub/courses/services/courseService.ts) - Cursos
- ✅ [podcastService.ts](src/features/hub/podcasts/services/podcastService.ts) - Podcasts
- ✅ [liveService.ts](src/features/hub/lives/services/liveService.ts) - Lives
- ✅ [bookService.ts](src/features/hub/books/services/bookService.ts) - Books

### 5. **Social Services** ([src/features/social/services/socialService.ts](src/features/social/services/socialService.ts))
- ✅ Follow/Unfollow creators
- ✅ Favoritos (add/remove)
- ✅ Notificações (read/unread/delete)
- ✅ Endpoints atualizados para match com backend

## 🚀 Como Testar

### Passo 1: Garantir que a API está a correr
```bash
cd c:/Users/User/Documents/GitHub/Riquinho/api/Front/API_finhub
npx ts-node-dev --respawn --transpile-only src/server.ts
```

✅ API deve estar em: `http://localhost:5000`

### Passo 2: Popular a Base de Dados (se ainda não fez)
```bash
# Método recomendado (HTTP seed)
node seed-http.js
```

Isto cria:
- **1 Admin**: admin@finhub.com / admin123
- **3 Creators**: creator1@finhub.com / creator123 (e creator2, creator3)
- **2 Users**: user1@test.com / user123, user2@test.com / user123

### Passo 3: Arrancar o Frontend
```bash
cd c:/Users/User/Documents/GitHub/Riquinho/api/Front/FinHub-Vite
npm run dev
```

### Passo 4: Testar Fluxos

#### 🔐 Autenticação
1. Abre `http://localhost:5173` (ou a porta do Vite)
2. Tenta fazer login com: `creator1@finhub.com` / `creator123`
3. Verifica no console do browser:
   - `🌐 API Request: POST /auth/login`
   - `✅ API Response: POST /auth/login`
4. Verifica que o user está autenticado (avatar no header, etc)

#### 📝 Conteúdos
1. Navega para a página de artigos
2. Verifica no console:
   - `🌐 API Request: GET /articles`
   - `✅ API Response: GET /articles`
3. Se não houver artigos, podes criar um (se estiveres logged como creator)

#### 👥 Social
1. Tenta seguir um creator
2. Verifica no console:
   - `🌐 API Request: POST /follow/{creatorId}`
3. Tenta adicionar aos favoritos
4. Verifica notificações

## 🔍 Debug no Browser

Abre as DevTools (F12) e verifica:

### Console
Deves ver logs como:
```
🌐 API Request: POST /auth/login
✅ API Response: POST /auth/login { status: 200, data: {...} }
```

### Network Tab
Verifica que:
- Todas as requests vão para `http://localhost:5000/api/*`
- Headers têm `Authorization: Bearer <token>`
- Responses têm status 200/201/etc

### Application > Local Storage
Verifica `auth-storage`:
```json
{
  "state": {
    "user": { ... },
    "accessToken": "eyJ...",
    "refreshToken": "eyJ...",
    "isAuthenticated": true
  }
}
```

## ⚠️ Troubleshooting

### Erro: "Network Error" ou "CORS"
**Causa**: API não está a correr ou CORS não configurado

**Fix**:
1. Confirma que API está em `http://localhost:5000`
2. Verifica que backend tem CORS habilitado ([src/server.ts](../API_finhub/src/server.ts))

### Erro: "401 Unauthorized"
**Causa**: Token inválido ou expirado

**Fix**:
1. Faz logout e login novamente
2. Limpa localStorage: `localStorage.clear()`
3. Recarrega a página

### Erro: "Cannot find module" ou imports quebrados
**Causa**: Paths ou aliases incorretos

**Fix**:
1. Verifica [tsconfig.json](tsconfig.json) - alias `@/` deve apontar para `src/`
2. Reinicia o dev server

### Artigos/Vídeos não aparecem
**Causa**: Base de dados vazia

**Fix**:
```bash
cd c:/Users/User/Documents/GitHub/Riquinho/api/Front/API_finhub
node seed-http.js
```

### Mock user ainda aparece
**Causa**: Cache do browser com dados antigos

**Fix**:
1. `localStorage.clear()`
2. Hard refresh: Ctrl+Shift+R (ou Cmd+Shift+R no Mac)

## 📊 Endpoints Disponíveis

### Auth
- POST `/auth/register` - Criar conta
- POST `/auth/login` - Login
- POST `/auth/logout` - Logout
- POST `/auth/refresh` - Refresh token
- GET `/auth/me` - Obter user atual

### Articles
- GET `/articles` - Listar artigos (público)
- GET `/articles/:slug` - Obter artigo por slug
- POST `/articles` - Criar artigo (creator/admin)
- PATCH `/articles/:id` - Atualizar artigo
- DELETE `/articles/:id` - Apagar artigo
- POST `/articles/:id/publish` - Publicar
- POST `/articles/:id/view` - Incrementar views

### Videos, Courses, Podcasts, Lives, Books
Seguem o mesmo padrão dos artigos.

### Social - Follow
- POST `/follow/:targetId` - Seguir
- DELETE `/follow/:targetId` - Deixar de seguir
- GET `/follow/following` - Quem eu sigo
- GET `/follow/followers` - Meus seguidores
- GET `/follow/:targetId/status` - Verificar se sigo
- GET `/follow/mutual` - Follows mútuos

### Social - Favorites
- POST `/favorites` - Adicionar favorito
- DELETE `/favorites/:id` - Remover favorito
- GET `/favorites` - Meus favoritos
- GET `/favorites/check/:targetId` - Verificar se favoritado

### Social - Notifications
- GET `/notifications` - Listar notificações
- GET `/notifications/unread` - Apenas não lidas
- PATCH `/notifications/:id/read` - Marcar como lida
- POST `/notifications/read-all` - Marcar todas como lidas
- DELETE `/notifications/:id` - Apagar
- DELETE `/notifications` - Apagar todas

## 🎉 Próximos Passos

1. ✅ **Integração completa** - DONE!
2. 🧪 **Testar todos os fluxos** - Em progresso
3. 🎨 **Ajustar UI conforme necessário** - Ajustar loading states, error messages
4. 🚀 **Deploy** - Preparar para produção

## 📝 Notas Importantes

- **Desenvolvimento**: API em `localhost:5000`, Frontend em `localhost:5173`
- **Produção**: Ajustar `VITE_API_URL` no `.env` para URL de produção
- **Tokens**: Access token expira em 15min, refresh token em 7 dias (configurável no backend)
- **Roles**: free < premium < creator < admin (hierarquia de permissões)

## 🔗 Links Úteis

- [Backend API Docs](../API_finhub/README.md)
- [Seed Guide](../API_finhub/SEED_GUIDE.md)
- [Phase 7 Docs](../API_finhub/FASE_API_7_SOCIAL.md)
