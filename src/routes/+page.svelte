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
