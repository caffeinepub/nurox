# Specification

## Summary
**Goal:** Remove the infinite “Initializing…” startup hang so the app reliably reaches Login or the authenticated UI, and provide a clear recovery path when initialization fails.

**Planned changes:**
- Rebuild the startup/authenticated gate so no blocking work can keep the UI stuck on “Initializing…”, and ensure the app renders Login or the app shell quickly.
- Add a new non-blocking actor hook (e.g., `useSafeActor`) and migrate app usage away from the immutable `useActor` so actor creation cannot hang for normal users.
- Gate any admin-only initialization behind a present, non-empty `caffeineAdminToken`, and ensure failures are caught and shown as non-blocking warnings/errors.
- Add initialization timeout handling (e.g., ~15s) and show an English error screen that indicates whether actor initialization or profile loading failed, with a Retry action that re-attempts without a hard refresh.
- Ensure Internet Identity provider URL is available at runtime by setting `window.process.env.II_URL` in `frontend/index.html` to `https://identity.ic0.app/#authorize`.
- Apply a consistent visual theme across login/loading/error screens (dark graphite base, warm neutral surfaces, neon-lime accent; avoid blue/purple), matching the rest of the app’s typography and spacing.

**User-visible outcome:** On a fresh load, the app reaches Login or the authenticated UI without an indefinite spinner; if startup fails or times out, users see a clear English error message and can tap Retry to recover.
