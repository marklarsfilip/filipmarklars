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
