<script lang="ts">
  import type { Component } from 'svelte';
  import { animateOnScroll } from '$lib/utils/animate-on-scroll';

  let { data } = $props();
  const Content: Component = $derived(data.content as Component);
</script>

<svelte:head>
  <title>{data.project.title} — Filip Marklars</title>
  <meta name="description" content={data.project.description} />
</svelte:head>

<article class="py-24 px-6">
  <div class="max-w-3xl mx-auto">
    <a
      href="/projects"
      class="inline-flex items-center gap-1 text-sm text-muted hover:text-cream transition-colors duration-200 mb-8"
    >
      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M7 17L3 12m0 0l4-5m-4 5h18" />
      </svg>
      All Projects
    </a>

    <header class="mb-12" use:animateOnScroll>
      <h1 class="font-heading text-4xl md:text-5xl font-light text-cream mb-4">{data.project.title}</h1>
      <p class="text-muted font-light mb-4">{data.project.description}</p>

      <div class="flex flex-wrap items-center gap-4 text-sm text-muted mb-6">
        <time>{new Date(data.project.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</time>
        {#if data.project.repo}
          <a href={data.project.repo} target="_blank" rel="noopener" class="text-orange hover:brightness-125 transition-all duration-200">Repository</a>
        {/if}
        {#if data.project.demo}
          <a href={data.project.demo} target="_blank" rel="noopener" class="text-orange hover:brightness-125 transition-all duration-200">Demo</a>
        {/if}
      </div>

      <div class="flex flex-wrap gap-2">
        {#each data.project.tags as tag}
          <span class="text-xs px-2 py-1 rounded-full bg-mint/10 text-mint font-mono">{tag}</span>
        {/each}
      </div>
    </header>

    <div class="prose prose-invert max-w-none" use:animateOnScroll={{ delay: 100 }}>
      <Content />
    </div>
  </div>
</article>
