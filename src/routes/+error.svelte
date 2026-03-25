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
