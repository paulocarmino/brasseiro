# React Boilerplate

> A modern, production-ready React boilerplate with all the essentials configured and working out of the box.

## Overview

This boilerplate eliminates hours of initial setup by providing a fully configured React development environment with modern tools and best practices. Start building features immediately instead of configuring build tools.

### Philosophy: Mock-First Development

- **Start Fast**: Begin with mock data for rapid prototyping
- **Validate Early**: Test ideas without backend dependencies
- **Scale When Ready**: Seamlessly migrate to Supabase when needed

## Tech Stack

### Core (Always Present)

| Technology          | Version | Purpose                |
| ------------------- | ------- | ---------------------- |
| React               | 19.x    | UI Framework           |
| TypeScript          | 5.x     | Type Safety            |
| Vite                | 7.x     | Build Tool             |
| Tailwind CSS        | 4.x     | Styling (CSS-first!)   |
| shadcn/ui           | Latest  | Component Library      |
| React Router        | 6.x     | Client-side Routing    |
| Zustand             | Latest  | State Management       |
| Lucide React        | Latest  | Icons                  |
| ESLint + Prettier   | Latest  | Code Quality           |

### Optional (Add When Needed)

| Technology          | Purpose                | When to Add            |
| ------------------- | ---------------------- | ---------------------- |
| Supabase            | Backend (BaaS)         | When migrating from mocks |

## Quick Start

**⚠️ This project uses pnpm, not npm or yarn!**

```bash
# Clone or copy this directory
cp -r boilerplate-react my-new-project

# Navigate to project
cd my-new-project

# Install dependencies
pnpm install

# Start development server
pnpm dev
```

Open [http://localhost:5173](http://localhost:5173) to see your app.

## Project Structure

```
boilerplate-react/
├── public/                  # Static assets
├── src/
│   ├── components/          # Reusable components
│   │   ├── ui/             # shadcn/ui components
│   │   └── layout/         # Layout components (Header, Footer)
│   ├── features/           # Feature-based organization (when needed)
│   │   └── example/        # Example feature
│   ├── hooks/              # Custom React hooks
│   │   └── useProducts.ts  # Example custom hook
│   ├── lib/                # Libraries and utilities
│   │   ├── api.ts         # API client (mock → Supabase ready)
│   │   └── utils.ts       # Utility functions (cn, etc.)
│   ├── mocks/              # Mock data for prototyping
│   │   └── data.ts        # Example mock data
│   ├── routes/             # Pages/Routes
│   │   ├── Home.tsx       # Home page
│   │   ├── About.tsx      # About page
│   │   └── NotFound.tsx   # 404 page
│   ├── stores/             # Zustand stores
│   │   └── exampleStore.ts # Example store
│   ├── types/              # TypeScript type definitions
│   ├── App.tsx             # Router configuration
│   ├── main.tsx            # Application entry point
│   └── index.css           # Global styles + Tailwind
├── templates/              # Optional templates
│   └── supabase.ts.example # Supabase setup template
├── .env.example            # Environment variables template
├── CLAUDE.md               # Development guidelines
├── README.md               # This file
└── package.json            # Dependencies and scripts
```

## Available Scripts

```bash
# Development server with hot reload
pnpm dev

# Build for production
pnpm build

# Preview production build
pnpm preview

# Run ESLint
pnpm lint
```

## Features

### ✅ Fully Configured

- **Zero Config Required**: Everything works out of the box
- **Path Aliases**: Use `@/` imports everywhere
- **TypeScript**: Full type safety and IntelliSense
- **Hot Module Replacement**: Instant feedback during development

### ✅ Modern Styling

- **Tailwind CSS**: Utility-first styling
- **shadcn/ui**: Beautiful, accessible components
- **Dark Mode Ready**: Built-in dark mode support
- **Responsive**: Mobile-first design patterns

### ✅ Developer Experience

- **ESLint + Prettier**: Consistent code formatting
- **Fast Build Times**: Vite's lightning-fast HMR
- **Type Safety**: Catch errors before runtime
- **Clear Structure**: Intuitive folder organization

### ✅ Production Ready

- **Optimized Builds**: Automatic code splitting
- **Tree Shaking**: Remove unused code
- **Asset Optimization**: Images and fonts optimized
- **Modern Output**: ES2022+ with fallbacks

## What's Included

### Components

- **Layout**: Header, Footer, Layout wrapper
- **shadcn/ui**: Button, Card, Input, Label, Toast, Dialog, Dropdown Menu
- **Examples**: ProductCard, forms, navigation

### State Management

- **Zustand Store**: Example store with products
- **Custom Hooks**: useProducts, use-toast

### Routing

- **React Router**: Configured with nested routes
- **Pages**: Home, About, 404
- **Navigation**: Header with responsive nav

### Mock Data

- **Products**: Example product data with images
- **Users**: Example user data
- **API Client**: Mock API that mimics real backend

## Development Guide

See [CLAUDE.md](./CLAUDE.md) for comprehensive development guidelines including:

- React + TypeScript best practices
- Component patterns
- Styling conventions
- State management patterns
- Migration from mock to real backend
- Performance optimization tips
- Accessibility guidelines

## Migrating to Real Backend (Supabase)

When you're ready to add a real backend:

### Step 1: Install Supabase

```bash
pnpm add @supabase/supabase-js
```

### Step 2: Copy Template

```bash
cp templates/supabase.ts.example src/lib/supabase.ts
```

### Step 3: Configure Environment

```bash
cp .env.example .env
```

Edit `.env` with your Supabase credentials:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

### Step 4: Update API Client

In `src/lib/api.ts`, replace mock functions with Supabase queries. See comments in the file for examples.

## Adding UI Components

### 🚨 CRITICAL: Always Use CLI, Never Create Manually

**NEVER** create shadcn/ui or Retro UI components manually! Always use the CLI:

❌ **WRONG**: Copy code from examples and create files manually
✅ **RIGHT**: Use `npx shadcn@latest add [component]`

**Why?**
- CLI ensures up-to-date code
- Automatically installs dependencies
- Applies your `components.json` configuration
- Prevents bugs from outdated versions

### shadcn/ui Components

```bash
# Add a specific component
npx shadcn@latest add button
npx shadcn@latest add card
npx shadcn@latest add dialog

# Add multiple components
npx shadcn@latest add select form table

# See available components
npx shadcn@latest add
```

Browse all components at [ui.shadcn.com](https://ui.shadcn.com/docs/components)

### Retro UI Components

Retro UI uses the same CLI:

```bash
# Method 1: Via registry (recommended)
npx shadcn@latest add @retroui/button
npx shadcn@latest add @retroui/card

# Method 2: Via direct URL
npx shadcn@latest add 'https://retroui.dev/r/button.json'
```

Browse components at [retroui.dev](https://retroui.dev/docs/components)

## Customization

### Theme

Edit CSS variables in `src/index.css` to customize colors:

```css
:root {
  --primary: 221.2 83.2% 53.3%;
  --secondary: 210 40% 96.1%;
  /* ... more variables */
}
```

### Tailwind v4 Setup

Tailwind v4 requires **TWO** dependencies:

```bash
pnpm add -D tailwindcss @tailwindcss/vite
```

Configure Vite plugin in `vite.config.ts`:

```typescript
import tailwindcss from "@tailwindcss/vite"

export default defineConfig({
  plugins: [react(), tailwindcss()],  // ← Essential!
})
```

Customize theme in `src/index.css` using `@theme`:

```css
@theme {
  --color-brand: #ff6b6b;
}
```

Then use: `className="bg-brand"`

**Note**: Tailwind v4 doesn't use `tailwind.config.js` or `postcss.config.js`!

### TypeScript

Strict type checking is enabled. Adjust in `tsconfig.app.json` if needed.

## Deployment

### Vercel (Recommended)

```bash
# Install Vercel CLI
pnpm add -g vercel

# Deploy
vercel
```

### Netlify

```bash
# Build command
pnpm build

# Publish directory
dist
```

### Other Platforms

Build with `pnpm build` and deploy the `dist/` directory to any static hosting service.

## Troubleshooting

### Path alias `@/` not working

Ensure `vite.config.ts` and `tsconfig.app.json` are properly configured with path aliases.

### Tailwind styles not applying

1. Ensure you installed both dependencies: `pnpm add -D tailwindcss @tailwindcss/vite`
2. Check that `vite.config.ts` has the Tailwind plugin configured
3. Verify `index.css` contains `@import "tailwindcss"` at the top
4. Confirm `index.css` is imported in `main.tsx`
5. **Note**: Tailwind v4 doesn't use `tailwind.config.js`!

### TypeScript errors

Run `pnpm build` to see all TypeScript errors. Fix them before committing.

### Build fails

1. Run `pnpm lint` to check for ESLint errors
2. Fix all errors before building
3. Check for unused imports or variables

## Environment Variables

All environment variables must be prefixed with `VITE_` to be accessible in the browser.

```env
# ✅ Accessible in browser
VITE_API_URL=https://api.example.com

# ❌ NOT accessible in browser
API_SECRET=secret-key
```

Access in code:

```typescript
const apiUrl = import.meta.env.VITE_API_URL
```

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Contributing

This is a template repository. Feel free to:

- Customize for your needs
- Add/remove dependencies
- Modify folder structure
- Adapt coding patterns

## Resources

- [React Docs](https://react.dev)
- [Vite Docs](https://vite.dev)
- [Tailwind CSS](https://tailwindcss.com)
- [shadcn/ui](https://ui.shadcn.com)
- [React Router](https://reactrouter.com)
- [Zustand](https://github.com/pmndrs/zustand)
- [Supabase](https://supabase.com/docs)

## License

MIT - Feel free to use this boilerplate for any project.

---

**Built with ❤️ for rapid React development**
