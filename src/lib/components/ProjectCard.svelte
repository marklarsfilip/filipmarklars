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
