import { AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useState } from 'react';

interface StartupErrorScreenProps {
  title?: string;
  description?: string;
  technicalDetails?: string;
  onRetry?: () => Promise<void> | void;
}

/**
 * Full-screen error component with structured error display (title, description, technical details) and async retry action that attempts recovery without page reload; supports backend unavailable/stopped error differentiation and uses gold accent theme for retry button.
 */
export default function StartupErrorScreen({ 
  title = 'Initialization Failed',
  description = 'The application failed to initialize properly. Please try again.',
  technicalDetails,
  onRetry 
}: StartupErrorScreenProps) {
  const [isRetrying, setIsRetrying] = useState(false);

  const handleRetry = async () => {
    if (isRetrying) return;
    
    setIsRetrying(true);
    try {
      if (onRetry) {
        await onRetry();
        // Give the retry a moment to take effect
        await new Promise(resolve => setTimeout(resolve, 500));
      } else {
        window.location.reload();
      }
    } catch (error) {
      console.error('Retry failed:', error);
    } finally {
      // Reset retry state after a delay
      setTimeout(() => setIsRetrying(false), 2000);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="flex justify-center">
          <div className="h-16 w-16 rounded-full bg-destructive/10 flex items-center justify-center">
            <AlertCircle className="h-8 w-8 text-destructive" />
          </div>
        </div>
        
        <div className="space-y-2">
          <h1 className="text-2xl font-bold text-foreground">
            {title}
          </h1>
          <p className="text-muted-foreground">
            {description}
          </p>
        </div>

        {technicalDetails && (
          <Alert variant="destructive" className="text-left">
            <AlertDescription className="text-xs font-mono break-all whitespace-pre-wrap">
              {technicalDetails}
            </AlertDescription>
          </Alert>
        )}

        <div className="space-y-3">
          <Button 
            onClick={handleRetry}
            disabled={isRetrying}
            className="w-full bg-primary hover:bg-primary/90"
            size="lg"
          >
            {isRetrying ? (
              <>
                <RefreshCw className="mr-2 h-5 w-5 animate-spin" />
                Retrying...
              </>
            ) : (
              <>
                <RefreshCw className="mr-2 h-5 w-5" />
                Retry Connection
              </>
            )}
          </Button>
          
          <div className="text-xs text-muted-foreground space-y-1">
            <p className="font-medium">Troubleshooting tips:</p>
            <ul className="text-left list-disc list-inside space-y-1">
              <li>Check your internet connection</li>
              <li>Verify the Internet Computer network is accessible</li>
              <li>Clear your browser cache and cookies</li>
              <li>Try a different browser or incognito mode</li>
              <li>Disable browser extensions temporarily</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
