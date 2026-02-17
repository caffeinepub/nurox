import { useEffect, useState, useCallback, useRef } from 'react';
import { useSafeActor } from './useSafeActor';
import { useGetCallerUserProfile } from './useQueries';

const STARTUP_TIMEOUT = 20000; // 20 seconds (increased to account for auto-retries)

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
  retry: () => Promise<void>;
}

/**
 * Startup gate with improved retry logic that resets timeout timer on retry, always re-attempts both actor initialization and profile loading, and ensures forward-moving sequence with clear terminal states without remaining in loading indefinitely.
 */
export function useStartupGate(): StartupGateState {
  const { actor, isLoading: actorLoading, error: actorError, retry: retryActor } = useSafeActor();
  const { data: userProfile, isLoading: profileLoading, error: profileError, refetch: refetchProfile, isFetched: profileFetched } = useGetCallerUserProfile();
  
  const [timeoutReached, setTimeoutReached] = useState(false);
  const startTimeRef = useRef<number>(Date.now());
  const [isRetrying, setIsRetrying] = useState(false);

  // Reset timeout and start time when actor changes or retry is triggered
  useEffect(() => {
    setTimeoutReached(false);
    startTimeRef.current = Date.now();
  }, [actor]);

  // Set timeout based on loading state
  useEffect(() => {
    if ((actorLoading || profileLoading) && !isRetrying) {
      const elapsed = Date.now() - startTimeRef.current;
      const remaining = Math.max(0, STARTUP_TIMEOUT - elapsed);
      
      if (remaining === 0) {
        setTimeoutReached(true);
        return;
      }
      
      const timer = setTimeout(() => {
        setTimeoutReached(true);
      }, remaining);

      return () => clearTimeout(timer);
    }
  }, [actorLoading, profileLoading, isRetrying]);

  const retry = useCallback(async () => {
    setIsRetrying(true);
    
    // Reset timeout and start time
    setTimeoutReached(false);
    startTimeRef.current = Date.now();
    
    try {
      // Always retry actor first
      retryActor();
      
      // Wait a moment for actor to initialize
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Then refetch profile if we have an actor
      if (actor || profileError) {
        await refetchProfile();
      }
    } finally {
      setIsRetrying(false);
    }
  }, [retryActor, refetchProfile, actor, profileError]);

  // Determine status
  let status: StartupStatus = 'loading';
  let error: Error | null = null;

  // Check timeout first
  if (timeoutReached && (actorLoading || profileLoading)) {
    status = 'timeout';
    error = new Error('Startup timeout: Application took too long to initialize');
  }
  // Check actor error
  else if (actorError) {
    status = 'connection-error';
    error = actorError;
  }
  // Check profile error
  else if (profileError) {
    status = 'profile-error';
    error = profileError as Error;
  }
  // Check if ready
  else if (!actorLoading && !profileLoading && actor && profileFetched) {
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
