import type { PerformanceMetrics } from '../../domain/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatPercent, formatNumber, formatCurrency } from '../../utils/format';
import { TrendingUp, TrendingDown, Target, Award, AlertTriangle, Activity } from 'lucide-react';

interface KpiGridProps {
  metrics: PerformanceMetrics;
}

export default function KpiGrid({ metrics }: KpiGridProps) {
  const kpis = [
    {
      title: 'Total Trades',
      value: metrics.totalTrades.toString(),
      icon: Activity,
      color: 'text-blue-500',
    },
    {
      title: 'Win Rate',
      value: formatPercent(metrics.winRate),
      icon: Target,
      color: 'text-green-500',
    },
    {
      title: 'Net P/L',
      value: `${metrics.netProfitLoss > 0 ? '+' : ''}${formatNumber(metrics.netProfitLoss)} pips`,
      icon: metrics.netProfitLoss > 0 ? TrendingUp : TrendingDown,
      color: metrics.netProfitLoss > 0 ? 'text-green-500' : 'text-red-500',
    },
    {
      title: 'Profit Factor',
      value: metrics.profitFactor === Infinity ? '∞' : formatNumber(metrics.profitFactor),
      icon: Award,
      color: 'text-yellow-500',
    },
    {
      title: 'Expectancy',
      value: `${formatNumber(metrics.expectancy)} pips`,
      icon: Activity,
      color: 'text-purple-500',
    },
    {
      title: 'Avg RR',
      value: formatNumber(metrics.averageRR),
      icon: Target,
      color: 'text-cyan-500',
    },
    {
      title: 'Max Drawdown',
      value: formatPercent(metrics.maxDrawdown),
      icon: AlertTriangle,
      color: 'text-orange-500',
    },
    {
      title: 'Discipline Score',
      value: formatPercent(metrics.disciplineScore),
      icon: Award,
      color: metrics.disciplineScore >= 80 ? 'text-green-500' : 'text-yellow-500',
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {kpis.map((kpi) => {
        const Icon = kpi.icon;
        return (
          <Card key={kpi.title} className="border-border/40 bg-card/50 backdrop-blur">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {kpi.title}
              </CardTitle>
              <Icon className={`h-4 w-4 ${kpi.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{kpi.value}</div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
