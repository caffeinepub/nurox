import type { Trade, Violation, WinLossResult } from '../backend';
import type { TradeFormData } from './types';
import { calculateRiskAmount, calculateRR } from '../utils/tradingCalculations';

/**
 * Maps form data to backend Trade type with proper field handling.
 * Ensures win/loss result and profit/loss amount are correctly signed.
 */
export function mapFormDataToTrade(formData: TradeFormData, existingId?: string, screenshotUrl?: string): Trade {
  const riskAmount = calculateRiskAmount(formData.accountBalance, formData.riskPercent);
  const rr = calculateRR(formData.entryPrice, formData.stopLoss, formData.takeProfit);
  const stopDistance = Math.abs(formData.entryPrice - formData.stopLoss);

  const violations: Violation[] = [];
  if (!formData.structureBreakConfirmed) {
    violations.push({
      rule: 'Structure Break',
      description: 'Structure break not confirmed',
      timestamp: BigInt(Date.now()) * BigInt(1_000_000),
    });
  }
  if (!formData.liquiditySweepConfirmed) {
    violations.push({
      rule: 'Liquidity Sweep',
      description: 'Liquidity sweep not confirmed',
      timestamp: BigInt(Date.now()) * BigInt(1_000_000),
    });
  }
  if (!formData.riskRespected) {
    violations.push({
      rule: 'Risk Management',
      description: 'Risk parameters not respected',
      timestamp: BigInt(Date.now()) * BigInt(1_000_000),
    });
  }
  if (!formData.noEmotionalEntry) {
    violations.push({
      rule: 'Emotional Control',
      description: 'Emotional entry detected',
      timestamp: BigInt(Date.now()) * BigInt(1_000_000),
    });
  }

  const disciplineScore = ((4 - violations.length) / 4) * 100;

  const winLossResult: WinLossResult = formData.winLossResult !== undefined ? formData.winLossResult : ('win' as WinLossResult);

  let profitLossAmount = formData.profitLossAmount || 0;
  if (winLossResult === 'loss' && profitLossAmount > 0) {
    profitLossAmount = -profitLossAmount;
  } else if (winLossResult === 'win' && profitLossAmount < 0) {
    profitLossAmount = Math.abs(profitLossAmount);
  }

  return {
    id: existingId || `trade_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    entryTimestamp: BigInt(formData.date.getTime()) * BigInt(1_000_000),
    exitTimestamp: undefined,
    pair: formData.pair,
    direction: formData.direction,
    entryType: formData.strategy,
    riskReward: rr,
    resultPips: undefined,
    resultRR: undefined,
    accountSize: formData.accountBalance,
    riskAmount,
    positionSize: formData.lotSize,
    stopLossSize: stopDistance,
    positionSizeMethod: 'Manual',
    positionSizeError: false,
    rewardExpectation: rr * riskAmount,
    rewardReached: false,
    liquiditySweepConfirmed: formData.liquiditySweepConfirmed,
    structureBreakConfirmed: formData.structureBreakConfirmed,
    newsSusceptibility: false,
    emotions: `Before: ${formData.emotionBefore} | After: ${formData.emotionAfter}`,
    disciplineScore,
    violations,
    isScreenshot: !!screenshotUrl,
    screenshotUrl,
    entryPrice: formData.entryPrice,
    stopLossPrice: formData.stopLoss,
    takeProfitPrice: formData.takeProfit,
    grade: formData.tradeGrade,
    winLossResult,
    profitLossAmount,
  };
}
