import type { Project } from '$lib/types/project';

export function sortProjects(projects: Project[]): Project[] {
  return [...projects].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export function getFeaturedProjects(projects: Project[], limit = 3): Project[] {
  return sortProjects(projects.filter((p) => p.featured)).slice(0, limit);
}

export async function loadProjects(): Promise<Project[]> {
  const modules = import.meta.glob<{ metadata: Omit<Project, 'slug'> }>(
    '$lib/content/projects/*.md',
    { eager: true }
  );

  const projects: Project[] = Object.entries(modules).map(([path, module]) => {
    const filename = path.split('/').pop()!.replace('.md', '');
    const metadata = module.metadata;
    return {
      ...metadata,
      slug: metadata.slug ?? filename,
    } as Project;
  });

  return sortProjects(projects);
}
