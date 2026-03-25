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
