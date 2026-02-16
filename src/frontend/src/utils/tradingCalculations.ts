export function calculateRiskAmount(accountSize: number, riskPercent: number): number {
  return (accountSize * riskPercent) / 100;
}

export function calculateStopDistance(entryPrice: number, stopLoss: number): number {
  return Math.abs(entryPrice - stopLoss);
}

export function calculateLotSize(riskAmount: number, stopDistance: number, pipValue: number): number {
  if (stopDistance === 0 || pipValue === 0) return 0;
  return riskAmount / (stopDistance * pipValue);
}

export function calculateRR(entryPrice: number, stopLoss: number, takeProfit: number): number {
  const risk = Math.abs(entryPrice - stopLoss);
  const reward = Math.abs(takeProfit - entryPrice);
  if (risk === 0) return 0;
  return reward / risk;
}

export function calculateProfitLoss(
  direction: 'Buy' | 'Sell',
  entryPrice: number,
  exitPrice: number,
  lotSize: number,
  pipValue: number
): number {
  const priceDiff = direction === 'Buy' ? exitPrice - entryPrice : entryPrice - exitPrice;
  const pips = priceDiff / pipValue;
  return pips * lotSize * pipValue * 100000; // Standard lot calculation
}

export function calculatePercentGainLoss(profitLoss: number, accountSize: number): number {
  if (accountSize === 0) return 0;
  return (profitLoss / accountSize) * 100;
}

export function calculatePipValue(pair: string, accountCurrency: string = 'USD'): number {
  // Simplified pip value calculation - in production, this would be more sophisticated
  if (pair.includes('JPY')) {
    return 0.01;
  }
  return 0.0001;
}
