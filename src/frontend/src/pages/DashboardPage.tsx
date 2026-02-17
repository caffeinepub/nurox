import { useState } from 'react';
import { TrendingUp } from 'lucide-react';
import { useGetAllTrades } from '../hooks/useQueries';
import { calculatePerformanceMetrics, calculateEquityCurve } from '../utils/analytics';
import { calculateMonthlyPerformance, calculatePairDistribution, calculateSessionPerformance } from '../utils/breakdowns';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import KpiGrid from '../components/dashboard/KpiGrid';
import AnalyticsSummaryPanel from '../components/dashboard/AnalyticsSummaryPanel';
import EquityCurveChart from '../components/charts/EquityCurveChart';
import MonthlyPerformanceChart from '../components/charts/MonthlyPerformanceChart';
import PairDistributionChart from '../components/charts/PairDistributionChart';
import SessionPerformanceChart from '../components/charts/SessionPerformanceChart';
import ChatPanel from '../components/chat/ChatPanel';

/**
 * Dashboard page with KPIs, analytics summary, charts, and chatbot.
 * Handles empty state and limited-data state gracefully.
 */
export default function DashboardPage() {
  const { data: trades = [], isLoading } = useGetAllTrades();
  const [showChat, setShowChat] = useState(false);

  const completedTrades = trades.filter((t) => t.profitLossAmount !== undefined && t.profitLossAmount !== 0);

  const metrics = calculatePerformanceMetrics(trades);
  const equity = calculateEquityCurve(completedTrades);
  const monthlyPerf = calculateMonthlyPerformance(completedTrades);
  const pairDist = calculatePairDistribution(completedTrades);
  const sessionPerf = calculateSessionPerformance(completedTrades);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <Skeleton className="h-10 w-64" />
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(8)].map((_, i) => (
            <Skeleton key={i} className="h-32" />
          ))}
        </div>
      </div>
    );
  }

  if (trades.length === 0) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight bg-gradient-to-r from-yellow-500 to-yellow-600 bg-clip-text text-transparent">
              Command Center
            </h1>
            <p className="text-muted-foreground mt-1">Your trading performance at a glance</p>
          </div>
        </div>

        <Alert className="border-yellow-500/50 bg-yellow-500/10">
          <TrendingUp className="h-4 w-4 text-yellow-500" />
          <AlertDescription className="text-yellow-200">
            No trades yet. Add your first trade in the Journal to see analytics and performance metrics here.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  const hasCompletedTrades = completedTrades.length > 0;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight bg-gradient-to-r from-yellow-500 to-yellow-600 bg-clip-text text-transparent">
            Command Center
          </h1>
          <p className="text-muted-foreground mt-1">Your trading performance at a glance</p>
        </div>
      </div>

      {!hasCompletedTrades && (
        <Alert className="border-yellow-500/50 bg-yellow-500/10">
          <TrendingUp className="h-4 w-4 text-yellow-500" />
          <AlertDescription className="text-yellow-200">
            You have {trades.length} trade{trades.length !== 1 ? 's' : ''}, but none with Win/Loss outcomes yet. Edit your trades in the Journal to add outcomes and see full analytics.
          </AlertDescription>
        </Alert>
      )}

      <KpiGrid metrics={metrics} />

      <AnalyticsSummaryPanel metrics={metrics} />

      <Tabs defaultValue="equity" className="space-y-4">
        <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 lg:w-auto">
          <TabsTrigger value="equity">Equity</TabsTrigger>
          <TabsTrigger value="monthly">Monthly</TabsTrigger>
          <TabsTrigger value="pairs">Pairs</TabsTrigger>
          <TabsTrigger value="sessions">Sessions</TabsTrigger>
        </TabsList>

        <TabsContent value="equity" className="space-y-4">
          <Card className="border-border/40 bg-card/50 backdrop-blur">
            <CardHeader>
              <CardTitle>Equity Curve</CardTitle>
              <CardDescription>Your account balance over time</CardDescription>
            </CardHeader>
            <CardContent className="pt-2">
              <EquityCurveChart data={equity} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="monthly" className="space-y-4">
          <Card className="border-border/40 bg-card/50 backdrop-blur">
            <CardHeader>
              <CardTitle>Monthly Performance</CardTitle>
              <CardDescription>Profit/loss breakdown by month</CardDescription>
            </CardHeader>
            <CardContent className="pt-2">
              <MonthlyPerformanceChart data={monthlyPerf} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="pairs" className="space-y-4">
          <Card className="border-border/40 bg-card/50 backdrop-blur">
            <CardHeader>
              <CardTitle>Pair Distribution</CardTitle>
              <CardDescription>Trading activity by currency pair</CardDescription>
            </CardHeader>
            <CardContent className="pt-2">
              <PairDistributionChart data={pairDist} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="sessions" className="space-y-4">
          <Card className="border-border/40 bg-card/50 backdrop-blur">
            <CardHeader>
              <CardTitle>Session Performance</CardTitle>
              <CardDescription>Performance across trading sessions</CardDescription>
            </CardHeader>
            <CardContent className="pt-2">
              <SessionPerformanceChart data={sessionPerf} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <ChatPanel metrics={metrics} />
    </div>
  );
}
