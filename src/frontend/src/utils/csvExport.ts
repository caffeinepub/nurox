import type { Trade } from '../backend';
import { formatDate, formatNumber } from './format';

export function generateTradesCSV(trades: Trade[]): string {
  const headers = [
    'ID',
    'Date',
    'Pair',
    'Direction',
    'Entry Type',
    'Account Size',
    'Risk Amount',
    'Position Size',
    'Stop Loss Size',
    'Risk/Reward',
    'Result (Pips)',
    'Result (RR)',
    'Discipline Score',
    'Violations',
    'Emotions',
  ];

  const rows = trades.map(trade => [
    trade.id,
    formatDate(trade.entryTimestamp),
    trade.pair,
    trade.direction,
    trade.entryType,
    formatNumber(trade.accountSize),
    formatNumber(trade.riskAmount),
    formatNumber(trade.positionSize),
    formatNumber(trade.stopLossSize),
    trade.riskReward ? formatNumber(trade.riskReward) : 'N/A',
    trade.resultPips ? formatNumber(trade.resultPips) : 'N/A',
    trade.resultRR ? formatNumber(trade.resultRR) : 'N/A',
    formatNumber(trade.disciplineScore),
    trade.violations.length.toString(),
    escapeCSV(trade.emotions),
  ]);

  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.join(',')),
  ].join('\n');

  return csvContent;
}

function escapeCSV(value: string): string {
  if (value.includes(',') || value.includes('"') || value.includes('\n')) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}

export function downloadCSV(content: string, filename: string): void {
  const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
