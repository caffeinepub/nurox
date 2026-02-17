/**
 * Extracts and normalizes Internet Computer replica reject details from unknown error shapes.
 * Returns a user-safe summary string for technical details display.
 */
export function parseICRejectError(error: unknown): string | null {
  if (!error) return null;

  // Handle Error objects
  if (error instanceof Error) {
    const message = error.message;
    
    // Check for reject code patterns
    const rejectCodeMatch = message.match(/reject code (\d+)/i);
    const rejectCode = rejectCodeMatch ? rejectCodeMatch[1] : null;
    
    // Extract reject message if present
    const rejectMessageMatch = message.match(/reject message: (.+?)(?:\n|$)/i);
    const rejectMessage = rejectMessageMatch ? rejectMessageMatch[1] : null;
    
    // Check for common IC error patterns
    const isCanisterStopped = message.toLowerCase().includes('canister is stopped') || 
                              message.toLowerCase().includes('callcontextmanager');
    const isCanisterNotFound = message.toLowerCase().includes('canister') && 
                               message.toLowerCase().includes('not found');
    const isCanisterTrapped = message.toLowerCase().includes('canister trapped') ||
                              message.toLowerCase().includes('canister rejected');
    
    // Build a clear summary
    if (rejectCode === '5' || isCanisterStopped) {
      return `Backend canister is stopped (Reject code: ${rejectCode || '5'}). The service needs to be restarted.`;
    }
    
    if (rejectCode === '3' || isCanisterNotFound) {
      return `Backend canister not found (Reject code: ${rejectCode || '3'}). The service may not be deployed.`;
    }
    
    if (rejectCode === '4' || isCanisterTrapped) {
      return `Backend canister rejected the request (Reject code: ${rejectCode || '4'}). ${rejectMessage || 'Internal error.'}`;
    }
    
    if (rejectCode) {
      return `IC Reject code ${rejectCode}: ${rejectMessage || message}`;
    }
    
    return message;
  }
  
  // Handle structured error objects
  if (error && typeof error === 'object') {
    const err = error as any;
    
    // Check for reject_code property
    if ('reject_code' in err) {
      const code = err.reject_code;
      const message = err.reject_message || err.message || 'Unknown error';
      
      if (code === 5) {
        return `Backend canister is stopped (Reject code: 5). The service needs to be restarted.`;
      }
      
      if (code === 3) {
        return `Backend canister not found (Reject code: 3). The service may not be deployed.`;
      }
      
      if (code === 4) {
        return `Backend canister rejected the request (Reject code: 4). ${message}`;
      }
      
      return `IC Reject code ${code}: ${message}`;
    }
    
    // Check for error_code property (alternative format)
    if ('error_code' in err && 'error_message' in err) {
      return `IC Error ${err.error_code}: ${err.error_message}`;
    }
    
    // Try to extract from nested properties
    if ('message' in err && typeof err.message === 'string') {
      return parseICRejectError(new Error(err.message));
    }
  }
  
  // Handle string errors
  if (typeof error === 'string') {
    return parseICRejectError(new Error(error));
  }
  
  return null;
}

/**
 * Checks if an error is a backend unavailable/stopped error
 */
export function isBackendUnavailableError(error: unknown): boolean {
  if (!error) return false;
  
  const parsed = parseICRejectError(error);
  if (!parsed) return false;
  
  const lowerParsed = parsed.toLowerCase();
  return lowerParsed.includes('canister is stopped') ||
         lowerParsed.includes('reject code: 5') ||
         lowerParsed.includes('reject code 5') ||
         lowerParsed.includes('callcontextmanager') ||
         lowerParsed.includes('canister not found') ||
         lowerParsed.includes('reject code: 3') ||
         lowerParsed.includes('reject code 3');
}
