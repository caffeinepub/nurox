import { RouterProvider } from '@tanstack/react-router';
import { Loader2 } from 'lucide-react';
import { appRouter } from './router';
import { useSaveCallerUserProfile } from '../hooks/useQueries';
import { useStartupGate } from '../hooks/useStartupGate';
import ProfileSetupDialog from '../components/auth/ProfileSetupDialog';
import StartupErrorScreen from '../components/startup/StartupErrorScreen';
import AppErrorBoundary from '../components/startup/AppErrorBoundary';
import { classifyStartupError } from '../utils/startupErrorClassification';

/**
 * Authenticated application shell using startup gate for orchestrated initialization with timeout protection, automatic retry/backoff for backend unavailable errors, improved error classification, and manual retry support that fully reinitializes actor and profile without page refresh; applies gold accent theme to startup gating screens.
 */
export default function AuthenticatedApp() {
  const { status, error, retry } = useStartupGate();
  const saveProfile = useSaveCallerUserProfile();

  // Loading state
  if (status === 'loading') {
    return (
      <div className="unauth-theme min-h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto" />
          <p className="text-sm text-muted-foreground">Initializing...</p>
        </div>
      </div>
    );
  }

  // Error states
  if (status === 'timeout' || status === 'connection-error' || status === 'profile-error') {
    const classified = classifyStartupError(
      error,
      status === 'profile-error' ? 'profile' : undefined
    );

    return (
      <div className="unauth-theme">
        <StartupErrorScreen
          title={classified.title}
          description={classified.description}
          technicalDetails={classified.technicalDetails}
          onRetry={retry}
        />
      </div>
    );
  }

  // Profile setup needed
  if (status === 'setup-needed') {
    return (
      <AppErrorBoundary>
        <div className="unauth-theme min-h-screen flex items-center justify-center bg-background">
          <ProfileSetupDialog
            open={true}
            onSave={async (name) => {
              await saveProfile.mutateAsync({ name });
            }}
          />
        </div>
      </AppErrorBoundary>
    );
  }

  // Ready - render app
  return (
    <AppErrorBoundary>
      <RouterProvider router={appRouter} />
    </AppErrorBoundary>
  );
}
