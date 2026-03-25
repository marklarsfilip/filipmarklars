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
