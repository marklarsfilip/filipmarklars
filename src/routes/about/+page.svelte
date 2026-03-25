<script lang="ts">
  import SkillBadge from '$lib/components/SkillBadge.svelte';
  import { animateOnScroll } from '$lib/utils/animate-on-scroll';

  const skills = [
    'TypeScript', 'JavaScript', 'SvelteKit', 'Svelte', 'Tailwind CSS',
    'Node.js', 'Python', 'Git', 'HTML/CSS',
  ];
</script>

<svelte:head>
  <title>About — Filip Marklars</title>
  <meta name="description" content="About Filip Marklars — skills, tech stack, and contact." />
</svelte:head>

<section class="py-24 px-6">
  <div class="max-w-3xl mx-auto">
    <!-- Intro -->
    <p
      class="font-heading text-3xl md:text-4xl font-light italic text-cream leading-snug mb-8"
      use:animateOnScroll
    >
      Hey, I'm Filip — I build things with code and love exploring new technologies.
    </p>
    <p
      class="text-muted font-light leading-relaxed mb-16"
      use:animateOnScroll={{ delay: 100 }}
    >
      This site is my personal space where I showcase what I'm working on.
      I'm passionate about modern web development, open source, and creating
      tools that make life easier.
    </p>

    <!-- Skills -->
    <h2
      class="font-heading text-2xl font-light text-cream mb-8"
      use:animateOnScroll
    >
      Skills & Tech Stack
    </h2>
    <div class="flex flex-wrap gap-3 mb-16" use:animateOnScroll={{ delay: 100 }}>
      {#each skills as skill}
        <SkillBadge name={skill} />
      {/each}
    </div>

    <!-- Contact CTA -->
    <div use:animateOnScroll>
      <a
        href="/contact"
        class="inline-flex items-center gap-2 text-muted hover:text-orange transition-colors duration-300 font-light"
      >
        Let's connect
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M17 8l4 4m0 0l-4 4m4-4H3" />
        </svg>
      </a>
    </div>
  </div>
</section>
