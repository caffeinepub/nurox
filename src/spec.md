# Specification

## Summary
**Goal:** Eliminate the recurring “Backend Service Unavailable / Backend canister is stopped (Reject code: 5)” failure by cleanly rebuilding/redeploying the Motoko backend canister and improving the frontend’s startup recovery behavior so users can reliably reach login.

**Planned changes:**
- Clean rebuild and redeploy the single Motoko backend actor (`backend/main.mo`) to ensure it initializes correctly and responds reliably after deployment.
- Ensure `healthCheck()` consistently returns `true` during normal use post-deploy, and explicitly reset state if a state-breaking change is required for a clean rebuild.
- Add frontend automatic retry with backoff (bounded max duration) on initial startup when the backend is temporarily unavailable (e.g., reject code 5/canister stopped) before showing the terminal error screen.
- Update the “Retry Connection” action on the startup error screen to fully re-initialize startup (fresh actor initialization + profile refetch) without requiring a full page reload, and avoid indefinite loading states.

**User-visible outcome:** Opening the site no longer immediately fails with a canister-stopped error under normal conditions; the app retries briefly if the backend is temporarily unavailable, and “Retry Connection” reliably recovers startup and proceeds to the login flow without manual refreshes.
