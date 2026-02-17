import { getErrorMessage } from './getErrorMessage';
import { parseICRejectError, isBackendUnavailableError } from './icRejectParsing';

export type ErrorCategory = 'connection' | 'profile' | 'authorization' | 'timeout' | 'backend-unavailable' | 'unknown';

export interface ClassifiedError {
  category: ErrorCategory;
  title: string;
  description: string;
  technicalDetails?: string;
}

/**
 * Utility that classifies startup errors into categories (connection, profile, authorization, timeout, backend-unavailable, unknown) with structured error information for appropriate UI handling.
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
  const icRejectDetails = parseICRejectError(error);
  const isBackendUnavailable = isBackendUnavailableError(error);

  // Backend unavailable/stopped errors (highest priority)
  if (isBackendUnavailable) {
    return {
      category: 'backend-unavailable',
      title: 'Backend Service Unavailable',
      description: 'The backend service is currently stopped or unavailable. This usually means the canister needs to be restarted. Please wait a moment and try again, or contact support if the issue persists.',
      technicalDetails: icRejectDetails || getErrorMessage(error),
    };
  }

  // Timeout errors
  if (message.includes('timeout')) {
    return {
      category: 'timeout',
      title: 'Connection Timeout',
      description: 'The application took too long to connect. This may be due to network issues or high server load.',
      technicalDetails: icRejectDetails || getErrorMessage(error),
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
      technicalDetails: icRejectDetails || getErrorMessage(error),
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
      technicalDetails: icRejectDetails || getErrorMessage(error),
    };
  }

  // Profile errors
  if (message.includes('profile') || context === 'profile') {
    return {
      category: 'profile',
      title: 'Profile Load Failed',
      description: 'Unable to load your user profile. Your data is safe, but we need to retry the connection.',
      technicalDetails: icRejectDetails || getErrorMessage(error),
    };
  }

  // Default unknown error
  return {
    category: 'unknown',
    title: 'Startup Error',
    description: 'An unexpected error occurred while starting the application. Please try again.',
    technicalDetails: icRejectDetails || getErrorMessage(error),
  };
}
