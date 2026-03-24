# Personal Website Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build Filip Marklar's personal website with home, about, and project showcase pages — dark minimal design, statically prerendered, deployed to Cloudflare Pages.

**Architecture:** SvelteKit 2 with static adapter prerenders all pages at build time. Project data lives in markdown files with frontmatter, parsed by mdsvex. Tailwind CSS v4 handles styling via CSS-native `@theme` tokens.

**Tech Stack:** SvelteKit 2, Svelte 5, TypeScript, Tailwind CSS v4, mdsvex, Vitest, Playwright, Cloudflare Pages

**Spec:** `docs/superpowers/specs/2026-03-24-personal-website-design.md`

---

## File Map

| File | Responsibility |
|---|---|
| `src/app.css` | Tailwind imports + `@theme` color/font tokens |
| `src/app.html` | SvelteKit HTML shell |
| `src/lib/types/project.ts` | `Project` TypeScript interface |
| `src/lib/utils/projects.ts` | Load, parse, sort markdown project files |
| `src/lib/components/Navbar.svelte` | Sticky nav with mobile hamburger |
| `src/lib/components/Footer.svelte` | Social links + attribution |
| `src/lib/components/Hero.svelte` | Home hero: name, tagline, CTA |
| `src/lib/components/ProjectCard.svelte` | Card for project grid |
| `src/lib/components/SkillBadge.svelte` | Mint badge for skills |
| `src/lib/content/projects/personal-website.md` | Sample project markdown |
| `src/routes/+layout.svelte` | Root layout wrapping nav + footer |
| `src/routes/+page.svelte` | Home page |
| `src/routes/+page.server.ts` | Load featured projects for home |
| `src/routes/about/+page.svelte` | About page |
| `src/routes/projects/+page.svelte` | Project list page |
| `src/routes/projects/+page.server.ts` | Load all projects for list |
| `src/routes/projects/[slug]/+page.svelte` | Project detail page |
| `src/routes/projects/[slug]/+page.ts` | Load single project by slug (universal load — returns component) |
| `src/routes/+error.svelte` | Custom 404 page |
| `src/routes/+layout.server.ts` | Enable prerendering for all routes |
| `svelte.config.js` | SvelteKit + mdsvex + Cloudflare adapter config |
| `vite.config.ts` | Vite config |
| `playwright.config.ts` | Playwright E2E test config |
| `tests/unit/projects.test.ts` | Unit tests for project utils |
| `tests/e2e/navigation.test.ts` | E2E tests for pages and navigation |

---

### Task 1: Scaffold SvelteKit Project

**Files:**
- Create: `package.json`, `svelte.config.js`, `vite.config.ts`, `tsconfig.json`, `src/app.html`, `src/app.css`, `.gitignore`

- [ ] **Step 1: Initialize SvelteKit project**

Run:
```bash
cd C:/Code/filipmarklars
npm create svelte@latest . -- --template skeleton --types typescript --no-add-ons
```
Select: Skeleton project, TypeScript, no additional options.

- [ ] **Step 2: Install dependencies**

Run:
```bash
npm install
npm install -D tailwindcss@latest @tailwindcss/vite@latest @tailwindcss/typography@latest mdsvex @sveltejs/adapter-cloudflare
```

- [ ] **Step 3: Configure svelte.config.js with mdsvex and Cloudflare adapter**

Replace `svelte.config.js`:
```js
import adapter from '@sveltejs/adapter-cloudflare';
import { vitePreprocess } from '@sveltejs/kit/vite';
import { mdsvex } from 'mdsvex';

/** @type {import('mdsvex').MdsvexOptions} */
const mdsvexOptions = {
  extensions: ['.md'],
};

/** @type {import('@sveltejs/kit').Config} */
const config = {
  extensions: ['.svelte', '.md'],
  preprocess: [vitePreprocess(), mdsvex(mdsvexOptions)],
  kit: {
    adapter: adapter(),
  },
};

export default config;
```

- [ ] **Step 4: Configure Vite with Tailwind plugin**

Replace `vite.config.ts`:
```ts
import { sveltekit } from '@sveltejs/kit/vite';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [tailwindcss(), sveltekit()],
});
```

- [ ] **Step 5: Set up app.css with Tailwind and theme tokens**

Replace `src/app.css`:
```css
@import 'tailwindcss';
@plugin '@tailwindcss/typography';

@theme {
  --color-base: #262525;
  --color-surface: #2f2e2e;
  --color-cream: #FFF6DA;
  --color-mint: #84F2D6;
  --color-orange: #FC6B3F;
  --color-muted: #a8a29e;

  --font-sans: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  --font-mono: 'Fira Code', 'JetBrains Mono', ui-monospace, monospace;
}
```

- [ ] **Step 6: Set up app.html**

Replace `src/app.html`:
```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <!-- favicon can be added later to static/ -->
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    %sveltekit.head%
  </head>
  <body class="bg-base text-cream font-sans">
    <div style="display: contents">%sveltekit.body%</div>
  </body>
</html>
```

- [ ] **Step 7: Verify dev server starts**

Run: `npm run dev`
Expected: Server starts at `http://localhost:5173`, no errors.

- [ ] **Step 8: Commit**

```bash
git init
git add .
git commit -m "feat: scaffold SvelteKit project with Tailwind v4, mdsvex, Cloudflare adapter"
```

---

### Task 2: Types and Project Utilities

**Files:**
- Create: `src/lib/types/project.ts`, `src/lib/utils/projects.ts`
- Test: `tests/unit/projects.test.ts`

- [ ] **Step 1: Install Vitest**

Run:
```bash
npm install -D vitest
```

Add to `vite.config.ts` (import and config):
```ts
import { sveltekit } from '@sveltejs/kit/vite';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [tailwindcss(), sveltekit()],
  test: {
    include: ['tests/unit/**/*.test.ts'],
  },
});
```

- [ ] **Step 2: Create Project type**

Create `src/lib/types/project.ts`:
```ts
export interface Project {
  title: string;
  description: string;
  date: string;
  tags: string[];
  slug: string;
  thumbnail?: string;
  repo?: string;
  demo?: string;
  featured?: boolean;
}
```

- [ ] **Step 3: Write failing tests for project utilities**

Create `tests/unit/projects.test.ts`:
```ts
import { describe, it, expect } from 'vitest';
import { sortProjects, getFeaturedProjects } from '$lib/utils/projects';
import type { Project } from '$lib/types/project';

const mockProjects: Project[] = [
  { title: 'Old', description: '', date: '2025-01-01', tags: [], slug: 'old' },
  { title: 'New', description: '', date: '2026-03-01', tags: [], slug: 'new', featured: true },
  { title: 'Mid', description: '', date: '2025-06-15', tags: [], slug: 'mid', featured: true },
];

describe('sortProjects', () => {
  it('sorts by date descending', () => {
    const sorted = sortProjects(mockProjects);
    expect(sorted.map((p) => p.slug)).toEqual(['new', 'mid', 'old']);
  });
});

describe('getFeaturedProjects', () => {
  it('returns only featured projects', () => {
    const featured = getFeaturedProjects(mockProjects);
    expect(featured.every((p) => p.featured)).toBe(true);
  });

  it('limits to specified count', () => {
    const featured = getFeaturedProjects(mockProjects, 1);
    expect(featured).toHaveLength(1);
  });

  it('sorts featured by date descending', () => {
    const featured = getFeaturedProjects(mockProjects);
    expect(featured.map((p) => p.slug)).toEqual(['new', 'mid']);
  });
});
```

- [ ] **Step 4: Run tests to verify they fail**

Run: `npx vitest run`
Expected: FAIL — module `$lib/utils/projects` not found.

- [ ] **Step 5: Implement project utilities**

Create `src/lib/utils/projects.ts`:
```ts
import type { Project } from '$lib/types/project';

export function sortProjects(projects: Project[]): Project[] {
  return [...projects].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export function getFeaturedProjects(projects: Project[], limit = 3): Project[] {
  return sortProjects(projects.filter((p) => p.featured)).slice(0, limit);
}

export async function loadProjects(): Promise<Project[]> {
  const modules = import.meta.glob<{ metadata: Omit<Project, 'slug'> }>(
    '$lib/content/projects/*.md',
    { eager: true }
  );

  const projects: Project[] = Object.entries(modules).map(([path, module]) => {
    const filename = path.split('/').pop()!.replace('.md', '');
    const metadata = module.metadata;
    return {
      ...metadata,
      slug: metadata.slug ?? filename,
    } as Project;
  });

  return sortProjects(projects);
}
```

- [ ] **Step 6: Run tests to verify they pass**

Run: `npx vitest run`
Expected: All 3 tests PASS.

- [ ] **Step 7: Commit**

```bash
git add src/lib/types/ src/lib/utils/ tests/ vite.config.ts package.json package-lock.json
git commit -m "feat: add Project type and utility functions with tests"
```

---

### Task 3: Layout, Navbar, and Footer

**Files:**
- Create: `src/lib/components/Navbar.svelte`, `src/lib/components/Footer.svelte`
- Modify: `src/routes/+layout.svelte`

- [ ] **Step 1: Create Navbar component**

Create `src/lib/components/Navbar.svelte`:
```svelte
<script lang="ts">
  import { page } from '$app/state';

  let menuOpen = $state(false);

  const links = [
    { href: '/', label: 'Home' },
    { href: '/about', label: 'About' },
    { href: '/projects', label: 'Projects' },
  ];
</script>

<nav class="sticky top-0 z-50 bg-surface/90 backdrop-blur-sm border-b border-cream/10">
  <div class="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
    <a href="/" class="text-xl font-bold text-cream hover:text-orange transition-colors">
      fmarklars
    </a>

    <!-- Desktop links -->
    <div class="hidden md:flex gap-8">
      {#each links as { href, label }}
        <a
          {href}
          class="relative py-1 text-sm text-muted hover:text-cream transition-colors
            {page.url.pathname === href ? 'text-cream' : ''}"
        >
          {label}
          {#if page.url.pathname === href}
            <span class="absolute left-0 -bottom-1 w-full h-0.5 bg-orange"></span>
          {/if}
        </a>
      {/each}
    </div>

    <!-- Mobile hamburger -->
    <button
      class="md:hidden text-cream"
      onclick={() => (menuOpen = !menuOpen)}
      aria-label="Toggle menu"
    >
      <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        {#if menuOpen}
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        {:else}
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
        {/if}
      </svg>
    </button>
  </div>

  <!-- Mobile menu -->
  {#if menuOpen}
    <div class="md:hidden border-t border-cream/10 bg-surface">
      {#each links as { href, label }}
        <a
          {href}
          class="block px-6 py-3 text-sm text-muted hover:text-cream hover:bg-base/50 transition-colors
            {page.url.pathname === href ? 'text-cream border-l-2 border-orange' : ''}"
          onclick={() => (menuOpen = false)}
        >
          {label}
        </a>
      {/each}
    </div>
  {/if}
</nav>
```

- [ ] **Step 2: Create Footer component**

Create `src/lib/components/Footer.svelte`:
```svelte
<footer class="border-t border-cream/10 py-8 mt-auto">
  <div class="max-w-5xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
    <p class="text-sm text-muted">Built with SvelteKit</p>
    <div class="flex gap-4">
      <a href="https://github.com/filipmarklar" target="_blank" rel="noopener" class="text-muted hover:text-orange transition-colors" aria-label="GitHub">
        <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/></svg>
      </a>
      <a href="https://linkedin.com/in/filipmarklar" target="_blank" rel="noopener" class="text-muted hover:text-orange transition-colors" aria-label="LinkedIn">
        <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
      </a>
    </div>
  </div>
</footer>
```

- [ ] **Step 3: Set up root layout**

Replace `src/routes/+layout.svelte`:
```svelte
<script lang="ts">
  import '../app.css';
  import Navbar from '$lib/components/Navbar.svelte';
  import Footer from '$lib/components/Footer.svelte';

  let { children } = $props();
</script>

<div class="min-h-screen flex flex-col">
  <Navbar />
  <main class="flex-1">
    {@render children()}
  </main>
  <Footer />
</div>
```

- [ ] **Step 4: Verify layout renders**

Run: `npm run dev`
Visit `http://localhost:5173`. Expected: dark background, navbar with "fmarklars" logo and links, footer at bottom.

- [ ] **Step 5: Commit**

```bash
git add src/lib/components/ src/routes/+layout.svelte
git commit -m "feat: add Navbar, Footer, and root layout"
```

---

### Task 4: Home Page

**Files:**
- Create: `src/lib/components/Hero.svelte`, `src/lib/components/ProjectCard.svelte`, `src/routes/+page.server.ts`
- Modify: `src/routes/+page.svelte`

- [ ] **Step 1: Create Hero component**

Create `src/lib/components/Hero.svelte`:
```svelte
<section class="py-24 px-6">
  <div class="max-w-5xl mx-auto">
    <h1 class="text-5xl md:text-6xl font-bold mb-4">
      Filip <span class="text-orange">Marklar</span>
    </h1>
    <p class="text-xl text-muted mb-8 max-w-2xl">
      Building things with code. Exploring ideas. Sharing the journey.
    </p>
    <a
      href="/projects"
      class="inline-block px-6 py-3 bg-orange text-base font-semibold rounded-lg hover:brightness-110 transition"
    >
      View Projects
    </a>
  </div>
</section>
```

- [ ] **Step 2: Create ProjectCard component**

Create `src/lib/components/ProjectCard.svelte`:
```svelte
<script lang="ts">
  import type { Project } from '$lib/types/project';

  let { project }: { project: Project } = $props();
</script>

<a href="/projects/{project.slug}" class="group block bg-surface rounded-xl p-6 hover:ring-1 hover:ring-orange/50 transition-all">
  {#if project.thumbnail}
    <img
      src={project.thumbnail}
      alt={project.title}
      class="w-full h-40 object-cover rounded-lg mb-4"
    />
  {/if}
  <h3 class="text-lg font-semibold text-cream group-hover:text-orange transition-colors mb-2">
    {project.title}
  </h3>
  <p class="text-sm text-muted mb-4">{project.description}</p>
  <div class="flex flex-wrap gap-2">
    {#each project.tags as tag}
      <span class="text-xs px-2 py-1 rounded-full bg-mint/10 text-mint">{tag}</span>
    {/each}
  </div>
</a>
```

- [ ] **Step 3: Create sample project markdown**

Create `src/lib/content/projects/personal-website.md`:
```markdown
---
title: "Personal Website"
description: "My personal space on the web — built with SvelteKit, Tailwind, and deployed on Cloudflare Pages."
date: "2026-03-24"
tags: ["SvelteKit", "TypeScript", "Tailwind CSS"]
featured: true
---

This is the website you're looking at right now! Built from scratch with a focus on performance and clean design.

## Tech Stack

- **SvelteKit 2** with Svelte 5 runes
- **Tailwind CSS v4** with CSS-native theming
- **mdsvex** for markdown content
- **Cloudflare Pages** for hosting
```

- [ ] **Step 4: Create home page server load function**

Create `src/routes/+page.server.ts`:
```ts
import { getFeaturedProjects, loadProjects } from '$lib/utils/projects';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
  const projects = await loadProjects();
  return {
    featured: getFeaturedProjects(projects, 3),
  };
};
```

- [ ] **Step 5: Build home page**

Replace `src/routes/+page.svelte`:
```svelte
<script lang="ts">
  import Hero from '$lib/components/Hero.svelte';
  import ProjectCard from '$lib/components/ProjectCard.svelte';

  let { data } = $props();
</script>

<svelte:head>
  <title>Filip Marklar</title>
  <meta name="description" content="Filip Marklar's personal website — projects, skills, and more." />
</svelte:head>

<Hero />

{#if data.featured.length > 0}
  <section class="px-6 pb-24">
    <div class="max-w-5xl mx-auto">
      <h2 class="text-2xl font-bold mb-8">Featured Projects</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {#each data.featured as project}
          <ProjectCard {project} />
        {/each}
      </div>
    </div>
  </section>
{/if}
```

- [ ] **Step 6: Verify home page renders**

Run: `npm run dev`
Visit `http://localhost:5173`. Expected: hero with name + tagline, CTA button, featured project card below.

- [ ] **Step 7: Commit**

```bash
git add src/lib/components/Hero.svelte src/lib/components/ProjectCard.svelte src/lib/content/ src/routes/+page.svelte src/routes/+page.server.ts
git commit -m "feat: add home page with hero and featured projects"
```

---

### Task 5: About Page

**Files:**
- Create: `src/lib/components/SkillBadge.svelte`, `src/routes/about/+page.svelte`

- [ ] **Step 1: Create SkillBadge component**

Create `src/lib/components/SkillBadge.svelte`:
```svelte
<script lang="ts">
  let { name }: { name: string } = $props();
</script>

<span class="inline-block text-sm px-3 py-1.5 rounded-full bg-mint/10 text-mint font-mono">
  {name}
</span>
```

- [ ] **Step 2: Create about page**

Create `src/routes/about/+page.svelte`:
```svelte
<script lang="ts">
  import SkillBadge from '$lib/components/SkillBadge.svelte';

  const skills = [
    'TypeScript', 'JavaScript', 'SvelteKit', 'Svelte', 'Tailwind CSS',
    'Node.js', 'Python', 'Git', 'HTML/CSS',
  ];
</script>

<svelte:head>
  <title>About — Filip Marklar</title>
  <meta name="description" content="About Filip Marklar — skills, tech stack, and contact." />
</svelte:head>

<section class="py-24 px-6">
  <div class="max-w-3xl mx-auto">
    <h1 class="text-4xl font-bold mb-8">About Me</h1>
    <p class="text-muted text-lg leading-relaxed mb-12">
      Hey! I'm Filip. I build things with code and love exploring new technologies.
      This site is my personal space where I showcase what I'm working on.
    </p>

    <h2 class="text-2xl font-bold mb-6">Skills & Tech Stack</h2>
    <div class="flex flex-wrap gap-3 mb-12">
      {#each skills as skill}
        <SkillBadge name={skill} />
      {/each}
    </div>

    <h2 class="text-2xl font-bold mb-6">Contact</h2>
    <div class="flex flex-col gap-3 text-muted">
      <a href="mailto:filip@example.com" class="hover:text-orange transition-colors">
        Email → filip@example.com
      </a>
      <a href="https://github.com/filipmarklar" target="_blank" rel="noopener" class="hover:text-orange transition-colors">
        GitHub → filipmarklar
      </a>
      <a href="https://linkedin.com/in/filipmarklar" target="_blank" rel="noopener" class="hover:text-orange transition-colors">
        LinkedIn → filipmarklar
      </a>
    </div>
  </div>
</section>
```

- [ ] **Step 3: Verify about page**

Run: `npm run dev`
Visit `http://localhost:5173/about`. Expected: bio, mint skill badges, contact links.

- [ ] **Step 4: Commit**

```bash
git add src/lib/components/SkillBadge.svelte src/routes/about/
git commit -m "feat: add about page with skills and contact"
```

---

### Task 6: Projects List Page

**Files:**
- Create: `src/routes/projects/+page.svelte`, `src/routes/projects/+page.server.ts`

- [ ] **Step 1: Create projects list server load**

Create `src/routes/projects/+page.server.ts`:
```ts
import { loadProjects } from '$lib/utils/projects';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
  const projects = await loadProjects();
  return { projects };
};
```

- [ ] **Step 2: Create projects list page**

Create `src/routes/projects/+page.svelte`:
```svelte
<script lang="ts">
  import ProjectCard from '$lib/components/ProjectCard.svelte';

  let { data } = $props();
</script>

<svelte:head>
  <title>Projects — Filip Marklar</title>
  <meta name="description" content="Projects by Filip Marklar." />
</svelte:head>

<section class="py-24 px-6">
  <div class="max-w-5xl mx-auto">
    <h1 class="text-4xl font-bold mb-8">Projects</h1>
    {#if data.projects.length === 0}
      <p class="text-muted">No projects yet. Check back soon!</p>
    {:else}
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {#each data.projects as project}
          <ProjectCard {project} />
        {/each}
      </div>
    {/if}
  </div>
</section>
```

- [ ] **Step 3: Verify projects list**

Run: `npm run dev`
Visit `http://localhost:5173/projects`. Expected: grid with "Personal Website" card.

- [ ] **Step 4: Commit**

```bash
git add src/routes/projects/+page.svelte src/routes/projects/+page.server.ts
git commit -m "feat: add projects list page"
```

---

### Task 7: Project Detail Page

**Files:**
- Create: `src/routes/projects/[slug]/+page.svelte`, `src/routes/projects/[slug]/+page.ts`

- [ ] **Step 1: Create project detail universal load**

Create `src/routes/projects/[slug]/+page.ts` (universal load, not server — components are not serializable):
```ts
import { error } from '@sveltejs/kit';
import type { PageLoad } from './$types';
import type { Project } from '$lib/types/project';

export const load: PageLoad = async ({ params }) => {
  const modules = import.meta.glob<{
    default: import('svelte').Component;
    metadata: Omit<Project, 'slug'>;
  }>('$lib/content/projects/*.md', { eager: true });

  for (const [path, module] of Object.entries(modules)) {
    const filename = path.split('/').pop()!.replace('.md', '');
    const slug = module.metadata.slug ?? filename;

    if (slug === params.slug) {
      return {
        content: module.default,
        project: { ...module.metadata, slug } as Project,
      };
    }
  }

  error(404, 'Project not found');
};
```

- [ ] **Step 2: Create project detail page**

Create `src/routes/projects/[slug]/+page.svelte`:
```svelte
<script lang="ts">
  import type { Component } from 'svelte';

  let { data } = $props();
  const Content: Component = data.content as Component;
</script>

<svelte:head>
  <title>{data.project.title} — Filip Marklar</title>
  <meta name="description" content={data.project.description} />
</svelte:head>

<article class="py-24 px-6">
  <div class="max-w-3xl mx-auto">
    <header class="mb-12">
      <h1 class="text-4xl font-bold mb-4">{data.project.title}</h1>
      <p class="text-muted mb-4">{data.project.description}</p>

      <div class="flex flex-wrap items-center gap-4 text-sm text-muted mb-4">
        <time>{new Date(data.project.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</time>
        {#if data.project.repo}
          <a href={data.project.repo} target="_blank" rel="noopener" class="text-orange hover:brightness-110">Repo →</a>
        {/if}
        {#if data.project.demo}
          <a href={data.project.demo} target="_blank" rel="noopener" class="text-orange hover:brightness-110">Demo →</a>
        {/if}
      </div>

      <div class="flex flex-wrap gap-2">
        {#each data.project.tags as tag}
          <span class="text-xs px-2 py-1 rounded-full bg-mint/10 text-mint">{tag}</span>
        {/each}
      </div>
    </header>

    <div class="prose prose-invert max-w-none">
      <Content />
    </div>
  </div>
</article>
```

- [ ] **Step 3: Verify project detail page**

Run: `npm run dev`
Visit `http://localhost:5173/projects/personal-website`. Expected: project title, metadata, rendered markdown body.

- [ ] **Step 4: Commit**

```bash
git add src/routes/projects/\[slug\]/
git commit -m "feat: add project detail page with markdown rendering"
```

---

### Task 8: Error Page and Prerendering

**Files:**
- Create: `src/routes/+error.svelte`, `src/routes/+layout.server.ts`

- [ ] **Step 1: Create custom error page**

Create `src/routes/+error.svelte`:
```svelte
<script lang="ts">
  import { page } from '$app/state';
</script>

<svelte:head>
  <title>Not Found — Filip Marklar</title>
</svelte:head>

<section class="py-24 px-6 text-center">
  <div class="max-w-3xl mx-auto">
    <h1 class="text-6xl font-bold text-orange mb-4">{page.status}</h1>
    <p class="text-xl text-muted mb-8">{page.error?.message ?? 'Page not found'}</p>
    <a href="/" class="inline-block px-6 py-3 bg-orange text-base font-semibold rounded-lg hover:brightness-110 transition">
      Go Home
    </a>
  </div>
</section>
```

- [ ] **Step 2: Enable prerendering**

Create `src/routes/+layout.server.ts`:
```ts
export const prerender = true;
```

- [ ] **Step 3: Verify build succeeds**

Run: `npm run build`
Expected: Build completes, static files generated in `.svelte-kit/cloudflare`.

- [ ] **Step 4: Commit**

```bash
git add src/routes/+error.svelte src/routes/+layout.server.ts
git commit -m "feat: add custom 404 page and enable static prerendering"
```

---

### Task 9: E2E Tests

**Files:**
- Create: `tests/e2e/navigation.test.ts`, `playwright.config.ts`

- [ ] **Step 1: Install Playwright**

Run:
```bash
npm install -D @playwright/test
npx playwright install chromium
```

- [ ] **Step 2: Create Playwright config**

Create `playwright.config.ts`:
```ts
import { defineConfig } from '@playwright/test';

export default defineConfig({
  webServer: {
    command: 'npm run build && npm run preview',
    port: 4173,
  },
  testDir: 'tests/e2e',
  use: {
    baseURL: 'http://localhost:4173',
  },
});
```

- [ ] **Step 3: Write E2E tests**

Create `tests/e2e/navigation.test.ts`:
```ts
import { test, expect } from '@playwright/test';

test('home page loads with hero', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('h1')).toContainText('Filip');
  await expect(page.locator('a[href="/projects"]')).toBeVisible();
});

test('navbar links work', async ({ page }) => {
  await page.goto('/');
  await page.click('a[href="/about"]');
  await expect(page).toHaveURL('/about');
  await expect(page.locator('h1')).toContainText('About');
});

test('projects page shows project cards', async ({ page }) => {
  await page.goto('/projects');
  await expect(page.locator('h1')).toContainText('Projects');
  await expect(page.locator('a[href*="/projects/"]').first()).toBeVisible();
});

test('project detail page renders', async ({ page }) => {
  await page.goto('/projects/personal-website');
  await expect(page.locator('h1')).toContainText('Personal Website');
});

test('404 page shows for bad routes', async ({ page }) => {
  await page.goto('/nonexistent');
  await expect(page.locator('h1')).toContainText('404');
});
```

- [ ] **Step 4: Run E2E tests**

Run: `npx playwright test`
Expected: All 5 tests PASS.

- [ ] **Step 5: Commit**

```bash
git add tests/e2e/ playwright.config.ts package.json package-lock.json
git commit -m "test: add E2E tests for navigation and page rendering"
```

---

### Task 10: Deployment Setup

**Files:**
- Modify: `.gitignore`

- [ ] **Step 1: Update .gitignore**

Ensure `.gitignore` includes:
```
.svelte-kit
node_modules
build
.superpowers
.wrangler
```

- [ ] **Step 2: Push to GitHub**

Run:
```bash
git remote add origin https://github.com/filipmarklar/filipmarklars.git
git branch -M main
git push -u origin main
```

(Adjust URL to actual repo.)

- [ ] **Step 3: Connect Cloudflare Pages**

Manual step — in Cloudflare dashboard:
1. Go to Workers & Pages → Create → Pages → Connect to Git
2. Select the `filipmarklars` repo
3. Build settings: Framework preset = SvelteKit, build command = `npm run build`, output directory = `.svelte-kit/cloudflare`
4. Deploy

- [ ] **Step 4: Verify live site**

Visit `https://fmarklars.pages.dev`. Expected: site loads with all pages working.

- [ ] **Step 5: Commit any remaining config**

```bash
git add .gitignore
git commit -m "chore: finalize gitignore and deployment config"
```
