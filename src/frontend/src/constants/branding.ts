/**
 * Centralized branding asset paths for the Nurox application.
 * All logo and icon references should use these constants.
 */

export const BRANDING = {
  // Main logo (new yellow X NUROX design)
  logo: '/assets/generated/nurox-logo.dim_1024x1024.png',
  
  // Favicon variants
  favicon16: '/assets/generated/nurox-favicon-16.dim_16x16.png',
  favicon32: '/assets/generated/nurox-favicon-32.dim_32x32.png',
  
  // App icons for PWA/installable
  appIcon192: '/assets/generated/nurox-app-icon-192.dim_192x192.png',
  appIcon512: '/assets/generated/nurox-app-icon-512.dim_512x512.png',
  
  // App name and tagline
  appName: 'NUROX',
  tagline: 'Beyond the chart',
} as const;
