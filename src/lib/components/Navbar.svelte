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
