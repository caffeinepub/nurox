import { QueryClient } from '@tanstack/react-query';

/**
 * Centralized QueryClient configuration for the entire application.
 * Provides consistent caching and refetch behavior across all queries.
 */
export function createAppQueryClient(): QueryClient {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 1000 * 60,
        refetchOnWindowFocus: false,
        retry: 2,
      },
      mutations: {
        retry: false,
      },
    },
  });
}
