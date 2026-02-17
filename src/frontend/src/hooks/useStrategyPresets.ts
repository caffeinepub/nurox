import { useMemo } from 'react';
import { parseStrategyPresets } from '../utils/strategyPresets';
import type { Settings } from '../backend';

/**
 * Hook to derive stable strategy presets from settings
 * Memoizes by the raw presets string to prevent unnecessary re-renders
 */
export function useStrategyPresets(settings: Settings | undefined) {
  const presets = useMemo(() => {
    if (!settings) return [];
    return parseStrategyPresets(settings.strategyPresets);
  }, [settings?.strategyPresets]);

  const hasPresets = presets.length > 0;

  return { presets, hasPresets };
}
