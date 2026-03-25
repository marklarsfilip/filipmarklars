import { describe, it, expect } from 'vitest';
import { sortProjects, getFeaturedProjects } from '$lib/utils/projects';
import type { Project } from '$lib/types/project';

const mockProjects: Project[] = [
  { title: 'Old', description: '', date: '2025-01-01', tags: [], slug: 'old' },
  { title: 'New', description: '', date: '2026-03-01', tags: [], slug: 'new', featured: true },
  { title: 'Mid', description: '', date: '2025-06-15', tags: [], slug: 'mid', featured: true },
];

describe('sortProjects', () => {
  it('sorts by date descending', () => {
    const sorted = sortProjects(mockProjects);
    expect(sorted.map((p) => p.slug)).toEqual(['new', 'mid', 'old']);
  });
});

describe('getFeaturedProjects', () => {
  it('returns only featured projects', () => {
    const featured = getFeaturedProjects(mockProjects);
    expect(featured.every((p) => p.featured)).toBe(true);
  });

  it('limits to specified count', () => {
    const featured = getFeaturedProjects(mockProjects, 1);
    expect(featured).toHaveLength(1);
  });

  it('sorts featured by date descending', () => {
    const featured = getFeaturedProjects(mockProjects);
    expect(featured.map((p) => p.slug)).toEqual(['new', 'mid']);
  });
});
