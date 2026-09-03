import type { GitHubRepo, PortfolioJsonMetadata, PortfolioProject } from '../types/project';
import { repoCuratedKnowledge } from '../data/fallbackProjects';
import { fetchPortfolioMetadata, fetchReadmeSnippet } from './githubService';

/**
 * Known tech acronyms to keep uppercase in title formatting
 */
const ACRONYMS = new Set(['AI', 'ML', 'OCR', 'NLP', 'PCA', 'ANN', 'LSTM', 'EMI', 'API', 'UI', 'UX', 'DSA', 'SQL']);

/**
 * Converts repository names like 'AI-Study-Planner' or 'bus_reservation_system' into clean Title Case
 */
export const formatRepoTitle = (name: string): string => {
  // Replace underscores and hyphens with spaces
  const spaced = name.replace(/[-_]+/g, ' ').trim();

  // Split into tokens
  const words = spaced.split(/\s+/);

  return words
    .map((word) => {
      const upper = word.toUpperCase();
      if (ACRONYMS.has(upper)) {
        return upper;
      }
      // Handle words like 'FaceRecogination' -> 'Face Recognition'
      if (upper === 'FACERECOGINATION') return 'Face Recognition';
      return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    })
    .join(' ');
};

/**
 * Validates and cleans URL strings for Live Demo links
 */
const sanitizeUrl = (url: string | null | undefined, repoUrl: string): string | null => {
  if (!url || typeof url !== 'string') return null;
  const trimmed = url.trim();
  if (trimmed.length === 0) return null;
  // Ignore if homepage points back to the GitHub repo itself
  if (trimmed.toLowerCase() === repoUrl.toLowerCase()) return null;
  if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
    return trimmed;
  }
  return `https://${trimmed}`;
};

/**
 * Filters out repositories that should not be displayed in the public portfolio
 */
export const isRepoEligible = (repo: GitHubRepo, username: string): boolean => {
  // Exclude forks and archived projects
  if (repo.fork || repo.archived) {
    return false;
  }

  const topics = (repo.topics || []).map((t) => t.toLowerCase());

  // Exclude explicitly hidden repositories
  if (topics.includes('portfolio-hidden') || topics.includes('hidden')) {
    return false;
  }

  // Exclude user profile repository (e.g. 'sahithi-manda/sahithi-manda')
  if (repo.name.toLowerCase() === username.toLowerCase()) {
    return false;
  }

  // Exclude the portfolio's own repository unless specifically tagged as featured
  if (
    repo.name.toLowerCase() === 'personal_portfolio_website' ||
    repo.name.toLowerCase() === 'portfolio'
  ) {
    if (!topics.includes('portfolio-featured')) {
      return false;
    }
  }

  return true;
};

/**
 * Normalizes a single GitHub repository into a PortfolioProject object
 */
export const normalizeGitHubRepo = async (
  repo: GitHubRepo,
  username: string
): Promise<PortfolioProject | null> => {
  // Check optional portfolio.json in repository root
  const metadata: PortfolioJsonMetadata | null = await fetchPortfolioMetadata(
    username,
    repo.name,
    repo.default_branch || 'main'
  );

  // If metadata specifies hidden, discard
  if (metadata?.hidden) {
    return null;
  }

  const curated = repoCuratedKnowledge[repo.name];
  const topics = (repo.topics || []).map((t) => t.toLowerCase());

  // Determine Title
  const title = metadata?.title || curated?.title || formatRepoTitle(repo.name);

  // Determine Description
  let description = metadata?.description || repo.description || curated?.description;
  if (!description || description.trim().length === 0) {
    // Attempt fallback to README first sentence
    const readmeSnippet = await fetchReadmeSnippet(username, repo.name, repo.default_branch || 'main');
    description =
      readmeSnippet ||
      `${title} built with ${repo.language || 'modern software technologies'}, published on GitHub.`;
  }

  // Determine Technologies
  let tech: string[] = [];
  if (metadata?.technologies && metadata.technologies.length > 0) {
    tech = metadata.technologies;
  } else if (curated?.tech && (!repo.topics || repo.topics.length === 0)) {
    tech = curated.tech;
  } else {
    const rawTechList: string[] = [];
    if (repo.language) {
      rawTechList.push(repo.language);
    }
    // Filter out meta topics like 'portfolio', 'portfolio-featured'
    const filteredTopics = (repo.topics || []).filter(
      (t) => !['portfolio', 'portfolio-featured', 'portfolio-hidden', 'hidden', 'project'].includes(t.toLowerCase())
    );
    rawTechList.push(...filteredTopics);

    if (rawTechList.length === 0) {
      tech = [repo.language || 'Python'];
    } else {
      // Capitalize topics and deduplicate
      tech = Array.from(
        new Set(
          rawTechList.map((t) => {
            const upper = t.toUpperCase();
            if (ACRONYMS.has(upper)) return upper;
            return t.charAt(0).toUpperCase() + t.slice(1);
          })
        )
      ).slice(0, 5);
    }
  }

  // Determine Featured Status
  const featured = Boolean(
    metadata?.featured ??
      (topics.includes('portfolio-featured') ||
        topics.includes('featured') ||
        curated?.featured ||
        repo.stargazers_count > 2)
  );

  const displayOrder = metadata?.displayOrder ?? curated?.displayOrder;
  const liveUrl = sanitizeUrl(metadata?.liveUrl || metadata?.demoUrl || repo.homepage, repo.html_url);

  return {
    id: `gh-${repo.id}`,
    title,
    description: description.trim(),
    tech,
    github: repo.html_url,
    liveUrl,
    image: metadata?.image,
    category: metadata?.category,
    stars: repo.stargazers_count || 0,
    forks: repo.forks_count || 0,
    language: repo.language,
    featured,
    displayOrder,
    gridClass: 'md:col-span-3', // dynamically recalculated during list balancing
    updatedAt: repo.pushed_at || repo.updated_at || repo.created_at,
    isFromGitHub: true,
  };
};

/**
 * Normalizes, sorts, and applies responsive layout spans to a list of GitHub repositories
 */
export const processAndSortProjects = async (
  repos: GitHubRepo[],
  username: string
): Promise<PortfolioProject[]> => {
  // 1. Filter eligible repositories
  const eligibleRepos = repos.filter((r) => isRepoEligible(r, username));

  // 2. Normalize repositories concurrently
  const projectPromises = eligibleRepos.map((repo) => normalizeGitHubRepo(repo, username));
  const results = await Promise.all(projectPromises);
  const projects = results.filter((p): p is PortfolioProject => p !== null);

  // 3. Sort intelligently:
  // - Featured first (sorted by displayOrder if available, then by latest push date)
  // - Non-featured sorted by latest push date
  projects.sort((a, b) => {
    if (a.featured && !b.featured) return -1;
    if (!a.featured && b.featured) return 1;

    if (a.featured && b.featured) {
      if (a.displayOrder !== undefined && b.displayOrder !== undefined) {
        return a.displayOrder - b.displayOrder;
      }
      if (a.displayOrder !== undefined) return -1;
      if (b.displayOrder !== undefined) return 1;
    }

    // Sort by latest update date descending
    const dateA = new Date(a.updatedAt).getTime();
    const dateB = new Date(b.updatedAt).getTime();
    return dateB - dateA;
  });

  // 4. Assign responsive bento grid spans (alternating 3-span and 2-span rows)
  // Row layout pattern in 6-column grid: [3, 3], [2, 2, 2], [3, 3], [2, 2, 2]...
  const pattern = [3, 3, 2, 2, 2];
  projects.forEach((proj, idx) => {
    const span = pattern[idx % pattern.length];
    proj.gridClass = span === 3 ? 'md:col-span-3' : 'md:col-span-2';
  });

  return projects;
};
