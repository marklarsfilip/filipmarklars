# Filip Marklars Website — Redesign v2

**Date:** 2026-03-25
**Stack:** SvelteKit 2, Svelte 5, TypeScript, Tailwind CSS v4, Cloudflare Pages

## Design Direction

Minimal Dark Elegance with motion-driven interactions. Ultra-clean layout, generous whitespace, thin typography, and purposeful animations that make the site feel alive without being distracting.

## Color Palette — Warm Ember (Refined)

| Token          | Hex       | Usage                              |
|----------------|-----------|------------------------------------|
| `base`         | `#050505` | Page background                    |
| `surface`      | `#111110` | Cards, elevated surfaces           |
| `surface-hover`| `#1a1918` | Interactive hover states           |
| `cream`        | `#FFF6DA` | Primary text                       |
| `orange`       | `#FC6B3F` | Accent, CTAs, highlights           |
| `mint`         | `#84F2D6` | Tags, secondary accent             |
| `muted`        | `#8a8480` | Secondary text, captions (4.5:1+ on base) |

## Typography

| Role     | Font        | Weights      | Usage                        |
|----------|-------------|--------------|------------------------------|
| Headings | Cormorant   | 300, 400, 600| Page titles, hero, section heads |
| Body     | Montserrat  | 300, 400, 500| Body text, nav, buttons      |
| Mono     | Fira Code   | 400          | Code blocks, tech badges     |

Google Fonts: add `<link rel="preconnect" href="https://fonts.googleapis.com">` and `<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>` in `app.html` before the stylesheet link:
```
https://fonts.googleapis.com/css2?family=Cormorant:ital,wght@0,300;0,400;0,600;1,300;1,400&family=Montserrat:wght@300;400;500&family=Fira+Code:wght@400&display=swap
```

## Motion System

All animations respect `prefers-reduced-motion` — when enabled, all motion is disabled and transitions are instant.

### Entrance Animations
- Elements fade-up (opacity 0→1, translateY 20px→0) when scrolling into view
- Uses Intersection Observer with `threshold: 0.1`
- Staggered delays within groups (e.g., cards stagger 100ms apart)
- Duration: 600-800ms, ease-out

### Page Transitions
- Svelte `{#key $page.url.pathname}` wrapper around `{@render children()}` in layout
- Import `$page` from `$app/stores`
- Cross-fade: outgoing page fades out (150ms), incoming fades up (300ms)
- Subtle Y translate (10px) on incoming page

### Parallax
- Decorative floating orbs on hero move at 0.3x scroll speed
- CSS transform-based, no JS libraries needed
- Subtle — max displacement ~30px

### Micro-interactions
- Hover transitions: 200-300ms on all interactive elements
- CTA buttons: border glow effect on hover (box-shadow with orange)
- Project cards: subtle Y lift (-2px) + ring appearance on hover
- Nav links: underline slides in from left on hover

## Pages

### 1. Home (`/`)

**Hero section** (full viewport height):
- Centered layout, flexbox
- Staggered entrance sequence:
  1. Subtitle ("Developer & Creator") — fade-in, 200ms delay
  2. Name ("Filip / Marklars") — fade-up, 500ms delay. "Marklars" in Cormorant italic + orange
  3. Divider line — grows from center, 900ms delay
  4. Tagline — fade-up, 1100ms delay
  5. CTA button ("View Work") — fade-in, 1400ms delay
- Floating ambient orbs: 2-3 radial gradients (orange and mint, very low opacity ~5%), positioned absolute, parallax on scroll, CSS animation `float` (gentle up/down, 5-6s loop)
- Scroll indicator at bottom: animated chevron or thin line, pulses

**Featured Projects section**:
- Section heading: "Selected Work" in Cormorant, scroll-triggered fade-up
- 3-column responsive grid (1 col mobile, 2 tablet, 3 desktop)
- Project cards stagger in on scroll (100ms delay between each)
- Thin decorative divider between hero and projects section (line grows on scroll)

### 2. About (`/about`)

**Intro section**:
- Large Cormorant italic pull-quote style: personal intro sentence
- Montserrat body text below with bio details
- Fade-up entrance on load

**Skills & Tech section**:
- Section heading in Cormorant
- Skill badges: `bg-surface` background, `text-mint`, monospace font, subtle border
- Displayed as flex-wrap grid, stagger-in on scroll
- Keep existing SkillBadge component, restyle

**Contact CTA**:
- "Let's connect" text with arrow link to `/contact`
- Fade-up on scroll

### 3. Projects (`/projects`)

**Header**: "Projects" in large Cormorant, fade-up on load

**Grid**: Same responsive 3-column layout as home featured section

**Project cards** (redesigned):
- `bg-surface` background, rounded-xl, generous padding
- Optional thumbnail with `object-cover`, subtle rounded corners
- Title in Cormorant (lg weight 400), cream color, orange on hover
- Description in Montserrat (sm weight 300), muted color
- Tag badges in mint (same style as about page skills)
- Hover: `ring-1 ring-orange/30` + `translateY(-2px)` + shadow
- All cards scroll-triggered with stagger

**Empty state**: Styled to match — "No projects yet" in muted Montserrat

### 4. Project Detail (`/projects/[slug]`)

**Header section**:
- Back link: "← All Projects" in muted, subtle hover to cream
- Title in Cormorant (4xl, weight 400), entrance fade-up
- Description in Montserrat (muted)
- Date formatted as "Month Day, Year"
- Repo/Demo links: orange text, Montserrat, hover brightens
- Tags: mint badges

**Content**: Markdown rendered via mdsvex with Tailwind Typography (`prose prose-invert`). Customize prose headings via CSS: `.prose :is(h1,h2,h3,h4) { font-family: var(--font-heading); }` in `app.css`

### 5. Contact (`/contact`) — NEW

**Layout**: Centered like hero, generous vertical padding

**Heading**: "Say Hello" in large Cormorant italic, fade-up entrance

**Subtitle**: Brief Montserrat text — "Have a question or want to work together?"

**Contact methods** (3 rows, stagger-in):
- Email: mail icon + email address (mailto link)
- GitHub: GitHub icon + username/link
- LinkedIn: LinkedIn icon + profile link
- Each row: icon (SVG, 20px) + label in Montserrat, muted color, hover to cream with orange icon transition

**Decorative**: Same floating orbs as hero (orange/mint, low opacity) for visual consistency

**Data loading**: Purely static page, no `+page.server.ts` or `+page.ts` needed

### 6. Error Page (`/+error.svelte`)

- Status code in large Cormorant (6xl), orange color
- Error message in Montserrat, muted
- "Go Home" CTA button matching hero button style
- Centered layout

### 7. Layout

**Root layout** (`+layout.svelte`):
- Import Google Fonts in `app.html`
- `{#key $page.url.pathname}` wrapper around `{@render children()}` with Svelte fly/fade transition
- `min-h-screen flex flex-col` structure preserved

**Navbar**:
- Sticky, `bg-base/90 backdrop-blur-sm`, `border-b border-cream/5`
- Logo: "fmarklars" in Montserrat weight 300, cream, orange on hover
- Links: Home, About, Projects, Contact
- Active indicator: orange underline (slides in via CSS transition)
- Inactive: muted color, hover to cream
- Mobile: hamburger toggle, animated to X, dropdown with left-border active indicator. Closes on route change (reactive to `$page.url`) and on click outside.

**Footer**:
- `border-t border-cream/5`
- Left: "Filip Marklars" in Montserrat weight 300
- Right: GitHub + LinkedIn SVG icons, cream, orange on hover
- Centered on mobile, row on desktop

## Tailwind v4 Theme Updates

Update `app.css` `@theme` block:
```css
@theme {
  --color-base: #050505;
  --color-surface: #111110;
  --color-surface-hover: #1a1918;
  --color-cream: #FFF6DA;
  --color-orange: #FC6B3F;
  --color-mint: #84F2D6;
  --color-muted: #8a8480;
  --font-sans: 'Montserrat', sans-serif;
  --font-heading: 'Cormorant', serif;
  --font-mono: 'Fira Code', ui-monospace, monospace;
}
```

## New Utility: Scroll Animation

Create a Svelte action `src/lib/utils/animate-on-scroll.ts`:
- Uses Intersection Observer
- Adds a CSS class when element enters viewport
- Supports `data-delay` attribute for stagger
- Elements start with `opacity: 0; transform: translateY(20px)`
- On intersect, transition to `opacity: 1; transform: translateY(0)`
- Check `prefers-reduced-motion` — if true, elements start visible, no animation
- Action returns `destroy()` that calls `observer.disconnect()` for cleanup

## New Component: Floating Orbs

Create `src/lib/components/FloatingOrbs.svelte`:
- Renders 2-3 absolutely positioned radial gradient divs
- Configurable colors (default orange + mint)
- CSS `float` animation (gentle up/down)
- Parallax via scroll event listener wrapped in `onMount` (SSR-safe), throttled with `requestAnimationFrame`, `transform: translateY`
- Respects `prefers-reduced-motion`

## Files to Create
- `src/routes/contact/+page.svelte` — Contact page
- `src/lib/utils/animate-on-scroll.ts` — Scroll animation action
- `src/lib/components/FloatingOrbs.svelte` — Decorative orbs

## Files to Modify
- `src/app.html` — Add Google Fonts link
- `src/app.css` — Update @theme tokens, add animation utilities, add font families
- `src/routes/+layout.svelte` — Add page transitions, update font classes
- `src/routes/+page.svelte` — Redesign home page
- `src/routes/about/+page.svelte` — Redesign about page
- `src/routes/projects/+page.svelte` — Restyle project listing
- `src/routes/projects/[slug]/+page.svelte` — Restyle project detail
- `src/routes/+error.svelte` — Restyle error page
- `src/lib/components/Navbar.svelte` — New typography, updated styling
- `src/lib/components/Footer.svelte` — New typography, simplified
- `src/lib/components/Hero.svelte` — Full redesign with animations
- `src/lib/components/ProjectCard.svelte` — Restyle with new design
- `src/lib/components/SkillBadge.svelte` — Restyle

## Accessibility Checklist
- [ ] All animations respect `prefers-reduced-motion`
- [ ] Color contrast ratio >= 4.5:1 for all text
- [ ] Focus states visible on all interactive elements
- [ ] All images have alt text
- [ ] Touch targets >= 44x44px
- [ ] Tab order matches visual order
- [ ] No horizontal scroll on mobile
- [ ] Semantic HTML throughout
