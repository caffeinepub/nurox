import { useInternetIdentity } from './useInternetIdentity';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useState, useCallback, useEffect } from 'react';
import { type backendInterface } from '../backend';
import { createActorWithConfig } from '../config';
import { getSecretParameter } from '../utils/urlParams';
import { getErrorMessage } from '../utils/getErrorMessage';
import { isBackendUnavailableError } from '../utils/icRejectParsing';

const ACTOR_QUERY_KEY = 'safe-actor';
const ACTOR_INIT_TIMEOUT = 10000; // 10 seconds for actor creation
const MAX_AUTO_RETRIES = 3; // Maximum automatic retry attempts
const RETRY_DELAYS = [1000, 2000, 3000]; // Exponential backoff delays in ms

export interface SafeActorState {
  actor: backendInterface | null;
  isLoading: boolean;
  error: Error | null;
  adminInitWarning: string | null;
  retry: () => void;
}

/**
 * Safe actor hook with bounded initialization timeout, automatic retry/backoff for backend-unavailable errors, deterministic manual retry that resets all state, and proper error surfacing with query invalidation on actor changes.
 */
export function useSafeActor(): SafeActorState {
  const { identity } = useInternetIdentity();
  const [retryCount, setRetryCount] = useState(0);
  const [adminInitWarning, setAdminInitWarning] = useState<string | null>(null);
  const [autoRetryAttempt, setAutoRetryAttempt] = useState(0);
  const queryClient = useQueryClient();

  const actorQuery = useQuery<backendInterface>({
    queryKey: [ACTOR_QUERY_KEY, identity?.getPrincipal().toString(), retryCount],
    queryFn: async () => {
      setAdminInitWarning(null);
      
      const isAuthenticated = !!identity;
      const timeoutPromise = new Promise<never>((_, reject) => {
        setTimeout(() => reject(new Error('Actor initialization timeout')), ACTOR_INIT_TIMEOUT);
      });

      try {
        const actorPromise = (async () => {
          if (!isAuthenticated) {
            return await createActorWithConfig();
          }

          const actorOptions = {
            agentOptions: {
              identity
            }
          };

          const actor = await createActorWithConfig(actorOptions);
          
          // Only attempt admin init if token is present
          const adminToken = getSecretParameter('caffeineAdminToken') || '';
          if (adminToken) {
            try {
              // Give admin init a short timeout - it should not block normal users
              const adminInitPromise = actor._initializeAccessControlWithSecret(adminToken);
              const adminTimeout = new Promise<never>((_, reject) => {
                setTimeout(() => reject(new Error('Admin initialization timeout')), 3000);
              });
              
              await Promise.race([adminInitPromise, adminTimeout]);
            } catch (adminError: any) {
              // Admin init failed - warn but don't block
              console.warn('Admin initialization failed:', adminError);
              setAdminInitWarning(getErrorMessage(adminError));
            }
          }
          
          return actor;
        })();

        return await Promise.race([actorPromise, timeoutPromise]);
      } catch (error: any) {
        console.error('Actor creation failed:', error);
        
        // Check if this is a backend unavailable error and we haven't exceeded retry limit
        if (isBackendUnavailableError(error) && autoRetryAttempt < MAX_AUTO_RETRIES) {
          const delay = RETRY_DELAYS[autoRetryAttempt] || RETRY_DELAYS[RETRY_DELAYS.length - 1];
          console.log(`Backend unavailable, auto-retrying in ${delay}ms (attempt ${autoRetryAttempt + 1}/${MAX_AUTO_RETRIES})`);
          
          // Schedule automatic retry
          await new Promise(resolve => setTimeout(resolve, delay));
          setAutoRetryAttempt(prev => prev + 1);
          
          // Retry by throwing a special error that triggers refetch
          throw new Error('AUTO_RETRY');
        }
        
        // Ensure we throw a proper Error object with the most useful message
        const errorMessage = getErrorMessage(error);
        throw new Error(errorMessage);
      }
    },
    staleTime: Infinity,
    retry: (failureCount, error) => {
      // Only auto-retry for AUTO_RETRY errors
      if (error instanceof Error && error.message === 'AUTO_RETRY') {
        return failureCount < MAX_AUTO_RETRIES;
      }
      return false;
    },
    retryDelay: 0, // We handle delays manually
    enabled: true,
  });

  // Invalidate dependent queries when actor changes
  useEffect(() => {
    if (actorQuery.data) {
      // Actor successfully initialized - invalidate profile and other queries
      queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
      queryClient.invalidateQueries({ queryKey: ['settings'] });
      queryClient.invalidateQueries({ queryKey: ['trades'] });
    }
  }, [actorQuery.data, queryClient]);

  const retry = useCallback(() => {
    // Reset all state for a fresh retry
    setRetryCount(prev => prev + 1);
    setAdminInitWarning(null);
    setAutoRetryAttempt(0); // Reset auto-retry counter
  }, []);

  return {
    actor: actorQuery.data || null,
    isLoading: actorQuery.isLoading || actorQuery.isFetching,
    error: actorQuery.error instanceof Error && actorQuery.error.message === 'AUTO_RETRY' 
      ? null // Don't expose AUTO_RETRY as an error
      : actorQuery.error as Error | null,
    adminInitWarning,
    retry,
  };
}
