import { QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from 'next-themes';
import { Toaster } from '@/components/ui/sonner';
import { useInternetIdentity } from './hooks/useInternetIdentity';
import { createAppQueryClient } from './app/queryClient';
import AuthenticatedApp from './app/AuthenticatedApp';
import LoginView from './components/auth/LoginView';
import { Loader2 } from 'lucide-react';

const queryClient = createAppQueryClient();

/**
 * Root application component with authentication gate that shows LoginView when unauthenticated and AuthenticatedApp when authenticated; identity initialization is non-blocking with a simple loading state using gold accent theme for unauthenticated screens.
 */
export default function App() {
  const { identity, isInitializing } = useInternetIdentity();
  const isAuthenticated = !!identity;

  // Show minimal loading only during initial identity check
  if (isInitializing) {
    return (
      <div className="unauth-theme min-h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto" />
          <p className="text-sm text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
      <QueryClientProvider client={queryClient}>
        {isAuthenticated ? <AuthenticatedApp /> : <LoginView />}
        <Toaster />
      </QueryClientProvider>
    </ThemeProvider>
  );
}
