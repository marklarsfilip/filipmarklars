export interface Project {
  title: string;
  description: string;
  date: string;
  tags: string[];
  slug: string;
  thumbnail?: string;
  thumbnailAlt?: string;
  repo?: string;
  demo?: string;
  featured?: boolean;
  featuredOrder?: number;
}
