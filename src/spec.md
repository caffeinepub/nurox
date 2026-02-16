# Specification

## Summary
**Goal:** Make the Journal → New Trade “Strategy” dropdown use only the authenticated user’s saved Settings → Strategy Presets, instead of any hardcoded strategy list.

**Planned changes:**
- Load the saved Settings.strategyPresets for the authenticated user and use it as the sole source of Strategy dropdown options in Journal → New Trade (after the user clicks Save Settings).
- Parse the newline-delimited presets string into a cleaned list (trim whitespace, remove empty lines, de-duplicate consistently) before rendering dropdown options.
- Update frontend typing so TradeFormData.strategy supports dynamic preset values (not a fixed hardcoded TypeScript union).
- Handle empty presets by showing no selectable Strategy options and displaying English guidance to add strategies in Settings; prevent adding arbitrary strategies from the Journal form.
- When editing an existing trade, keep displaying the trade’s saved strategy as selected even if it’s not currently in presets (no crash).

**User-visible outcome:** After saving strategy presets in Settings, those preset names appear as the only selectable Strategy options when creating a new trade in the Journal; if no presets are saved, the form instructs the user to add them in Settings and does not allow selecting/creating strategies from the Journal.
