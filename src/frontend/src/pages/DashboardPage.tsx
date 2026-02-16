import { useState } from 'react';
import { useGetAllTrades } from '../hooks/useQueries';
import { calculatePerformanceMetrics, calculateEquityCurve } from '../utils/analytics';
import { calculateMonthlyPerformance, calculatePairDistribution, calculateSessionPerformance } from '../utils/breakdowns';
import KpiGrid from '../components/dashboard/KpiGrid';
import EquityCurveChart from '../components/charts/EquityCurveChart';
import MonthlyPerformanceChart from '../components/charts/MonthlyPerformanceChart';
import PairDistributionChart from '../components/charts/PairDistributionChart';
import SessionPerformanceChart from '../components/charts/SessionPerformanceChart';
import ChatPanel from '../components/chat/ChatPanel';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export default function DashboardPage() {
  const { data: trades = [], isLoading } = useGetAllTrades();
  const [showChat, setShowChat] = useState(false);

  const metrics = calculatePerformanceMetrics(trades);
  const equity = calculateEquityCurve(trades);
  const monthlyPerf = calculateMonthlyPerformance(trades);
  const pairDist = calculatePairDistribution(trades);
  const sessionPerf = calculateSessionPerformance(trades);

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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-yellow-500 to-yellow-600 bg-clip-text text-transparent">
            Command Center
          </h1>
          <p className="text-muted-foreground mt-1">Your trading performance at a glance</p>
        </div>
      </div>

      <KpiGrid metrics={metrics} />

      <Tabs defaultValue="equity" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4 lg:w-auto">
          <TabsTrigger value="equity">Equity</TabsTrigger>
          <TabsTrigger value="monthly">Monthly</TabsTrigger>
          <TabsTrigger value="pairs">Pairs</TabsTrigger>
          <TabsTrigger value="sessions">Sessions</TabsTrigger>
        </TabsList>

        <TabsContent value="equity" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Equity Curve</CardTitle>
              <CardDescription>Your account balance over time</CardDescription>
            </CardHeader>
            <CardContent>
              <EquityCurveChart data={equity} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="monthly" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Monthly Performance</CardTitle>
              <CardDescription>Profit/loss breakdown by month</CardDescription>
            </CardHeader>
            <CardContent>
              <MonthlyPerformanceChart data={monthlyPerf} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="pairs" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Pair Distribution</CardTitle>
              <CardDescription>Trading activity by currency pair</CardDescription>
            </CardHeader>
            <CardContent>
              <PairDistributionChart data={pairDist} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="sessions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Session Performance</CardTitle>
              <CardDescription>Performance across trading sessions</CardDescription>
            </CardHeader>
            <CardContent>
              <SessionPerformanceChart data={sessionPerf} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <ChatPanel metrics={metrics} />
    </div>
  );
}
