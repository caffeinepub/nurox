/**
 * Extracts a readable error message from an unknown error value.
 * Handles Error objects, strings, backend traps, nested causes, and other thrown values.
 */
export function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    // Check for nested cause
    if (error.cause) {
      const causeMessage = getErrorMessage(error.cause);
      return `${error.message} (Cause: ${causeMessage})`;
    }
    return error.message;
  }
  
  if (typeof error === 'string') {
    return error;
  }
  
  if (error && typeof error === 'object') {
    // Handle objects with message property
    if ('message' in error && typeof error.message === 'string') {
      return error.message;
    }
    
    // Handle backend error objects (e.g., from Debug.trap)
    if ('error' in error && typeof error.error === 'string') {
      return error.error;
    }
    
    // Handle rejection objects
    if ('reject_message' in error && typeof error.reject_message === 'string') {
      return error.reject_message;
    }

    // Handle reject_code with message
    if ('reject_code' in error && 'reject_message' in error) {
      return `Error ${error.reject_code}: ${error.reject_message}`;
    }
    
    // Fallback to JSON representation
    try {
      const jsonStr = JSON.stringify(error);
      // If JSON is too generic, return a better message
      if (jsonStr === '{}' || jsonStr === '[]') {
        return 'An unknown error occurred';
      }
      return jsonStr;
    } catch {
      return 'An unknown error occurred';
    }
  }
  
  return 'An unknown error occurred';
}
