import type { PerformanceMetrics } from '../../domain/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, TrendingDown, Target, Award } from 'lucide-react';
import { formatNumber, formatPercent, formatRatio } from '../../utils/format';

interface KpiGridProps {
  metrics: PerformanceMetrics;
}

/**
 * KPI metrics grid with safe formatting that handles NaN/Infinity by displaying 'N/A'
 * where calculations are not meaningful (e.g., division by zero, no data).
 */
export default function KpiGrid({ metrics }: KpiGridProps) {
  const kpis = [
    {
      title: 'Total Trades',
      value: metrics.totalTrades.toString(),
      icon: Target,
      color: 'text-blue-500',
    },
    {
      title: 'Win Rate',
      value: formatPercent(metrics.winRate),
      icon: TrendingUp,
      color: 'text-green-500',
    },
    {
      title: 'Profit Factor',
      value: formatRatio(metrics.profitFactor),
      icon: Award,
      color: 'text-yellow-500',
    },
    {
      title: 'Net P/L',
      value: `${metrics.netProfitLoss >= 0 ? '+' : ''}${formatNumber(metrics.netProfitLoss)} pips`,
      icon: metrics.netProfitLoss >= 0 ? TrendingUp : TrendingDown,
      color: metrics.netProfitLoss >= 0 ? 'text-green-500' : 'text-red-500',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {kpis.map((kpi) => (
        <Card key={kpi.title} className="border-border/40 bg-card/50 backdrop-blur">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {kpi.title}
            </CardTitle>
            <kpi.icon className={`h-4 w-4 ${kpi.color}`} />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${kpi.color}`}>{kpi.value}</div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
