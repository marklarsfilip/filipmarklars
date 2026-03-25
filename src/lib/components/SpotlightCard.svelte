<script lang="ts">
  import { onMount } from 'svelte';

  let {
    class: className = '',
    glowColor = 'orange',
    children,
  }: {
    class?: string;
    glowColor?: 'orange' | 'mint' | 'blue' | 'purple';
    children?: import('svelte').Snippet;
  } = $props();

  let cardRef = $state<HTMLDivElement | null>(null);
  let reducedMotion = $state(false);

  const colorMap: Record<string, { base: number; spread: number }> = {
    orange: { base: 15, spread: 30 },
    mint: { base: 160, spread: 40 },
    blue: { base: 220, spread: 40 },
    purple: { base: 280, spread: 40 },
  };

  onMount(() => {
    reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reducedMotion) return;

    function syncPointer(e: PointerEvent) {
      if (!cardRef) return;
      const rect = cardRef.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const xp = e.clientX / window.innerWidth;
      cardRef.style.setProperty('--spot-x', `${x}px`);
      cardRef.style.setProperty('--spot-y', `${y}px`);
      cardRef.style.setProperty('--xp', xp.toFixed(2));
    }

    document.addEventListener('pointermove', syncPointer);
    return () => document.removeEventListener('pointermove', syncPointer);
  });

  const config = $derived(colorMap[glowColor] ?? colorMap.orange);
</script>

<div
  bind:this={cardRef}
  class="spotlight-card {className}"
  style="--base: {config.base}; --spread: {config.spread};"
>
  <div class="spotlight-card-glow" aria-hidden="true"></div>
  <div class="spotlight-card-border" aria-hidden="true"></div>
  <div class="spotlight-card-content">
    {#if children}
      {@render children()}
    {/if}
  </div>
</div>

<style>
  .spotlight-card {
    position: relative;
    border-radius: 0.75rem;
    overflow: hidden;
    background: var(--color-surface, #111110);
    --hue: calc(var(--base, 15) + (var(--xp, 0.5) * var(--spread, 30)));
  }

  /* Subtle background glow that follows pointer */
  .spotlight-card-glow {
    pointer-events: none;
    position: absolute;
    inset: 0;
    opacity: 0;
    transition: opacity 0.4s ease;
    background: radial-gradient(
      300px circle at var(--spot-x, 50%) var(--spot-y, 50%),
      hsl(var(--hue) 80% 60% / 0.07),
      transparent 60%
    );
  }

  .spotlight-card:hover .spotlight-card-glow {
    opacity: 1;
  }

  /* Glowing border that follows pointer */
  .spotlight-card-border {
    pointer-events: none;
    position: absolute;
    inset: 0;
    border-radius: inherit;
    opacity: 0;
    transition: opacity 0.4s ease;
    /* Use a mask to only show the border edge */
    border: 1.5px solid transparent;
    mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0);
    mask-composite: exclude;
    background: radial-gradient(
      250px circle at var(--spot-x, 50%) var(--spot-y, 50%),
      hsl(var(--hue) 90% 65% / 0.6),
      hsl(var(--hue) 90% 65% / 0.1) 60%,
      transparent 70%
    );
  }

  .spotlight-card:hover .spotlight-card-border {
    opacity: 1;
  }

  .spotlight-card-content {
    position: relative;
    z-index: 1;
  }

  @media (prefers-reduced-motion: reduce) {
    .spotlight-card-glow,
    .spotlight-card-border {
      display: none;
    }
  }
</style>
