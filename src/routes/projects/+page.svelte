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
