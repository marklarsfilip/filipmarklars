<script lang="ts">
  import Hero from '$lib/components/Hero.svelte';
  import ProjectCard from '$lib/components/ProjectCard.svelte';

  let { data } = $props();
</script>

<svelte:head>
  <title>Filip Marklars</title>
  <meta name="description" content="Filip Marklars' personal website — projects, skills, and more." />
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
