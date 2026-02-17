import { useEffect, useState, useCallback } from 'react';
import { useSafeActor } from './useSafeActor';
import { useGetCallerUserProfile } from './useQueries';

const STARTUP_TIMEOUT = 15000; // 15 seconds

export type StartupStatus = 
  | 'loading'
  | 'ready'
  | 'setup-needed'
  | 'connection-error'
  | 'profile-error'
  | 'timeout';

export interface StartupGateState {
  status: StartupStatus;
  error: Error | null;
  retry: () => void;
}

/**
 * Startup gate with health check and profile fetch orchestration that fully resets internal state when actor lifecycle changes and ensures forward-moving sequence with clear terminal states (ready/setup-needed/connection-error/profile-error), never remaining in 'loading' indefinitely.
 */
export function useStartupGate(): StartupGateState {
  const { actor, isLoading: actorLoading, error: actorError, retry: retryActor } = useSafeActor();
  const { data: userProfile, isLoading: profileLoading, error: profileError, refetch: refetchProfile } = useGetCallerUserProfile();
  
  const [timeoutReached, setTimeoutReached] = useState(false);
  const [startTime] = useState(() => Date.now());

  // Reset timeout when actor changes
  useEffect(() => {
    setTimeoutReached(false);
  }, [actor]);

  // Set timeout
  useEffect(() => {
    if (actorLoading || profileLoading) {
      const elapsed = Date.now() - startTime;
      const remaining = Math.max(0, STARTUP_TIMEOUT - elapsed);
      
      const timer = setTimeout(() => {
        setTimeoutReached(true);
      }, remaining);

      return () => clearTimeout(timer);
    }
  }, [actorLoading, profileLoading, startTime]);

  const retry = useCallback(() => {
    setTimeoutReached(false);
    if (actorError) {
      retryActor();
    } else if (profileError) {
      refetchProfile();
    } else {
      retryActor();
    }
  }, [actorError, profileError, retryActor, refetchProfile]);

  // Determine status
  let status: StartupStatus = 'loading';
  let error: Error | null = null;

  if (timeoutReached && (actorLoading || profileLoading)) {
    status = 'timeout';
    error = new Error('Startup timeout: Application took too long to initialize');
  } else if (actorError) {
    status = 'connection-error';
    error = actorError;
  } else if (profileError) {
    status = 'profile-error';
    error = profileError as Error;
  } else if (!actorLoading && !profileLoading && actor) {
    if (userProfile === null) {
      status = 'setup-needed';
    } else {
      status = 'ready';
    }
  }

  return {
    status,
    error,
    retry,
  };
}
