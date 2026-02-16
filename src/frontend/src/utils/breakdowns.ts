import type { TradeView } from '../backend';
import type { MonthlyPerformance, PairDistribution, SessionPerformance } from '../domain/types';

export function calculateMonthlyPerformance(trades: TradeView[]): MonthlyPerformance[] {
  const monthlyMap = new Map<string, { profit: number; trades: number }>();

  trades.forEach(trade => {
    const date = new Date(Number(trade.entryTimestamp) / 1_000_000);
    const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    
    const existing = monthlyMap.get(monthKey) || { profit: 0, trades: 0 };
    monthlyMap.set(monthKey, {
      profit: existing.profit + (trade.resultPips || 0),
      trades: existing.trades + 1,
    });
  });

  return Array.from(monthlyMap.entries())
    .map(([month, data]) => ({
      month,
      profit: data.profit,
      trades: data.trades,
    }))
    .sort((a, b) => a.month.localeCompare(b.month));
}

export function calculatePairDistribution(trades: TradeView[]): PairDistribution[] {
  const pairMap = new Map<string, { trades: number; profit: number }>();

  trades.forEach(trade => {
    const existing = pairMap.get(trade.pair) || { trades: 0, profit: 0 };
    pairMap.set(trade.pair, {
      trades: existing.trades + 1,
      profit: existing.profit + (trade.resultPips || 0),
    });
  });

  return Array.from(pairMap.entries())
    .map(([pair, data]) => ({
      pair,
      trades: data.trades,
      profit: data.profit,
    }))
    .sort((a, b) => b.trades - a.trades);
}

export function calculateSessionPerformance(trades: TradeView[]): SessionPerformance[] {
  const sessions: ('Asia' | 'London' | 'New York')[] = ['Asia', 'London', 'New York'];
  
  return sessions.map(session => {
    const sessionTrades = trades.filter(t => {
      const hour = new Date(Number(t.entryTimestamp) / 1_000_000).getUTCHours();
      if (session === 'Asia') return hour >= 0 && hour < 8;
      if (session === 'London') return hour >= 8 && hour < 16;
      return hour >= 16 && hour < 24;
    });

    const wins = sessionTrades.filter(t => (t.resultPips || 0) > 0).length;
    const winRate = sessionTrades.length > 0 ? (wins / sessionTrades.length) * 100 : 0;
    const profit = sessionTrades.reduce((sum, t) => sum + (t.resultPips || 0), 0);

    return {
      session,
      trades: sessionTrades.length,
      winRate,
      profit,
    };
  });
}
