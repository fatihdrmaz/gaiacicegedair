# JSX → Next.js TSX Conversion Rules

**Source:** `/Users/fatihdurmaz/expo-projects/gaiacicegedair/src/`
**Target:** `/Users/fatihdurmaz/expo-projects/gaiacicegedair-next/src/`

Source files use the Babel-standalone "global script" style: no imports/exports, every top-level `function X` or `const Y` is a browser global referenced by other files. Hooks are destructured from `React` (e.g. `const { useState, useEffect } = React`).

## Rules

1. **Output:** Convert each `.jsx` → a `.tsx` file with ES module `import`/`export`.
2. **'use client':** Add `'use client';` at the top of any file using React hooks, event handlers, refs, or browser APIs (window/document/localStorage).
3. **React imports:** Replace `const { useState, useEffect } = React` with explicit imports from `'react'`.
4. **Cross-file imports** — use these aliases:
   - `Button, Input, TextArea, Select, Field, Modal, FloralImage, SectionTitle, Divider, Reveal, useReveal` → `@/components/ui`
   - `Icons` (and subcomponents) → `@/components/shared/icons`
   - `Logo` → `@/components/shared/logo`
   - Photo data / `PHOTOS` / image helpers → `@/components/site/images`
   - `SERVICE_DETAILS`, `BLOG_POSTS`, `SERVICES`, etc. → `@/lib/content`
   - `Nav` → `@/components/shared/nav`
   - `Footer` → `@/components/shared/footer`
   - `QuoteForm` → `@/components/site/quote-form`
   - `TweaksPanel` → `@/components/shared/tweaks`
   - `WhatsappFab` → `@/components/shared/whatsapp-fab`
   - `Hero, Services, About, Showcase, Gallery, Contact, Blog*, B2C*, ServiceDetailPage, ...` → `@/components/site/<kebab-name>`
   - `Portal*` components → `@/components/portal/<kebab-name>`
   - Portal mock data → `@/lib/portal-data`

5. **Routing — replace SPA `setPage(...)` calls** with Next.js routing:

   | Old key | New path |
   |---|---|
   | `home` | `/` |
   | `services` | `/hizmetler` |
   | `about` | `/hakkimizda` |
   | `gallery` | `/galeri` |
   | `b2c` | `/ozel-gunlerim` |
   | `contact` | `/iletisim` |
   | `blog` | `/blog` |
   | `blog:<slug>` | `/blog/<slug>` |
   | `service:<key>` | `/hizmetler/<key>` |
   | `portal` | `/portal/giris` |
   | `portal:dashboard` | `/portal/dashboard` |
   | `portal:admin` | `/admin` |
   | `portal:<x>` | `/portal/<x>` |

   - `<a onClick={() => setPage('x')}>` → `<Link href="/...">` (import from `next/link`)
   - Programmatic nav: `const router = useRouter()` (from `next/navigation`), `router.push('/...')`
   - Drop `setPage` / `onNavigate` props when no longer needed
   - Drop `localStorage.getItem('gaia-page')`, `window.__setPage`
   - Remove `ReactDOM.createRoot(...)` calls

6. **Types:** keep minimal. Inline prop types are fine: `function Foo({ x }: { x: number })`. Use `any` for free-form/loose data. Goal: compile cleanly with `tsc --noEmit`.

7. **Inline `<style>{\`...\`}</style>`** — keep as-is; works in client components.

8. **CSS vars** like `var(--accent)` — keep verbatim. `globals.css` is already wired.

9. **Body data attributes** (e.g. `document.body.dataset.accent`) — set only inside `useEffect` in client components.

10. **Don't refactor / redesign** — preserve behavior. Mock data references (`Akbank`, `Ayşe Kaya`, etc.) stay for now; Phase 2 will swap them for real data.

11. **File name convention:** kebab-case TSX. Component name remains PascalCase, exported.

12. **CJS interop:** `<script src="...babel/standalone">` is gone — no `require()` either. Use only ES imports.
