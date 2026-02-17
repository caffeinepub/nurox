import { useInternetIdentity } from './useInternetIdentity';
import { useQuery } from '@tanstack/react-query';
import { useState, useCallback } from 'react';
import { type backendInterface } from '../backend';
import { createActorWithConfig } from '../config';
import { getSecretParameter } from '../utils/urlParams';

const ACTOR_QUERY_KEY = 'safe-actor';
const ACTOR_INIT_TIMEOUT = 10000; // 10 seconds for actor creation

export interface SafeActorState {
  actor: backendInterface | null;
  isLoading: boolean;
  error: Error | null;
  adminInitWarning: string | null;
  retry: () => void;
}

/**
 * Safe actor hook with bounded initialization timeout, deterministic retry that resets all timeout/error state, and proper error surfacing that prevents infinite loading states by enforcing timeouts and exposing all error conditions.
 */
export function useSafeActor(): SafeActorState {
  const { identity } = useInternetIdentity();
  const [retryCount, setRetryCount] = useState(0);
  const [adminInitWarning, setAdminInitWarning] = useState<string | null>(null);

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
              setAdminInitWarning(adminError.message || 'Admin initialization failed');
            }
          }
          
          return actor;
        })();

        return await Promise.race([actorPromise, timeoutPromise]);
      } catch (error: any) {
        console.error('Actor creation failed:', error);
        throw error;
      }
    },
    staleTime: Infinity,
    retry: false,
    enabled: true,
  });

  const retry = useCallback(() => {
    setRetryCount(prev => prev + 1);
    setAdminInitWarning(null);
  }, []);

  return {
    actor: actorQuery.data || null,
    isLoading: actorQuery.isLoading || actorQuery.isFetching,
    error: actorQuery.error as Error | null,
    adminInitWarning,
    retry,
  };
}
