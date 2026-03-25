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
