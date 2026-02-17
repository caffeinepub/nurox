/**
 * Safe formatting utilities that handle NaN, Infinity, and undefined values gracefully.
 * Prevents broken UI display in analytics and dashboard components.
 */

export function formatCurrency(value: number, currency: string = 'USD'): string {
  if (!isFinite(value)) return 'N/A';
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

export function formatPercent(value: number, decimals: number = 2): string {
  if (!isFinite(value)) return 'N/A';
  return `${value.toFixed(decimals)}%`;
}

export function formatNumber(value: number, decimals: number = 2): string {
  if (!isFinite(value)) return 'N/A';
  return value.toFixed(decimals);
}

export function formatRatio(value: number, decimals: number = 2): string {
  if (value === Infinity) return '∞';
  if (!isFinite(value)) return 'N/A';
  return value.toFixed(decimals);
}

export function formatDate(date: Date | bigint): string {
  const d = typeof date === 'bigint' ? new Date(Number(date) / 1_000_000) : date;
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

export function formatDateTime(date: Date | bigint): string {
  const d = typeof date === 'bigint' ? new Date(Number(date) / 1_000_000) : date;
  return d.toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}
