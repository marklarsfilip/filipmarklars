import { error } from '@sveltejs/kit';
import type { PageLoad } from './$types';
import type { Project } from '$lib/types/project';

export const load: PageLoad = async ({ params }) => {
  const modules = import.meta.glob<{
    default: import('svelte').Component;
    metadata: Omit<Project, 'slug'> & { slug?: string };
  }>('$lib/content/projects/*.md', { eager: true });

  for (const [path, module] of Object.entries(modules)) {
    const filename = path.split('/').pop()!.replace('.md', '');
    const slug = module.metadata.slug ?? filename;

    if (slug === params.slug) {
      return {
        content: module.default,
        project: { ...module.metadata, slug } as Project,
      };
    }
  }

  error(404, 'Project not found');
};
