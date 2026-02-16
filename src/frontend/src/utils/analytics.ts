import type { TradeView } from '../backend';
import type { PerformanceMetrics, EquityPoint } from '../domain/types';

export function calculatePerformanceMetrics(trades: TradeView[]): PerformanceMetrics {
  if (trades.length === 0) {
    return {
      totalTrades: 0,
      winRate: 0,
      lossRate: 0,
      netProfitLoss: 0,
      profitFactor: 0,
      expectancy: 0,
      averageRR: 0,
      maxDrawdown: 0,
      currentStreak: { type: 'win', count: 0 },
      bestTrade: 0,
      worstTrade: 0,
      riskConsistencyScore: 0,
      disciplineScore: 0,
    };
  }

  const completedTrades = trades.filter(t => t.resultPips !== undefined);
  const wins = completedTrades.filter(t => (t.resultPips || 0) > 0);
  const losses = completedTrades.filter(t => (t.resultPips || 0) < 0);

  const totalTrades = completedTrades.length;
  const winRate = totalTrades > 0 ? (wins.length / totalTrades) * 100 : 0;
  const lossRate = 100 - winRate;

  const totalProfit = wins.reduce((sum, t) => sum + (t.resultPips || 0), 0);
  const totalLoss = Math.abs(losses.reduce((sum, t) => sum + (t.resultPips || 0), 0));
  const netProfitLoss = totalProfit - totalLoss;

  const profitFactor = totalLoss > 0 ? totalProfit / totalLoss : totalProfit > 0 ? Infinity : 0;

  const avgWin = wins.length > 0 ? totalProfit / wins.length : 0;
  const avgLoss = losses.length > 0 ? totalLoss / losses.length : 0;
  const expectancy = (winRate / 100) * avgWin - (lossRate / 100) * avgLoss;

  const averageRR = trades.reduce((sum, t) => sum + (t.riskReward || 0), 0) / trades.length;

  const equity = calculateEquityCurve(trades);
  const maxDrawdown = calculateMaxDrawdown(equity);

  const currentStreak = calculateCurrentStreak(completedTrades);

  const bestTrade = Math.max(...completedTrades.map(t => t.resultPips || 0), 0);
  const worstTrade = Math.min(...completedTrades.map(t => t.resultPips || 0), 0);

  const riskConsistencyScore = calculateRiskConsistency(trades);
  const disciplineScore = trades.reduce((sum, t) => sum + t.disciplineScore, 0) / trades.length;

  return {
    totalTrades,
    winRate,
    lossRate,
    netProfitLoss,
    profitFactor,
    expectancy,
    averageRR,
    maxDrawdown,
    currentStreak,
    bestTrade,
    worstTrade,
    riskConsistencyScore,
    disciplineScore,
  };
}

export function calculateEquityCurve(trades: TradeView[]): EquityPoint[] {
  const sortedTrades = [...trades].sort((a, b) => Number(a.entryTimestamp - b.entryTimestamp));
  const equity: EquityPoint[] = [];
  let balance = sortedTrades[0]?.accountSize || 10000;

  equity.push({ date: new Date(), balance });

  sortedTrades.forEach(trade => {
    if (trade.resultPips !== undefined) {
      balance += trade.resultPips;
      equity.push({
        date: new Date(Number(trade.entryTimestamp) / 1_000_000),
        balance,
      });
    }
  });

  return equity;
}

export function calculateMaxDrawdown(equity: EquityPoint[]): number {
  let maxDrawdown = 0;
  let peak = equity[0]?.balance || 0;

  equity.forEach(point => {
    if (point.balance > peak) {
      peak = point.balance;
    }
    const drawdown = ((peak - point.balance) / peak) * 100;
    if (drawdown > maxDrawdown) {
      maxDrawdown = drawdown;
    }
  });

  return maxDrawdown;
}

function calculateCurrentStreak(trades: TradeView[]): { type: 'win' | 'loss'; count: number } {
  if (trades.length === 0) return { type: 'win', count: 0 };

  const sorted = [...trades].sort((a, b) => Number(b.entryTimestamp - a.entryTimestamp));
  const lastResult = (sorted[0].resultPips || 0) > 0 ? 'win' : 'loss';
  let count = 0;

  for (const trade of sorted) {
    const isWin = (trade.resultPips || 0) > 0;
    if ((lastResult === 'win' && isWin) || (lastResult === 'loss' && !isWin)) {
      count++;
    } else {
      break;
    }
  }

  return { type: lastResult, count };
}

function calculateRiskConsistency(trades: TradeView[]): number {
  if (trades.length === 0) return 100;
  
  const riskAmounts = trades.map(t => t.riskAmount);
  const avgRisk = riskAmounts.reduce((sum, r) => sum + r, 0) / riskAmounts.length;
  const variance = riskAmounts.reduce((sum, r) => sum + Math.pow(r - avgRisk, 2), 0) / riskAmounts.length;
  const stdDev = Math.sqrt(variance);
  
  const coefficientOfVariation = avgRisk > 0 ? (stdDev / avgRisk) * 100 : 0;
  return Math.max(0, 100 - coefficientOfVariation);
}
