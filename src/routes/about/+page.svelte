<script lang="ts">
  import SkillBadge from '$lib/components/SkillBadge.svelte';

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
    <h1 class="text-4xl font-bold mb-8">About Me</h1>
    <p class="text-muted text-lg leading-relaxed mb-12">
      Hey! I'm Filip Marklars. I build things with code and love exploring new technologies.
      This site is my personal space where I showcase what I'm working on.
    </p>

    <h2 class="text-2xl font-bold mb-6">Skills & Tech Stack</h2>
    <div class="flex flex-wrap gap-3 mb-12">
      {#each skills as skill}
        <SkillBadge name={skill} />
      {/each}
    </div>

    <h2 class="text-2xl font-bold mb-6">Contact</h2>
    <div class="flex flex-col gap-3 text-muted">
      <a href="mailto:filip@example.com" class="hover:text-orange transition-colors">
        Email → filip@example.com
      </a>
      <a href="https://github.com/marklarsfilip" target="_blank" rel="noopener" class="hover:text-orange transition-colors">
        GitHub → marklarsfilip
      </a>
      <a href="https://linkedin.com/in/filipmarklars" target="_blank" rel="noopener" class="hover:text-orange transition-colors">
        LinkedIn → filipmarklars
      </a>
    </div>
  </div>
</section>
