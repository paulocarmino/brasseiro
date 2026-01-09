# React Boilerplate - Development Guide

Este documento contém best practices, padrões e instruções para desenvolver aplicações usando este boilerplate.

## Stack Tecnológico

- **Build Tool**: Vite
- **Framework**: React 19 + TypeScript
- **Styling**: Tailwind CSS v4 + shadcn/ui
- **Routing**: React Router v6
- **State Management**: Zustand
- **Icons**: Lucide React
- **Code Quality**: ESLint + Prettier

## ⚠️ IMPORTANTES

### Package Manager: pnpm

**ESTE PROJETO USA PNPM, NÃO NPM OU YARN!**

Todos os comandos devem usar `pnpm`:
- ✅ `pnpm install` (não `npm install`)
- ✅ `pnpm add <package>` (não `npm install <package>`)
- ✅ `pnpm dev` (não `npm run dev`)
- ✅ `pnpm build` (não `npm run build`)

### Tailwind CSS v4

**ESTE PROJETO USA TAILWIND CSS v4. EM HIPÓTESE ALGUMA FAÇA DOWNGRADE PARA v3!**

O Tailwind v4 introduz mudanças significativas na arquitetura:

- ✅ **Duas dependências obrigatórias**: `tailwindcss` + `@tailwindcss/vite`
- ✅ Plugin Vite configurado em `vite.config.ts`
- ✅ Configuração via CSS usando `@import` e `@theme`
- ✅ Não há mais `tailwind.config.js`
- ✅ Não há mais `postcss.config.js`
- ✅ PostCSS e Autoprefixer integrados nativamente
- ✅ Performance muito superior ao v3

**CRÍTICO**: Sem o plugin `@tailwindcss/vite`, o Tailwind NÃO funciona!

Se você encontrar tutoriais ou documentação pedindo `tailwind.config.js`, **IGNORE** - isso é v3.

---

## 1. React + TypeScript Best Practices

### Componentes Funcionais

Sempre use **function components** com TypeScript:

```typescript
// ✅ BOM
interface ButtonProps {
  label: string
  onClick: () => void
  variant?: "primary" | "secondary"
}

export function Button({ label, onClick, variant = "primary" }: ButtonProps) {
  return <button onClick={onClick}>{label}</button>
}

// ❌ EVITE arrow functions em exports principais
export const Button = ({ label }: ButtonProps) => {
  // ...
}
```

### Props Typing

```typescript
// Para componentes com children
interface CardProps {
  title: string
  children: React.ReactNode
  className?: string
}

// Para eventos
interface FormProps {
  onSubmit: (data: FormData) => void
  onChange?: (value: string) => void
}

// Props opcionais sempre com valores default
function Card({ title, children, className = "" }: CardProps) {
  // ...
}
```

---

## 2. Hooks - Padrões e Regras

### Custom Hooks

Crie custom hooks para encapsular lógica reutilizável:

```typescript
// src/hooks/useUsers.ts
export function useUsers() {
  const [users, setUsers] = useState<User[]>([])
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    loadUsers()
  }, [])

  const loadUsers = async () => {
    setIsLoading(true)
    try {
      const data = await api.users.getAll()
      setUsers(data)
    } catch (error) {
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  return { users, isLoading, refresh: loadUsers }
}
```

### Regras dos Hooks

1. Sempre chame hooks no **top level** do componente
2. Não chame hooks dentro de loops, condições ou funções aninhadas
3. Use `useCallback` para funções que são dependências de outros hooks
4. Use `useMemo` para cálculos custosos

---

## 3. Styling com Tailwind CSS v4

### Configuração Vite (OBRIGATÓRIO!)

O Tailwind v4 **REQUER** o plugin `@tailwindcss/vite` configurado:

```typescript
// vite.config.ts
import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"
import tailwindcss from "@tailwindcss/vite"  // ← ESSENCIAL!

export default defineConfig({
  plugins: [react(), tailwindcss()],  // ← Plugin obrigatório
})
```

### Configuração CSS-First

No Tailwind v4, toda configuração de tema é feita via CSS em `src/index.css`:

```css
@import "tailwindcss";

@theme {
  /* Customize seu tema aqui */
  --color-primary: #3b82f6;
  --radius-lg: 1rem;
}

@layer base {
  /* CSS customizado aqui */
}
```

**NUNCA tente criar `tailwind.config.js` ou `postcss.config.js` - isso é v3!**

### Classes Utilities

```typescript
// ✅ BOM - Use utility classes do Tailwind
<div className="flex items-center gap-4 p-6 bg-white rounded-lg shadow-md">

// ❌ EVITE - CSS inline
<div style={{ display: 'flex', padding: '1.5rem' }}>
```

### Responsive Design

```typescript
// Mobile-first approach
<div className="
  w-full           // mobile
  md:w-1/2         // tablet
  lg:w-1/3         // desktop
  xl:w-1/4         // large desktop
">
```

### Combining Classes com cn()

```typescript
import { cn } from "@/lib/utils"

function Button({ className, variant }: ButtonProps) {
  return (
    <button
      className={cn(
        "px-4 py-2 rounded-md font-medium",
        variant === "primary" && "bg-primary text-white",
        variant === "secondary" && "bg-secondary text-foreground",
        className
      )}
    >
      {children}
    </button>
  )
}
```

### Customizando Cores e Tema (v4)

Para adicionar cores customizadas no Tailwind v4, edite `src/index.css`:

```css
@theme {
  /* Adicione novas cores */
  --color-brand: #ff6b6b;
  --color-success: #51cf66;

  /* Use em componentes como: bg-brand, text-success */
}
```

**Nota**: No v3 você faria isso em `tailwind.config.js` - esse arquivo NÃO EXISTE mais no v4!

---

## 4. shadcn/ui & Retro UI - Instalação de Componentes

### 🚨 REGRA CRÍTICA: SEMPRE Use CLI, NUNCA Crie Manualmente

**NUNCA crie componentes shadcn/ui ou Retro UI na mão!** Sempre use o CLI:

❌ **ERRADO**: Copiar código de exemplos e criar arquivos manualmente
✅ **CERTO**: Usar `npx shadcn@latest add [component]`

**Por quê?**
- CLI garante código atualizado
- Instala dependências automaticamente
- Aplica sua configuração do `components.json`
- Evita bugs de versões desatualizadas

### Instalando shadcn/ui Components

```bash
# Adicionar um componente específico
npx shadcn@latest add button
npx shadcn@latest add card
npx shadcn@latest add dialog

# Adicionar múltiplos componentes
npx shadcn@latest add button card dialog

# Ver lista de componentes disponíveis
npx shadcn@latest add
```

**Nota**: Se o shadcn tentar criar `tailwind.config.js`, DELETE o arquivo imediatamente. Não é necessário no v4.

### Instalando Retro UI Components

Retro UI usa o mesmo CLI do shadcn:

```bash
# Método 1: Via registry (recomendado)
npx shadcn@latest add @retroui/button
npx shadcn@latest add @retroui/card
npx shadcn@latest add @retroui/radio

# Método 2: Via URL direta
npx shadcn@latest add 'https://retroui.dev/r/button.json'
```

**Ambos os métodos funcionam, mas o Método 1 é mais simples.**

### ⚠️ shadcn/ui + Tailwind v4

Os componentes shadcn/ui e Retro UI funcionam perfeitamente com Tailwind v4. As cores customizadas do tema (primary, secondary, etc.) estão configuradas em `src/index.css` usando CSS variables.

### Customizando Componentes

Os componentes shadcn/ui são **seu código**, não uma library. Customize diretamente:

```typescript
// src/components/ui/button.tsx
// Adicione variants, modifique estilos, etc.
```

### Descobrindo Novos Componentes

- **shadcn/ui**: https://ui.shadcn.com/docs/components
- **Retro UI**: https://retroui.dev/docs/components

### Composição

```typescript
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export function ProductCard({ product }: Props) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{product.title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p>{product.description}</p>
        <Button>Buy Now</Button>
      </CardContent>
    </Card>
  )
}
```

---

## 5. Zustand - State Management

### Creating Stores

```typescript
// src/stores/userStore.ts
import { create } from "zustand"

interface UserStore {
  user: User | null
  setUser: (user: User) => void
  logout: () => void
}

export const useUserStore = create<UserStore>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
  logout: () => set({ user: null }),
}))
```

### Using Stores

```typescript
// Selecione apenas o que precisa (evita re-renders desnecessários)
const user = useUserStore((state) => state.user)
const setUser = useUserStore((state) => state.setUser)

// Ou desestruture tudo (se usar tudo)
const { user, setUser, logout } = useUserStore()
```

---

## 6. Estrutura de Pastas

### Organização Híbrida

```
src/
├── components/       # Componentes reutilizáveis
│   ├── ui/          # shadcn/ui components
│   └── layout/      # Layout components
├── features/        # Features complexas (quando necessário)
│   └── auth/
│       ├── LoginForm.tsx
│       ├── useAuth.ts
│       └── authStore.ts
├── hooks/           # Custom hooks globais
├── lib/             # Configurações e utils
├── mocks/           # Mock data
├── routes/          # Páginas
├── stores/          # Zustand stores
└── types/           # TypeScript types
```

### Quando usar `features/`?

Use `features/` para funcionalidades complexas que têm múltiplos arquivos relacionados (componentes + hooks + store + types).

---

## 7. Evolução: Mock → Backend Real

### FASE 1: Protótipo com Mocks (Atual)

Durante prototipagem, use os mocks em `src/mocks/data.ts`:

```typescript
// src/lib/api.ts já está configurado para usar mocks
const products = await api.products.getAll() // Retorna mock data
```

### FASE 2: Adicionar Supabase

Quando o usuário solicitar backend real:

#### Passo 1: Instalar Supabase

```bash
pnpm add @supabase/supabase-js
```

#### Passo 2: Copiar Template

```bash
cp templates/supabase.ts.example src/lib/supabase.ts
```

#### Passo 3: Configurar Environment

```bash
cp .env.example .env
```

Edite `.env` com suas credenciais:

```env
VITE_SUPABASE_URL=https://seu-projeto.supabase.co
VITE_SUPABASE_ANON_KEY=sua-chave-aqui
```

#### Passo 4: Atualizar API Client

Em `src/lib/api.ts`, comente o código de mock e descomente o código Supabase:

```typescript
// Comente isso:
// export const api = { ... mock functions ... }

// Descomente isso:
import { supabase } from "./supabase"

export const api = {
  users: {
    getAll: async () => {
      const { data, error } = await supabase.from("users").select("*")
      if (error) throw error
      return data || []
    },
  },
  // ... outras funções
}
```

### Migração de Mocks para Supabase

1. **Mantenha os tipos**: Seus types em `src/types/` continuam os mesmos
2. **Atualize gradualmente**: Migre uma API por vez
3. **Tratamento de erros**: Adicione try/catch onde necessário
4. **Loading states**: Já estão implementados nos hooks

### FASE 3: Configurar MCP Server do Supabase (Opcional)

O MCP Server do Supabase adiciona 42 ferramentas ao Claude Code para interagir diretamente com seu banco de dados durante o desenvolvimento.

**Quando usar?**
- Ao trabalhar com Claude Code e precisar consultar/manipular dados do Supabase
- Para debug rápido de queries e estruturas de dados
- Automatizar operações de banco de dados durante desenvolvimento

#### Pré-requisito: Instalação Global (uma vez só)

O MCP Server já está instalado globalmente em `~/lab/.mcp-servers/supabase/`. Se não estiver:

```bash
cd ~/lab/.mcp-servers
git clone https://github.com/canbolayir/self-hosted-supabase-mcp supabase
cd supabase
npm install && npm run build
```

#### Configurar para o Projeto Atual

Após configurar suas credenciais do Supabase no `.env`:

```bash
# 1. Configure as variáveis do Supabase no .env
SUPABASE_URL=https://seu-projeto.supabase.co
SUPABASE_ANON_KEY=sua-chave-anonima
SUPABASE_SERVICE_ROLE_KEY=sua-service-role-key

# 2. Execute o script de setup
pnpm setup:mcp
```

**O que o script faz:**
1. Lê as credenciais do `.env` local
2. Atualiza automaticamente a configuração do Claude Code
3. Configura o MCP Server para usar o Supabase do projeto atual

**Importante:**
- Cada projeto tem seu próprio Supabase com credenciais diferentes
- Ao trocar de projeto, rode `pnpm setup:mcp` novamente
- Reinicie o Claude Desktop após rodar o script
- A `SERVICE_ROLE_KEY` é sensível - NUNCA commite o `.env`!

#### Ferramentas Disponíveis

Após configurar, o Claude Code terá acesso a:
- Queries SQL diretas
- CRUD operations em tabelas
- Gerenciamento de usuários e auth
- Operações de storage
- Execução de functions
- E muito mais (42 ferramentas no total)

---

## 8. React Router Patterns

### Navegação

```typescript
import { Link, useNavigate } from "react-router-dom"

// Navegação declarativa
<Link to="/about">About</Link>

// Navegação programática
const navigate = useNavigate()
navigate('/products')
navigate(-1) // Voltar
```

### Protected Routes

```typescript
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const user = useUserStore((state) => state.user)

  if (!user) {
    return <Navigate to="/login" replace />
  }

  return <>{children}</>
}

// Uso
<Route
  path="/dashboard"
  element={
    <ProtectedRoute>
      <Dashboard />
    </ProtectedRoute>
  }
/>
```

### Parâmetros de Rota

```typescript
// Definir rota
<Route path="/products/:id" element={<ProductDetail />} />

// Acessar parâmetros
import { useParams } from "react-router-dom"

function ProductDetail() {
  const { id } = useParams()
  // ...
}
```

---

## 9. Performance Tips

### React.memo

Use para componentes que recebem mesmas props frequentemente:

```typescript
export const ProductCard = React.memo(({ product }: Props) => {
  return <Card>...</Card>
})
```

### useCallback

Para funções passadas como props:

```typescript
const handleClick = useCallback(() => {
  doSomething(id)
}, [id])
```

### useMemo

Para cálculos custosos:

```typescript
const filteredProducts = useMemo(() => {
  return products.filter((p) => p.price > 50)
}, [products])
```

### Lazy Loading

```typescript
import { lazy, Suspense } from "react"

const Dashboard = lazy(() => import("@/routes/Dashboard"))

<Suspense fallback={<Loading />}>
  <Dashboard />
</Suspense>
```

---

## 10. TypeScript Tips

### Evite `any`

```typescript
// ❌ EVITE
const data: any = await api.fetchData()

// ✅ BOM
const data: User[] = await api.fetchData()

// ✅ Quando não souber o tipo exato
const data: unknown = await api.fetchData()
if (isUser(data)) {
  // Type guard
  // data é User aqui
}
```

### Utility Types

```typescript
// Partial - torna todas props opcionais
type PartialUser = Partial<User>

// Pick - seleciona props específicas
type UserPreview = Pick<User, "id" | "name">

// Omit - remove props
type UserWithoutEmail = Omit<User, "email">

// Required - torna todas props obrigatórias
type RequiredConfig = Required<Config>
```

---

## 11. Naming Conventions

### Arquivos

- **Componentes**: `PascalCase.tsx` (ex: `ProductCard.tsx`)
- **Hooks**: `camelCase.ts` (ex: `useProducts.ts`)
- **Stores**: `camelCase.ts` (ex: `userStore.ts`)
- **Utils**: `camelCase.ts` (ex: `formatDate.ts`)
- **Types**: `camelCase.ts` ou `PascalCase.ts` (ex: `types.ts` ou `User.types.ts`)

### Variáveis e Funções

```typescript
// Componentes
function UserProfile() {}

// Hooks
function useUser() {}

// Handlers
const handleClick = () => {}
const handleSubmit = () => {}

// Booleans
const isLoading = true
const hasError = false
const canEdit = true

// Arrays
const users = []
const userList = [] // quando 'users' já existe

// Objects
const user = {}
const userData = {}
```

---

## 12. Accessibility (a11y)

### Sempre use labels

```typescript
<label htmlFor="email">Email</label>
<input id="email" type="email" />
```

### Buttons acessíveis

```typescript
// ✅ BOM
<button onClick={handleClick} aria-label="Close modal">
  <X />
</button>

// ❌ EVITE
<div onClick={handleClick}>
  <X />
</div>
```

### Alt text em imagens

```typescript
<img src={product.image} alt={`${product.title} product image`} />
```

---

## 13. Error Handling

### Em Componentes

```typescript
function ProductList() {
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    api.products
      .getAll()
      .then(setProducts)
      .catch((err) => setError(err.message))
  }, [])

  if (error) {
    return (
      <div className="text-red-500">
        <p>Error: {error}</p>
        <button onClick={retry}>Try Again</button>
      </div>
    )
  }

  return <div>...</div>
}
```

### Em Hooks

```typescript
export function useProducts() {
  const [error, setError] = useState<Error | null>(null)

  const loadProducts = async () => {
    try {
      setError(null)
      const data = await api.products.getAll()
      setProducts(data)
    } catch (err) {
      setError(err as Error)
      console.error("Failed to load products:", err)
    }
  }

  return { products, error, isLoading, retry: loadProducts }
}
```

---

## 14. Testing Patterns

### Component Tests (quando adicionar testes)

```typescript
import { render, screen } from "@testing-library/react"
import { Button } from "./Button"

test("renders button with label", () => {
  render(<Button label="Click me" onClick={() => {}} />)
  expect(screen.getByText("Click me")).toBeInTheDocument()
})
```

### Hook Tests

```typescript
import { renderHook } from "@testing-library/react"
import { useProducts } from "./useProducts"

test("loads products", async () => {
  const { result } = renderHook(() => useProducts())
  await waitFor(() => {
    expect(result.current.products).toHaveLength(3)
  })
})
```

---

## 15. Environment Variables

### Acessando

```typescript
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
```

### Regras

1. Prefixo `VITE_` é **obrigatório** para variáveis expostas ao browser
2. Nunca commite `.env` com valores reais
3. Sempre forneça `.env.example` com placeholders

---

## 16. Scripts Disponíveis

**⚠️ Este projeto usa pnpm, não npm ou yarn!**

```bash
# Desenvolvimento
pnpm dev

# Build de produção
pnpm build

# Preview do build
pnpm preview

# Linting
pnpm lint
```

---

## 17. Padrões de Código a Seguir

### DRY (Don't Repeat Yourself)

Se você copiar código 3+ vezes, extraia para uma função/componente.

### Single Responsibility

Cada componente/função deve ter **uma única responsabilidade**.

### Composition over Props Drilling

Use Context API ou Zustand ao invés de passar props por múltiplos níveis.

### Keep Components Small

Se um componente passar de 200 linhas, considere quebrar em componentes menores.

---

## Troubleshooting Comum

### Erro: "Cannot find module '@/...'"

**Solução**: Path aliases não configurados. Verifique `vite.config.ts` e `tsconfig.app.json`.

### Build falha

**Solução**: Rode `pnpm lint` para verificar erros de TypeScript/ESLint.

### Tailwind não aplica estilos

**Solução**: Verifique se `src/index.css` tem `@import "tailwindcss"` no topo e se está importado em `main.tsx`.

### Tailwind não está aplicando estilos (classes não funcionam)

**Solução**: Verifique se você instalou E configurou o plugin Vite:

1. Instale: `pnpm add -D @tailwindcss/vite`
2. Configure em `vite.config.ts`:
   ```typescript
   import tailwindcss from "@tailwindcss/vite"
   export default defineConfig({
     plugins: [react(), tailwindcss()],  // ← Adicione isso
   })
   ```

### Erro: "Cannot find module tailwindcss/plugin"

**Solução**: Isso é código v3. No v4, NÃO use plugins via JS. Use apenas `@theme` no CSS.

### Alguém criou tailwind.config.js por engano

**Solução**: DELETE o arquivo imediatamente:
```bash
rm tailwind.config.js postcss.config.js
```

### shadcn/ui component não encontrado

**Solução**: Instale o componente: `npx shadcn@latest add [component]`

### Classes Tailwind não são reconhecidas

**Solução v4**: Certifique-se de que está usando a sintaxe correta do v4. Cores customizadas devem ser definidas em `@theme` no CSS, não em `tailwind.config.js`.

---

## Suporte e Dúvidas

- **shadcn/ui docs**: https://ui.shadcn.com
- **Tailwind v4 docs**: https://tailwindcss.com/docs
- **React Router**: https://reactrouter.com
- **Zustand**: https://github.com/pmndrs/zustand
- **Supabase**: https://supabase.com/docs

---

**Lembre-se**: Este boilerplate é um ponto de partida. Adapte conforme as necessidades do seu projeto!
