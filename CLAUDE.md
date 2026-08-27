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
No UI component library; the design system is hand-built in `app/globals.css`.

**The design system** (`app/globals.css`). Colors live in the Tailwind v4 `@theme` block
(`canvas`/`ink`/`accent`/`line`) alongside radius and shadow tokens.

**The palette is navy and teal over warm sand**, redrawn 25/08/2026. Every value is deliberate,
so do not swap one in isolation: the anchor `#0B2137` is a navy with chroma in it rather than a
near-black; the accent `#0D7186` is a petrol teal chosen specifically because the previous
`#0891B2` was within a hair of Tailwind's default cyan; and the neutrals (`#FBF9F4` paper,
`#F0EBE1` sand, `#E0D9CB` rules) are warm so the cool anchor has something to push against. That
warm/cool tension is the whole point: an earlier all-cool version read sterile. Shadows are
warm-tinted (`rgba(38,30,20,...)`) to sit in the same world; a blue shadow on sand looks wrong.
`--color-ink-muted` is `#5C626B` because anything lighter fails AA on the sand band.

On top of them:
- **Type scale:** `.t-display`, `.t-h1`..`.t-h4`, `.t-lead`, `.t-body`, `.t-micro`. Tracking is a
  function of size (large text gets negative tracking, small uppercase gets positive) and leading
  moves inversely. Do not reach for `tracking-tight` on a heading; use the scale class.
- **Surfaces:** `.card` (+ `.card-hover`) and `.panel`. Separation comes from *depth*, not a 1px
  rule on everything. Bigger surface, deeper shadow.
- **Chrome:** `.hdr` is a translucent `backdrop-filter` layer the page scrolls under, with a scroll
  edge effect (`[data-scrolled]`) rather than a permanent border.
- Also `.btn`/`.btn-2`/`.btn-sm`, `.lnk`, `.eye` (eyebrow with a rule), `.wrap`, `.sec`/`.sec-tight`.
- `.on-dark` on a navy section restyles eyebrows, secondary buttons, and focus rings for it.
- `prefers-reduced-motion`, `prefers-reduced-transparency` and `prefers-contrast` are each answered
  separately at the foot of the file. Reduced motion means gentler, not absent.

**Motion** (`lib/spring.ts`, `components/motion.tsx`). Anything a user can touch is driven by a
spring parameterised as **damping ratio + response** (not mass/stiffness), because springs are
interruptible and carry velocity through a re-target. `project()` gives a flick's resting point
(exponential decay, not `v^2/2a`), `rubberband()` gives progressive resistance at a boundary, and
`VelocityTracker` gives a real release velocity over a 100ms window. Used by
`components/layout/mobile-nav.tsx` (drag-to-dismiss bottom sheet) and
`components/hero-project-carousel.tsx` (1:1 drag, momentum projection, velocity handoff).
`components/motion.tsx` exports `Reveal` (scroll reveal, `rise` and `image` variants, `delay` for
stagger) and `HeroParallax`. `components/fade-in.tsx` is a thin wrapper kept for existing callers.

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

**Project image phases.** Every `project_images` row carries a `phase` of `rendering`,
`in_progress` or `completed` (text plus a CHECK, not a Postgres enum, so the spellings stay
editable). Three rules follow from it, and all three live in `lib/project-phases.ts`:
- `display_order` is scoped **per phase**: each phase numbers its own images from 0.
- `is_primary` means **first of its phase**, so up to three rows per project are true. Any
  reader must filter by phase as well.
- `toPhaseGroups()` drops empty phases, and `groups.length > 1` **is** the show-the-control
  rule. A project with images in only one phase renders exactly as it did before phases
  existed: no chip, no group labels. That is deliberate, not an oversight.

`components/project-image-stage.tsx` is the shared viewer used by both the list card and the
detail page. It runs one reel straight through every phase, swaps the label as it crosses a
boundary, and autoplays **only while the card is on screen** and the pointer is elsewhere
(seven cards cycling at once is unreadable). The lightbox is scoped to the phase on screen,
because `finite: false` would otherwise wrap from the last completed photograph into an
unlabelled rendering.

**Project detail pages** live at `/projects/[slug]`. `projects.slug` is generated from the
title on create and then **never regenerated**, so editing a title cannot break a live link.
The route resolves by slug first and falls back to the uuid, with `alternates.canonical`
pointing at the slug. It is dynamic, like every other public data page.

**Images:** uploaded client-side straight to Supabase Storage: `project-images` bucket
(`components/admin/image-uploader.tsx`) and `media-library` bucket (`app/admin/media/page.tsx`).
Both route every file through `components/admin/image-crop-modal.tsx` (react-easy-crop) before
upload. The public project gallery (`components/projects-gallery.tsx`) uses
`yet-another-react-lightbox` for fullscreen + zoom.

## Gotchas that have bitten this repo

**Two `public/images` files are 29-byte HTML stubs, not JPEGs**: `bangkok-bg.jpg` and
`scenario-industrial.jpg`. `next/image` returns 400 for them. The second is referenced by a
`project_images` row, so /projects logs one 400 until the real file is supplied. Check
`file -b --mime-type` before using anything from `public/images`.

**The `.js` class on `<html>`** is set by an inline pre-paint script in `app/layout.tsx`. Every
scroll-reveal rule is scoped to it so the page renders fully visible without JavaScript. `<html>`
carries `suppressHydrationWarning` because of it; do not remove either half.

**Image reorder writes with `update`, never `upsert`.** `components/admin/image-uploader.tsx`
used to send partial rows `{id, display_order, is_primary}` through `.upsert()`, which
PostgREST turns into `INSERT ... ON CONFLICT`. Postgres checks NOT NULL on the proposed tuple
before resolving the conflict, so `project_id`, `storage_path` and `url` being absent made
every reorder and delete fail with `23502`. Neither call checked `error` and both updated
local state anyway, so the order looked right until the next refresh. It now uses per-row
`.update().eq('id', ...)`, which names only the columns it touches, so no future NOT NULL
column can break that path. Do not reintroduce a partial upsert here.

**The header opacity is load-bearing.** `.hdr` sits at `rgba(11,33,55,0.90)`. It was `0.72`,
which composites over the page ground to roughly `#4E5764`, a muddy grey: the brand navy visibly
stopped being navy. Any drop below about `0.88` brings that back. Translucency is traded away
here on purpose.

**`backdrop-filter` establishes a containing block for `position: fixed` descendants.** The mobile
nav sheet must stay portalled to `document.body`, or it gets trapped inside the translucent
header's height.

**Never hand-write `-webkit-backdrop-filter` next to the standard property in CSS.** Lightning CSS
dedupes the pair and can keep only the prefixed one, silently killing the blur.

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
