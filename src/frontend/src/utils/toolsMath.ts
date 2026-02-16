export function calculateRiskPercent(accountSize: number, riskAmount: number): number {
  if (accountSize === 0) return 0;
  return (riskAmount / accountSize) * 100;
}

export function calculateCompoundGrowth(
  initialBalance: number,
  monthlyReturn: number,
  months: number
): { month: number; balance: number }[] {
  const results = [{ month: 0, balance: initialBalance }];
  let balance = initialBalance;

  for (let i = 1; i <= months; i++) {
    balance = balance * (1 + monthlyReturn / 100);
    results.push({ month: i, balance });
  }

  return results;
}

export function calculateDrawdownRecovery(drawdownPercent: number): number {
  if (drawdownPercent >= 100) return Infinity;
  return (drawdownPercent / (100 - drawdownPercent)) * 100;
}

export function calculateRiskOfRuin(
  winRate: number,
  avgWin: number,
  avgLoss: number,
  riskPerTrade: number
): number {
  if (winRate >= 100 || riskPerTrade >= 100) return 0;
  if (winRate <= 0) return 100;

  const lossRate = 100 - winRate;
  const payoffRatio = avgWin / avgLoss;
  
  // Simplified risk of ruin calculation
  const p = winRate / 100;
  const q = lossRate / 100;
  const a = payoffRatio;
  
  if (p * a === q) return 50; // Break-even scenario
  
  const riskOfRuin = Math.pow((q / (p * a)), (100 / riskPerTrade));
  return Math.min(100, riskOfRuin * 100);
}
