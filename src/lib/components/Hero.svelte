<script lang="ts">
  import ParticleCanvas from './ParticleCanvas.svelte';
</script>

<section class="relative min-h-screen flex items-center justify-center px-6 overflow-hidden">
  <ParticleCanvas />

  <div class="text-center relative z-10">
    <p
      class="text-xs tracking-[0.25em] uppercase text-muted mb-6"
      style="animation: fade-in 0.8s ease-out 0.2s both;"
    >
      Developer & Creator
    </p>

    <h1
      class="font-heading text-6xl md:text-7xl lg:text-8xl font-light leading-none tracking-tight"
      style="animation: fade-up 0.8s ease-out 0.5s both;"
    >
      Filip<br />
      <span class="italic text-orange">Marklars</span>
    </h1>

    <div
      class="h-px bg-orange/40 mx-auto my-8"
      style="animation: line-grow 0.6s ease-out 0.9s both;"
    ></div>

    <p
      class="text-sm font-light text-muted max-w-sm mx-auto leading-relaxed"
      style="animation: fade-up 0.8s ease-out 1.1s both;"
    >
      Building things with code. Exploring ideas. Sharing the journey.
    </p>

    <a
      href="/projects"
      class="inline-block mt-8 px-8 py-3 border border-orange/30 text-orange text-xs tracking-[0.15em] uppercase
        hover:border-orange hover:shadow-[0_0_20px_rgba(252,107,63,0.15)] transition-all duration-300
        focus:outline-none focus:ring-2 focus:ring-orange/50 focus:ring-offset-2 focus:ring-offset-base"
      style="animation: fade-in 1s ease-out 1.4s both;"
    >
      View Work
    </a>
  </div>

  <!-- Scroll indicator -->
  <div
    class="absolute bottom-8 left-1/2 -translate-x-1/2"
    style="animation: pulse-down 2s ease-in-out infinite 2s;"
  >
    <svg class="w-5 h-5 text-muted/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M19 14l-7 7m0 0l-7-7" />
    </svg>
  </div>
</section>
