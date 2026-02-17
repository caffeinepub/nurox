import { useState } from 'react';
import { BRANDING } from '../../constants/branding';

/**
 * Login branding component with resilient logo rendering and graceful fallback to text mark.
 * Prevents blank screens or crashes when logo assets fail to load.
 */
export default function LoginBranding() {
  const [imageError, setImageError] = useState(false);

  if (imageError) {
    return (
      <div className="flex justify-center">
        <div className="text-center space-y-2">
          <div className="text-6xl font-black bg-gradient-to-r from-yellow-500 via-yellow-400 to-yellow-500 bg-clip-text text-transparent">
            NUROX
          </div>
          <div className="text-xs text-muted-foreground">Trading Journal</div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-center">
      <img
        src={BRANDING.logo}
        alt={`${BRANDING.appName} - ${BRANDING.tagline}`}
        className="h-40 sm:h-48 w-auto object-contain"
        loading="eager"
        decoding="async"
        onError={(e) => {
          console.error('Login logo failed to load:', BRANDING.logo);
          setImageError(true);
        }}
      />
    </div>
  );
}
