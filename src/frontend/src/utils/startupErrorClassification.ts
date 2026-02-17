export type ErrorCategory = 'connection' | 'profile' | 'authorization' | 'timeout' | 'unknown';

export interface ClassifiedError {
  category: ErrorCategory;
  title: string;
  description: string;
  technicalDetails?: string;
}

/**
 * Utility that classifies startup errors into categories (connection, profile, authorization, timeout, unknown) for appropriate UI handling.
 */
export function classifyStartupError(error: Error | null, context?: string): ClassifiedError {
  if (!error) {
    return {
      category: 'unknown',
      title: 'Unknown Error',
      description: 'An unexpected error occurred during startup.',
    };
  }

  const message = error.message.toLowerCase();

  // Timeout errors
  if (message.includes('timeout')) {
    return {
      category: 'timeout',
      title: 'Connection Timeout',
      description: 'The application took too long to connect. This may be due to network issues or high server load.',
      technicalDetails: error.message,
    };
  }

  // Connection/network errors
  if (
    message.includes('network') ||
    message.includes('fetch') ||
    message.includes('connection') ||
    message.includes('actor') ||
    message.includes('canister')
  ) {
    return {
      category: 'connection',
      title: 'Connection Failed',
      description: 'Unable to connect to the backend service. Please check your internet connection and try again.',
      technicalDetails: error.message,
    };
  }

  // Authorization errors
  if (
    message.includes('unauthorized') ||
    message.includes('permission') ||
    message.includes('access denied') ||
    message.includes('authentication')
  ) {
    return {
      category: 'authorization',
      title: 'Authorization Error',
      description: 'There was a problem verifying your identity. Please try logging in again.',
      technicalDetails: error.message,
    };
  }

  // Profile errors
  if (message.includes('profile') || context === 'profile') {
    return {
      category: 'profile',
      title: 'Profile Load Failed',
      description: 'Unable to load your user profile. Your data is safe, but we need to retry the connection.',
      technicalDetails: error.message,
    };
  }

  // Default unknown error
  return {
    category: 'unknown',
    title: 'Startup Error',
    description: 'An unexpected error occurred while starting the application. Please try again.',
    technicalDetails: error.message,
  };
}
