import { getFeaturedProjects, loadProjects } from '$lib/utils/projects';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
  const projects = await loadProjects();
  return {
    featured: getFeaturedProjects(projects, 3),
  };
};
