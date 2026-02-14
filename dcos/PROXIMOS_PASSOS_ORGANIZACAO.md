# 📋 PRÓXIMOS PASSOS - Organização da Estrutura

**Data:** 2026-02-14
**Status Atual:** ✅ **Fase 3 Concluída - 80% Organizado**

---

## ✅ **O QUE FOI COMPLETADO HOJE**

### **1. Fase 1: Limpeza de Duplicações** ✅
- ✅ Deletados ratings antigos duplicados
- ✅ Deletados componentes auth duplicados
- ✅ Consolidados layouts em `/shared/layouts`
- ✅ Movido ProtectedRoute para `/shared/guards`
- ✅ Deletado diretório `/app`
- ✅ Atualizados 16 imports de ProtectedRoute

### **2. Fase 2: Reorganização de Stores** ✅
- ✅ Migrado PageShell para useAuthStore
- ✅ Criado wrapper de compatibilidade useUserStore
- ✅ Movido useNewsStore para `/features/hub/news/stores`
- ✅ Movidos todos os stores de news

### **3. Fase 3: Organização de Types, Schemas, Hooks, Utils** ✅

#### **Types** ✅
```
Movidos para features:
✅ article.ts → /features/hub/articles/types/
✅ course.ts → /features/hub/courses/types/
✅ news.ts → /features/hub/news/types/
✅ book.ts → /features/hub/books/types/
✅ comment.ts → /features/hub/types/
✅ creator.ts → /features/creators/types/
✅ stocks.ts → /features/tools/stocks/types/
✅ mlPredictions.ts → /features/tools/stocks/types/
✅ playlist.ts, podcast.ts, video.ts, liveEvent.ts → /features/hub/types/
✅ AdMetrics.ts → /features/creators/marketing/types/
✅ pageContext.ts → /lib/types/
✅ content.ts → /features/hub/utils/content.legacy.ts (com funções helper)
✅ creatorForm.ts → /features/auth/types/
✅ file.ts → /features/creators/types/
✅ FormValues.ts → /features/auth/types/
✅ LevelEvaluationLogic.ts → /features/creators/types/
✅ react-router-dom-server.d.ts → /lib/types/

Deletados:
🗑️ types.ts, types.d.ts (duplicados)
🗑️ Diretório /types/ (vazio)
```

#### **Schemas** ✅
```
✅ courseFormSchema.ts → /features/hub/courses/schemas/
✅ userFormSchema.ts → /features/auth/schemas/
✅ creatorFormSchema.ts → /features/auth/schemas/
🗑️ Diretório /schemas/ (vazio)
```

#### **Hooks** ✅
```
✅ useAnalytics.ts → /lib/analytics/
✅ useHasHydrated.ts → /lib/hooks/
✅ useMediaQuery.ts → /shared/hooks/
✅ useVisitedTopics.ts → /features/hub/hooks/
🗑️ Diretório /hooks/ (vazio)
```

#### **Utils** ✅
```
Stocks Utils:
✅ consumerCalc.ts → /features/tools/stocks/utils/
✅ energyCalculations.ts → /features/tools/stocks/utils/
✅ industrialsCalculations.ts → /features/tools/stocks/utils/
✅ mergeStockData.ts → /features/tools/stocks/utils/
✅ mlPredictionsApi.ts → /features/tools/stocks/utils/
✅ simulateDCF.ts → /features/tools/stocks/utils/
✅ utilitiesValidation.ts → /features/tools/stocks/utils/
✅ complementares/ → /features/tools/stocks/utils/complementares/
  ├── basicMaterialsComplementares.ts
  ├── communicationServicesComplementares.ts
  ├── consumerCyclicalComplementares.ts
  ├── consumerDefensiveComplementares.ts
  ├── energyComplementares.ts
  ├── financialComplementares.ts
  ├── healthcareComplementares.ts
  ├── industrialsComplementares.ts
  ├── realEstateComplementares.ts
  ├── technologyComplementares.ts
  └── utilitiesComplementares.ts

Outros Utils:
✅ api.ts → /lib/api/
✅ getRoutesByRole.ts → /lib/routing/
✅ sourceUtils.ts → /features/hub/news/utils/
✅ use-toast.ts → /shared/hooks/
✅ visitedTopics.ts → /features/hub/utils/
🗑️ Diretório /utils/ (vazio)
```

#### **Mock e I18n** ✅
```
✅ /mock → /lib/mock/
  ├── books.ts
  ├── mockAdMetrics.ts
  ├── mockAdPerformance.ts
  ├── mockArticles.ts
  ├── mockCourses.ts
  ├── mockCreatorsFull.ts
  ├── mockFiles.ts
  ├── mockFormik.ts
  ├── mockLiveEvents.ts
  ├── mockPlaylists.ts
  ├── mockPodcasts.ts
  ├── mockReels.ts
  ├── mockTransactions.ts
  └── mockWelcomeVideos.ts

✅ /i18n → /lib/i18n/
  ├── en/
  ├── pt/
  ├── index.ts
  └── index.d.ts
```

#### **Routes Criadas** ✅
```
✅ /pages/creators/dashboard/articles/index.page.tsx
✅ /pages/creators/dashboard/articles/create.page.tsx
✅ /pages/creators/dashboard/articles/@id/edit.page.tsx

🗑️ Deletado: /pages/creators/conteudos/artigos/ (estrutura antiga)
```

### **4. Atualizações de Imports** ✅
- ✅ Todos os imports atualizados para novos caminhos
- ✅ Usando aliases `@/` em todos os imports

---

## 📊 **ESTRUTURA ATUAL (PÓS-FASE 3)**

```
src/
├── features/                   ✅ LIMPO E ORGANIZADO
│   ├── auth/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── pages/
│   │   ├── schemas/            ✅ Schemas movidos
│   │   ├── services/
│   │   ├── stores/
│   │   │   └── useAuthStore.ts ✅ Store principal
│   │   ├── types/              ✅ Types movidos
│   │   └── index.ts
│   │
│   ├── hub/
│   │   ├── articles/
│   │   │   ├── components/
│   │   │   ├── hooks/
│   │   │   ├── pages/          ✅ Páginas públicas
│   │   │   ├── services/
│   │   │   ├── types/          ✅ Types movidos
│   │   │   └── index.ts
│   │   ├── books/
│   │   │   └── types/          ✅ Types movidos
│   │   ├── courses/
│   │   │   ├── schemas/        ✅ Schemas movidos
│   │   │   └── types/          ✅ Types movidos
│   │   ├── news/
│   │   │   ├── stores/         ✅ Stores movidos
│   │   │   ├── types/          ✅ Types movidos
│   │   │   └── utils/          ✅ Utils movidos
│   │   ├── components/         ← Componentes GENÉRICOS
│   │   ├── hooks/              ✅ Hooks movidos
│   │   ├── utils/              ✅ Utils movidos
│   │   └── types/              ✅ Types compartilhados
│   │
│   ├── creators/
│   │   ├── dashboard/
│   │   │   └── articles/
│   │   │       ├── components/
│   │   │       │   └── ArticleForm.tsx
│   │   │       └── pages/      ✅ Dashboard CRIADOR
│   │   ├── marketing/
│   │   │   └── types/          ✅ Types movidos
│   │   └── types/              ✅ Types movidos
│   │
│   └── tools/
│       └── stocks/
│           ├── types/          ✅ Types movidos
│           └── utils/          ✅ Utils movidos
│               └── complementares/ ✅ Movido
│
├── shared/                     ✅ CONSOLIDADO
│   ├── ui/
│   ├── layouts/                ✅ Layouts consolidados
│   ├── guards/                 ✅ Guards centralizados
│   ├── hooks/                  ✅ Hooks movidos
│   └── dev/
│
├── lib/                        ✅ CORE
│   ├── api/                    ✅ api.ts movido
│   ├── analytics/              ✅ useAnalytics movido
│   ├── hooks/                  ✅ useHasHydrated movido
│   ├── i18n/                   ✅ i18n movido
│   ├── mock/                   ✅ mock movido
│   ├── permissions/
│   ├── routing/                ✅ getRoutesByRole movido
│   ├── types/                  ✅ Types globais
│   └── utils/
│
├── stores/                     ✅ SÓ WRAPPER
│   └── useUserStore.ts         (compatibilidade)
│
├── pages/                      ✅ ROTAS
├── renderer/                   ✅ SSR
├── routes/                     ✅ CONFIG ROTAS
│
└── [Ainda a organizar]         ⚠️ FASE 4
    ├── components/             ⚠️ Grande - precisa migração
    │   ├── auth/               ⚠️ userForm, creatorForm
    │   ├── book/
    │   ├── commonButtons/
    │   ├── creators/           ⚠️ Grande - mover para features
    │   ├── definicoes/
    │   ├── fileManagement/
    │   ├── languages/
    │   ├── layout/             ⚠️ Header, SidebarLayout antigos
    │   ├── noticias/           ⚠️ Mover para /features/hub/news
    │   ├── providers/
    │   ├── stocks/             ⚠️ Mover para /features/tools/stocks
    │   └── ui/
    │
    ├── stories/                ⚠️ Storybook - avaliar
    └── __tests__/              ⚠️ Testes - organizar
```

---

## 🔄 **AINDA A FAZER (FASE 4)**

### **Prioridade 1: Migrar /components para /features** 🔴

#### **A. Components de News**
```bash
# Mover componentes de notícias
src/components/noticias/ → src/features/hub/news/components/

Arquivos a mover:
- Todos os componentes de notícias
- Integrar com stores já existentes em /features/hub/news/stores
```

#### **B. Components de Stocks**
```bash
# Mover componentes de stocks
src/components/stocks/ → src/features/tools/stocks/components/

Arquivos a mover:
- Todos os componentes de stocks
- Já temos types e utils em /features/tools/stocks/
```

#### **C. Components de Creators**
```bash
# Mover componentes de creators
src/components/creators/ → src/features/creators/

Estrutura atual em /components/creators/:
├── analytics/           → /features/creators/analytics/components/
├── contentManagement/   → /features/creators/dashboard/
├── gamification/        → /features/creators/gamification/components/
├── marketing/           → /features/creators/marketing/components/
└── public/              → /features/creators/public/components/
```

#### **D. Components de Auth**
```bash
# Mover forms de auth
src/components/auth/userForm/ → src/features/auth/components/forms/user/
src/components/auth/creatorForm/ → src/features/auth/components/forms/creator/
```

#### **E. Components de Books**
```bash
# Mover componentes de books
src/components/book/ → src/features/hub/books/components/
```

#### **F. Components de Definições**
```bash
# Mover componentes de settings
src/components/definicoes/ → src/features/auth/components/settings/
# OU
src/components/definicoes/ → src/shared/components/settings/
```

#### **G. Layout Antigo**
```bash
# Atualizar páginas que usam layout antigo
src/components/layout/Header.tsx
src/components/layout/SidebarLayout.tsx

Usado por:
- src/pages/creators/@username.page.tsx
- src/pages/creators/index.page.tsx
- src/pages/index.page.tsx
- src/pages/noticias/index.page.tsx
- src/pages/stocks/index.page.tsx

Ação: Migrar estas páginas para usar DashboardLayout ou PublicLayout
```

---

### **Prioridade 2: Organizar Componentes Genéricos** 🟡

```bash
# Avaliar e organizar
src/components/commonButtons/ → src/shared/components/buttons/ ou deletar
src/components/fileManagement/ → src/shared/components/files/ ou /features/creators/
src/components/languages/ → src/shared/components/language/ ou /lib/i18n/components/
src/components/providers/ → src/shared/providers/ ou manter
```

---

### **Prioridade 3: Storybook e Testes** 🟢

```bash
# Avaliar necessidade
src/stories/ → Manter ou deletar (Storybook)
src/__tests__/ → Organizar testes por feature ou manter

Opções:
1. Manter stories/ para documentação de componentes
2. Deletar se não estiver sendo usado
3. Organizar testes para ficarem junto das features
```

---

### **Prioridade 4: Criar Barrel Exports** 🟢

Criar `index.ts` em cada feature para exports limpos:

```typescript
// Exemplo: src/features/hub/news/index.ts
export * from './components'
export * from './stores'
export * from './types'
export * from './utils'
```

---

### **Prioridade 5: Deletar Wrapper useUserStore** 🟢

Após verificar que nenhum código usa mais `useUserStore`:

```bash
# Verificar uso
grep -r "useUserStore" src/ --exclude-dir=node_modules

# Se não houver uso além do próprio wrapper, deletar
rm src/stores/useUserStore.ts
rmdir src/stores/
```

---

## 📈 **PROGRESSO GERAL**

```
Fase 1: Limpeza Duplicações          ✅ 100%
Fase 2: Reorganização Stores          ✅ 100%
Fase 3: Types/Schemas/Hooks/Utils     ✅ 100%
Fase 4: Migração de Components        ⚠️  0%
Fase 5: Organização Final             ⚠️  0%

TOTAL:                                ✅ 60%
```

---

## 🎯 **PRÓXIMA SESSÃO DE TRABALHO**

### **Recomendação de Sequência:**

1. **Começar por News** (mais simples)
   - Mover `/components/noticias` → `/features/hub/news/components`
   - Já tem stores, types, utils prontos

2. **Depois Stocks**
   - Mover `/components/stocks` → `/features/tools/stocks/components`
   - Já tem types e utils prontos

3. **Depois Creators** (maior)
   - Migrar gradualmente cada subdiretório
   - Garantir que rotas apontem para a nova estrutura

4. **Auth Forms**
   - Mover userForm e creatorForm para features

5. **Limpeza Final**
   - Deletar `/components` vazio
   - Criar barrel exports
   - Deletar wrapper useUserStore se possível

---

## 💡 **NOTAS IMPORTANTES**

### **Arquivos Legacy Mantidos Temporariamente:**

1. **content.legacy.ts** em `/features/hub/utils/`
   - Usado por 6 componentes em `/components/creators/public/`
   - Quando migrar esses componentes, atualizar para usar types das features
   - Depois pode deletar content.legacy.ts

2. **useUserStore.ts** em `/stores/`
   - Wrapper de compatibilidade
   - Usado por código que ainda não foi migrado
   - Pode deletar quando todo código usar `useAuthStore`

### **Padrões Estabelecidos:**

```
Feature Structure:
/features/{domain}/
├── components/      ← Componentes da feature
├── hooks/           ← Hooks específicos
├── pages/           ← Páginas/rotas
├── schemas/         ← Schemas de validação
├── services/        ← API calls
├── stores/          ← State management
├── types/           ← TypeScript types
├── utils/           ← Funções utilitárias
└── index.ts         ← Barrel export
```

---

**Status:** ✅ **Pronto para Fase 4 - Migração de Components**

**Próximo Commit:** Organização completa de types, schemas, hooks, utils, mock e i18n
