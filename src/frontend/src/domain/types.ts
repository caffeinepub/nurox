import type { TradeView, Trade as BackendTrade, Violation } from '../backend';

export type Direction = 'Buy' | 'Sell';
export type Session = 'Asia' | 'London' | 'New York';
export type Timeframe = 'M1' | 'M5' | 'M15' | 'M30' | 'H1' | 'H4' | 'D1' | 'W1';

export interface UITrade extends TradeView {
  tags?: string[];
  notes?: string;
  profitLoss?: number;
  balanceAfter?: number;
  percentGainLoss?: number;
}

export interface TradeFormData {
  date: Date;
  pair: string;
  direction: Direction;
  entryPrice: number;
  stopLoss: number;
  takeProfit: number;
  lotSize: number;
  riskPercent: number;
  accountBalance: number;
  strategy: string;
  timeframe: Timeframe;
  session: Session;
  emotionBefore: string;
  emotionAfter: string;
  notes: string;
  screenshot?: File;
  structureBreakConfirmed: boolean;
  liquiditySweepConfirmed: boolean;
  riskRespected: boolean;
  noEmotionalEntry: boolean;
}

export interface PerformanceMetrics {
  totalTrades: number;
  winRate: number;
  lossRate: number;
  netProfitLoss: number;
  profitFactor: number;
  expectancy: number;
  averageRR: number;
  maxDrawdown: number;
  currentStreak: { type: 'win' | 'loss'; count: number };
  bestTrade: number;
  worstTrade: number;
  riskConsistencyScore: number;
  disciplineScore: number;
}

export interface EquityPoint {
  date: Date;
  balance: number;
}

export interface MonthlyPerformance {
  month: string;
  profit: number;
  trades: number;
}

export interface PairDistribution {
  pair: string;
  trades: number;
  profit: number;
}

export interface SessionPerformance {
  session: Session;
  trades: number;
  winRate: number;
  profit: number;
}
