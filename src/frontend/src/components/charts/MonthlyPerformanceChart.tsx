import type { MonthlyPerformance } from '../../domain/types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { formatNumber } from '../../utils/format';

interface MonthlyPerformanceChartProps {
  data: MonthlyPerformance[];
}

export default function MonthlyPerformanceChart({ data }: MonthlyPerformanceChartProps) {
  if (data.length === 0) {
    return (
      <div className="h-80 flex items-center justify-center text-muted-foreground">
        No monthly data available yet.
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={320}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="oklch(var(--border))" />
        <XAxis 
          dataKey="month" 
          stroke="oklch(var(--muted-foreground))"
          fontSize={12}
        />
        <YAxis 
          stroke="oklch(var(--muted-foreground))"
          fontSize={12}
          tickFormatter={(value) => `${formatNumber(value)} pips`}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: 'oklch(var(--popover))',
            border: '1px solid oklch(var(--border))',
            borderRadius: '8px',
          }}
          formatter={(value: number) => [`${formatNumber(value)} pips`, 'Profit']}
        />
        <Bar dataKey="profit" radius={[8, 8, 0, 0]}>
          {data.map((entry, index) => (
            <Cell 
              key={`cell-${index}`} 
              fill={entry.profit >= 0 ? 'oklch(var(--chart-1))' : 'oklch(var(--destructive))'} 
            />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
