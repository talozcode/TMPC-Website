# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

## Writing rules (apply to ALL copy, content, comments, and commits)

1. **NEVER use em dashes (Unicode U+2014) or en dashes (U+2013).** This is the No. 1 rule.
   Use a comma, colon, period, parentheses, or a plain hyphen `-` instead. It applies
   everywhere: page copy, admin labels, placeholders, DB content, code comments, and commit
   messages. Scan with `grep -rnP "\x{2014}" app components lib scripts` before committing.

> **This is a modified Next.js 16.** The `middleware` file convention is renamed to
> `proxy` (root `proxy.ts`, exported `proxy()` + `config.matcher`). APIs/conventions can
> differ from training data, so read `node_modules/next/dist/docs/` before writing Next code.

## Commands

```bash
npm run dev      # dev server (Turbopack), http://localhost:3000
npm run build    # production build, also runs the TypeScript check
npm start        # serve the production build (after build)
npm run lint     # eslint
npx tsc --noEmit # typecheck only
```

There is **no test suite** in this repo. Verification is done by building and running the app.

Deploy: pushing to `main` (GitHub `talozcode/TMPC-Website`) auto-deploys on Vercel. A failed
`npm run build` means a failed deploy, so always build before pushing.

## Environment

`.env.local` holds: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`,
`SUPABASE_SERVICE_ROLE_KEY`, `ADMIN_EMAIL`. The service-role key is server-only.

## Architecture

A marketing site plus a self-serve CMS. **Supabase is the single source of truth**; the public
pages render whatever the admin edits.

**Stack:** Next.js 16 App Router, React 19, Tailwind v4, Supabase (Postgres + Auth + Storage).
No UI component library; the design system is hand-built (tokens + `animate-*` keyframes in
`app/globals.css`: `canvas`/`ink`/`accent`/`line` colors, `font-display`).

**Three Supabase clients, pick by context:**
- `lib/supabase/client.ts`: browser, anon key (client components).
- `lib/supabase/server.ts`: server component, anon key, reads cookies (respects RLS).
- `lib/supabase/admin.ts`: **service role, bypasses RLS, server-only.** Used by every admin page.

**Auth & RLS:** `proxy.ts` gates `/admin/*` (unauthenticated goes to `/admin/login`, logged-in
on login goes to `/admin/projects`). RLS (see `supabase/migrations/001_initial_cms_schema.sql`)
allows public read of *published/active* rows; the admin escapes RLS via the service-role client.

**Data flow:** admin (`app/admin/*`, service-role client + server actions) mutates Postgres, then
public pages (`app/`, anon server client) read it. Public/admin data pages are dynamic
(`export const dynamic = 'force-dynamic'` or cookie use) so edits appear without a redeploy.
Content tables: `projects` + `project_images`, `categories`, `services`, `team_members`,
`testimonials`, `blog_posts`, `site_settings`, `seo_metadata`, `media_files`, `contact_inquiries`.

**Images:** uploaded client-side straight to Supabase Storage: `project-images` bucket
(`components/admin/image-uploader.tsx`) and `media-library` bucket (`app/admin/media/page.tsx`).
Both route every file through `components/admin/image-crop-modal.tsx` (react-easy-crop) before
upload. The public project gallery (`components/projects-gallery.tsx`) uses
`yet-another-react-lightbox` for fullscreen + zoom.

## Critical gotcha: server components & interactivity

This has broken the build repeatedly. In a React Server Component you **cannot**:
- put an event handler on a DOM element (`<button onClick={...}>`), or
- pass a plain function (e.g. `onSave={(d) => action(id, d)}`) to a client component.

Both fail at RSC serialization, often only **once a table has rows** (an empty list renders no
buttons, so it sneaks past). Patterns used here:
- Pass server actions pre-bound: `action.bind(null, id)` (never an inline arrow).
- Extract interactive buttons (e.g. `confirm()` on delete) into small client components:
  `components/admin/confirm-delete-button.tsx`, `components/admin/delete-project-button.tsx`.

## Conventions

- After Edit/Write, commit and push (Vercel deploys). Branching off `main` is not required here.
- One-time data seeds live in `scripts/*.mjs`: idempotent Node scripts that hit the Supabase
  REST API with the service-role key from `.env.local` (e.g. `node scripts/seed-projects.mjs`).
- Renaming a UI label is not the same as touching DB columns / form `name=` keys. Keep data keys
  stable to avoid migrations.
