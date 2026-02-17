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
    const profitText = isFinite(metrics.netProfitLoss) ? metrics.netProfitLoss.toFixed(2) : '0.00';
    return `Your net profit/loss is ${profitText} pips. ${metrics.netProfitLoss > 0 ? 'Great job!' : 'Keep working on your strategy.'}`;
  }

  if (lowerQuery.includes('best trade')) {
    const bestText = isFinite(metrics.bestTrade) ? metrics.bestTrade.toFixed(2) : '0.00';
    return `Your best trade was ${bestText} pips.`;
  }

  if (lowerQuery.includes('worst trade')) {
    const worstText = isFinite(metrics.worstTrade) ? metrics.worstTrade.toFixed(2) : '0.00';
    return `Your worst trade was ${worstText} pips.`;
  }

  if (lowerQuery.includes('discipline') || lowerQuery.includes('score')) {
    const disciplineText = isFinite(metrics.disciplineScore) ? metrics.disciplineScore.toFixed(2) : '0.00';
    return `Your discipline score is ${disciplineText}%. ${metrics.disciplineScore >= 80 ? 'Excellent discipline!' : 'Focus on following your rules consistently.'}`;
  }

  if (lowerQuery.includes('streak')) {
    return `You are currently on a ${metrics.currentStreak.count} ${metrics.currentStreak.type} streak.`;
  }

  if (lowerQuery.includes('drawdown')) {
    const drawdownText = isFinite(metrics.maxDrawdown) ? metrics.maxDrawdown.toFixed(2) : '0.00';
    return `Your maximum drawdown is ${drawdownText}%.`;
  }

  if (lowerQuery.includes('expectancy')) {
    const expectancyText = isFinite(metrics.expectancy) ? metrics.expectancy.toFixed(2) : '0.00';
    return `Your expectancy is ${expectancyText} pips per trade.`;
  }

  if (lowerQuery.includes('profit factor')) {
    const pfText = metrics.profitFactor === Infinity ? 'infinite (no losses)' : isFinite(metrics.profitFactor) ? metrics.profitFactor.toFixed(2) : 'N/A';
    return `Your profit factor is ${pfText}.`;
  }

  if (lowerQuery.includes('win loss ratio') || lowerQuery.includes('w/l ratio')) {
    const ratioText = metrics.winLossRatio === Infinity ? 'infinite (no losses)' : isFinite(metrics.winLossRatio) ? metrics.winLossRatio.toFixed(2) : 'N/A';
    return `Your win/loss ratio is ${ratioText} (${metrics.totalWins} wins / ${metrics.totalLosses} losses).`;
  }

  if (lowerQuery.includes('help') || lowerQuery.includes('what can you do')) {
    return 'I can answer questions about your trading stats. Try asking: "What is my win rate?", "How many trades?", "What is my profit?", "Best trade?", "Discipline score?", "Current streak?", "Win/loss ratio?", etc.';
  }

  return "I'm not sure how to answer that. Try asking about your win rate, total trades, profit/loss, best/worst trade, discipline score, win/loss ratio, or current streak. Type 'help' for more options.";
}
