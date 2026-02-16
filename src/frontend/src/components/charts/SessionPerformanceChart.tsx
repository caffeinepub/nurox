import type { SessionPerformance } from '../../domain/types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { formatPercent, formatNumber } from '../../utils/format';

interface SessionPerformanceChartProps {
  data: SessionPerformance[];
}

export default function SessionPerformanceChart({ data }: SessionPerformanceChartProps) {
  if (data.length === 0) {
    return (
      <div className="h-80 flex items-center justify-center text-muted-foreground">
        No session data available yet.
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={320}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="oklch(var(--border))" />
        <XAxis 
          dataKey="session" 
          stroke="oklch(var(--muted-foreground))"
          fontSize={12}
        />
        <YAxis 
          stroke="oklch(var(--muted-foreground))"
          fontSize={12}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: 'oklch(var(--popover))',
            border: '1px solid oklch(var(--border))',
            borderRadius: '8px',
          }}
        />
        <Legend />
        <Bar dataKey="trades" fill="oklch(var(--chart-1))" radius={[8, 8, 0, 0]} name="Trades" />
        <Bar dataKey="winRate" fill="oklch(var(--chart-2))" radius={[8, 8, 0, 0]} name="Win Rate %" />
      </BarChart>
    </ResponsiveContainer>
  );
}
