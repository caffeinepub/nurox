import type { EquityPoint } from '../../domain/types';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { formatCurrency, formatDate } from '../../utils/format';

interface EquityCurveChartProps {
  data: EquityPoint[];
}

export default function EquityCurveChart({ data }: EquityCurveChartProps) {
  if (data.length === 0) {
    return (
      <div className="h-80 flex items-center justify-center text-muted-foreground">
        No equity data available yet. Start trading to see your equity curve!
      </div>
    );
  }

  const chartData = data.map(point => ({
    date: formatDate(point.date),
    balance: point.balance,
  }));

  return (
    <ResponsiveContainer width="100%" height={320}>
      <LineChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" stroke="oklch(var(--border))" />
        <XAxis 
          dataKey="date" 
          stroke="oklch(var(--muted-foreground))"
          fontSize={12}
        />
        <YAxis 
          stroke="oklch(var(--muted-foreground))"
          fontSize={12}
          tickFormatter={(value) => formatCurrency(value, 'USD')}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: 'oklch(var(--popover))',
            border: '1px solid oklch(var(--border))',
            borderRadius: '8px',
          }}
          formatter={(value: number) => [formatCurrency(value, 'USD'), 'Balance']}
        />
        <Line 
          type="monotone" 
          dataKey="balance" 
          stroke="oklch(var(--chart-1))" 
          strokeWidth={2}
          dot={false}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
