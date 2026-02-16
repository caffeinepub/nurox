import type { PerformanceMetrics } from '../domain/types';

export function processChatbotQuery(query: string, metrics: PerformanceMetrics): string {
  const lowerQuery = query.toLowerCase();

  if (lowerQuery.includes('win rate') || lowerQuery.includes('winrate')) {
    return `Your current win rate is ${metrics.winRate.toFixed(2)}% based on ${metrics.totalTrades} trades.`;
  }

  if (lowerQuery.includes('total trades') || lowerQuery.includes('how many trades')) {
    return `You have completed ${metrics.totalTrades} trades in total.`;
  }

  if (lowerQuery.includes('profit') || lowerQuery.includes('p/l') || lowerQuery.includes('pnl')) {
    return `Your net profit/loss is ${metrics.netProfitLoss.toFixed(2)} pips. ${metrics.netProfitLoss > 0 ? 'Great job!' : 'Keep working on your strategy.'}`;
  }

  if (lowerQuery.includes('best trade')) {
    return `Your best trade was ${metrics.bestTrade.toFixed(2)} pips.`;
  }

  if (lowerQuery.includes('worst trade')) {
    return `Your worst trade was ${metrics.worstTrade.toFixed(2)} pips.`;
  }

  if (lowerQuery.includes('discipline') || lowerQuery.includes('score')) {
    return `Your discipline score is ${metrics.disciplineScore.toFixed(2)}%. ${metrics.disciplineScore >= 80 ? 'Excellent discipline!' : 'Focus on following your rules consistently.'}`;
  }

  if (lowerQuery.includes('streak')) {
    return `You are currently on a ${metrics.currentStreak.count} ${metrics.currentStreak.type} streak.`;
  }

  if (lowerQuery.includes('drawdown')) {
    return `Your maximum drawdown is ${metrics.maxDrawdown.toFixed(2)}%.`;
  }

  if (lowerQuery.includes('expectancy')) {
    return `Your expectancy is ${metrics.expectancy.toFixed(2)} pips per trade.`;
  }

  if (lowerQuery.includes('profit factor')) {
    return `Your profit factor is ${metrics.profitFactor === Infinity ? 'infinite (no losses)' : metrics.profitFactor.toFixed(2)}.`;
  }

  if (lowerQuery.includes('help') || lowerQuery.includes('what can you do')) {
    return 'I can answer questions about your trading stats. Try asking: "What is my win rate?", "How many trades?", "What is my profit?", "Best trade?", "Discipline score?", "Current streak?", etc.';
  }

  return "I'm not sure how to answer that. Try asking about your win rate, total trades, profit/loss, best/worst trade, discipline score, or current streak. Type 'help' for more options.";
}
