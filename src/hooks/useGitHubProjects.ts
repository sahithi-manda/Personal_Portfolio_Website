import { useState, useEffect, useCallback, useRef } from 'react';
import type { PortfolioProject } from '../types/project';
import { fallbackProjects } from '../data/fallbackProjects';
import {
  getGitHubUsername,
  fetchUserRepositories,
  getCachedProjects,
  setCachedProjects,
  clearProjectsCache,
} from '../services/githubService';
import { processAndSortProjects } from '../services/projectNormalizer';

interface UseGitHubProjectsReturn {
  projects: PortfolioProject[];
  isLoading: boolean;
  isSyncing: boolean;
  error: string | null;
  syncSource: 'live' | 'cache' | 'fallback';
  username: string;
  refresh: () => Promise<void>;
}

export const useGitHubProjects = (): UseGitHubProjectsReturn => {
  const username = getGitHubUsername();
  const [projects, setProjects] = useState<PortfolioProject[]>(() => {
    // Immediate synchronous initialization from cache or fallback to prevent layout flash
    const cached = getCachedProjects(username);
    if (cached && cached.length > 0) {
      return cached;
    }
    return fallbackProjects;
  });

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [syncSource, setSyncSource] = useState<'live' | 'cache' | 'fallback'>(() => {
    const cached = getCachedProjects(username);
    return cached && cached.length > 0 ? 'cache' : 'fallback';
  });

  const isMountedRef = useRef<boolean>(true);

  const loadProjects = useCallback(
    async (forceRefresh = false) => {
      // If we don't have projects at all, set loading
      if (projects.length === 0) {
        setIsLoading(true);
      }
      setIsSyncing(true);
      setError(null);

      try {
        if (forceRefresh) {
          clearProjectsCache();
        } else {
          // Check if valid cache exists
          const cached = getCachedProjects(username);
          if (cached && cached.length > 0) {
            if (isMountedRef.current) {
              setProjects(cached);
              setSyncSource('cache');
              setIsLoading(false);
              setIsSyncing(false);
            }
            return;
          }
        }

        // Fetch fresh repositories from GitHub API
        const rawRepos = await fetchUserRepositories(username);

        // Normalize, enrich, and sort repositories
        const normalized = await processAndSortProjects(rawRepos, username);

        if (normalized.length > 0) {
          // Store to cache
          setCachedProjects(username, normalized);
          if (isMountedRef.current) {
            setProjects(normalized);
            setSyncSource('live');
          }
        } else {
          // If user has zero eligible repos, use curated fallback
          if (isMountedRef.current) {
            setProjects(fallbackProjects);
            setSyncSource('fallback');
          }
        }
      } catch (err: unknown) {
        console.warn('[useGitHubProjects] Sync failed, maintaining cached/curated projects:', err);
        if (isMountedRef.current) {
          const errorMessage = err instanceof Error ? err.message : 'Failed to sync with GitHub';
          setError(errorMessage);

          // Graceful fallback to existing projects
          if (projects.length === 0) {
            setProjects(fallbackProjects);
            setSyncSource('fallback');
          }
        }
      } finally {
        if (isMountedRef.current) {
          setIsLoading(false);
          setIsSyncing(false);
        }
      }
    },
    [username, projects.length]
  );

  useEffect(() => {
    isMountedRef.current = true;
    loadProjects(false);

    return () => {
      isMountedRef.current = false;
    };
  }, [loadProjects]);

  const refresh = useCallback(async () => {
    await loadProjects(true);
  }, [loadProjects]);

  return {
    projects,
    isLoading,
    isSyncing,
    error,
    syncSource,
    username,
    refresh,
  };
};
