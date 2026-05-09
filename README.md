# TestCraft AI

Generador de test cases profesionales con IA. Pegá una user story, obtené Gherkin/BDD test cases en segundos.

## Stack

- **Frontend**: React 19 + Vite + TypeScript
- **Styling**: Tailwind CSS 4
- **Routing**: react-router-dom v7
- **Backend/Auth/DB**: Supabase
- **IA**: Anthropic Claude claude-sonnet-4-20250514 (via Supabase Edge Function)
- **Deploy**: Vercel

## Setup local

### 1. Clonar y instalar

```bash
git clone <repo>
cd testcraft-ai
npm install
```

### 2. Variables de entorno

```bash
cp .env.example .env
```

Completar con tus credenciales de Supabase:

```
VITE_SUPABASE_URL=https://tu-proyecto.supabase.co
VITE_SUPABASE_ANON_KEY=tu-anon-key
```

### 3. Supabase — Base de datos

1. Crear un proyecto en [supabase.com](https://supabase.com)
2. Ir a SQL Editor y ejecutar `supabase/schema.sql`
3. Habilitar Google OAuth en Authentication → Providers

### 4. Supabase — Edge Function

```bash
# Instalar Supabase CLI
npm install -g supabase

# Login
supabase login

# Linkear proyecto
supabase link --project-ref TU_PROJECT_REF

# Setear secrets
supabase secrets set ANTHROPIC_API_KEY=tu-anthropic-key

# Deploy de la edge function
supabase functions deploy generate-test-cases
```

### 5. Dev server

```bash
npm run dev
```

## Deploy en Vercel

1. Importar el repo en [vercel.com](https://vercel.com)
2. Agregar las variables de entorno:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
3. Framework preset: **Vite**
4. Deploy

## Estructura del proyecto

```
src/
├── components/     # UI components reutilizables
├── pages/          # Páginas de la app
├── hooks/          # Custom hooks (auth, credits, generations)
├── lib/            # Supabase client, types, constants
supabase/
├── schema.sql      # Schema de la base de datos
└── functions/      # Edge functions (llamada a Claude API)
```

## Planes

| Plan | Créditos/mes | Precio |
|------|-------------|--------|
| Free | 10 | $0 |
| Pro  | 200 | $19/mes |
| Team | 1000 | $79/mes |

---

Creado por QualityBridge · Buenos Aires
