# Specification

## Summary
**Goal:** Deliver the initial Nurox trading journal + analytics command center with Internet Identity login, per-user persistence, premium black/gold UI theme, and core trading workflows (journal, dashboard, tools, settings, exports, and rule-based chatbot).

**Planned changes:**
- Add Internet Identity authentication with gated routing (sign-in required; redirect to dashboard) plus sign-out.
- Build a single Motoko actor backend with principal-scoped storage for trades, settings, and derived metadata; expose CRUD for trades and read/update for settings.
- Set up a modular frontend structure separating UI components, domain types, backend/actor API layer, and pure calculation/analytics utility modules.
- Apply a premium high-contrast black-and-gold terminal-style theme (desktop-first, tablet compatible) across login, shell, and pages.
- Integrate the provided Nurox logo in the app shell (login/header) and include generated favicon/app icon assets as static files.
- Implement the Advanced Trading Journal:
  - Trade entry form with all specified fields, screenshot upload, pre-save discipline checklist, and validation
  - Edit/delete trades with persistence
  - Sorting, filtering, search, tagging, and rule-violation highlighting
- Implement trading calculation utilities (pure functions) for: risk amount, stop distance, RR ratio, profit/loss, balance after trade, % gain/loss; enforce lot size formula: `Lot Size = Risk Amount / (Stop Distance × Pip Value)`; store key derived values on save.
- Build the Main Dashboard KPIs + charts: equity curve (line), monthly performance (bar), pair distribution (pie), session performance (Asia/London/New York).
- Implement the Performance Analytics Engine for global stats and breakdowns by strategy/session/timeframe, including max drawdown, streaks, and frequency per week/month.
- Add dedicated Risk & Position Tools pages/panels: lot size calculator, risk % calculator, fixed amount risk tool, pip calculator, compounding growth simulator, drawdown recovery calculator, risk of ruin calculator (usable without saving trades).
- Add Settings UI + persistence for default account size, default risk %, base currency, theme toggle, and strategy presets; defaults prefill journal/tool inputs where relevant.
- Add a deterministic, rule-based chatbot panel that answers a small set of stat questions by reading current computed analytics (no external AI).
- Add CSV export from the journal, respecting current filters/search when applicable and including relevant fields + key derived metrics in a consistent column order.

**User-visible outcome:** Users can sign in with Internet Identity to access a black/gold Nurox dashboard, log and manage trades (with screenshots, tags, rule tracking), view KPIs and charts, use risk tools and settings, chat with a simple stats bot, and export their journal to CSV—all saved per user across devices.
