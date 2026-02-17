import { useState } from 'react';
import { useInternetIdentity } from '../../hooks/useInternetIdentity';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, AlertCircle, Shield } from 'lucide-react';
import LoginBranding from './LoginBranding';

/**
 * Login page with Internet Identity authentication using gold accent theme, error handling, and state-based login transitions.
 */
export default function LoginView() {
  const { login, loginStatus, loginError } = useInternetIdentity();
  const [localError, setLocalError] = useState<string | null>(null);

  const isLoggingIn = loginStatus === 'logging-in';
  const hasError = loginStatus === 'loginError';

  const handleLogin = async () => {
    setLocalError(null);
    try {
      await login();
    } catch (error: any) {
      console.error('Login error:', error);
      setLocalError(error.message || 'Authentication failed. Please try again.');
    }
  };

  const displayError = localError || (hasError && loginError?.message);

  return (
    <div className="unauth-theme min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-accent/5 p-4">
      <Card className="w-full max-w-md border-primary/20 shadow-2xl">
        <CardHeader className="text-center space-y-8 pb-8">
          <LoginBranding />
          <div>
            <CardTitle className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-primary via-primary/80 to-primary bg-clip-text text-transparent">
              Welcome to Nurox
            </CardTitle>
            <CardDescription className="text-base mt-3">
              Master Your Trading Journey. Your professional trading command center.
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {displayError && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{displayError}</AlertDescription>
            </Alert>
          )}

          <Button
            onClick={handleLogin}
            disabled={isLoggingIn}
            className="w-full h-12 text-base font-semibold bg-primary hover:bg-primary/90 transition-all"
            size="lg"
          >
            {isLoggingIn ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Connecting...
              </>
            ) : (
              <>
                <Shield className="mr-2 h-5 w-5" />
                Sign In with Internet Identity
              </>
            )}
          </Button>

          <div className="text-center text-xs text-muted-foreground space-y-2 pt-2">
            <p>Secure authentication powered by Internet Computer</p>
            <p className="text-[10px]">
              Your identity is cryptographically secured and never shared with third parties
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
