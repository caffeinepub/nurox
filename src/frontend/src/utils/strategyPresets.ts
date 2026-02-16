/**
 * Parses a newline-delimited strategy presets string into a clean, de-duplicated list.
 * Trims each line, removes empty lines, and de-duplicates entries (case-sensitive).
 * 
 * @param presetsText - The raw strategy presets text from settings
 * @returns Array of unique, trimmed strategy names
 */
export function parseStrategyPresets(presetsText: string): string[] {
  if (!presetsText || presetsText.trim() === '') {
    return [];
  }

  const lines = presetsText.split('\n');
  const trimmedLines = lines.map(line => line.trim()).filter(line => line.length > 0);
  
  // De-duplicate using Set (case-sensitive)
  const uniqueStrategies = Array.from(new Set(trimmedLines));
  
  return uniqueStrategies;
}
