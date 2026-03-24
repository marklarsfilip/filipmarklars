# Personal Website — Design Spec

## Overview

A personal website for Filip Marklar to showcase projects, introduce himself, and share things with friends. Built for growth — starts as a static multi-page site, designed to expand into a full-stack platform over time.

**URL:** `fmarklars.pages.dev`

## Stack

| Layer | Choice | Rationale |
|---|---|---|
| Framework | SvelteKit 2 + Svelte 5 | Best compiled performance, full-stack growth path, SSR/SSG per-route |
| Language | TypeScript (strict) | Type safety across the codebase |
| Styling | Tailwind CSS v4 | CSS-native config, zero runtime, tree-shakes aggressively |
| Markdown | mdsvex | Frontmatter, syntax highlighting, Svelte components in markdown |
| Hosting | Cloudflare Pages | Free tier: unlimited bandwidth, 500 builds/month, edge-deployed globally |
| Rendering | Static prerendered | Fastest TTFB, zero server cost. Flip individual routes to SSR when needed |

## Color Palette

| Token | Hex | Usage |
|---|---|---|
| `base` | `#262525` | Page background |
| `surface` | `#2f2e2e` | Cards, nav, elevated elements |
| `cream` | `#FFF6DA` | Primary text, headings |
| `orange` | `#FC6B3F` | CTAs, links, hover states, active indicators |
| `mint` | `#84F2D6` | Tags, secondary highlights, tech badges |
| `muted` | `#a8a29e` | Secondary text, descriptions |

**Typography:** System font stack (`-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`). Monospace (`"Fira Code", "JetBrains Mono", ui-monospace, monospace`) for code/tech elements.

**Design vibe:** Dark minimal with neon accents. Clean whitespace, simple typography.

## Project Structure

```
filipmarklars/
├── src/
│   ├── lib/
│   │   ├── components/     # Reusable Svelte components
│   │   ├── content/
│   │   │   └── projects/   # Markdown files, one per project
│   │   ├── types/          # TypeScript interfaces
│   │   └── utils/          # Helpers (markdown parsing, etc.)
│   ├── routes/
│   │   ├── +layout.svelte  # Root layout (nav + footer)
│   │   ├── +page.svelte    # Home
│   │   ├── about/
│   │   │   └── +page.svelte
│   │   └── projects/
│   │       ├── +page.svelte        # Project list
│   │       └── [slug]/
│   │           └── +page.svelte    # Project detail
│   └── app.css             # Tailwind base + custom theme tokens
├── static/                 # Favicon, images, fonts
├── svelte.config.js
├── tsconfig.json
├── vite.config.ts
└── package.json
```

## Pages

### Home (`/`)

- **Hero section:** Name, one-line tagline, CTA button linking to projects
- **Brief intro:** 2-3 sentences
- **Featured projects:** Grid of latest 3 projects (filtered by `featured: true` frontmatter)

### About (`/about`)

- **Bio:** Short paragraph introduction
- **Skills/tech stack:** Mint-colored badges in a grid layout
- **Contact:** Links to email, GitHub, LinkedIn, etc.

### Projects List (`/projects`)

- **Grid of project cards**
- Each card shows: title, short description, tech tags (mint badges), optional thumbnail
- Cards link to `/projects/[slug]`

### Project Detail (`/projects/[slug]`)

- Rendered from markdown via mdsvex
- Header with title, date, tags, and links (demo/repo)
- Markdown body with syntax highlighting

## Components

| Component | Purpose |
|---|---|
| `Navbar` | Sticky top nav. Logo/name left, links right. Orange underline on active route. Hamburger on mobile. |
| `Footer` | Social link icons + attribution |
| `ProjectCard` | Card for project list grid. Title, description, tags, thumbnail. |
| `Hero` | Home page hero with name, tagline, CTA |
| `SkillBadge` | Mint-colored badge for tech/skill display |

## Markdown Frontmatter Schema

```yaml
---
title: "My Cool Project"           # required
description: "A short description"  # required
date: "2026-03-24"                  # required, ISO format
tags: ["SvelteKit", "TypeScript"]   # required
slug: "my-cool-project"             # optional, defaults to filename without .md
thumbnail: "/images/projects/x.png" # optional
repo: "https://github.com/..."      # optional
demo: "https://..."                 # optional
featured: true                      # optional, shows on home page
---
```

## Data Flow

1. Markdown files in `src/lib/content/projects/` are the single source of truth for project data
2. Slug is derived from the filename (e.g., `my-cool-project.md` → `/projects/my-cool-project`), overridable via frontmatter `slug` field
3. At build time, mdsvex parses markdown + frontmatter into Svelte components
4. `+page.server.ts` load functions read and sort project metadata for list/featured views — sorted by date descending, featured projects first on the home page
5. SvelteKit prerenders all pages to static HTML at build time
6. Cloudflare Pages serves static files from its edge network

## Error Handling

- **404 page:** Custom `+error.svelte` with dark theme styling and a link back to home
- **Missing project slug:** SvelteKit returns 404 automatically for unmatched `[slug]` routes
- **Missing thumbnails:** Project cards gracefully hide the image area if no thumbnail is provided

## Testing

- **Unit tests:** Vitest for utility functions (markdown parsing, slug generation)
- **E2E tests:** Playwright for page navigation, project list rendering, responsive layout
- Run tests in CI before Cloudflare deploys

## Deployment

- Git repo connected to Cloudflare Pages
- Auto-deploys on push to `main` branch
- Preview deploys on pull requests

## Growth Path (future — not for v1)

The architecture supports incremental expansion without rewrites:

- **Blog:** Add `src/lib/content/blog/` + routes. Same markdown pattern.
- **Contact form:** Add a `+page.server.ts` form action, flip route to SSR.
- **API routes:** Add `+server.ts` files in any route directory.
- **Auth:** Cloudflare Workers-based auth.
- **Database:** Cloudflare D1 (SQLite) for dynamic data.
- **File storage:** Cloudflare R2 for images/assets.
