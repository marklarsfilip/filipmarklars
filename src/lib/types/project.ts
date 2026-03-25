export interface Project {
  title: string;
  description: string;
  date: string;
  tags: string[];
  slug: string;
  thumbnail?: string;
  repo?: string;
  demo?: string;
  featured?: boolean;
}
