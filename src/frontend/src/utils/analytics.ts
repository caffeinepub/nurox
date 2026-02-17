import type { Trade } from '../backend';
import type { PerformanceMetrics, EquityPoint } from '../domain/types';

/**
 * Calculates performance metrics from trades using profitLossAmount.
 * Handles edge cases (0 trades, no completed outcomes) to prevent NaN/Infinity.
 */
export function calculatePerformanceMetrics(trades: Trade[]): PerformanceMetrics {
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
      totalWins: 0,
      totalLosses: 0,
      totalProfit: 0,
      totalLoss: 0,
      winLossRatio: 0,
    };
  }

  const completedTrades = trades.filter((t) => t.profitLossAmount !== undefined && t.profitLossAmount !== 0);
  const wins = completedTrades.filter((t) => t.profitLossAmount > 0);
  const losses = completedTrades.filter((t) => t.profitLossAmount < 0);

  const totalTrades = completedTrades.length;
  const totalWins = wins.length;
  const totalLosses = losses.length;
  const winRate = totalTrades > 0 ? (wins.length / totalTrades) * 100 : 0;
  const lossRate = 100 - winRate;

  const totalProfit = wins.reduce((sum, t) => sum + t.profitLossAmount, 0);
  const totalLoss = Math.abs(losses.reduce((sum, t) => sum + t.profitLossAmount, 0));
  const netProfitLoss = totalProfit - totalLoss;

  const profitFactor = totalLoss > 0 ? totalProfit / totalLoss : totalProfit > 0 ? Infinity : 0;

  const avgWin = wins.length > 0 ? totalProfit / wins.length : 0;
  const avgLoss = losses.length > 0 ? totalLoss / losses.length : 0;
  const expectancy = (winRate / 100) * avgWin - (lossRate / 100) * avgLoss;

  const averageRR = trades.reduce((sum, t) => sum + (t.riskReward || 0), 0) / (trades.length || 1);

  const equity = calculateEquityCurve(trades);
  const maxDrawdown = calculateMaxDrawdown(equity);

  const currentStreak = calculateCurrentStreak(completedTrades);

  const bestTrade = Math.max(...completedTrades.map((t) => t.profitLossAmount), 0);
  const worstTrade = Math.min(...completedTrades.map((t) => t.profitLossAmount), 0);

  const riskConsistencyScore = calculateRiskConsistency(trades);
  const disciplineScore = trades.reduce((sum, t) => sum + t.disciplineScore, 0) / (trades.length || 1);

  const winLossRatio = totalLosses > 0 ? totalWins / totalLosses : totalWins > 0 ? Infinity : 0;

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
    totalWins,
    totalLosses,
    totalProfit,
    totalLoss,
    winLossRatio,
  };
}

export function calculateEquityCurve(trades: Trade[]): EquityPoint[] {
  if (trades.length === 0) {
    return [{ date: new Date(), balance: 10000 }];
  }

  const sortedTrades = [...trades].sort((a, b) => Number(a.entryTimestamp - b.entryTimestamp));
  const equity: EquityPoint[] = [];
  let balance = sortedTrades[0]?.accountSize || 10000;

  equity.push({ date: new Date(), balance });

  sortedTrades.forEach((trade) => {
    if (trade.profitLossAmount !== undefined && trade.profitLossAmount !== 0) {
      balance += trade.profitLossAmount;
      equity.push({
        date: new Date(Number(trade.entryTimestamp) / 1_000_000),
        balance,
      });
    }
  });

  return equity;
}

export function calculateMaxDrawdown(equity: EquityPoint[]): number {
  if (equity.length === 0) return 0;

  let maxDrawdown = 0;
  let peak = equity[0]?.balance || 0;

  equity.forEach((point) => {
    if (point.balance > peak) {
      peak = point.balance;
    }
    if (peak > 0) {
      const drawdown = ((peak - point.balance) / peak) * 100;
      if (drawdown > maxDrawdown) {
        maxDrawdown = drawdown;
      }
    }
  });

  return maxDrawdown;
}

function calculateCurrentStreak(trades: Trade[]): { type: 'win' | 'loss'; count: number } {
  if (trades.length === 0) return { type: 'win', count: 0 };

  const sorted = [...trades].sort((a, b) => Number(b.entryTimestamp - a.entryTimestamp));
  const lastResult = sorted[0].profitLossAmount > 0 ? 'win' : 'loss';
  let count = 0;

  for (const trade of sorted) {
    const isWin = trade.profitLossAmount > 0;
    if ((lastResult === 'win' && isWin) || (lastResult === 'loss' && !isWin)) {
      count++;
    } else {
      break;
    }
  }

  return { type: lastResult, count };
}

function calculateRiskConsistency(trades: Trade[]): number {
  if (trades.length === 0) return 100;

  const riskAmounts = trades.map((t) => t.riskAmount);
  const avgRisk = riskAmounts.reduce((sum, r) => sum + r, 0) / (riskAmounts.length || 1);

  if (avgRisk === 0) return 100;

  const variance = riskAmounts.reduce((sum, r) => sum + Math.pow(r - avgRisk, 2), 0) / (riskAmounts.length || 1);
  const stdDev = Math.sqrt(variance);

  const coefficientOfVariation = (stdDev / avgRisk) * 100;
  return Math.max(0, 100 - coefficientOfVariation);
}
