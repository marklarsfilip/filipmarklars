# Website Redesign v2 — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Redesign the personal website with Minimal Dark Elegance aesthetic, new typography (Cormorant + Montserrat), refined color palette, motion system (scroll animations, page transitions, parallax), and a new Contact page.

**Architecture:** Foundation-first approach — update theme tokens, fonts, and create shared motion utilities first, then restyle each component/page. This ensures every component picks up the new design system automatically through Tailwind classes.

**Tech Stack:** SvelteKit 2, Svelte 5, TypeScript, Tailwind CSS v4, Cloudflare Pages

**Spec:** `docs/superpowers/specs/2026-03-25-website-redesign-v2.md`

---

### Task 1: Update Foundation — Fonts, Theme Tokens, Global CSS

**Files:**
- Modify: `src/app.html`
- Modify: `src/app.css`

- [ ] **Step 1: Add Google Fonts preconnect and stylesheet to app.html**

Replace the `<head>` section in `src/app.html`:

```html
<head>
  <meta charset="utf-8" />
  <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Cormorant:ital,wght@0,300;0,400;0,600;1,300;1,400&family=Montserrat:wght@300;400;500&family=Fira+Code:wght@400&display=swap" rel="stylesheet" />
  %sveltekit.head%
</head>
```

- [ ] **Step 2: Update Tailwind v4 theme tokens in app.css**

Replace the entire `src/app.css` with:

```css
@import 'tailwindcss';
@plugin '@tailwindcss/typography';

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

/* Prose heading override for markdown content */
.prose :is(h1, h2, h3, h4) {
  font-family: var(--font-heading);
}

/* Scroll animation base styles */
.animate-on-scroll {
  opacity: 0;
  transform: translateY(20px);
  transition: opacity 0.7s ease-out, transform 0.7s ease-out;
}

.animate-on-scroll.is-visible {
  opacity: 1;
  transform: translateY(0);
}

/* Reduced motion: skip all animations */
@media (prefers-reduced-motion: reduce) {
  .animate-on-scroll {
    opacity: 1;
    transform: none;
    transition: none;
  }
}

/* Divider line — grows width instead of fading up */
.divider-line.animate-on-scroll {
  width: 0;
  opacity: 1;
  transform: none;
  transition: width 0.8s ease-out;
}

.divider-line.animate-on-scroll.is-visible {
  width: 40px;
}

/* Float animation for decorative orbs */
@keyframes float-slow {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-12px); }
}

@keyframes float-slower {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-8px); }
}

/* Hero entrance animations */
@keyframes fade-in {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes fade-up {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes line-grow {
  from { width: 0; }
  to { width: 40px; }
}

@keyframes pulse-down {
  0%, 100% { opacity: 0.4; transform: translateY(0); }
  50% { opacity: 1; transform: translateY(4px); }
}

@media (prefers-reduced-motion: reduce) {
  @keyframes float-slow { 0%, 100% { transform: none; } }
  @keyframes float-slower { 0%, 100% { transform: none; } }
  @keyframes fade-in { from { opacity: 1; } to { opacity: 1; } }
  @keyframes fade-up { from { opacity: 1; transform: none; } to { opacity: 1; transform: none; } }
  @keyframes line-grow { from { width: 40px; } to { width: 40px; } }
  @keyframes pulse-down { 0%, 100% { opacity: 1; transform: none; } }
}
```

- [ ] **Step 3: Verify dev server starts cleanly**

Run: `npm run dev`
Expected: No errors, site loads with new fonts and darker background.

- [ ] **Step 4: Commit**

```bash
git add src/app.html src/app.css
git commit -m "feat: update design foundation — new fonts, color tokens, animation utilities"
```

---

### Task 2: Create Scroll Animation Action

**Files:**
- Create: `src/lib/utils/animate-on-scroll.ts`

- [ ] **Step 1: Create the Svelte action**

Create `src/lib/utils/animate-on-scroll.ts`:

```typescript
/**
 * Svelte action that adds scroll-triggered entrance animations.
 * Uses Intersection Observer to add 'is-visible' class when element enters viewport.
 * Supports stagger delay via parameter.
 *
 * Usage: <div use:animateOnScroll> or <div use:animateOnScroll={{ delay: 200 }}>
 */
export function animateOnScroll(
  node: HTMLElement,
  params?: { delay?: number }
) {
  // Check reduced motion preference
  const prefersReducedMotion = window.matchMedia(
    '(prefers-reduced-motion: reduce)'
  ).matches;

  if (prefersReducedMotion) {
    // Skip animation entirely — element is already visible via CSS
    node.classList.add('animate-on-scroll', 'is-visible');
    return { destroy() {} };
  }

  node.classList.add('animate-on-scroll');

  if (params?.delay) {
    node.style.transitionDelay = `${params.delay}ms`;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      }
    },
    { threshold: 0.1 }
  );

  observer.observe(node);

  return {
    destroy() {
      observer.disconnect();
    },
  };
}
```

- [ ] **Step 2: Verify TypeScript compiles**

Run: `npx svelte-check`
Expected: No errors related to animate-on-scroll.ts

- [ ] **Step 3: Commit**

```bash
git add src/lib/utils/animate-on-scroll.ts
git commit -m "feat: add scroll animation Svelte action with reduced-motion support"
```

---

### Task 3: Create FloatingOrbs Component

**Files:**
- Create: `src/lib/components/FloatingOrbs.svelte`

- [ ] **Step 1: Create the component**

Create `src/lib/components/FloatingOrbs.svelte`:

```svelte
<script lang="ts">
  import { onMount } from 'svelte';

  let scrollY = $state(0);
  let reducedMotion = $state(false);

  onMount(() => {
    reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (reducedMotion) return;

    let ticking = false;
    function onScroll() {
      if (!ticking) {
        requestAnimationFrame(() => {
          scrollY = window.scrollY;
          ticking = false;
        });
        ticking = true;
      }
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  });
</script>

<div class="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
  <div
    class="absolute -top-20 -right-20 w-72 h-72 rounded-full"
    style="
      background: radial-gradient(circle, rgba(252, 107, 63, 0.05), transparent 70%);
      animation: float-slow 6s ease-in-out infinite;
      transform: translateY({reducedMotion ? 0 : scrollY * -0.3}px);
    "
  ></div>
  <div
    class="absolute top-1/3 -left-32 w-64 h-64 rounded-full"
    style="
      background: radial-gradient(circle, rgba(132, 242, 214, 0.04), transparent 70%);
      animation: float-slower 8s ease-in-out infinite;
      transform: translateY({reducedMotion ? 0 : scrollY * -0.15}px);
    "
  ></div>
  <div
    class="absolute -bottom-16 right-1/4 w-48 h-48 rounded-full"
    style="
      background: radial-gradient(circle, rgba(252, 107, 63, 0.03), transparent 70%);
      animation: float-slow 7s ease-in-out 2s infinite;
      transform: translateY({reducedMotion ? 0 : scrollY * -0.2}px);
    "
  ></div>
</div>
```

- [ ] **Step 2: Commit**

```bash
git add src/lib/components/FloatingOrbs.svelte
git commit -m "feat: add FloatingOrbs component with parallax and reduced-motion support"
```

---

### Task 4: Redesign Layout — Page Transitions, Navbar, Footer

**Files:**
- Modify: `src/routes/+layout.svelte`
- Modify: `src/lib/components/Navbar.svelte`
- Modify: `src/lib/components/Footer.svelte`

- [ ] **Step 1: Update root layout with page transitions**

Replace `src/routes/+layout.svelte`:

```svelte
<script lang="ts">
  import '../app.css';
  import { page } from '$app/stores';
  import { fade, fly } from 'svelte/transition';
  import Navbar from '$lib/components/Navbar.svelte';
  import Footer from '$lib/components/Footer.svelte';

  let { children } = $props();
</script>

<div class="min-h-screen flex flex-col">
  <Navbar />
  <main class="flex-1">
    {#key $page.url.pathname}
      <div
        in:fly={{ y: 10, duration: 300, delay: 150 }}
        out:fade={{ duration: 150 }}
      >
        {@render children()}
      </div>
    {/key}
  </main>
  <Footer />
</div>
```

- [ ] **Step 2: Redesign Navbar**

Replace `src/lib/components/Navbar.svelte`:

```svelte
<script lang="ts">
  import { page } from '$app/state';

  let menuOpen = $state(false);

  const links = [
    { href: '/', label: 'Home' },
    { href: '/about', label: 'About' },
    { href: '/projects', label: 'Projects' },
    { href: '/contact', label: 'Contact' },
  ];

  // Close menu on route change
  $effect(() => {
    page.url.pathname;
    menuOpen = false;
  });
</script>

<svelte:window
  onclick={(e) => {
    if (menuOpen && !(e.target as HTMLElement).closest('nav')) {
      menuOpen = false;
    }
  }}
/>

<nav class="sticky top-0 z-50 bg-base/90 backdrop-blur-sm border-b border-cream/5">
  <div class="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
    <a
      href="/"
      class="text-lg font-light tracking-wide text-cream hover:text-orange transition-colors duration-300"
    >
      fmarklars
    </a>

    <!-- Desktop links -->
    <div class="hidden md:flex gap-8">
      {#each links as { href, label }}
        <a
          {href}
          class="relative py-1 text-sm font-light text-muted hover:text-cream transition-colors duration-200
            {page.url.pathname === href ? 'text-cream' : ''}"
        >
          {label}
          <span
            class="absolute left-0 -bottom-1 h-px bg-orange transition-all duration-300
              {page.url.pathname === href ? 'w-full' : 'w-0'}"
          ></span>
        </a>
      {/each}
    </div>

    <!-- Mobile hamburger -->
    <button
      class="md:hidden text-cream p-2"
      onclick={() => (menuOpen = !menuOpen)}
      aria-label="Toggle menu"
    >
      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        {#if menuOpen}
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M6 18L18 6M6 6l12 12" />
        {:else}
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 6h16M4 12h16M4 18h16" />
        {/if}
      </svg>
    </button>
  </div>

  <!-- Mobile menu -->
  {#if menuOpen}
    <div class="md:hidden border-t border-cream/5 bg-base/95 backdrop-blur-sm">
      {#each links as { href, label }}
        <a
          {href}
          class="block px-6 py-3 text-sm font-light text-muted hover:text-cream transition-colors duration-200
            {page.url.pathname === href ? 'text-cream border-l-2 border-orange' : ''}"
        >
          {label}
        </a>
      {/each}
    </div>
  {/if}
</nav>
```

- [ ] **Step 3: Redesign Footer**

Replace `src/lib/components/Footer.svelte`:

```svelte
<footer class="border-t border-cream/5 py-8 mt-auto">
  <div class="max-w-5xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
    <p class="text-sm font-light text-muted">Filip Marklars</p>
    <div class="flex gap-5">
      <a href="https://github.com/marklarsfilip" target="_blank" rel="noopener" class="text-muted hover:text-orange transition-colors duration-300" aria-label="GitHub">
        <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/></svg>
      </a>
      <a href="https://linkedin.com/in/filipmarklars" target="_blank" rel="noopener" class="text-muted hover:text-orange transition-colors duration-300" aria-label="LinkedIn">
        <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
      </a>
    </div>
  </div>
</footer>
```

- [ ] **Step 4: Verify site renders with new layout**

Run: `npm run dev`
Expected: Navbar shows 4 links (including Contact), footer simplified, page transitions work on navigation.

- [ ] **Step 5: Commit**

```bash
git add src/routes/+layout.svelte src/lib/components/Navbar.svelte src/lib/components/Footer.svelte
git commit -m "feat: redesign layout with page transitions, updated navbar and footer"
```

---

### Task 5: Redesign Hero Component

**Files:**
- Modify: `src/lib/components/Hero.svelte`

- [ ] **Step 1: Rewrite Hero with animations and orbs**

Replace `src/lib/components/Hero.svelte`:

```svelte
<script lang="ts">
  import FloatingOrbs from './FloatingOrbs.svelte';
</script>

<section class="relative min-h-screen flex items-center justify-center px-6 overflow-hidden">
  <FloatingOrbs />

  <div class="text-center relative z-10">
    <p
      class="text-xs tracking-[0.25em] uppercase text-muted mb-6"
      style="animation: fade-in 0.8s ease-out 0.2s both;"
    >
      Developer & Creator
    </p>

    <h1
      class="font-heading text-6xl md:text-7xl lg:text-8xl font-light leading-none tracking-tight"
      style="animation: fade-up 0.8s ease-out 0.5s both;"
    >
      Filip<br />
      <span class="italic text-orange">Marklars</span>
    </h1>

    <div
      class="h-px bg-orange/40 mx-auto my-8"
      style="animation: line-grow 0.6s ease-out 0.9s both;"
    ></div>

    <p
      class="text-sm font-light text-muted max-w-sm mx-auto leading-relaxed"
      style="animation: fade-up 0.8s ease-out 1.1s both;"
    >
      Building things with code. Exploring ideas. Sharing the journey.
    </p>

    <a
      href="/projects"
      class="inline-block mt-8 px-8 py-3 border border-orange/30 text-orange text-xs tracking-[0.15em] uppercase
        hover:border-orange hover:shadow-[0_0_20px_rgba(252,107,63,0.15)] transition-all duration-300
        focus:outline-none focus:ring-2 focus:ring-orange/50 focus:ring-offset-2 focus:ring-offset-base"
      style="animation: fade-in 1s ease-out 1.4s both;"
    >
      View Work
    </a>
  </div>

  <!-- Scroll indicator -->
  <div
    class="absolute bottom-8 left-1/2 -translate-x-1/2"
    style="animation: pulse-down 2s ease-in-out infinite 2s;"
  >
    <svg class="w-5 h-5 text-muted/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M19 14l-7 7m0 0l-7-7" />
    </svg>
  </div>
</section>
```

- [ ] **Step 2: Verify hero renders correctly**

Run: `npm run dev`, navigate to `/`
Expected: Full-viewport hero with staggered entrance animations, floating orbs, scroll indicator.

- [ ] **Step 3: Commit**

```bash
git add src/lib/components/Hero.svelte
git commit -m "feat: redesign hero with staggered animations, floating orbs, and scroll indicator"
```

---

### Task 6: Redesign Home Page (Featured Projects Section)

**Files:**
- Modify: `src/routes/+page.svelte`
- Modify: `src/lib/components/ProjectCard.svelte`
- Modify: `src/lib/components/SkillBadge.svelte`

- [ ] **Step 1: Restyle ProjectCard**

Replace `src/lib/components/ProjectCard.svelte`:

```svelte
<script lang="ts">
  import type { Project } from '$lib/types/project';
  import { animateOnScroll } from '$lib/utils/animate-on-scroll';

  let { project, delay = 0 }: { project: Project; delay?: number } = $props();
</script>

<a
  href="/projects/{project.slug}"
  class="group block bg-surface rounded-xl p-6 cursor-pointer
    hover:ring-1 hover:ring-orange/30 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-orange/5
    transition-all duration-300
    focus:outline-none focus:ring-2 focus:ring-orange/50"
  use:animateOnScroll={{ delay }}
>
  {#if project.thumbnail}
    <img
      src={project.thumbnail}
      alt={project.title}
      class="w-full h-40 object-cover rounded-lg mb-4"
    />
  {/if}
  <h3 class="font-heading text-lg text-cream group-hover:text-orange transition-colors duration-200 mb-2">
    {project.title}
  </h3>
  <p class="text-sm font-light text-muted mb-4">{project.description}</p>
  <div class="flex flex-wrap gap-2">
    {#each project.tags as tag}
      <span class="text-xs px-2 py-1 rounded-full bg-mint/10 text-mint font-mono">{tag}</span>
    {/each}
  </div>
</a>
```

- [ ] **Step 2: Restyle SkillBadge**

Replace `src/lib/components/SkillBadge.svelte`:

```svelte
<script lang="ts">
  let { name }: { name: string } = $props();
</script>

<span class="inline-block text-sm px-3 py-1.5 rounded-full bg-surface text-mint font-mono border border-mint/10">
  {name}
</span>
```

- [ ] **Step 3: Redesign home page featured section**

Replace `src/routes/+page.svelte`:

```svelte
<script lang="ts">
  import Hero from '$lib/components/Hero.svelte';
  import ProjectCard from '$lib/components/ProjectCard.svelte';
  import { animateOnScroll } from '$lib/utils/animate-on-scroll';

  let { data } = $props();
</script>

<svelte:head>
  <title>Filip Marklars</title>
  <meta name="description" content="Filip Marklars' personal website — projects, skills, and more." />
</svelte:head>

<Hero />

{#if data.featured.length > 0}
  <!-- Decorative divider — line grows from center on scroll -->
  <div class="max-w-5xl mx-auto px-6 flex justify-center">
    <div class="divider-line h-px bg-orange/30" use:animateOnScroll></div>
  </div>

  <section class="px-6 py-24">
    <div class="max-w-5xl mx-auto">
      <h2
        class="font-heading text-3xl md:text-4xl font-light text-cream mb-12"
        use:animateOnScroll
      >
        Selected Work
      </h2>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {#each data.featured as project, i}
          <ProjectCard {project} delay={i * 100} />
        {/each}
      </div>
    </div>
  </section>
{/if}
```

- [ ] **Step 4: Verify home page**

Run: `npm run dev`, navigate to `/`
Expected: Hero + divider + "Selected Work" heading + project cards with stagger animation on scroll.

- [ ] **Step 5: Commit**

```bash
git add src/routes/+page.svelte src/lib/components/ProjectCard.svelte src/lib/components/SkillBadge.svelte
git commit -m "feat: redesign home page, project cards, and skill badges"
```

---

### Task 7: Redesign About Page

**Files:**
- Modify: `src/routes/about/+page.svelte`

- [ ] **Step 1: Rewrite about page**

Replace `src/routes/about/+page.svelte`:

```svelte
<script lang="ts">
  import SkillBadge from '$lib/components/SkillBadge.svelte';
  import { animateOnScroll } from '$lib/utils/animate-on-scroll';

  const skills = [
    'TypeScript', 'JavaScript', 'SvelteKit', 'Svelte', 'Tailwind CSS',
    'Node.js', 'Python', 'Git', 'HTML/CSS',
  ];
</script>

<svelte:head>
  <title>About — Filip Marklars</title>
  <meta name="description" content="About Filip Marklars — skills, tech stack, and contact." />
</svelte:head>

<section class="py-24 px-6">
  <div class="max-w-3xl mx-auto">
    <!-- Intro -->
    <p
      class="font-heading text-3xl md:text-4xl font-light italic text-cream leading-snug mb-8"
      use:animateOnScroll
    >
      Hey, I'm Filip — I build things with code and love exploring new technologies.
    </p>
    <p
      class="text-muted font-light leading-relaxed mb-16"
      use:animateOnScroll={{ delay: 100 }}
    >
      This site is my personal space where I showcase what I'm working on.
      I'm passionate about modern web development, open source, and creating
      tools that make life easier.
    </p>

    <!-- Skills -->
    <h2
      class="font-heading text-2xl font-light text-cream mb-8"
      use:animateOnScroll
    >
      Skills & Tech Stack
    </h2>
    <div class="flex flex-wrap gap-3 mb-16" use:animateOnScroll={{ delay: 100 }}>
      {#each skills as skill}
        <SkillBadge name={skill} />
      {/each}
    </div>

    <!-- Contact CTA -->
    <div use:animateOnScroll>
      <a
        href="/contact"
        class="inline-flex items-center gap-2 text-muted hover:text-orange transition-colors duration-300 font-light"
      >
        Let's connect
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M17 8l4 4m0 0l-4 4m4-4H3" />
        </svg>
      </a>
    </div>
  </div>
</section>
```

- [ ] **Step 2: Verify about page**

Run: `npm run dev`, navigate to `/about`
Expected: Elegant intro, skill badges with new style, contact CTA linking to /contact.

- [ ] **Step 3: Commit**

```bash
git add src/routes/about/+page.svelte
git commit -m "feat: redesign about page with elegant typography and scroll animations"
```

---

### Task 8: Redesign Projects Pages

**Files:**
- Modify: `src/routes/projects/+page.svelte`
- Modify: `src/routes/projects/[slug]/+page.svelte`

- [ ] **Step 1: Redesign projects listing**

Replace `src/routes/projects/+page.svelte`:

```svelte
<script lang="ts">
  import ProjectCard from '$lib/components/ProjectCard.svelte';
  import { animateOnScroll } from '$lib/utils/animate-on-scroll';

  let { data } = $props();
</script>

<svelte:head>
  <title>Projects — Filip Marklars</title>
  <meta name="description" content="Projects by Filip Marklars." />
</svelte:head>

<section class="py-24 px-6">
  <div class="max-w-5xl mx-auto">
    <h1
      class="font-heading text-4xl md:text-5xl font-light text-cream mb-12"
      use:animateOnScroll
    >
      Projects
    </h1>
    {#if data.projects.length === 0}
      <p class="text-muted font-light">No projects yet. Check back soon!</p>
    {:else}
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {#each data.projects as project, i}
          <ProjectCard {project} delay={i * 100} />
        {/each}
      </div>
    {/if}
  </div>
</section>
```

- [ ] **Step 2: Redesign project detail page**

Replace `src/routes/projects/[slug]/+page.svelte`:

```svelte
<script lang="ts">
  import type { Component } from 'svelte';
  import { animateOnScroll } from '$lib/utils/animate-on-scroll';

  let { data } = $props();
  const Content: Component = $derived(data.content as Component);
</script>

<svelte:head>
  <title>{data.project.title} — Filip Marklars</title>
  <meta name="description" content={data.project.description} />
</svelte:head>

<article class="py-24 px-6">
  <div class="max-w-3xl mx-auto">
    <a
      href="/projects"
      class="inline-flex items-center gap-1 text-sm text-muted hover:text-cream transition-colors duration-200 mb-8"
    >
      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M7 17L3 12m0 0l4-5m-4 5h18" />
      </svg>
      All Projects
    </a>

    <header class="mb-12" use:animateOnScroll>
      <h1 class="font-heading text-4xl md:text-5xl font-light text-cream mb-4">{data.project.title}</h1>
      <p class="text-muted font-light mb-4">{data.project.description}</p>

      <div class="flex flex-wrap items-center gap-4 text-sm text-muted mb-6">
        <time>{new Date(data.project.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</time>
        {#if data.project.repo}
          <a href={data.project.repo} target="_blank" rel="noopener" class="text-orange hover:brightness-125 transition-all duration-200">Repository</a>
        {/if}
        {#if data.project.demo}
          <a href={data.project.demo} target="_blank" rel="noopener" class="text-orange hover:brightness-125 transition-all duration-200">Demo</a>
        {/if}
      </div>

      <div class="flex flex-wrap gap-2">
        {#each data.project.tags as tag}
          <span class="text-xs px-2 py-1 rounded-full bg-mint/10 text-mint font-mono">{tag}</span>
        {/each}
      </div>
    </header>

    <div class="prose prose-invert max-w-none" use:animateOnScroll={{ delay: 100 }}>
      <Content />
    </div>
  </div>
</article>
```

- [ ] **Step 3: Verify both project pages**

Run: `npm run dev`, navigate to `/projects` and click a project.
Expected: Clean heading typography, scroll animations, back link, restyled content.

- [ ] **Step 4: Commit**

```bash
git add src/routes/projects/+page.svelte src/routes/projects/\[slug\]/+page.svelte
git commit -m "feat: redesign projects listing and detail pages"
```

---

### Task 9: Create Contact Page

**Files:**
- Create: `src/routes/contact/+page.svelte`

- [ ] **Step 1: Create the contact page**

Create `src/routes/contact/+page.svelte`:

```svelte
<script lang="ts">
  import FloatingOrbs from '$lib/components/FloatingOrbs.svelte';
  import { animateOnScroll } from '$lib/utils/animate-on-scroll';
</script>

<svelte:head>
  <title>Contact — Filip Marklars</title>
  <meta name="description" content="Get in touch with Filip Marklars." />
</svelte:head>

<section class="relative min-h-[80vh] flex items-center justify-center px-6 overflow-hidden">
  <FloatingOrbs />

  <div class="relative z-10 text-center max-w-md mx-auto">
    <h1
      class="font-heading text-5xl md:text-6xl font-light italic text-cream mb-4"
      use:animateOnScroll
    >
      Say Hello
    </h1>
    <p
      class="text-muted font-light mb-12"
      use:animateOnScroll={{ delay: 100 }}
    >
      Have a question or want to work together?
    </p>

    <div class="flex flex-col gap-6">
      <a
        href="mailto:filip@marklars.dev"
        class="group flex items-center justify-center gap-3 text-muted hover:text-cream transition-colors duration-300"
        use:animateOnScroll={{ delay: 200 }}
      >
        <svg class="w-5 h-5 group-hover:text-orange transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
        </svg>
        <span class="font-light">filip@marklars.dev</span>
      </a>

      <a
        href="https://github.com/marklarsfilip"
        target="_blank"
        rel="noopener"
        class="group flex items-center justify-center gap-3 text-muted hover:text-cream transition-colors duration-300"
        use:animateOnScroll={{ delay: 300 }}
      >
        <svg class="w-5 h-5 group-hover:text-orange transition-colors duration-300" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
        </svg>
        <span class="font-light">marklarsfilip</span>
      </a>

      <a
        href="https://linkedin.com/in/filipmarklars"
        target="_blank"
        rel="noopener"
        class="group flex items-center justify-center gap-3 text-muted hover:text-cream transition-colors duration-300"
        use:animateOnScroll={{ delay: 400 }}
      >
        <svg class="w-5 h-5 group-hover:text-orange transition-colors duration-300" fill="currentColor" viewBox="0 0 24 24">
          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
        </svg>
        <span class="font-light">filipmarklars</span>
      </a>
    </div>
  </div>
</section>
```

- [ ] **Step 2: Verify contact page**

Run: `npm run dev`, navigate to `/contact`
Expected: Centered layout with floating orbs, heading, 3 contact links with stagger animation.

- [ ] **Step 3: Commit**

```bash
git add src/routes/contact/+page.svelte
git commit -m "feat: add contact page with floating orbs and stagger animations"
```

---

### Task 10: Redesign Error Page

**Files:**
- Modify: `src/routes/+error.svelte`

- [ ] **Step 1: Restyle error page**

Replace `src/routes/+error.svelte`:

```svelte
<script lang="ts">
  import { page } from '$app/state';
</script>

<svelte:head>
  <title>Not Found — Filip Marklars</title>
</svelte:head>

<section class="min-h-[80vh] flex items-center justify-center px-6 text-center">
  <div>
    <h1 class="font-heading text-7xl md:text-8xl font-light text-orange mb-4">
      {page.status}
    </h1>
    <p class="text-muted font-light text-lg mb-8">
      {page.error?.message ?? 'Page not found'}
    </p>
    <a
      href="/"
      class="inline-block px-8 py-3 border border-orange/30 text-orange text-xs tracking-[0.15em] uppercase
        hover:border-orange hover:shadow-[0_0_20px_rgba(252,107,63,0.15)] transition-all duration-300
        focus:outline-none focus:ring-2 focus:ring-orange/50 focus:ring-offset-2 focus:ring-offset-base"
    >
      Go Home
    </a>
  </div>
</section>
```

- [ ] **Step 2: Commit**

```bash
git add src/routes/+error.svelte
git commit -m "feat: redesign error page with new typography"
```

---

### Task 11: Final Verification

- [ ] **Step 1: Run type check**

Run: `npx svelte-check`
Expected: No errors.

- [ ] **Step 2: Run build**

Run: `npm run build`
Expected: Build succeeds with no errors.

- [ ] **Step 3: Run E2E tests**

Run: `npx playwright test`
Expected: All existing tests pass (may need updates for changed text like "Featured Projects" → "Selected Work").

- [ ] **Step 4: Fix any test failures**

Test files to update: `tests/e2e/navigation.test.ts` and `tests/unit/projects.test.ts`.
Known changes that may break tests:
- "Featured Projects" heading → "Selected Work"
- Nav now has 4 links (added "Contact")
- About page heading changed from "About Me" to italic pull-quote intro
Update assertions to match new text content.

- [ ] **Step 5: Visual review**

Start dev server and manually check each page at 375px, 768px, 1024px, 1440px:
- `/` — Hero animations, orbs, project cards
- `/about` — Typography, skill badges, contact CTA
- `/projects` — Grid, card hover states
- `/projects/personal-website` — Back link, prose styling
- `/contact` — Orbs, links, animations
- 404 page — Error styling

- [ ] **Step 6: Accessibility checklist verification**

Manually verify against spec's accessibility checklist:
- All `animate-on-scroll` elements are visible with `prefers-reduced-motion: reduce` (check CSS)
- All text has 4.5:1+ contrast (cream `#FFF6DA` on base `#050505` = ~18:1, muted `#8a8480` on base = ~4.5:1)
- All interactive elements have visible focus states (`focus:ring-*` classes)
- All `<img>` tags have `alt` attributes
- Touch targets >= 44px (nav button has `p-2`, contact links have `gap-3` + icon size)
- Tab order is logical (top-to-bottom, left-to-right)
- No horizontal scroll at 375px
- Semantic HTML: `<nav>`, `<main>`, `<footer>`, `<article>`, `<section>`, `<header>`, `<time>`

- [ ] **Step 7: Commit any fixes**

```bash
git add -A
git commit -m "fix: update tests and polish for redesign v2"
```
