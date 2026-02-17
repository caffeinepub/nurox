import type { PerformanceMetrics } from '../../domain/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { TrendingUp, TrendingDown, Target, Award, AlertTriangle, Activity, Zap } from 'lucide-react';
import { formatNumber, formatPercent, formatRatio } from '../../utils/format';

interface AnalyticsSummaryPanelProps {
  metrics: PerformanceMetrics;
}

/**
 * Combined analytics summary panel with safe formatting that prevents NaN/Infinity display.
 * All numeric values are validated before rendering to ensure clean, professional output.
 */
export default function AnalyticsSummaryPanel({ metrics }: AnalyticsSummaryPanelProps) {
  return (
    <Card className="border-border/40 bg-card/50 backdrop-blur">
      <CardHeader>
        <CardTitle className="text-xl flex items-center gap-2">
          <Zap className="h-5 w-5 text-yellow-500" />
          Performance Summary
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Win/Loss Overview */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">Total Wins</p>
            <p className="text-2xl font-bold text-green-500">{metrics.totalWins}</p>
          </div>
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">Total Losses</p>
            <p className="text-2xl font-bold text-red-500">{metrics.totalLosses}</p>
          </div>
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">Win/Loss Ratio</p>
            <p className="text-2xl font-bold text-yellow-500">{formatRatio(metrics.winLossRatio)}</p>
          </div>
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">Win Rate</p>
            <p className="text-2xl font-bold text-cyan-500">{formatPercent(metrics.winRate)}</p>
          </div>
        </div>

        <Separator />

        {/* Profit/Loss Breakdown */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground flex items-center gap-1">
              <TrendingUp className="h-3 w-3" />
              Total Profit
            </p>
            <p className="text-xl font-bold text-green-500">+{formatNumber(metrics.totalProfit)} pips</p>
          </div>
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground flex items-center gap-1">
              <TrendingDown className="h-3 w-3" />
              Total Loss
            </p>
            <p className="text-xl font-bold text-red-500">-{formatNumber(metrics.totalLoss)} pips</p>
          </div>
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground flex items-center gap-1">
              <Activity className="h-3 w-3" />
              Net Result
            </p>
            <p className={`text-xl font-bold ${metrics.netProfitLoss >= 0 ? 'text-green-500' : 'text-red-500'}`}>
              {metrics.netProfitLoss >= 0 ? '+' : ''}{formatNumber(metrics.netProfitLoss)} pips
            </p>
          </div>
        </div>

        <Separator />

        {/* Key Performance Indicators */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground flex items-center gap-1">
              <Award className="h-3 w-3" />
              Profit Factor
            </p>
            <p className="text-lg font-semibold">{formatRatio(metrics.profitFactor)}</p>
          </div>
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground flex items-center gap-1">
              <Target className="h-3 w-3" />
              Expectancy
            </p>
            <p className="text-lg font-semibold">{formatNumber(metrics.expectancy)} pips</p>
          </div>
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground flex items-center gap-1">
              <Target className="h-3 w-3" />
              Avg RR
            </p>
            <p className="text-lg font-semibold">{formatNumber(metrics.averageRR)}</p>
          </div>
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground flex items-center gap-1">
              <AlertTriangle className="h-3 w-3" />
              Max Drawdown
            </p>
            <p className="text-lg font-semibold text-orange-500">{formatPercent(metrics.maxDrawdown)}</p>
          </div>
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground flex items-center gap-1">
              <Award className="h-3 w-3" />
              Discipline
            </p>
            <p className="text-lg font-semibold">{formatPercent(metrics.disciplineScore)}</p>
          </div>
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground flex items-center gap-1">
              <Activity className="h-3 w-3" />
              Risk Consistency
            </p>
            <p className="text-lg font-semibold">{formatPercent(metrics.riskConsistencyScore)}</p>
          </div>
        </div>

        <Separator />

        {/* Streaks & Extremes */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">Current Streak</p>
            <Badge variant={metrics.currentStreak.type === 'win' ? 'default' : 'destructive'} className="text-sm">
              {metrics.currentStreak.count} {metrics.currentStreak.type}
              {metrics.currentStreak.count !== 1 ? 's' : ''}
            </Badge>
          </div>
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">Best Trade</p>
            <p className="text-lg font-semibold text-green-500">+{formatNumber(metrics.bestTrade)} pips</p>
          </div>
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">Worst Trade</p>
            <p className="text-lg font-semibold text-red-500">{formatNumber(metrics.worstTrade)} pips</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
