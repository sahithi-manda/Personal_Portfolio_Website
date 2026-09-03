import type { GitHubRepo, PortfolioJsonMetadata, PortfolioProject } from '../types/project';

const CACHE_KEY = 'portfolio_github_projects_cache_v2';
const CACHE_TTL_MS = 30 * 60 * 1000; // 30 minutes

export interface CachedData {
  timestamp: number;
  username: string;
  projects: PortfolioProject[];
}

/**
 * Returns the configured GitHub username from environment variables or default fallback.
 */
export const getGitHubUsername = (): string => {
  const envUsername = import.meta.env.VITE_GITHUB_USERNAME;
  if (envUsername && typeof envUsername === 'string' && envUsername.trim().length > 0) {
    return envUsername.trim();
  }
  return 'sahithi-manda';
};

/**
 * Retrieves the optional GitHub Personal Access Token if provided.
 */
const getGitHubToken = (): string | undefined => {
  const token = import.meta.env.VITE_GITHUB_TOKEN;
  if (token && typeof token === 'string' && token.trim().length > 0) {
    return token.trim();
  }
  return undefined;
};

/**
 * Fetches public repositories for the configured username from the GitHub REST API.
 */
export const fetchUserRepositories = async (username: string): Promise<GitHubRepo[]> => {
  const token = getGitHubToken();
  const headers: HeadersInit = {
    Accept: 'application/vnd.github+json',
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`https://api.github.com/users/${username}/repos?per_page=100&sort=updated`, {
    headers,
  });

  if (!response.ok) {
    if (response.status === 403) {
      console.warn('[GitHub Sync] GitHub API rate limit reached. Using fallback/cached data.');
      throw new Error('RATE_LIMIT_EXCEEDED');
    }
    if (response.status === 404) {
      console.warn(`[GitHub Sync] User '${username}' not found on GitHub.`);
      throw new Error('USER_NOT_FOUND');
    }
    throw new Error(`GitHub API HTTP ${response.status}`);
  }

  const data = await response.json();
  if (!Array.isArray(data)) {
    throw new Error('Malformed GitHub API response: expected array');
  }

  return data as GitHubRepo[];
};

/**
 * Attempts to fetch optional portfolio.json metadata from the repository root via raw GitHub CDN.
 * Note: raw.githubusercontent.com does not consume GitHub REST API hourly quota.
 */
export const fetchPortfolioMetadata = async (
  username: string,
  repoName: string,
  branch = 'main'
): Promise<PortfolioJsonMetadata | null> => {
  try {
    const rawUrl = `https://raw.githubusercontent.com/${username}/${repoName}/${branch}/portfolio.json`;
    const res = await fetch(rawUrl, { cache: 'no-cache' });
    if (res.ok) {
      const json = await res.json();
      return json as PortfolioJsonMetadata;
    }
    // Try 'master' branch fallback if 'main' was not found
    if (branch === 'main') {
      const masterUrl = `https://raw.githubusercontent.com/${username}/${repoName}/master/portfolio.json`;
      const masterRes = await fetch(masterUrl, { cache: 'no-cache' });
      if (masterRes.ok) {
        const json = await masterRes.json();
        return json as PortfolioJsonMetadata;
      }
    }
    return null;
  } catch {
    // portfolio.json is completely optional; fail silently
    return null;
  }
};

/**
 * Extracts a concise 1-2 sentence preview from README.md if repository description is absent.
 */
export const fetchReadmeSnippet = async (
  username: string,
  repoName: string,
  branch = 'main'
): Promise<string | null> => {
  try {
    const rawUrl = `https://raw.githubusercontent.com/${username}/${repoName}/${branch}/README.md`;
    const res = await fetch(rawUrl);
    if (!res.ok) return null;
    const text = await res.text();

    // Clean markdown: strip headings, badges, markdown links, code blocks
    const lines = text.split('\n');
    for (const line of lines) {
      const trimmed = line.trim();
      // Skip headings, empty lines, HTML, badges, code ticks
      if (
        !trimmed ||
        trimmed.startsWith('#') ||
        trimmed.startsWith('![') ||
        trimmed.startsWith('<') ||
        trimmed.startsWith('```') ||
        trimmed.startsWith('---') ||
        trimmed.startsWith('***')
      ) {
        continue;
      }

      // Remove markdown links [text](url) -> text
      const cleaned = trimmed.replace(/\[([^\]]+)\]\([^)]+\)/g, '$1').replace(/[*_`]/g, '').trim();
      if (cleaned.length > 20) {
        return cleaned.length > 160 ? cleaned.slice(0, 157) + '...' : cleaned;
      }
    }
    return null;
  } catch {
    return null;
  }
};

/**
 * Retrieves cached normalized projects from localStorage if fresh.
 */
export const getCachedProjects = (username: string): PortfolioProject[] | null => {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    if (!raw) return null;

    const parsed: CachedData = JSON.parse(raw);
    const isSameUser = parsed.username?.toLowerCase() === username.toLowerCase();
    const isNotExpired = Date.now() - parsed.timestamp < CACHE_TTL_MS;

    if (isSameUser && isNotExpired && Array.isArray(parsed.projects) && parsed.projects.length > 0) {
      return parsed.projects;
    }
    return null;
  } catch {
    return null;
  }
};

/**
 * Persists normalized projects into localStorage with timestamp and username.
 */
export const setCachedProjects = (username: string, projects: PortfolioProject[]): void => {
  try {
    const data: CachedData = {
      timestamp: Date.now(),
      username,
      projects,
    };
    localStorage.setItem(CACHE_KEY, JSON.stringify(data));
  } catch (err) {
    console.warn('[GitHub Sync] Could not write to localStorage cache:', err);
  }
};

/**
 * Clears the local project cache to force fresh synchronization.
 */
export const clearProjectsCache = (): void => {
  try {
    localStorage.removeItem(CACHE_KEY);
  } catch {
    // Ignore
  }
};
