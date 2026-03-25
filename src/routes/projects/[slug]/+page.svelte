<script lang="ts">
  import type { Component } from 'svelte';

  let { data } = $props();
  const Content: Component = $derived(data.content as Component);
</script>

<svelte:head>
  <title>{data.project.title} — Filip Marklars</title>
  <meta name="description" content={data.project.description} />
</svelte:head>

<article class="py-24 px-6">
  <div class="max-w-3xl mx-auto">
    <header class="mb-12">
      <h1 class="text-4xl font-bold mb-4">{data.project.title}</h1>
      <p class="text-muted mb-4">{data.project.description}</p>

      <div class="flex flex-wrap items-center gap-4 text-sm text-muted mb-4">
        <time>{new Date(data.project.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</time>
        {#if data.project.repo}
          <a href={data.project.repo} target="_blank" rel="noopener" class="text-orange hover:brightness-110">Repo →</a>
        {/if}
        {#if data.project.demo}
          <a href={data.project.demo} target="_blank" rel="noopener" class="text-orange hover:brightness-110">Demo →</a>
        {/if}
      </div>

      <div class="flex flex-wrap gap-2">
        {#each data.project.tags as tag}
          <span class="text-xs px-2 py-1 rounded-full bg-mint/10 text-mint">{tag}</span>
        {/each}
      </div>
    </header>

    <div class="prose prose-invert max-w-none">
      <Content />
    </div>
  </div>
</article>
