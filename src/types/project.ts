/**
 * Raw GitHub Repository API response representation
 */
export interface GitHubRepo {
  id: number;
  name: string;
  full_name: string;
  description: string | null;
  html_url: string;
  homepage: string | null;
  language: string | null;
  topics?: string[];
  stargazers_count: number;
  forks_count: number;
  fork: boolean;
  archived: boolean;
  created_at: string;
  updated_at: string;
  pushed_at: string;
  default_branch: string;
}

/**
 * Optional portfolio.json file structure located in project repository root
 */
export interface PortfolioJsonMetadata {
  title?: string;
  description?: string;
  category?: string;
  technologies?: string[];
  featured?: boolean;
  displayOrder?: number;
  image?: string;
  demoUrl?: string;
  liveUrl?: string;
  hidden?: boolean;
}

/**
 * Normalized project model consumed by UI components
 */
export interface PortfolioProject {
  id: string;
  title: string;
  description: string;
  tech: string[];
  github: string;
  liveUrl?: string | null;
  image?: string;
  category?: string;
  stars: number;
  forks: number;
  language?: string | null;
  featured: boolean;
  displayOrder?: number;
  gridClass: string;
  updatedAt: string;
  isFromGitHub: boolean;
}
