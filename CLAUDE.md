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
- **Surfaces:** `.card` (+ `.card-hover`) and `.panel`. Since 05/11/2026 separation is a 1px
  rule in the `line` colour, square, no shadow (see Professional pass below).
- **Chrome:** `.hdr` is a translucent `backdrop-filter` layer the page scrolls under, with a thin
  bottom rule (the scroll shadow was removed 05/11/2026).
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
`components/hero-before-after.tsx` (the homepage hero's drag handle, plus its one-time mount hint).
`components/motion.tsx` exports `Reveal` (scroll reveal, `rise` and `image` variants, `delay` for
stagger). `components/fade-in.tsx` is a thin wrapper kept for existing callers.

**Homepage motion (05/11/2026, feat/professional, after the owner called the professional home
"boring and not sleek").** Brought over from `feat/v3` and recoloured (v3 orange = teal: `#57BACE`
on navy, `#0D7186` on paper; v3 ink = navy; light text = paper). All CSS lives in the commented
"Homepage motion" block at the foot of `app/globals.css`.
- **Libraries:** `gsap` 3.15.0 (ScrollTrigger + SplitText), `@gsap/react` 2.1.2, `lenis` 1.3.27.
  No three.js, framer-motion or animejs. `components/anim/gsap.ts` registers the plugins once and
  exports `MOTION_OK` (`prefers-reduced-motion: no-preference`); every scroll effect is gated on it.
- **Shared (every public page):** `components/anim/smooth-scroll.tsx` (Lenis, mounted in
  `site-shell.tsx`, off for coarse pointers and reduced motion, synced to ScrollTrigger) and the
  footer, now v3's `components/ui/beam-wordmark-footer.tsx` (navy, light-teal beam that drifts only
  while on screen, giant TMPC wordmark in the heading face; grain and vertical bands removed). The
  header is unchanged.
- **Home only** (`app/page.tsx`, wrapped in `.home-motion`, which also gives reveals v3's longer
  1.6rem / 0.9s rise): `components/home/home-hero.tsx` (full-bleed skyline
  `public/images/hero-home-skyline.jpg` + the two light masks; only the base photo is `priority`,
  the masks are `loading="eager"` without preload; shutter open, lights-on, `HeroMotion` scroll
  depth, fine-pointer `Reticle`; the 22/09 "We Represent You / One Point of Contact / Concept to
  Completion" line is the hero's foot). The skyline is atmospheric, not presented as TMPC work, so
  it is allowed under the no-stock rule. `public/images/hero-home.jpg` is a different photo
  (Chinatown) still used by `/hero`; the masks only fit the skyline file.
  `FxStrip`/`FxDrift` (ECB rates in baht via `lib/fx-rates.ts`, cached 1h, absent on failure);
  the before/after slider directly under it (`priority={false}` there); `OwnerTable` (v3's "we
  represent you" fan, its lit line now a CSS `stroke-dashoffset` transition instead of anime.js;
  it replaced `components/coordination-flow.tsx`, deleted, which said the same thing);
  `WordScrub` on its lead; `Parallax` (4%) on the Aura photo; `CoreServices` (five ruled rows,
  teal rule draws on hover, title steps in, arrow handed on; v3's sticky stock photos dropped);
  `ProcessTimeline scrub` (v3's reading-line fill, text only; Services still uses it static);
  Testimonials unchanged; `components/sections/cta-band.tsx` + `cta-band-motion.tsx` (navy, no
  photo, teal datum drawn on scroll, survey grid drift, low teal glow, Bangkok time).
  `SplitHeading` on the h1 and every section h2 (`.split-line-mask` has extra bottom room or the
  1.04 to 1.12 leading cuts descenders). `ButtonLink`/`TextLink`/`ArrowSwap` in
  `components/ui/arrow-link.tsx` (`.btn-x` wipe, `RollLabel`, `Magnetic` on primaries) are only
  used on the home page so far; plain `.btn` elsewhere is untouched.
- **Reduced motion:** headings and reveals are simply there, the hero opens lit and still, no
  reticle, Lenis off, the process marks the row being read without a travelling fill, hovers
  change instantly. Phones (< 900px) paint the hero copy without waiting for script.

**Professional pass (branch `feat/professional`, 05/11/2026).** The site should read like a
serious professional-services firm: restraint and proof, not effects.
- **No stock photography.** Every image on a public page is a real TMPC project photograph from
  `projects`/`project_images`, captioned with the project (`components/project-photo.tsx`, data
  via `lib/projects.ts`: `getPublishedProjects()` + `projectPhoto(projects, slug, phase?)`), or
  there is no image. Placed: Home "We save you money" = Aura Wellness Phuket (lead); About "Our
  Approach" and Services "Development Management" = Bright Phuket (lead); Services "Execution
  Oversight" = Aura Wellness Phuket (first in-progress photo). Page heroes are plain navy bands.
  OG images use the Aura Wellness Phuket lead (`getShareImage()`).
- Several seeded `project_images` rows still point at stock files (`/images/scenario-*.jpg`).
  `isRealProjectImage()` in `lib/project-phases.ts` drops any non-http URL, so `toPhaseGroups()`
  can now return `[]`; the gallery and detail page then lay that project out as text only.
  The rows themselves are untouched. The files in `public/images/` stay on disk, unreferenced.
- **The home hero `hero_before_after` row also points at stock** (`scenario-warehouse.jpg` /
  `scenario-commercial.jpg`); it was deliberately left as is. Replace it at `/admin/hero` with a
  real before/after (only Aura Wellness Phuket has rendering/in-progress/completed photos).
- **One before/after interaction only:** the home slider. The compare components, the projects
  card stream and anime.js are gone. GSAP, SplitText and Lenis came back on 05/11/2026 for the
  homepage only (see Homepage motion above). Off the home page `process-timeline.tsx` is a static
  ruled, numbered list (no photos); `service-index.tsx` is a plain sticky list; `Reveal` is the
  only scroll motion there (10px rise, 0.5s; the image variant is a plain fade).
- **UI:** square corners (radius tokens are 0), no card shadows (1px `line` rule instead), thin
  rules between consecutive light sections, the teal kept for links, eyebrow rules and focus.
  `.btn` is solid navy (paper on navy bands), `.btn-2` is text plus a thin border; the header CTA
  is `.btn-2`. Project category chips became plain small-caps labels.
- **Heading typeface review switch (REVIEW AID, remove once a face is chosen).** Both candidates
  load in `app/layout.tsx`: A = IBM Plex Sans (`--font-heading-a`, the default), B = Source Serif 4
  (`--font-heading-b`). Headings use `var(--font-heading)` (`--font-display` points at it);
  `html[data-type="serif"]` switches it to B and halves the negative tracking (`--hd-track`).
  `components/type-switch.tsx` reads `?type=serif` (or `?type=sans` to clear) on mount and keeps
  it in localStorage `tmpc-type`, client only, so no page turns dynamic. When a face is chosen:
  drop the other font, the switch component, its `<TypeSwitch />` and the `data-type` CSS.

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
detail page. Three segmented tabs on the image chrome scope everything below them, the strip,
the arrows, the counter, the lightbox, to one phase at a time; it opens on the most advanced
phase with images (`initialPhase()`). A per-phase index is remembered, so switching tabs and
back restores the photograph you were on rather than resetting to the first one. Autoplay
cycles within the active phase only, and runs **only while the card is on screen** and the
pointer is elsewhere (seven cards cycling at once is unreadable). The lightbox is scoped to the
active phase, because `finite: false` would otherwise wrap from the last completed photograph
into an unlabelled rendering.

**Homepage hero** (`components/hero-before-after.tsx`) is a drag-to-reveal before/after
comparison, backed by the single-row `hero_before_after` table (`supabase/migrations/
003_hero_before_after.sql`, `004_hero_before_after_project_label.sql`). One row, not a list: the
homepage has exactly one hero, so there is no "which row is active" logic anywhere, admin
included. Edited from `/admin/hero` (`components/admin/hero-before-after-form.tsx`), which
uploads straight to the `media-library` bucket under a `hero/` prefix and shows a live preview
using the same public component. Both images are cropped to a fixed 3:2 (`ImageCropModal`'s
`fixedAspect` prop, which also hides its aspect picker), so the two photos line up rather than
the compare edge jumping at the seam. `project_name`/`project_details` are the optional title-bar
label (shown top-left on the card, same treatment the old carousel gave a project's category and
title). The link to `/projects` is fixed in the component, not admin-editable.

On the homepage itself (since 05/11/2026) the slider is no longer in the hero: it sits in its own
"From site to opening" section directly under the full-bleed hero and the rates strip.

**Project detail pages** live at `/projects/[slug]`. `projects.slug` is generated from the
title on create and then **never regenerated**, so editing a title cannot break a live link.
The route resolves by slug first and falls back to the uuid, with `alternates.canonical`
pointing at the slug. It is dynamic, like every other public data page.

**Images:** uploaded client-side straight to Supabase Storage: `project-images` bucket
(`components/admin/image-uploader.tsx`) and `media-library` bucket (`app/admin/media/page.tsx`).
Both route every file through `components/admin/image-crop-modal.tsx` (react-easy-crop) before
upload. The public project gallery (`components/projects-gallery.tsx`) uses
`yet-another-react-lightbox` for fullscreen + zoom.

**Testimonials** (`components/testimonials.tsx`) renders active rows from the `testimonials`
table on the homepage, right after Services. Returns `null` when there are none, which is the
case today: the table and its `/admin/testimonials` editor existed for a while with nothing on
the public site reading from them.

**Blog** is public at `/blog` and `/blog/[slug]` (`app/blog/`), reading published `blog_posts`
rows. The admin editor (`/admin/blog`) predates these routes; `content` is authored as plain text
in a textarea, so the detail page splits on blank lines for paragraphs rather than parsing
markdown or HTML, there is no markdown/sanitizer dependency in this repo. `/blog` shows an empty
state instead of a blank grid when there are zero published posts (true today), and only shows up
in `sitemap.ts` once there is at least one.

**SEO** (`lib/seo.ts`, `app/sitemap.ts`, `app/robots.ts`). `getSeoRow(page)` reads one row from
the `seo_metadata` table; `generateMetadata()` on Home/About/Services/Projects/Contact calls it
and falls back to a hardcoded default, so `/admin/seo` now actually changes what ships instead of
writing to a table nothing read. `metadataBase` in `app/layout.tsx` is a `SITE_URL` constant
pointed at the live Vercel URL: `tmpc.co.th` doesn't resolve, so every canonical/OG tag used to
point at a dead domain. Update `SITE_URL` (in `app/layout.tsx`, `app/sitemap.ts`, `app/robots.ts`)
the day a real custom domain goes live. `app/layout.tsx` also carries a site-wide
`ProfessionalService` JSON-LD block; there was none before.

**Contact page** (`app/contact/page.tsx`) reads `whatsapp`/`email`/`location` from `site_settings`
live rather than the hardcoded `siteConfig` defaults, falling back to `siteConfig` only if a
setting is empty. The WhatsApp card is conditional on `isRealPhoneNumber()`, digits only, 8 to 15
of them, because the seed placeholder `'66XXXXXXXXX'` was hardcoded straight into the page and
shipped live as a dead, clickable link. Don't hardcode a phone number back into this page; set the
real one at `/admin/settings` instead. The methods grid's column count tracks the real card count
so a hidden WhatsApp card never leaves an empty third column.

**The "10+ parties" stat was retired** (22/09/2026), replaced by client-outcome framing ("We
Represent You" / "One Point of Contact" / "Concept to Completion" in the hero, and
`components/coordination-flow.tsx`'s "Multiple Teams, 2 Languages, 1 Point of Contact" line
replacing the old numeric statement band; on 05/11/2026 that component was replaced by
`components/home/owner-table.tsx`, whose lead carries the same "multiple teams, two languages,
one point of contact" line). It used to be repeated three places and had drifted out
of sync (10+/8+/five); the Project Coordination service description (`services` table, number
`03`, CMS content) was updated to "multiple parties" in the same pass so nothing on the site still
carries the old figure.

**Homepage sections removed 22/09/2026, per client review**: the "Bangkok, Thailand" hero eyebrow
and the Quick Facts Rail (Bangkok based / English and Thai / Owner side / Concept to handover)
are both gone. `components/coordination-flow.tsx` replaced the "One Coordination Layer" statement
band, its own file comment explains the design constraints (a near-identical multi-box diagram
was tried on this homepage once before and removed for being "confusing/long on mobile," see
`git show 6431fd5` / `git show dd2c2cc`; this version is a single short vertical stack with no
responsive branching, built specifically to not repeat that failure).

## Gotchas that have bitten this repo

**Two `public/images` files are 29-byte HTML stubs, not JPEGs**: `bangkok-bg.jpg` and
`scenario-industrial.jpg`. `next/image` returns 400 for them. Neither is referenced by a
`project_images` row anymore (the Khon Kaen Community Hub row pointing at the second one was
removed after it rendered as an empty box in production); `scenario-industrial.jpg` is still used
by the internal `/hero` design-reference page, so don't delete it without checking there first.
Check `file -b --mime-type` before using anything from `public/images`.

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
