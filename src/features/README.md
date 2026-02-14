# 🏗️ Features - Arquitetura Feature-Based

Esta pasta contém todos os módulos organizados por **domínio de negócio** (feature-based architecture), seguindo o plano de arquitetura profissional.

---

## 📁 Estrutura

### **auth/** - Autenticação e Autorização
- `components/` - Login, Register, ForgotPassword, etc.
- `hooks/` - useAuth, usePermissions, usePaywall
- `services/` - authService (login, register, refresh token)
- `types/` - User, AuthState, UserRole

### **hub/** - Conteúdo Educativo (HUB Component)
- `articles/` - Artigos educativos
- `courses/` - Cursos com módulos
- `videos/` - Vídeos educativos
- `events/` - Eventos e calendário
- `creators/` - Perfis e páginas de creators

### **tools/** - Ferramentas Financeiras (TOOLS Component)
- `personal-finance/` - Calculadoras financeiras
- `investments/` - Análise de investimentos
- `portfolio/` - Portfolio Tracker

### **social/** - Componente Social (SOCIAL Component)
- `feed/` - Feed de atividades
- `forums/` - Fóruns de discussão
- `chat/` - Sistema de chat

---

## 🎯 Princípios

1. **Feature-First**: Cada feature é auto-contida
2. **Co-location**: Componentes, hooks, services juntos
3. **Barrel Exports**: index.ts em cada pasta para exports limpos
4. **Separação de Concerns**:
   - `components/` → UI components
   - `hooks/` → Business logic
   - `services/` → API calls
   - `types/` → TypeScript interfaces

---

## 📦 Como Usar

```typescript
// ✅ BOM: Importar de features
import { LoginForm, useAuth } from '@/features/auth'
import { ArticleCard } from '@/features/hub/articles'

// ❌ RUIM: Importar direto do componente
import { LoginForm } from '@/features/auth/components/LoginForm'
```

---

## 🔄 Migração Incremental

Esta estrutura **coexiste** com a estrutura antiga (`/components`, `/pages`).

**Plano de migração**:
1. ✅ Novos componentes vão direto para `/features`
2. 🔄 Componentes existentes migram incrementalmente
3. 🗑️ Pasta antiga removida ao final (quando tudo migrado)
