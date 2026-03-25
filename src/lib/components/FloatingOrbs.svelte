<script lang="ts">
  import { onMount } from 'svelte';

  let scrollY = $state(0);
  let reducedMotion = $state(false);

  onMount(() => {
    reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (reducedMotion) return;

    let ticking = false;
    function onScroll() {
      if (!ticking) {
        requestAnimationFrame(() => {
          scrollY = window.scrollY;
          ticking = false;
        });
        ticking = true;
      }
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  });
</script>

<div class="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
  <div
    class="absolute -top-20 -right-20 w-72 h-72 rounded-full"
    style="
      background: radial-gradient(circle, rgba(252, 107, 63, 0.05), transparent 70%);
      animation: float-slow 6s ease-in-out infinite;
      transform: translateY({reducedMotion ? 0 : scrollY * -0.3}px);
    "
  ></div>
  <div
    class="absolute top-1/3 -left-32 w-64 h-64 rounded-full"
    style="
      background: radial-gradient(circle, rgba(132, 242, 214, 0.04), transparent 70%);
      animation: float-slower 8s ease-in-out infinite;
      transform: translateY({reducedMotion ? 0 : scrollY * -0.15}px);
    "
  ></div>
  <div
    class="absolute -bottom-16 right-1/4 w-48 h-48 rounded-full"
    style="
      background: radial-gradient(circle, rgba(252, 107, 63, 0.03), transparent 70%);
      animation: float-slow 7s ease-in-out 2s infinite;
      transform: translateY({reducedMotion ? 0 : scrollY * -0.2}px);
    "
  ></div>
</div>
