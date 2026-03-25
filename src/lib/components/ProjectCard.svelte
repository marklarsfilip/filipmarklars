<script lang="ts">
  import type { Project } from '$lib/types/project';

  let { project }: { project: Project } = $props();
</script>

<a href="/projects/{project.slug}" class="group block bg-surface rounded-xl p-6 hover:ring-1 hover:ring-orange/50 transition-all">
  {#if project.thumbnail}
    <img
      src={project.thumbnail}
      alt={project.title}
      class="w-full h-40 object-cover rounded-lg mb-4"
    />
  {/if}
  <h3 class="text-lg font-semibold text-cream group-hover:text-orange transition-colors mb-2">
    {project.title}
  </h3>
  <p class="text-sm text-muted mb-4">{project.description}</p>
  <div class="flex flex-wrap gap-2">
    {#each project.tags as tag}
      <span class="text-xs px-2 py-1 rounded-full bg-mint/10 text-mint">{tag}</span>
    {/each}
  </div>
</a>
