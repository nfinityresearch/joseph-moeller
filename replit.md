# Overview

This is "Joseph Moeller | Zen Practice & Writing" — a literary archive website for the writer Joseph Moeller, who writes on Zen practices. Built as a full-stack TypeScript application, it presents books/writings, quotes, and a biography in a visually refined, classical layout with generative/randomized elements (rotating zen quotes surfaced from the database). The design aesthetic is minimal and editorial, using serif typography (Crimson Pro) on warm paper-white backgrounds.

## User Preferences

- Preferred communication style: Simple, everyday language.
- Design direction: Classical, minimal, small serif type (Sabon-style). White space. Not inauthentic.
- Content should be data-driven (JSON/database), not hardcoded into component files.
- Generative elements: Rotating zen quotes/extracts that keep the site "alive."
- Navigation: Two items only — Writings and Biography.

## System Architecture

### Frontend
- **Framework**: React 19 with TypeScript, bundled by Vite
- **Routing**: Uses `wouter` for lightweight client-side routing. Routes are defined inline in `client/src/pages/home.tsx` via a `HomeRouter` component.
- **State/Data Fetching**: TanStack React Query for server state management. API calls use `fetch()` directly with query keys matching API paths.
- **UI Components**: Shadcn/ui (new-york style) with Radix UI primitives. Full component library lives in `client/src/components/ui/`
- **Styling**: Tailwind CSS v4 (using `@tailwindcss/vite` plugin and `@import "tailwindcss"` syntax), with CSS custom properties for theming. The color scheme uses warm, paper-like tones.
- **Animations**: Framer Motion for layout animations, transitions, and interactive effects
- **Custom Components**: 
  - `GenerativeStream` — rotating quote display with timed transitions, fetches from `/api/quotes`
- **Entry Point**: `client/src/main.tsx` → `App.tsx` → `Home` page

### Backend
- **Framework**: Express 5 on Node.js with TypeScript (compiled via `tsx`)
- **HTTP Server**: Node `http.createServer` wrapping Express
- **API Design**: RESTful JSON API under `/api/` prefix
  - `GET /api/site` — site config (title, subtitle, nav, author image) from `content/site.json`
  - `GET /api/quotes` — all quotes
  - `GET /api/quotes/random` — random quote
  - `GET /api/books` — all essays
  - `GET /api/books/:id` — single essay by ID
  - `GET /api/sections` — all content sections
  - `GET /api/sections/:slug` — single section by slug
- **Development**: Vite dev server runs as middleware for HMR (`server/vite.ts`)
- **Production**: Static files served from `dist/public` with SPA fallback (`server/static.ts`)

### Content (JSON Source of Truth)
- **Directory**: `content/` — all site content is defined in editable JSON files
  - `site.json` — site title, subtitle, author name/image, navigation items
  - `quotes.json` — rotating zen quotes (text, source, year)
  - `essays.json` — essay content (title, year, description, coverImage, body text)
  - `sections.json` — page sections like biography (slug, title, content, sortOrder)
- **Seed Script**: `server/seed.ts` — on every server startup, clears and re-inserts all content from JSON files into the database, ensuring JSON files are always the single source of truth
- **Editing Content**: To change any text, quotes, essays, or images, edit the JSON files in `content/`. Changes take effect on next server restart.

### Database
- **Database**: PostgreSQL (required via `DATABASE_URL` environment variable)
- **ORM**: Drizzle ORM with `drizzle-zod` for schema validation
- **Schema** (`shared/schema.ts`): Tables:
  - `quotes` — id (serial), text, source, year
  - `books` — id (serial), title, year, publisher, description, coverImage, body
  - `sections` — id (serial), slug (unique), title, content, sortOrder
  - `contact_messages` — id (serial), name, email, subject, message, createdAt
- **Migrations**: Drizzle Kit with `drizzle-kit push` command (`npm run db:push`)
- **Storage Layer**: `server/storage.ts` implements `IStorage` interface with `DatabaseStorage` class using `pg.Pool`

### Build System
- **Client Build**: Vite builds to `dist/public`
- **Server Build**: esbuild bundles server code to `dist/index.cjs`
- **Scripts**:
  - `npm run dev` — development server with HMR
  - `npm run build` — production build (client + server)
  - `npm run start` — run production build
  - `npm run db:push` — push schema to database

### Path Aliases
- `@/*` → `client/src/*`
- `@shared/*` → `shared/*`
- `@assets` → `attached_assets/`

## External Dependencies

- **PostgreSQL** — Primary database, connected via `DATABASE_URL` environment variable using `pg` (node-postgres) driver
- **Google Fonts** — Crimson Pro serif font loaded via Google Fonts CDN
- **Replit Plugins** — Development-only Vite plugins for Replit integration
- **No authentication** — Currently no auth system implemented; all API endpoints are public read-only

## Recent Changes

- 2026-02-16: Converted from static JSON to full-stack with PostgreSQL database. All content (quotes, books, music, sections) now served via API routes.
- 2026-02-16: Redesigned to classical minimal aesthetic with Crimson Pro serif font.
- 2026-02-16: Added navigation for Books, Journalism, Music, Film, Art, Store, Contact sections.
- 2026-02-16: Transformed site to Joseph Moeller zen writer. Removed music table/routes. Nav simplified to Writings and Biography. All content replaced with zen practice themes.
- 2026-02-16: Moved all content to JSON files in `content/` directory as single source of truth. Added seed script that syncs JSON → DB on every startup. Added `/api/site` endpoint. Frontend header/nav/footer now driven by `site.json`.
